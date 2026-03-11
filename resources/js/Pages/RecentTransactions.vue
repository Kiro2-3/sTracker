<template>
  <AuthenticatedLayout :user="auth.user">
    <Head title="Transactions" />
    <div class="min-h-screen w-full flex flex-col md:flex-row bg-base-200 text-base-content">
      <aside
        class="w-full md:w-60 flex md:flex-col flex-row gap-2 md:gap-6 items-stretch min-h-[4rem] md:min-h-[32rem] justify-start bg-base-100 border-b md:border-b-0 md:border-r border-base-200 p-4 sticky top-0 z-20 shadow-sm"
      >
        <div class="flex items-center md:mb-8 mb-2">
         <img src="/public/images/stracker-logo.png" alt="Stracker Logo" class="h-25 w-auto mr-6" />

        </div>

        <button
          class="btn btn-sm md:btn-md justify-start gap-2 font-medium normal-case btn-ghost text-base-content"
          @click="goToDashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.75 4.5h7.5v7.5h-7.5zM12.75 4.5h7.5v7.5h-7.5zM12.75 13.5h7.5v7.5h-7.5zM3.75 13.5h7.5v7.5h-7.5z" />
          </svg>
          <span>Dashboard</span>
        </button>

        <button
          class="btn btn-sm md:btn-md justify-start gap-2 font-medium normal-case btn-ghost text-base-content"
          @click="router.get(route('categories.index'))"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 6h.008v.008H6V6z" />
          </svg>
          <span>Categories</span>
        </button>

        <button
          class="btn btn-sm md:btn-md justify-start gap-2 font-medium normal-case btn-neutral text-base-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6v6h4.5M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
          </svg>
          <span>Transactions</span>
        </button>

        <button
          class="btn btn-primary btn-sm md:btn-md justify-start gap-2 font-semibold shadow"
          @click="goToAddTransaction"
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
        <div class="card bg-base-100 border border-base-200 shadow-xl overflow-hidden">
          <!-- Filters -->
          <div class="card-body gap-4 border-b border-base-200">
            <div class="flex flex-col gap-4 md:flex-row md:items-end">
              <label class="form-control w-full md:flex-1 gap-2">
                <span class="label-text font-semibold text-base-content">Search</span>
                <input
                  id="filter-search"
                  type="text"
                  v-model="filters.search"
                  placeholder="Search description or category"
                  class="input input-bordered w-full bg-base-100 text-base-content"
                />
              </label>
              <label class="form-control w-full md:w-40 gap-2">
                <span class="label-text font-semibold text-base-content">Type</span>
                <select
                  id="filter-type"
                  v-model="filters.type"
                  class="select select-bordered w-full bg-base-100 text-base-content"
                >
                  <option value="">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
              <label class="form-control w-full md:w-40 gap-2">
                <span class="label-text font-semibold text-base-content">Category</span>
                <select
                  id="filter-category"
                  v-model="filters.category"
                  class="select select-bordered w-full bg-base-100 text-base-content"
                >
                  <option value="">All</option>
                  <option
                    v-for="cat in categories"
                    :key="cat"
                    :value="cat"
                  >
                    {{ cat }}
                  </option>
                </select>
              </label>
              <label class="form-control w-full md:w-40 gap-2">
                <span class="label-text font-semibold text-base-content">From</span>
                <input
                  id="filter-date-from"
                  type="date"
                  v-model="filters.date_from"
                  class="input input-bordered w-full bg-base-100 text-base-content"
                />
              </label>
              <label class="form-control w-full md:w-40 gap-2">
                <span class="label-text font-semibold text-base-content">To</span>
                <input
                  id="filter-date-to"
                  type="date"
                  v-model="filters.date_to"
                  class="input input-bordered w-full bg-base-100 text-base-content"
                />
              </label>
              <div class="flex w-full flex-col gap-1 md:w-auto">
                <span class="invisible label-text">a</span>
                <button type="button" @click="applyFilters" class="btn btn-primary">
                  Search
                </button>
              </div>
              <div class="flex w-full flex-col gap-1 md:w-auto">
                <span class="invisible label-text">a</span>
                <button type="button" @click="clearFilters" class="btn btn-ghost">
                  Clear
                </button>
              </div>
              <div class="flex w-full flex-col gap-1 md:w-auto">
                <span class="invisible label-text">a</span>
                <button type="button" @click="exportCsv" class="btn btn-outline btn-success gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto max-h-[32rem] overflow-y-auto table-scroll">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in transactions.data" :key="t.id">
                  <td class="whitespace-nowrap">{{ t.entry_date }}</td>
                  <td>{{ t.description }}</td>
                  <td class="whitespace-nowrap">{{ t.category }}</td>
                  <td
                    class="font-semibold whitespace-nowrap"
                    :class="t.type === 'income' ? 'text-green-600' : 'text-error'"
                  >
                    ₱{{ Number(t.amount).toFixed(2) }}
                  </td>
                  <td class="uppercase text-xs font-bold tracking-wide">
                    <span
                      class="badge border-none px-3 py-2 text-xs font-semibold"
                      :class="t.type === 'income' ? 'badge-success' : 'badge-error'"
                    >
                      {{ t.type }}
                    </span>
                  </td>
                  <td class="text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        type="button"
                        @click="openEditTransaction(t)"
                        class="btn btn-ghost btn-xs text-primary px-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="deleteTransaction(t.id)"
                        class="btn btn-ghost btn-xs text-error px-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!transactions.data || transactions.data.length === 0">
                  <td colspan="6" class="p-10 text-center text-base-content/50">No transactions found yet.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="transactions.meta && transactions.meta.last_page > 1"
            class="flex items-center justify-between px-4 py-3 border-t border-base-200"
          >
            <span class="text-sm text-base-content/60">
              Page {{ transactions.meta.current_page }} of {{ transactions.meta.last_page }}
              &nbsp;·&nbsp; {{ transactions.meta.total }} total
            </span>
            <div class="flex gap-2">
              <button
                class="btn btn-sm btn-outline"
                :disabled="!transactions.links.prev"
                @click="transactions.links.prev && router.get(transactions.links.prev)"
              >
                ← Prev
              </button>
              <button
                class="btn btn-sm btn-primary"
                :disabled="!transactions.links.next"
                @click="transactions.links.next && router.get(transactions.links.next)"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <EditTransaction
          v-if="editTransaction"
          :transaction="editTransaction"
          :categories="categories"
          @close="editTransaction = null"
        />
      </main>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { router, Head } from '@inertiajs/vue3';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout.vue';
