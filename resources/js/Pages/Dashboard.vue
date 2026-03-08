<template>
  
  
  <AuthenticatedLayout :user="auth.user">
    <Head title="Stracker" />
    <div class="min-h-screen w-full flex flex-col md:flex-row bg-gray-50 text-gray-900">
      <!-- Sidebar menu -->
      <aside class="w-full md:w-56 flex md:flex-col flex-row gap-2 md:gap-4 items-stretch min-h-[4rem] md:min-h-[32rem] justify-start bg-white border-b md:border-b-0 md:border-r border-gray-200 p-2 md:p-4 sticky top-0 z-20">
        <div class="flex items-center md:mb-6 mb-2">
          <img src="/public/images/stracker-logo.png" alt="Stracker Logo" class="h-10 w-auto mr-2" />
          <span class="font-extrabold text-xl text-blue-700 tracking-tight">Stracker</span>
        </div>
        <button
          :class="['btn btn-outline', tab === 'dashboard' ? 'btn-primary text-white' : '']"
          @click="tab = 'dashboard'"
        >
          Dashboard
        </button>
        <button
          :class="['btn btn-outline', tab === 'transactions' ? 'btn-primary text-white' : '']"
          @click="tab = 'transactions'"
        >
          Recent Transactions
        </button>
        <button
          class="btn btn-accent text-white"
          @click="showAddTransaction = true"
        >
          Add Transaction
        </button>
        <button
          @click="logout"
          class="btn btn-error text-white font-bold hover:bg-red-700 transition-colors duration-150 md:mt-auto"
        >
          Logout
        </button>
      </aside>
      <!-- Main content -->
      <main class="flex-1 space-y-8 px-2 sm:px-4 md:px-8 py-4 md:py-8 w-full">
        <template v-if="tab === 'dashboard'">
          <!-- 1. Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div class="stat bg-white shadow rounded-xl p-6 flex flex-col items-center">
              <div class="stat-title text-gray-700">Total Income</div>
              <div class="stat-value text-green-600 text-3xl font-bold">₱{{ summary.income }}</div>
            </div>
            <div class="stat bg-white shadow rounded-xl p-6 flex flex-col items-center">
              <div class="stat-title text-gray-700">Total Expenses</div>
              <div class="stat-value text-red-600 text-3xl font-bold">₱{{ summary.expense }}</div>
            </div>
            <div class="stat bg-white shadow rounded-xl p-6 flex flex-col items-center">
              <div class="stat-title text-gray-700">Total Revenue</div>
              <div class="stat-value text-blue-600 text-3xl font-bold">₱{{ summary.balance }}</div>
            </div>
          </div>
          <!-- Line chart for total income vs total expense -->
          <div class="card bg-white shadow rounded-xl mb-6 w-full">
            <div class="card-body p-4 md:p-6">
              <h3 class="font-bold mb-4 text-lg text-blue-600">Income vs Expense Over Time</h3>
              <div class="w-full" style="min-height: 220px; height: 30vw; max-height: 340px;">
                <LineChart :data="lineData" />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            <!-- 3. Category Breakdown Diagram (Pie Chart) -->
            <div class="card bg-white shadow rounded-xl md:col-span-2 h-96 p-4 md:p-6 flex flex-col items-center justify-center w-full">
              <h3 class="font-bold mb-4 text-lg text-center text-purple-600">Category Breakdown</h3>
              <div v-if="pieChartData.length > 0" class="w-full" style="min-height: 220px; height: 30vw; max-height: 340px;">
                <PieChart :data="pieChartData" />
              </div>
              <p v-else class="text-gray-500 mt-10">Add transactions to see the diagram</p>
            </div>
          </div>
        </template>
        <template v-else-if="tab === 'transactions'">
          <div class="card bg-white shadow rounded-xl overflow-x-auto w-full">
            <div class="card-body p-4 md:p-6">
              <h3 class="font-bold mb-4 text-lg text-indigo-600">Recent Transactions</h3>
              <!-- Filter Form -->
              <div class="mb-4 p-2 md:p-4 bg-gray-100 rounded-lg">
                <h4 class="font-semibold mb-2 text-gray-700">Filter Transactions</h4>
                <form class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4" @submit.prevent="applyFilters">
                  <div class="form-control">
                    <InputLabel value="Category" htmlFor="category_filter" />
                    <select
                      id="category_filter"
                      name="category"
                      class="select select-bordered w-full text-black bg-white"
                      v-model="filters.category"
                    >
                      <option value="">All Categories</option>
                      <option value="Food">Food</option>
                      <option value="Salary">Salary</option>
                      <option value="Rent">Rent</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Bills">Bills</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="form-control">
                    <InputLabel value="Type" htmlFor="type_filter" />
                    <select
                      id="type_filter"
                      name="type"
                      class="select select-bordered w-full text-black bg-white"
                      v-model="filters.type"
                    >
                      <option value="">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div class="form-control">
                    <InputLabel value="From Date" htmlFor="date_from" />
                    <input
                      id="date_from"
                      name="date_from"
                      type="date"
                      class="input input-bordered w-full text-black bg-white"
                      v-model="filters.date_from"
                    />
                  </div>
                  <div class="form-control">
                    <InputLabel value="To Date" htmlFor="date_to" />
                    <input
                      id="date_to"
                      name="date_to"
                      type="date"
                      class="input input-bordered w-full text-black bg-white"
                      v-model="filters.date_to"
                    />
                  </div>
                  <div class="form-control sm:col-span-2 md:col-span-4 flex gap-2 flex-wrap">
                    <PrimaryButton type="submit" class="btn-sm">
                      Apply Filters
                    </PrimaryButton>
                    <button
                      type="button"
                      class="btn btn-ghost btn-sm"
                      @click="clearFilters"
                    >
                      Clear Filters
                    </button>
                  </div>
                </form>
              </div>
              <div class="overflow-x-auto">
                <table class="table table-zebra w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th class="text-gray-700 font-bold">Date</th>
                    <th class="text-gray-700 font-bold">Description</th>
                    <th class="text-gray-700 font-bold">Category</th>
                    <th class="text-right text-gray-700 font-bold">Amount</th>
                    <th class="text-center text-gray-700 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in transactions.data" :key="t.id" class="hover:bg-gray-50 transition-colors">
                    <td class="text-gray-800">{{ t.entry_date }}</td>
                    <td>
                      <div class="font-medium text-gray-800">{{ t.description }}</div>
                      <div class="text-xs uppercase font-semibold text-gray-500">{{ t.type }}</div>
                    </td>
                    <td>
                      <span class="badge badge-outline text-gray-800">{{ t.category }}</span>
                    </td>
                    <td class="text-right font-bold" :style="{ color: t.type === 'income' ? '#16a34a' : '#dc2626' }">
                      {{ t.type === 'income' ? '+' : '-' }}₱{{ t.amount }}
                    </td>
                    <td class="text-center">
                      <div class="flex gap-2 justify-center">
                        <Link
                          :href="route('transactions.edit', t.id)"
                          class="btn btn-ghost btn-sm btn-square"
                          title="Edit Transaction"
                        >
                          <!-- SVG icon -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          @click="deleteTransaction(t.id)"
                          class="btn btn-ghost btn-sm btn-square text-error"
                          title="Delete Transaction"
                        >
                          <!-- SVG icon -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!transactions.data || transactions.data.length === 0">
                    <td colspan="5" class="p-10 text-center text-gray-500">
                      No transactions found yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </template>
    </main>
  </div>
    <AddTransaction v-if="showAddTransaction" :categories="categories" @close="showAddTransaction = false" />
  </AuthenticatedLayout>
