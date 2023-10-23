<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MarcacaoController;
use App\Http\Controllers\Api\ProdutoController;
use App\Http\Controllers\Api\CarrinhoController;
use App\Http\Controllers\Api\ImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('upload-image', [ImageController::class, 'uploadImage']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
    Route::apiResource('/marcacaos', MarcacaoController::class);
    Route::apiResource('/produtos', ProdutoController::class);
    Route::apiResource('/carrinhos', CarrinhoController::class);

});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
