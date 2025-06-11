<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'quantity',
        'min_stock_level',
        'last_restock_date'
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'last_restock_date' => 'datetime',
    ];
    
    /**
     * Get the product that owns the inventory.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Check if the product is low on stock.
     *
     * @return bool
     */
    public function isLowStock(): bool
    {
        return $this->quantity <= $this->min_stock_level;
    }
}
