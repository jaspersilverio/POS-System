<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class ReceiptController extends Controller
{
    public function generate(Transaction $transaction)
    {
        $receipt = Receipt::create([
            'transaction_id' => $transaction->id,
            'store_name' => 'Dripline Clothing',
            'store_address' => '123 Fashion Street, Roxas City',
            'store_contact' => '+63 912 345 6789',
            'store_tin' => '123-456-789-000',
            'cashier_name' => Auth::user()->name,
            'cashier_id' => Auth::user()->id,
            'payment_method' => $transaction->payment_method,
            'items' => $transaction->items,
            'subtotal' => $transaction->subtotal,
            'discount' => $transaction->discount,
            'tax' => $transaction->tax ?? 0,
            'total' => $transaction->total,
            'amount_paid' => $transaction->amount_paid,
            'change' => $transaction->change ?? 0,
            'reference_number' => $transaction->reference_number,
            'footer_message' => 'Thank you for shopping at Dripline!'
        ]);

        return response()->json($receipt);
    }

    public function print(Receipt $receipt)
    {
        $pdf = PDF::loadView('receipts.template', ['receipt' => $receipt]);
        return $pdf->stream('receipt.pdf');
    }

    public function email(Receipt $receipt)
    {
        // TODO: Implement email sending with personalized content
        return response()->json(['message' => 'Receipt sent successfully']);
    }
}
