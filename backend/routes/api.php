<?php

use App\Http\Controllers\auth\LoginController;
use App\Http\Controllers\auth\LogoutController;
use App\Http\Controllers\auth\RegisterController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\StatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', RegisterController::class)->name('register');
Route::post('/login', LoginController::class)->name('login');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:api'])->group(
    function () {
        // status
        Route::post('/status', [StatusController::class, 'store']);
        Route::post('/status/{id}/edit', [StatusController::class, 'update']);
        Route::post('/status/{id}/love', [StatusController::class, 'love']);
        Route::delete('/status/{id}', [StatusController::class, 'deleteStatus']);
        Route::get('/status/posted/{id}', [StatusController::class, 'postedStatusUser']);

        // comments
        Route::post('/comments/{id}', [CommentsController::class, 'save']);
        Route::post('/comments/{id}/love', [CommentsController::class, 'love']);
        Route::delete('/comments/{id}', [CommentsController::class, 'deleteComments']);
    }
);
// Route::get('/status/posted/{id}', [StatusController::class, 'postedStatusUser']);

Route::get('/status/{id}', [StatusController::class, 'show']);
Route::get('/status', [StatusController::class, 'index']);

Route::post('/logout', LogoutController::class)->name('logout');
