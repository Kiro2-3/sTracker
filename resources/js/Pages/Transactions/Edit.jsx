import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

// Edit transaction page - allows users to modify existing income or expense entries
export default function Edit({ auth, transaction }) {
    // useForm hook manages the form state and submission of the updated data
    const { data, setData, put, processing, errors } = useForm({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        entry_date: transaction.entry_date,
    });

    // Handle form submission - sends a PUT request to update the transaction
    const submit = (e) => {
        e.preventDefault();
        put(route('transactions.update', transaction.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Transaction" />

            <div className="py-12 px-4 max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Transaction</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Modify the transaction details below</p>
                </div>

                {/* Edit form card */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Description field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Monthly salary, Coffee purchase"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {/* Show validation error if description is invalid */}
                            {errors.description && (
                                <div className="mt-1 text-sm text-red-500">{errors.description}</div>
                            )}
                        </div>

                        {/* Amount and Type fields in a grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Amount field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.amount && (
                                    <div className="mt-1 text-sm text-red-500">{errors.amount}</div>
                                )}
                            </div>

                            {/* Type dropdown (Income/Expense) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                {errors.type && (
                                    <div className="mt-1 text-sm text-red-500">{errors.type}</div>
                                )}
                            </div>
                        </div>

                        {/* Category and Date fields in a grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="Food">Food</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Leisure">Leisure</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.category && (
                                    <div className="mt-1 text-sm text-red-500">{errors.category}</div>
                                )}
                            </div>

                            {/* Date field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.entry_date}
                                    onChange={(e) => setData('entry_date', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.entry_date && (
                                    <div className="mt-1 text-sm text-red-500">{errors.entry_date}</div>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-6">
                            {/* Save button - updates the transaction */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>

                            {/* Cancel button - returns to dashboard without saving */}
                            <Link
                                href={route('dashboard')}
                                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
