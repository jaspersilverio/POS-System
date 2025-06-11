<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feedback = Feedback::with('transaction')->get();
        
        return response()->json([
            'feedback' => $feedback
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|exists:transactions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'customer_email' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if feedback already exists for this transaction
        $existingFeedback = Feedback::where('transaction_id', $request->transaction_id)->first();
        if ($existingFeedback) {
            return response()->json([
                'message' => 'Feedback already exists for this transaction',
                'feedback' => $existingFeedback
            ], 409);
        }
        
        // Get customer email from transaction if not provided
        $customerEmail = $request->customer_email;
        if (!$customerEmail) {
            $transaction = Transaction::find($request->transaction_id);
            $customerEmail = $transaction ? $transaction->customer_email : null;
        }
        
        $feedback = Feedback::create([
            'transaction_id' => $request->transaction_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'customer_email' => $customerEmail
        ]);

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'feedback' => $feedback->load('transaction')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $feedback = Feedback::with('transaction')->findOrFail($id);
        
        return response()->json([
            'feedback' => $feedback
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $feedback = Feedback::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback->update($request->only(['rating', 'comment']));

        return response()->json([
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback->load('transaction')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();
        
        return response()->json([
            'message' => 'Feedback deleted successfully'
        ]);
    }
    
    /**
     * Get feedback statistics
     */
    public function statistics()
    {
        $feedbackCount = Feedback::count();
        
        if ($feedbackCount == 0) {
            return response()->json([
                'message' => 'No feedback available yet',
                'statistics' => [
                    'count' => 0,
                    'average_rating' => 0,
                    'rating_distribution' => []
                ]
            ]);
        }
        
        $averageRating = Feedback::avg('rating');
        
        $ratingDistribution = DB::table('feedback')
            ->select('rating', DB::raw('COUNT(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating')
            ->get()
            ->keyBy('rating')
            ->map(function ($item) use ($feedbackCount) {
                return [
                    'count' => $item->count,
                    'percentage' => round(($item->count / $feedbackCount) * 100, 2)
                ];
            });
            
        // Fill in missing ratings with zero
        $fullDistribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $fullDistribution[$i] = $ratingDistribution[$i] ?? ['count' => 0, 'percentage' => 0];
        }
        
        return response()->json([
            'statistics' => [
                'count' => $feedbackCount,
                'average_rating' => round($averageRating, 2),
                'rating_distribution' => $fullDistribution
            ]
        ]);
    }
}