</template>

<script setup>
function logout() {
  router.post(route('logout'), {}, {
    onSuccess: () => {
      router.visit(route('login'));
    }
  });
}

import { ref, computed } from 'vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import LineChart from '@/Components/LineChart.vue';
import PieChart from '@/Components/PieChart.vue';
import AddTransaction from './AddTransaction.vue';

const showAddTransaction = ref(false);

const props = defineProps({
  auth: Object,
  transactions: Object,
  summary: Object,
  categories: Array,
  expenseTotals: Array,
  incomeTotals: Array,
  filters: Object,
});

const tab = ref('dashboard');
const filters = ref({ ...props.filters });

const barChartData = computed(() =>
  props.categories.map((cat, idx) => ({
    category: cat,
    income: props.incomeTotals[idx] || 0,
    expense: props.expenseTotals[idx] || 0,
  }))
);

const expenseByCategory = computed(() => {
  const result = {};
  (props.transactions.data || []).forEach((t) => {
    if (t.type === 'expense') {
      if (!result[t.category]) result[t.category] = 0;
      result[t.category] += Number(t.amount);
    }
  });
  return result;
});

const pieChartData = computed(() =>
  Object.entries(expenseByCategory.value).map(([name, value]) => ({ name, value }))
);

const lineData = computed(() => {
  const dateMap = {};
  (props.transactions.data || []).forEach((t) => {
    const date = t.entry_date;
    if (!dateMap[date]) dateMap[date] = { date, income: 0, expense: 0 };
    if (t.type === 'income') {
      dateMap[date].income += parseFloat(t.amount);
    } else {
      dateMap[date].expense += parseFloat(t.amount);
    }
  });
  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
});

function applyFilters() {
  router.get(route('dashboard'), { ...filters.value });
}
function clearFilters() {
  filters.value = {};
  router.get(route('dashboard'));
}
function deleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    router.delete(route('transactions.destroy', id));
  }
}
</script>

<style scoped>
/* Responsive tweaks for dashboard */
.stat-title {
  font-size: 1rem;
}
.stat-value {
  font-size: 2rem;
}
@media (max-width: 640px) {
  .stat-value {
    font-size: 1.25rem;
  }
  .stat-title {
    font-size: 0.9rem;
  }
}
</style>
