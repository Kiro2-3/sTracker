<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Optional link to a specific bank account; null means not linked to any account
            $table->foreignId('bank_account_id')
                ->nullable()
                ->after('entry_date')
                ->constrained('bank_accounts')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\BankAccount::class);
            $table->dropColumn('bank_account_id');
        });
    }
};
