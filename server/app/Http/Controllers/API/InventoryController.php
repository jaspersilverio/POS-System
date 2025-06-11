<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventory = Inventory::with('product')->get();
        
        return response()->json([
            'inventory' => $inventory
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if inventory already exists for this product
        $existingInventory = Inventory::where('product_id', $request->product_id)->first();
        if ($existingInventory) {
            return response()->json([
                'message' => 'Inventory record already exists for this product',
                'inventory' => $existingInventory
            ], 409);
        }

        $inventory = Inventory::create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'min_stock_level' => $request->min_stock_level,
            'last_restock_date' => now(),
        ]);

        return response()->json([
            'message' => 'Inventory created successfully',
            'inventory' => $inventory->load('product')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inventory = Inventory::with('product')->findOrFail($id);
        
        return response()->json([
            'inventory' => $inventory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $inventory = Inventory::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'quantity' => 'sometimes|integer|min:0',
            'min_stock_level' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update last_restock_date if quantity is increasing
        if ($request->has('quantity') && $request->quantity > $inventory->quantity) {
            $inventory->last_restock_date = now();
        }
        
        $inventory->update($request->only(['quantity', 'min_stock_level']));

        return response()->json([
            'message' => 'Inventory updated successfully',
            'inventory' => $inventory->load('product')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();
        
        return response()->json([
            'message' => 'Inventory record deleted successfully'
        ]);
    }
    
    /**
     * Get low stock inventory items
     */
    public function lowStock()
    {
        $lowStock = Inventory::with('product')
            ->whereRaw('quantity <= min_stock_level')
            ->get();
            
        return response()->json([
            'low_stock_count' => $lowStock->count(),
            'low_stock_items' => $lowStock
        ]);
    }
    
    /**
     * Restock inventory
     */
    public function restock(Request $request, string $id)
    {
        $inventory = Inventory::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $oldQuantity = $inventory->quantity;
        $inventory->quantity += $request->quantity;
        $inventory->last_restock_date = now();
        $inventory->save();
        
        return response()->json([
            'message' => 'Inventory restocked successfully',
            'old_quantity' => $oldQuantity,
            'added_quantity' => $request->quantity,
            'new_quantity' => $inventory->quantity,
            'inventory' => $inventory->load('product')
        ]);
    }
}
