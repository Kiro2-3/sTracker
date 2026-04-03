<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Stores a single money movement entry for a user.
 */
class Transaction extends Model
{
    use HasFactory;

    /**
     * Fields that can be safely filled from validated request data.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'description',
        'amount',
        'type',
        'category',
        'entry_date',
        'bank_account_id',
    ];

    /**
     * Get the owner of this transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The bank account this transaction is linked to (optional).
     */
    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }
}
