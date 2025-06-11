<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // References the cashier or staff who processed the transaction
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('payment_method');
            $table->string('receipt_number')->unique();
            $table->string('customer_email')->nullable();
            $table->enum('status', ['completed', 'cancelled', 'refunded'])->default('completed');
            $table->text('notes')->nullable(); // For any additional information
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
