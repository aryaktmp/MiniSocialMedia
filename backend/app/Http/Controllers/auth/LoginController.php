<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PDO;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        //set validation 
        $validate = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);

        // if validation fails
        if($validate->fails()){
            return response()->json($validate->errors(), 422);
        }

        // get credentials from request
        $credentials = $request->only('email', 'password');

        // if login auth is failed
        if(!$token = JWTAuth::attempt($credentials)){
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password Anda Salahh'
            ], 401);
        }

        // if login auth is successful
        return response()->json([
            'success' => true,
            'user' => auth()->user(),
            'token' => $token,
            // 'expires_in' => auth()->factory()->getTTL() * 60
        ], 200);
    }
}
