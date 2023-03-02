<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Models\Love;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CommentsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function save(Request $request, $id)
    {
        // dd($request->all());
        $validate = Validator::make($request->all(), [
            'comment' => 'required',
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 422);
        }

        try {
            $comment_id = DB::transaction(function () use ($request, $id) {
                $comment = new Comments();
                // dd($comment);
                $comment->user_id = auth()->id();
                $comment->comment = $request->comment;
                if ($request->mode == "status") {
                    $comment->status_id = $id;
                    $comment->comment_status_id = 0;
                } else {
                    $comment->status_id = $request->status_id;
                    $comment->comment_status_id = $id;
                }
                $comment->save();
                return $comment->id;
            });
            $comment = Comments::selectRaw('id,status_id,comments.comment_status_id,comment,user_id,created_at')
                ->with('User')
                ->WithCountData()
                ->find($comment_id);
            // dd($comment);
            return response()->json($comment, 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function love(Request $request, $id)
    {
        $loveStatus = Love::where('comment_status_id', $id)->where('user_id', auth()->id())->first();
        // dd($loveStatus);
        if ($loveStatus) {
            $loveStatus->delete();
        } else {
            $love = new Love();
            $love->user_id = auth()->id();
            $love->comment_status_id = $id;
            // $love->status_id = 0;
            $love->save();
        }
        return response()->json([
            'total_love' => Love::where('comment_status_id', $id)->count(),
            'love_status' => $loveStatus ? false : true,
        ]);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteComments($id)
    {
        $comment = Comments::find($id);
        try {

            $comment->delete();
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['error' => $th->getMessage()], 500);
        }
        return response()->noContent();
    }
}
