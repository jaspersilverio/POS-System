<?php

use Illuminate\Support\Facades\Route;  // Explicitly import Route
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AdminController;

Route::apiResource('products', ProductController::class);
Route::apiResource('transactions', TransactionController::class)->only(['index', 'store']);
Route::get('/products', [ProductController::class, 'index']);


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin-only', [AdminController::class, 'index']);
});
