<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $fillable = [
        'transaction_id',
        'store_name',
        'store_address',
        'store_contact',
        'store_tin',
        'cashier_name',
        'cashier_id',
        'payment_method',
        'items',
        'subtotal',
        'discount',
        'tax',
        'total',
        'amount_paid',
        'change',
        'reference_number',
        'footer_message'
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change' => 'decimal:2'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
