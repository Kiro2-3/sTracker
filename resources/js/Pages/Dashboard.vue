<template>
  <AuthenticatedLayout :user="auth.user">
    <Head title="Stracker" />
    
    <div class="min-h-screen w-full flex flex-col md:flex-row bg-gray-100 text-gray-900">
      <aside class="w-full md:w-60 flex md:flex-col flex-row gap-2 md:gap-6 items-stretch min-h-[4rem] md:min-h-[32rem] justify-start bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 sticky top-0 z-20 shadow-sm">
        <div class="flex items-center md:mb-8 mb-2">
          <img src="/public/images/stracker-logo.png" alt="Stracker Logo" class="h-25 w-auto mr-3" />

        </div>
        
        <button
          :class="[
            'btn btn-sm md:btn-md justify-start gap-2 font-medium normal-case',
            tab === 'dashboard' ? 'btn-neutral text-base-100' : 'btn-ghost text-base-content'
          ]"
          @click="selectTab('dashboard')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.75 4.5h7.5v7.5h-7.5zM12.75 4.5h7.5v7.5h-7.5zM12.75 13.5h7.5v7.5h-7.5zM3.75 13.5h7.5v7.5h-7.5z" />
          </svg>
          <span>Dashboard</span>
        </button>
        
        <button
          :class="[
            'btn btn-sm md:btn-md justify-start gap-2 font-medium normal-case',
            'btn-ghost text-base-content'
          ]"
          @click="router.get(route('categories.index'))"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 6h.008v.008H6V6z" />
          </svg>
          <span>Categories</span>
        </button>
        
        <button
          class="btn btn-sm md:btn-md justify-start gap-2 font-medium normal-case btn-ghost text-base-content"
          @click="router.get(route('transactions.recent'))"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6v6h4.5M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
          </svg>
          <span>Transactions</span>
        </button>

        <button
          class="btn btn-primary btn-sm md:btn-md justify-start gap-2 font-semibold shadow"
          @click="showAddTransaction = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Transaction</span>
        </button>
        
        <div class="mt-auto flex flex-col gap-2">
          <button
            class="btn btn-ghost btn-sm md:btn-md justify-start gap-2 font-medium normal-case text-base-content"
            @click="router.get(route('profile.edit'))"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Profile Settings</span>
          </button>
        </div>
      </aside>

      <main class="flex-1 space-y-10 px-4 md:px-12 py-8 w-full">
        <template v-if="tab === 'dashboard'">
          <div v-if="tabLoading.dashboard" class="space-y-8 animate-pulse">
            <!-- Summary Cards Skeleton -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              <div class="bg-white rounded-2xl shadow p-8 border border-gray-100 w-full">
                <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div class="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div class="bg-white rounded-2xl shadow p-8 border border-gray-100 w-full">
                <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div class="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div class="bg-white rounded-2xl shadow p-8 border border-gray-100 w-full">
                <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div class="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <!-- Chart Filters Skeleton -->
            <div class="bg-white rounded-2xl shadow border border-gray-100 mb-8 w-full p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div class="h-5 bg-gray-200 rounded w-32"></div>
                <div class="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div class="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch">
                <div class="h-10 bg-gray-200 rounded w-full sm:w-40"></div>
                <div class="h-10 bg-gray-200 rounded w-full sm:w-40"></div>
                <div class="h-10 bg-gray-200 rounded w-full sm:w-40"></div>
                <div class="h-10 bg-gray-200 rounded w-full sm:w-40"></div>
              </div>
            </div>

            <!-- Charts Skeleton -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div class="bg-white rounded-2xl shadow border border-gray-100 h-96 p-8 w-full flex flex-col gap-4">
                <div class="h-5 bg-gray-200 rounded w-40"></div>
                <div class="flex-1 bg-gray-100 rounded"></div>
              </div>
              <div class="bg-white rounded-2xl shadow border border-gray-100 h-96 p-8 w-full flex flex-col gap-4">
                <div class="h-5 bg-gray-200 rounded w-40"></div>
                <div class="flex-1 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>

          <div v-else class="space-y-8">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              <div class="bg-white rounded-2xl shadow p-8 flex flex-col items-center border border-gray-100">
                <div class="text-gray-500 text-base font-medium mb-2">Total Income</div>
                <div class="text-blue-600 text-3xl font-bold tracking-tight">₱{{ summaryForDisplay.income }}</div>
              </div>
              <div class="bg-white rounded-2xl shadow p-8 flex flex-col items-center border border-gray-100">
                <div class="text-gray-500 text-base font-medium mb-2">Total Expenses</div>
                <div class="text-red-600 text-3xl font-bold tracking-tight">₱{{ summaryForDisplay.expense }}</div>
              </div>
              <div class="bg-white rounded-2xl shadow p-8 flex flex-col items-center border border-gray-100">
                <div class="text-gray-500 text-base font-medium mb-2">Total Revenue</div>
                <div class="text-green-600 text-3xl font-bold tracking-tight">₱{{ summaryForDisplay.balance }}</div>
              </div>
            </div>

            <!-- Chart Filters -->
            <div class="card border border-base-200 bg-base-100 shadow-xl mb-8 w-full">
              <div class="card-body gap-5 p-6">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div class="space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                    </div>
                    <p class="text-sm text-base-content/60">
                      Refine the trend and breakdown cards using type, category, and date range.
                    </p>
                  </div>
                  <button type="button" class="btn btn-ghost btn-sm" @click="clearChartFilters">
                    Clear All
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label class="form-control w-full gap-2">
                    <span class="label-text font-semibold text-base-content">Type</span>
                    <select id="chart-type" v-model="chartFilters.type" class="select select-bordered w-full bg-base-100 text-base-content">
                      <option value="">All</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </label>

                  <label class="form-control w-full gap-2">
                    <span class="label-text font-semibold text-base-content">Category</span>
                    <select
                      id="chart-category"
                      v-model="chartFilters.category"
                      :disabled="chartFilters.type === 'income'"
                      :class="[
                        'select select-bordered w-full bg-base-100 text-base-content',
                        chartFilters.type === 'income' ? 'select-disabled opacity-60' : ''
                      ]"
                    >
                      <option value="">All</option>
                      <option
                        v-for="cat in chartCategoryOptions"
                        :key="cat"
                        :value="cat"
                      >
                        {{ cat }}
                      </option>
                    </select>
                  </label>

                  <label class="form-control w-full gap-2">
                    <span class="label-text font-semibold text-base-content">From</span>
                    <input id="chart-date-from" v-model="chartFilters.date_from" type="date" class="input input-bordered w-full bg-base-100 text-base-content" />
                  </label>

                  <label class="form-control w-full gap-2">
                    <span class="label-text font-semibold text-base-content">To</span>
                    <input id="chart-date-to" v-model="chartFilters.date_to" type="date" class="input input-bordered w-full bg-base-100 text-base-content" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 gap-8 xl:grid-cols-5 w-full">
              <div class="xl:col-span-3">
                <div class="card border border-base-200 bg-base-100 shadow-xl">
                  <div class="card-body gap-6 p-6">
                    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div class="space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                          <h3 class="text-xl font-semibold text-base-content">Income vs Expense Over Time</h3>
                          <span class="badge badge-primary badge-outline">Trend Overview</span>
                        </div>
                        <p class="text-sm text-base-content/60">
                          {{ chartDateRangeLabel }} · {{ filteredLineData.length }} plotted period<span v-if="filteredLineData.length !== 1">s</span>
                        </p>
                      </div>

                      <div class="flex flex-wrap gap-2">
                        <div class="badge badge-success badge-outline gap-2 px-3 py-3">
                          <span class="h-2.5 w-2.5 rounded-full bg-success"></span>
                          Income ₱{{ formatCurrency(summaryForDisplay.income) }}
                        </div>
                        <div class="badge badge-error badge-outline gap-2 px-3 py-3">
                          <span class="h-2.5 w-2.5 rounded-full bg-error"></span>
                          Expense ₱{{ formatCurrency(summaryForDisplay.expense) }}
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div class="rounded-2xl border border-success/20 bg-success/5 px-4 py-3">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-success/80">Income Signal</p>
                        <p class="mt-1 text-lg font-semibold text-base-content">₱{{ formatCurrency(summaryForDisplay.income) }}</p>
                      </div>
                      <div class="rounded-2xl border border-error/20 bg-error/5 px-4 py-3">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-error/80">Expense Signal</p>
                        <p class="mt-1 text-lg font-semibold text-base-content">₱{{ formatCurrency(summaryForDisplay.expense) }}</p>
                      </div>
                    </div>

                    <div class="rounded-3xl border border-base-200 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/10 p-4">
                      <div class="h-[320px] w-full">
                        <LineChart :data="filteredLineData" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="xl:col-span-2">
                <div class="card border border-base-200 bg-base-100 shadow-xl h-full">
                  <div class="card-body gap-6 p-6">
                    <div class="space-y-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-xl font-semibold text-base-content">Category Breakdown</h3>
                        <span class="badge badge-secondary badge-outline">Spending Mix</span>
                      </div>
                      <p class="text-sm text-base-content/60">
                        A modern doughnut view of your current totals.
                      </p>
                    </div>

                    <div v-if="filteredPieChartData.length > 0" class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_220px] items-center">
                      <div class="mx-auto flex h-[300px] w-full max-w-[300px] items-center justify-center rounded-3xl border border-base-200 bg-gradient-to-br from-secondary/10 via-base-100 to-primary/5 p-4">
                        <div class="h-full w-full">
                          <PieChart :data="filteredPieChartData" :colors="pieChartColors" />
                        </div>
                      </div>

                      <div class="space-y-3">
                        <div
                          v-for="(slice, index) in filteredPieChartData"
                          :key="slice.label"
                          class="flex items-center justify-between rounded-2xl border border-base-200 bg-base-200/40 px-4 py-3"
                        >
                          <div class="flex items-center gap-3">
                            <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: pieChartColors[index] || '#94a3b8' }"></span>
                            <div>
                              <p class="text-sm font-medium text-base-content">{{ slice.label }}</p>
                              <p class="text-xs text-base-content/60">Share snapshot</p>
                            </div>
                          </div>
                          <span class="text-sm font-semibold text-base-content">₱{{ formatCurrency(slice.value) }}</span>
                        </div>
                      </div>
                    </div>

                    <div v-else class="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-200/40 text-center">
                      <div class="space-y-2 px-6">
                        <p class="text-base font-semibold text-base-content">No chart data yet</p>
                        <p class="text-sm text-base-content/60">Add transactions to generate the modern breakdown view.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>


      </main>

      <AddTransaction v-if="showAddTransaction" :categories="categories" @close="showAddTransaction = false" />
      <EditTransaction v-if="editTransaction" :transaction="editTransaction" :categories="categories" @close="editTransaction = null" />
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, defineProps, watch, onMounted } from 'vue';
import { router, Head } from '@inertiajs/vue3';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout.vue';
import EditTransaction from './EditTransaction.vue';
import AddTransaction from './AddTransaction.vue';
import LineChart from '../Components/LineChart.vue';
import PieChart from '../Components/PieChart.vue';

