import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// Recharts components for modern, responsive charts
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    Legend as ReLegend,
} from 'recharts';

// color palettes
const incomeColor = '#22d399';
const expenseColor = '#ef4444';
const pieColors = ['#6366f1', '#ec4899', '#22d3ee', '#facc15', '#34d399', '#f87171'];

export default function Dashboard({ auth, transactions, summary, categories, expenseTotals, incomeTotals }) {
    
    // Inertia Form Hook
    const { data, setData, post, processing, reset, errors } = useForm({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        entry_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => reset(),
        });
    };

    // prepare dataset for Recharts bar chart. each entry is {category, income, expense}
    const barChartData = categories.map((cat, idx) => ({
        category: cat,
        income: incomeTotals[idx] || 0,
        expense: expenseTotals[idx] || 0,
    }));

    // prepare data for pie chart (e.g. expenses only, could easily extend)
    const pieChartData = categories.map((cat, idx) => ({
        name: cat,
        value: expenseTotals[idx] || 0,
    }));
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-12 px-4 max-w-7xl mx-auto space-y-6">
                
                {/* 1. Summary Cards using DaisyUI stats */}
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Income</div>
                        <div className="stat-value text-green-600">${summary.income}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Total Expenses</div>
                        <div className="stat-value text-red-600">${summary.expense}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Total Revenue</div>
                        <div className="stat-value">${summary.balance}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 2. Add Transaction Form */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h3 className="font-bold mb-4 text-lg">Add Transaction</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="form-control">
                                    <InputLabel value="Description" htmlFor="description" />
                                    <TextInput
                                        id="description"
                                        type="text"
                                        placeholder="Description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && (
                                        <InputError message={errors.description} />
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <div className="form-control flex-1">
                                        <InputLabel value="Amount" htmlFor="amount" />
                                        <TextInput
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                        />
                                        {errors.amount && (
                                            <InputError message={errors.amount} />
                                        )}
                                    </div>
                                    <div className="form-control flex-1">
                                        <InputLabel value="Type" htmlFor="type" />
                                        <select
                                            id="type"
                                            className="select select-bordered w-full"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                        {errors.type && (
                                            <InputError message={errors.type} />
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="form-control flex-1">
                                        <InputLabel value="Category" htmlFor="category" />
                                        <select
                                            id="category"
                                            className="select select-bordered w-full"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Salary">Salary</option>
                                            <option value="Rent">Rent</option>
                                            <option value="Leisure">Leisure</option>
                                        </select>
                                        {errors.category && (
                                            <InputError message={errors.category} />
                                        )}
                                    </div>
                                    <div className="form-control flex-1">
                                        <InputLabel value="Date" htmlFor="entry_date" />
                                        <input
                                            id="entry_date"
                                            type="date"
                                            className="input input-bordered w-full"
                                            value={data.entry_date}
                                            onChange={(e) => setData('entry_date', e.target.value)}
                                        />
                                        {errors.entry_date && (
                                            <InputError message={errors.entry_date} />
                                        )}
                                    </div>
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Save Transaction
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>

                    {/* 3. Category Breakdown Chart */}
                    <div className="card bg-base-100 shadow flex flex-col items-center">
                        <div className="card-body">
                            <h3 className="font-bold mb-4 text-lg">Category Breakdown</h3>
                            {(categories && categories.length > 0) ? (
                                <div className="w-full h-60">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                            <XAxis dataKey="category" tick={{ fill: '#374151' }} />
                                            <YAxis tick={{ fill: '#374151' }} />
                                            <ReTooltip />
                                            <ReLegend verticalAlign="bottom" />
                                            <Bar dataKey="income" name="Income" fill={incomeColor} />
                                            <Bar dataKey="expense" name="Expense" fill={expenseColor} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-gray-400 mt-10">Add transactions to see the chart</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Transaction History Table */}
                <div className="card bg-base-100 shadow overflow-x-auto">
                    <div className="card-body">
                        <h3 className="font-bold mb-4 text-lg">Recent Transactions</h3>
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th className="text-right">Amount</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.entry_date}</td>
                                        <td>
                                            <div className="font-medium">{t.description}</div>
                                            <div className="text-xs uppercase text-gray-700 dark:text-gray-500">{t.type}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className={`text-right font-bold ${
                                            t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount}
                                        </td>
                                        <td className="text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link
                                                    href={route('transactions.edit', t.id)}
                                                    className="btn btn-ghost btn-sm btn-square"
                                                    title="Edit Transaction"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Are you sure you want to delete this transaction?')) {
                                                            router.delete(route('transactions.destroy', t.id))
                                                        }
                                                    }}
                                                    className="btn btn-ghost btn-sm btn-square text-error"
                                                    title="Delete Transaction"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-gray-600 dark:text-gray-500">
                                            No transactions found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}