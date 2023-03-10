<?php

namespace App\Http\Controllers;

use App\Models\Love;
use App\Models\Status;
use App\Models\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Status::selectRaw("statuses.id, statuses.sentences, statuses.created_at, statuses.user_id")
            ->WithCountData()
            ->WithLoveStatus()
            ->with('User')
            ->orderBy('statuses.created_at', 'DESC');
        // dd($data->paginate(10));
        return response()->json($data->paginate(10));
    }

    public function postedStatusUser($id)
    {
        $data = Status::selectRaw("statuses.id, statuses.sentences, statuses.created_at, statuses.user_id")
            ->WithCountData()
            ->WithLoveStatus()
            ->with('User')
            ->orderBy('statuses.created_at', 'DESC')
            ->where('statuses.user_id', $id);
        // dd($data->paginate(10));
        return response()->json($data->paginate(10));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'sentences' => 'required',
        ]);

        $validationSentences = explode(' ', $request->sentences);
        if ((count($validationSentences) > 10) == true) {
            return response()->json([
                'sentences' => 'Your status exceeds the given limit which is 50 words'
            ], 422);
        }

        if ($validate->fails()) {
            // dd(response()->json($validate->errors(), 422));
            return response()->json($validate->errors(), 422);
        }

        $status = Status::create([
            'user_id' => auth()->id(),
            'sentences' => $request->sentences,
        ]);

        if ($status) {
            return response()->json([
                'success' => true,
                'data' => $status
            ], 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Status::selectRaw("statuses.id, statuses.sentences, statuses.created_at, statuses.user_id")
            ->WithCountData()
            ->WithLoveStatus()
            ->with('User')
            ->with("Comments")
            ->where('statuses.id', $id)
            ->get();
        // dd($data);
        View::firstOrCreate([
            'user_id' => auth()->id(),
            'status_id' =>  $id,
        ]);
        return response()->json($data->first());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validate = Validator::make($request->all(), [
            'sentences' => 'required',
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 422);
        }

        $status = Status::where('id', $id);
        $status->update([
            'user_id' => auth()->id(),
            'sentences' => $request->sentences,
        ]);

        // dd($status);
        if ($status) {
            return response()->json($status->first(), 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    public function love(Request $request, $id)
    {
        $loveStatus = Love::where('status_id', $id)->where('user_id', auth()->id())->first();
        if ($loveStatus) {
            $loveStatus->delete();
        } else {
            $love = new Love();
            $love->user_id = auth()->id();
            $love->status_id = $id;
            $love->comment_status_id = 0;
            $love->save();
        }
        return response()->json([
            'total_love' => Love::where('status_id', $id)->count(),
            'love_status' => $loveStatus ? 0 : 1,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteStatus($id)
    {
        try {
            $status = Status::find($id);

            $status->delete();
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['error' => $th->getMessage()], 500);
        }
        // dd(response()->noContent());
        return response()->noContent();
    }
}
