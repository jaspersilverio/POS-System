<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'sku',
        'category',
        'image_url',
        'active'
    ];
    
    /**
     * Get the inventory record associated with the product.
     */
    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }
    
    /**
     * Get the transaction items for the product.
     */
    public function transactionItems(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }
}
