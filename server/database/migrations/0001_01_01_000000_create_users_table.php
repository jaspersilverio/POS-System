<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            // Remove gender_id column
            $table->id();
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable();
            $table->integer('age');
            $table->date('birth_date');
            // DELETE THIS LINE: $table->unsignedBigInteger('gender_id');
            $table->string('address');
            $table->string('contact_number', 55);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'manager', 'cashier'])->default('cashier');
            $table->rememberToken();
            $table->timestamps();

            // DELETE THIS FOREIGN KEY:
            // $table->foreign('gender_id')->references('id')->on('genders');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
