<?php

use Illuminate\Support\Facades\Route;  // Explicitly import Route
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

Route::apiResource('products', ProductController::class);
Route::apiResource('transactions', TransactionController::class)->only(['index', 'store']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin-only', [AdminController::class, 'index']);
});
