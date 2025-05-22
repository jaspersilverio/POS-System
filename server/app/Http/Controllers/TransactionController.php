<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Transaction::with(['products:id,name,price']) // Eager load related products
            ->latest()
            ->paginate(10); // Better than get() for large datasets
    }

    public function show(Transaction $transaction)
    {
        return $transaction->load('products'); // Return with product details
    }

    public function destroy(Transaction $transaction)
    {
        DB::transaction(function () use ($transaction) {
            // Restore inventory first
            foreach ($transaction->items as $item) {
                Product::where('id', $item['product_id'])
                    ->increment('stock', $item['quantity']);
            }

            $transaction->delete();
        });


        return response()->noContent(); // HTTP 204 = No Content
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // STEP 3: Add DB transaction and inventory update
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'customer_name' => 'nullable|string|max:255',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'discount' => 'required|numeric|min:0',
            ]);

            // Auto-calculate totals (don't trust client-side)
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $subtotal += $product->price * $item['quantity'];

                // ⭐ Update inventory stock
                $product->decrement('stock', $item['quantity']);
            }

            $transaction = Transaction::create([
                'customer_name' => $validated['customer_name'],
                'items' => $validated['items'],
                'subtotal' => $subtotal,
                'discount' => $validated['discount'],
                'total' => $subtotal - $validated['discount'],
            ]);

            return response()->json($transaction, 201);
        });
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }
}
