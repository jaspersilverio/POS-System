<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\InventoryController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\FeedbackController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\UserController;
use App\Http\Middleware\CheckRole;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function() {
    // Auth routes
    Route::get('/user', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Product routes (accessible by all authenticated users)
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);
    
    // Routes requiring at least cashier role
    Route::middleware(['auth:sanctum', CheckRole::class.':cashier'])->group(function() {
        // Dashboard statistics
        Route::get('/dashboard/statistics', [DashboardController::class, 'getStatistics']);
        
        // Transaction routes for cashiers
        Route::apiResource('transactions', TransactionController::class)->only(['index', 'show', 'store']);
        Route::post('/transactions/{id}/email-receipt', [TransactionController::class, 'emailReceipt']);
        
        // Feedback routes for cashiers
        Route::post('/feedback', [FeedbackController::class, 'store']);
        Route::get('/feedback', [FeedbackController::class, 'index']);
        Route::get('/feedback-statistics', [FeedbackController::class, 'statistics']);
    });
    
    // Routes requiring at least manager role
    Route::middleware(['auth:sanctum', CheckRole::class.':manager'])->group(function() {
        // Inventory management
        Route::apiResource('inventory', InventoryController::class);
        Route::get('/low-stock', [InventoryController::class, 'lowStock']);
        Route::post('/inventory/{id}/restock', [InventoryController::class, 'restock']);
        
        // Product management for managers
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        
        // Transaction management for managers
        Route::put('/transactions/{id}', [TransactionController::class, 'update']);
        Route::get('/reports/transactions', [TransactionController::class, 'getByDateRange']);
        
        // Feedback routes for managers
        Route::get('/feedback/{id}', [FeedbackController::class, 'show']);
    });
    
    // Routes requiring admin role
    Route::middleware(['auth:sanctum', CheckRole::class.':admin'])->group(function() {
        // User management routes (admin only)
        Route::apiResource('users', UserController::class);
        
        // Transaction management for admins
        Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
        
        // Feedback management for admins
        Route::put('/feedback/{id}', [FeedbackController::class, 'update']);
        Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy']);
    });
}); 