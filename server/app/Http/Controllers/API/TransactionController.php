<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::with(['user', 'items.product'])->get();
        $transformedTransactions = $transactions->map(function($transaction) {
            return $this->transformTransaction($transaction);
        });
        
        return response()->json([
            'transactions' => $transformedTransactions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.discount' => 'sometimes|numeric|min:0|max:100',
            'paymentDetails' => 'required|array',
            'paymentDetails.method' => 'required|string',
            'paymentDetails.amountPaid' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'customerName' => 'nullable|string',
            'customerEmail' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check inventory levels
        foreach ($request->items as $item) {
            $inventory = Inventory::where('product_id', $item['product']['id'])->first();
            
            if (!$inventory || $inventory->quantity < $item['quantity']) {
                return response()->json([
                    'message' => 'Insufficient inventory for one or more products',
                    'product_id' => $item['product']['id'],
                    'requested_quantity' => $item['quantity'],
                    'available_quantity' => $inventory ? $inventory->quantity : 0
                ], 422);
            }
        }
        
        DB::beginTransaction();
        
        try {
            // Calculate discount amount
            $subtotal = $request->subtotal;
            $total = $request->total;
            $discountAmount = $subtotal - $total;
            
            // Create transaction
            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'total_amount' => $total,
                'discount_amount' => $discountAmount,
                'payment_method' => $request->paymentDetails['method'],
                'receipt_number' => Transaction::generateReceiptNumber(),
                'customer_email' => $request->customerEmail,
                'status' => 'completed',
                'notes' => json_encode($request->paymentDetails) // Store payment details as notes
            ]);
            
            // Create transaction items and update inventory
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product']['id']);
                $itemDiscount = $item['discount'] ?? 0;
                $unitPrice = $product->price;
                $quantity = $item['quantity'];
                
                // Calculate item subtotal with discount
                $itemSubtotal = $unitPrice * $quantity;
                if ($itemDiscount > 0) {
                    $itemSubtotal = $itemSubtotal - ($itemSubtotal * ($itemDiscount / 100));
                }
                
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $itemSubtotal
                ]);
                
                // Update inventory
                $inventory = Inventory::where('product_id', $product->id)->first();
                if ($inventory) {
                    $inventory->quantity -= $quantity;
                    $inventory->save();
                }
            }
            
            DB::commit();
            
            // Transform the transaction data to match frontend expectations
            $transformedTransaction = $this->transformTransaction($transaction);
            
            return response()->json([
                'message' => 'Transaction completed successfully',
                'transaction' => $transformedTransaction
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Transaction failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Transaction::with(['items.product', 'user'])->findOrFail($id);
        
        return response()->json([
            'transaction' => $this->transformTransaction($transaction)
        ]);
    }

    /**
     * Update the specified resource in storage (e.g., for status changes).
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:completed,cancelled,refunded',
            'notes' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // If changing to refunded/cancelled, restore inventory
        if (($request->status == 'refunded' || $request->status == 'cancelled') && 
            $transaction->status == 'completed') {
                
            DB::beginTransaction();
            
            try {
                // Restore inventory for each item
                foreach ($transaction->items as $item) {
                    $inventory = Inventory::where('product_id', $item->product_id)->first();
                    
                    if ($inventory) {
                        $inventory->quantity += $item->quantity;
                        $inventory->save();
                    }
                }
                
                $transaction->update([
                    'status' => $request->status,
                    'notes' => $request->notes ?? $transaction->notes
                ]);
                
                DB::commit();
                
                return response()->json([
                    'message' => "Transaction {$request->status} successfully",
                    'transaction' => $transaction->load(['items.product', 'user'])
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                
                return response()->json([
                    'message' => 'Failed to update transaction',
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            // Just update the status
            $transaction->update([
                'status' => $request->status,
                'notes' => $request->notes ?? $transaction->notes
            ]);
            
            return response()->json([
                'message' => "Transaction status updated to {$request->status}",
                'transaction' => $transaction
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // In a real POS system, you typically don't delete transactions for accounting reasons
        return response()->json([
            'message' => 'Transactions cannot be deleted. Use status updates instead.'
        ], 403);
    }
    
    /**
     * Get transactions by date range
     */
    public function getByDateRange(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $transactions = Transaction::with(['user', 'items.product'])
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get();
            
        $totalSales = $transactions->where('status', 'completed')->sum('total_amount');
        $totalTransactions = $transactions->where('status', 'completed')->count();
        
        return response()->json([
            'total_sales' => $totalSales,
            'total_transactions' => $totalTransactions,
            'transactions' => $transactions
        ]);
    }
    
    /**
     * Email receipt to customer
     */
    public function emailReceipt(Request $request, string $id)
    {
        $transaction = Transaction::with(['items.product', 'user'])->findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'customer_email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update customer email if provided
        if ($transaction->customer_email != $request->customer_email) {
            $transaction->customer_email = $request->customer_email;
            $transaction->save();
        }
        
        // TODO: Actually send the email (implementation would depend on email service)
        
        return response()->json([
            'message' => 'Receipt has been sent to ' . $request->customer_email,
            'transaction' => $transaction
        ]);
    }
    
    /**
     * Transform transaction data to match frontend expectations
     */
    private function transformTransaction($transaction)
    {
        $transaction->load(['items.product', 'user']);
        
        // Parse payment details from notes
        $paymentDetails = json_decode($transaction->notes, true) ?: [
            'method' => $transaction->payment_method,
            'amountPaid' => $transaction->total_amount
        ];
        
        // Transform transaction items
        $items = $transaction->items->map(function($item) {
            return [
                'product' => $item->product,
                'quantity' => $item->quantity,
                'discount' => 0, // We don't store per-item discount in the database
            ];
        });
        
        return [
            'id' => $transaction->id,
            'items' => $items,
            'total' => $transaction->total_amount,
            'subtotal' => $transaction->total_amount + $transaction->discount_amount,
            'discount' => $transaction->discount_amount,
            'tax' => 0, // We don't have tax in our current model
            'paymentDetails' => $paymentDetails,
            'customerEmail' => $transaction->customer_email,
            'createdAt' => $transaction->created_at,
            'receiptNumber' => $transaction->receipt_number,
            'status' => $transaction->status
        ];
    }
}
