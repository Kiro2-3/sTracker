<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a user's stored bank account details and tracked balance.
 */
class BankAccount extends Model
{
    use HasFactory;

    /**
     * Fields that can be assigned when creating or updating an account.
     *
     * Keeping this list explicit helps guard against unwanted mass assignment.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'bank_name',
        'account_number',
        'account_name',
        'branch',
        'notes',
        'balance',
    ];

    /**
     * Get the user who owns this bank account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