function logout() {
  router.post(route('logout'), {}, {
    onSuccess: () => {
      router.visit(route('login'));
    }
  });
}

const showAddTransaction = ref(false);
const editTransaction = ref(null);

function openEditTransaction(transaction) {
  editTransaction.value = { ...transaction };
}

const props = defineProps({
  auth: Object,
  transactions: Object,
  summary: Object,
  categories: Array,
  transactionCategories: Array,
  expenseTotals: Array,
  incomeTotals: Array,
  chartTransactions: Array,
});

const tab = ref('dashboard');
const tabLoading = ref({ dashboard: true });

function selectTab(target) {
  if (tab.value === target) {
    return;
  }
  tab.value = target;
  tabLoading.value[target] = true;
  setTimeout(() => {
    tabLoading.value[target] = false;
  }, 1500);
}

// Dashboard chart filters
const chartFilters = ref({
  type: '',
  category: '',
  date_from: '',
  date_to: ''
});

const activeChartFilterCount = computed(() => {
  return Object.values(chartFilters.value).filter((value) => value !== '').length;
});

// All user categories from the Categories table
const expenseFilterCategories = computed(() => props.categories);

// Chart category options: only show categories used in actual transactions
const chartCategoryOptions = computed(() => props.transactionCategories ?? props.categories);

