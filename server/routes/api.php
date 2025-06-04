<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Products
    Route::apiResource('products', ProductController::class);

    // Transactions
    Route::apiResource('transactions', TransactionController::class);

    // Admin only routes
    // Route::middleware('role:admin')->group(function () {
    //     Route::apiResource('users', UserController::class);
    //     Route::apiResource('categories', CategoryController::class);
    // });
});
