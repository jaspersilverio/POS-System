<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Receipt</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .store-name {
            font-size: 18px;
            font-weight: bold;
        }

        .items {
            width: 100%;
            margin: 20px 0;
        }

        .items th {
            text-align: left;
            border-bottom: 1px solid #000;
        }

        .total-section {
            margin-top: 20px;
            border-top: 1px solid #000;
            padding-top: 10px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="store-name">{{ $receipt->store_name }}</div>
        <div>{{ $receipt->store_address }}</div>
        <div>Contact: {{ $receipt->store_contact }}</div>
        @if ($receipt->store_tin)
            <div>TIN: {{ $receipt->store_tin }}</div>
        @endif
    </div>

    <div class="transaction-info">
        <div>Receipt #: {{ $receipt->transaction_id }}</div>
        <div>Date: {{ $receipt->created_at->format('Y-m-d H:i:s') }}</div>
        <div>Cashier: {{ $receipt->cashier_name }}</div>
        <div>Payment Method: {{ $receipt->payment_method }}</div>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($receipt->items as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>₱{{ number_format($item['price'], 2) }}</td>
                    <td>₱{{ number_format($item['quantity'] * $item['price'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total-section">
        <div>Subtotal: ₱{{ number_format($receipt->subtotal, 2) }}</div>
        @if ($receipt->discount > 0)
            <div>Discount: ₱{{ number_format($receipt->discount, 2) }}</div>
        @endif
        @if ($receipt->tax > 0)
            <div>Tax: ₱{{ number_format($receipt->tax, 2) }}</div>
        @endif
        <div><strong>Total: ₱{{ number_format($receipt->total, 2) }}</strong></div>
        <div>Amount Paid: ₱{{ number_format($receipt->amount_paid, 2) }}</div>
        @if ($receipt->change > 0)
            <div>Change: ₱{{ number_format($receipt->change, 2) }}</div>
        @endif
        @if ($receipt->reference_number)
            <div>Reference #: {{ $receipt->reference_number }}</div>
        @endif
    </div>

    <div class="footer">
        <div>{{ $receipt->footer_message }}</div>
        <div>Thank you for shopping with us!</div>
    </div>
</body>

</html>
