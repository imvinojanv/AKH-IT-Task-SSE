<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/products', [ProductController::class, 'index']);

use App\Http\Controllers\Api\SavedProductController;

Route::post('/saved', [SavedProductController::class, 'store']);
Route::get('/saved', [SavedProductController::class, 'index']);
Route::delete('/saved/{product_id}', [SavedProductController::class, 'destroy']);
