<?php

namespace App\Http\Controllers\BankAccount;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BankAccountController
{
    /**
     * Store a new bank account for the user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'balance' => 'nullable|numeric',
        ]);

        $user = $request->user();

        // ensure balance exists
        if (! isset($validated['balance'])) {
            $validated['balance'] = 0;
        }

        $user->bankAccounts()->create($validated);

        return redirect()->route('bank-accounts.index')->with('success', 'Bank account added successfully.');
    }

    /**
     * Show the Bank Accounts page.
     */
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        // paginate bank accounts for the user (3 per page)
        $bankAccounts = $user->bankAccounts()->latest()->paginate(3);
        $totalBalance = (float) $user->bankAccounts()->sum('balance');

        // Categories for the quick-transaction form
        $categories = $user->categories()->orderBy('name')->pluck('name');
        if ($categories->isEmpty()) {
            $categories = $user->transactions()
                ->select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category');
        }

        return Inertia::render('BankAccounts', [
            'auth' => ['user' => $user],
            'bankAccounts' => $bankAccounts,
            'totalBalance' => $totalBalance,
            'categories' => $categories,
            'accountTransactions' => $user->transactions()
                ->whereNotNull('bank_account_id')
                ->orderBy('entry_date', 'desc')
                ->orderBy('id', 'desc')
                ->get(['id', 'description', 'amount', 'type', 'category', 'entry_date', 'bank_account_id'])
                ->groupBy('bank_account_id'),
        ]);
    }

    /**
     * Update a bank account for the authenticated user.
     */
    public function update(Request $request, BankAccount $bankAccount)
    {
        $user = $request->user();

        if ($bankAccount->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'balance' => 'nullable|numeric',
        ]);

        $bankAccount->update($validated);

        return redirect()->route('bank-accounts.index');
    }

    /**
     * Delete a bank account for the authenticated user.
     */
    public function destroy(Request $request, BankAccount $bankAccount)
    {
        $user = $request->user();

        if ($bankAccount->user_id !== $user->id) {
            abort(403);
        }

        $bankAccount->delete();

        return redirect()->route('bank-accounts.index')->with('success', 'Bank account deleted successfully.');
    }
}
