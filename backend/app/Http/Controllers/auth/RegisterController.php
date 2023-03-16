<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        // dd($request->all());
        //set validation 
        $validate = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'no_telp' => 'required|string|max:15',
            'password' => 'required|min:8|confirmed'
        ]);

        // if validation failed
        if ($validate->fails()) {
            return response()->json($validate->errors(), 422);
        }

        // created a new users

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'password' => bcrypt($request->password),
        ]);

        // return response json if created successfully
        if($user) {
            return response()->json([
                'success' => true,
                'user' => $user
            ], 201);
        }

        // return response json if created failed
        return response()->json([
            'success' => false,
        ], 409);
    }
}