import EditTransaction from './EditTransaction.vue';

const props = defineProps({
  auth: Object,
  transactions: Object,
  categories: Array,
  filters: Object,
});

const filters = ref({
  search: props.filters?.search || '',
  type: props.filters?.type || '',
  category: props.filters?.category || '',
  date_from: props.filters?.date_from || '',
  date_to: props.filters?.date_to || '',
});

// Re-sync local filter state whenever Inertia delivers fresh props (including on initial render)
watch(() => props.filters, (newFilters) => {
  filters.value = {
    search: newFilters?.search || '',
    type: newFilters?.type || '',
    category: newFilters?.category || '',
    date_from: newFilters?.date_from || '',
    date_to: newFilters?.date_to || '',
  };
}, { immediate: true });

const editTransaction = ref(null);

function openEditTransaction(transaction) {
  editTransaction.value = { ...transaction };
}

function goToDashboard() {
  router.get(route('dashboard'));
}

function goToAddTransaction() {
  router.get(route('transactions.add'));
}

function logout() {
  router.post(route('logout'), {}, {
    onSuccess: () => {
      router.visit(route('login'));
    },
  });
}

function clearFilters() {
  filters.value = {
    search: '',
    type: '',
    category: '',
    date_from: '',
    date_to: '',
  };

  router.get(route('transactions.recent'), {}, {
    preserveScroll: true,
    replace: true,
  });
}

function applyFilters() {
  router.get(route('transactions.recent'), filters.value, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  });
}

function deleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    router.delete(route('transactions.destroy', id));
  }
}

function exportCsv() {
  const params = new URLSearchParams();
  if (filters.value.search) { params.set('search', filters.value.search); }
  if (filters.value.type) { params.set('type', filters.value.type); }
  if (filters.value.category) { params.set('category', filters.value.category); }
  if (filters.value.date_from) { params.set('date_from', filters.value.date_from); }
  if (filters.value.date_to) { params.set('date_to', filters.value.date_to); }

  const query = params.toString();
  window.location.href = route('transactions.export-csv') + (query ? '?' + query : '');
}
</script>

<style scoped>
.table-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.table-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.table-scroll::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}
.table-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
