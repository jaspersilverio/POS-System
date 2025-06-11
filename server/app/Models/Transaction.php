<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaction extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'total_amount',
        'discount_amount',
        'payment_method',
        'receipt_number',
        'customer_email',
        'status',
        'notes'
    ];
    
    /**
     * Get the user who processed the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the items for this transaction.
     */
    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }
    
    /**
     * Get the feedback for this transaction.
     */
    public function feedback(): HasOne
    {
        return $this->hasOne(Feedback::class);
    }
    
    /**
     * Generate a unique receipt number.
     *
     * @return string
     */
    public static function generateReceiptNumber(): string
    {
        return 'DRIP-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }
}