// When chart type is income, clear category so it doesn't filter by a stale value
watch(
  () => chartFilters.value.type,
  (newType) => {
    if (newType === 'income') {
      chartFilters.value.category = '';
    }
  }
);

function clearChartFilters() {
  chartFilters.value = { type: '', category: '', date_from: '', date_to: '' };
  router.get(route('dashboard'));
}

// Filtered transactions for dashboard charts
const filteredChartTransactions = computed(() => {
  return (props.chartTransactions || []).filter((t) => {
    if (chartFilters.value.type && t.type !== chartFilters.value.type) return false;
    if (chartFilters.value.category && t.category !== chartFilters.value.category) return false;
    if (chartFilters.value.date_from && t.entry_date < chartFilters.value.date_from) return false;
    if (chartFilters.value.date_to && t.entry_date > chartFilters.value.date_to) return false;
    return true;
  });
});

const filteredLineData = computed(() => {
  const dateMap = {};
  filteredChartTransactions.value.forEach((t) => {
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

const filteredPieChartData = computed(() => {
  let totalIncome = 0;
  let totalExpense = 0;
  filteredChartTransactions.value.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += Number(t.amount);
    } else if (t.type === 'expense') {
      totalExpense += Number(t.amount);
    }
  });
  const totalRevenue = totalIncome - totalExpense;
  // Only show slices that are > 0
  const data = [];
  if (totalIncome > 0) data.push({ label: 'Total Income', value: totalIncome });
  if (totalExpense > 0) data.push({ label: 'Total Expense', value: totalExpense });
  // Revenue can be negative, but show it for completeness
  data.push({ label: 'Total Revenue', value: totalRevenue });
  return data;
});

const summaryForDisplay = computed(() => {
  let income = 0;
  let expense = 0;

  filteredChartTransactions.value.forEach((t) => {
    if (t.type === 'income') {
      income += Number(t.amount);
    } else if (t.type === 'expense') {
      expense += Number(t.amount);
    }
  });

  const balance = income - expense;

  return {
    income: income.toFixed(2),
    expense: expense.toFixed(2),
    balance: balance.toFixed(2),
  };
});

const chartDateRangeLabel = computed(() => {
  const { date_from: dateFrom, date_to: dateTo } = chartFilters.value;

  if (dateFrom && dateTo) {
    return `${dateFrom} → ${dateTo}`;
  }

  if (dateFrom) {
    return `From ${dateFrom}`;
  }

  if (dateTo) {
    return `Until ${dateTo}`;
  }

  return 'All recorded dates';
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}


const pieChartColors = computed(() => {
  // Map each label to its color, in the same order as filteredPieChartData
  const colorMap = {
    'Total Income': '#2563eb', // blue-600
    'Total Expense': '#dc2626', // red-600
    'Total Revenue': '#16a34a', // green-600
  };
  return filteredPieChartData.value.map(d => colorMap[d.label] || '#a3a3a3');
});

function deleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    router.delete(route('transactions.destroy', id));
  }
}

onMounted(() => {
  setTimeout(() => {
    tabLoading.value[tab.value] = false;
  }, 1500);
});
</script>

<style scoped>

</style>
