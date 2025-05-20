<?php

use Illuminate\Support\Facades\Route;  // Explicitly import Route
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;

Route::apiResource('products', ProductController::class);
Route::apiResource('transactions', TransactionController::class)->only(['index', 'store']);
