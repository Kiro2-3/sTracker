<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * User-defined transaction grouping, such as food, rent, or salary.
 */
class Category extends Model
{
    use HasFactory;

    /**
     * Fields that may be assigned from validated form input.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
    ];

    /**
     * Get the user who created this category.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
