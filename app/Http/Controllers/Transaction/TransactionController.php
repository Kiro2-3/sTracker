<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/**
 * TransactionController handles all transaction-related operations
 * including listing, creating, editing, and deleting transactions.
 * This controller manages the income/expense tracking functionality.
 */
class TransactionController extends Controller
{
    // 1. Show the Dashboard with all transactions and summary
    public function index()
    {
        $user = Auth::user();
        
        $transactions = $user->transactions()->orderBy('entry_date', 'desc')->get();
        
        $totalIncome = $user->transactions()->where('type', 'income')->sum('amount');
        $totalExpense = $user->transactions()->where('type', 'expense')->sum('amount');

        $chartData = $user->transactions()
            ->where('type', 'expense')
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->get();

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'summary' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'balance' => $totalIncome - $totalExpense
            ],
            'chartData' => $chartData
        ]);
    }

    // 2. Save a new Transaction
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'entry_date' => 'required|date',
        ]);

        Auth::user()->transactions()->create($validated);

        return redirect()->back();
    }

    // 3. Show the edit form for a specific transaction
    // This displays the edit page where users can modify the transaction details
    public function show(Transaction $transaction)
    {
        // Authorization check: only the transaction owner can edit it
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Return the edit page with the transaction details pre-populated
        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
        ]);
    }

    // 4. Update a Transaction with new data
    // This method handles the PUT/PATCH request from the edit form
    public function update(Request $request, Transaction $transaction)
    {
        // Authorization check: only the transaction owner can update it
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Validate the incoming data from the edit form
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'entry_date' => 'required|date',
        ]);

        // Update the transaction with the new validated data
        $transaction->update($validated);

        // After successful update, redirect back to dashboard with a success message
        return redirect(route('dashboard'))->with('success', 'Transaction updated successfully');
    }

    // 5. Delete a Transaction
    // Only the transaction owner can delete it
    public function destroy(Transaction $transaction)
    {
        // Authorization check: only the transaction owner can delete it
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Remove the transaction from the database
        $transaction->delete();

        // Redirect back to where the user came from
        return redirect()->back();
    }
}
