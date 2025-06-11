<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\Transaction;
use App\Models\Feedback;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function getStatistics()
    {
        // Total products count
        $totalProducts = Product::where('active', true)->count();
        
        // Low stock items count
        $lowStockItems = Inventory::whereRaw('quantity <= min_stock_level')->count();
        
        // Total sales (sum of transaction amounts)
        $totalSales = Transaction::where('status', 'completed')
            ->sum('total_amount');
        
        // Get average feedback rating
        $averageRating = Feedback::avg('rating') ?: 0;
        
        // Recent transactions
        $recentTransactions = Transaction::with(['user:id,name', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'receipt_number' => $transaction->receipt_number,
                    'total_amount' => $transaction->total_amount,
                    'payment_method' => $transaction->payment_method,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at,
                    'cashier' => $transaction->user->name,
                    'items_count' => $transaction->items->count()
                ];
            });
        
        // Low stock items
        $lowStockProducts = Inventory::with('product')
            ->whereRaw('quantity <= min_stock_level')
            ->take(5)
            ->get()
            ->map(function ($inventory) {
                return [
                    'id' => $inventory->product->id,
                    'name' => $inventory->product->name,
                    'sku' => $inventory->product->sku,
                    'current_stock' => $inventory->quantity,
                    'min_stock' => $inventory->min_stock_level
                ];
            });
        
        // Sales by day (for last 7 days)
        $salesByDay = Transaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(function ($item) {
                return [date('Y-m-d', strtotime($item->date)) => round($item->total, 2)];
            });
        
        // Fill in missing days with zero values
        $dateRange = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dateRange[$date] = $salesByDay[$date] ?? 0;
        }
        
        return response()->json([
            'statistics' => [
                'total_products' => $totalProducts,
                'low_stock_items' => $lowStockItems,
                'total_sales' => round($totalSales, 2),
                'average_rating' => round($averageRating, 1),
                'recent_transactions' => $recentTransactions,
                'low_stock_products' => $lowStockProducts,
                'sales_by_day' => $dateRange
            ]
        ]);
    }
} 