<template>
  <AuthenticatedLayout :user="auth.user">
    <Head title="Bank Accounts" />
    <div class="min-h-screen w-full flex flex-col md:flex-row bg-base-200 text-base-content">
      <div class="hidden md:block">
        <AppSidebar :user="auth.user" active-page="bank-accounts" />
      </div>
      <main class="flex-1 min-w-0 px-4 md:px-12 py-8">
        <div class="flex justify-end mb-6">
          <button
            @click="openAddModal"
            aria-label="Add Bank Account"
            class="btn btn-primary shadow-lg text-white"
          >
            Add Bank Account
          </button>
        </div>
        <div class="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <!-- Balance Bar Chart Card -->
          <div class="w-full md:col-span-8">
            <div class="card bg-base-100 border border-base-200 shadow p-4 mb-6 h-[520px] flex flex-col">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold">Account Balances</h3>
                <div class="text-sm text-base-content/70">
                  Total:
                  <span class="text-green-600 font-semibold">
                    {{ showTotals ? formatCurrency(props.totalBalance) : '••••' }}
                  </span>
                  <button @click="toggleTotals" type="button" class="btn btn-ghost btn-xs p-1 ml-2" :aria-pressed="showTotals" aria-label="Toggle totals visibility">
                    <svg v-if="showTotals" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.363" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex-1 min-h-0">
                <canvas ref="balanceChart" class="w-full h-full block"></canvas>
              </div>
            </div>
          </div>

          <!-- Saved Bank Accounts Card -->
          <div class="w-full md:col-span-4 flex flex-col">
            <!-- Analytics Card -->
            <div class="card bg-base-100 border border-base-200 shadow p-6 mb-6">
              <h3 class="text-lg font-semibold mb-2">Wallet Summary</h3>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-base-content/70">Total Balance</div>
                  <div class="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <span>{{ showTotals ? formatCurrency(props.totalBalance) : '••••' }}</span>
                    <button @click="toggleTotals" type="button" class="btn btn-ghost btn-xs p-1" :aria-pressed="showTotals" aria-label="Toggle totals visibility">
                      <svg v-if="showTotals" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.88 9.88A3 3 0 0112 9c1.1 0 2.08.58 2.62 1.44" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-base-content/70">Accounts</div>
                  <div class="text-lg font-medium">{{ props.bankAccounts && props.bankAccounts.total ? props.bankAccounts.total : (accounts.length || 0) }}</div>
                </div>
              </div>
            </div>

            <!-- Upcoming Recurring Payments removed -->

            <div v-if="accounts && accounts.length" class="card bg-base-100 border border-base-200 shadow p-4 h-[440px] flex flex-col">
              <h3 class="text-xl font-semibold mb-3">Saved Bank Accounts</h3>
              <div class="overflow-y-auto flex-1 pr-2">
                <ul class="divide-y divide-base-200">
                  <li v-for="account in accounts" :key="account.id" class="py-3 cursor-pointer hover:bg-base-200 rounded transition"
                      @click="handleAccountClick(account)">
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-base-content">{{ account.bank_name }}</span>
                        <span class="text-xs text-base-content/60">{{ account.branch }}</span>
                      </div>
                      <div class="text-sm text-base-content/80">Acct #: {{ account.account_number }}</div>
                      <div class="text-sm text-base-content/80">Name: {{ account.account_name }}</div>
                      <div class="text-sm text-base-content/80 flex items-center gap-2">Balance:
                        <span class="text-green-600 font-medium">
                          {{ isAccountHidden(account.id) ? '••••' : formatCurrency(account.balance) }}
                        </span>
                        <button @click="toggleAccountVisibility(account.id)" type="button" class="btn btn-ghost btn-xs p-1" :aria-pressed="isAccountHidden(account.id)" :aria-label="isAccountHidden(account.id) ? 'Show amount' : 'Hide amount'">
                          <svg v-if="!isAccountHidden(account.id)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                          </svg>
                        </button>
                      </div>
                      <div v-if="account.notes" class="text-xs text-base-content/50 mt-1">{{ account.notes }}</div>
                    </div>
                  </li>
                </ul>
              </div>
              <nav v-if="props.bankAccounts && props.bankAccounts.links" class="mt-4 flex justify-center">
                <ul class="inline-flex items-center -space-x-px">
                  <li v-for="link in props.bankAccounts.links" :key="link.label">
                    <button
                      class="px-3 py-1 border rounded-l-md bg-base-100 hover:bg-base-200 transition-colors"
                      :class="{ 'bg-primary border-primary text-white hover:bg-primary': link.active, 'opacity-50 cursor-not-allowed': !link.url }"
                      @click="goToPage(link.url)"
                      v-html="link.label"
                      :disabled="!link.url"
                    ></button>
                  </li>
                </ul>
              </nav>
            </div>
            <div v-else class="card bg-base-100 border border-base-200 shadow p-6 text-center text-base-content/60 h-[440px] flex items-center justify-center">
              <span>No bank accounts saved yet.</span>
            </div>
          </div>

          <!-- Account Detail / Add Transaction / Edit Modal -->
          <transition name="fade">
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @click.self="closeModal">
              <div class="bg-base-100 rounded-xl shadow-2xl w-full max-w-lg relative animate-popup flex flex-col max-h-[90vh]">
                <button @click="closeModal" class="absolute top-3 right-3 text-base-content/60 hover:text-base-content text-xl z-10">&times;</button>

                <!-- ── DETAIL VIEW ── -->
                <template v-if="modalView === 'detail'">
                  <!-- Header -->
                  <div class="px-6 pt-6 pb-4 border-b border-base-200">
                    <div class="flex items-start justify-between pr-6">
                      <div>
                        <h2 class="text-xl font-bold">{{ selectedAccount?.bank_name }}</h2>
                        <div class="text-sm text-base-content/60 mt-0.5">{{ selectedAccount?.account_name }} &bull; {{ selectedAccount?.account_number }}</div>
                        <div v-if="selectedAccount?.branch" class="text-xs text-base-content/50 mt-0.5">{{ selectedAccount.branch }}</div>
                      </div>
                      <div class="text-right">
                        <div class="text-xs text-base-content/50 mb-0.5">Balance</div>
                        <div class="text-2xl font-bold text-green-600">{{ formatCurrency(selectedAccount?.balance) }}</div>
                      </div>
                    </div>
                    <!-- Action buttons -->
                    <div class="flex gap-2 mt-4">
                      <button @click="modalView = 'addTransaction'" class="btn btn-primary btn-sm text-white flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Transaction
                      </button>
                      <button @click="modalView = 'editAccount'" class="btn btn-ghost btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                        </svg>
                        Edit
                      </button>
                      <button @click="confirmDelete" class="btn btn-error btn-sm text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Transaction history -->
                  <div class="px-6 py-4 overflow-y-auto flex-1">
                    <h3 class="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-3">Transaction History</h3>
                    <template v-if="accountHistory.length">
                      <ul class="divide-y divide-base-200">
                        <li v-for="tx in accountHistory" :key="tx.id" class="py-2.5 flex items-center justify-between gap-2">
                          <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">{{ tx.description }}</div>
                            <div class="text-xs text-base-content/50">{{ tx.category }} &bull; {{ formatDate(tx.entry_date) }}</div>
                          </div>
                          <span :class="tx.type === 'income' ? 'text-green-600' : 'text-red-500'" class="font-semibold text-sm whitespace-nowrap">
                            {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                          </span>
                        </li>
                      </ul>
                    </template>
                    <div v-else class="text-sm text-base-content/50 text-center py-8">No transactions linked to this account yet.</div>
                  </div>
                </template>

                <!-- ── ADD TRANSACTION VIEW ── -->
                <template v-else-if="modalView === 'addTransaction'">
                  <div class="px-6 pt-6 pb-4 border-b border-base-200 flex items-center gap-3 pr-10">
                    <button @click="modalView = 'detail'" class="btn btn-ghost btn-sm btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div>
                      <h2 class="text-xl font-bold">Add Transaction</h2>
                      <div class="text-xs text-base-content/50">{{ selectedAccount?.bank_name }} &bull; {{ formatCurrency(selectedAccount?.balance) }}</div>
                    </div>
                  </div>
                  <div class="px-6 py-4 overflow-y-auto flex-1">
                    <p v-if="txFormError" class="mb-3 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">{{ txFormError }}</p>
                    <form @submit.prevent="submitTransaction" class="flex flex-col gap-4">
                      <!-- Type toggle -->
                      <div class="form-control">
                        <label class="label pb-1"><span class="label-text font-semibold">Type</span></label>
                        <div class="flex rounded-lg overflow-hidden border border-base-300">
                          <button type="button"
                            class="flex-1 py-2 text-sm font-medium transition-colors"
                            :class="txForm.type === 'expense' ? 'bg-red-500 text-white' : 'bg-base-100 text-base-content/60 hover:bg-base-200'"
                            @click="txForm.type = 'expense'">
                            Expense
                          </button>
                          <button type="button"
                            class="flex-1 py-2 text-sm font-medium transition-colors"
                            :class="txForm.type === 'income' ? 'bg-green-500 text-white' : 'bg-base-100 text-base-content/60 hover:bg-base-200'"
                            @click="txForm.type = 'income'">
                            Income
                          </button>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-3">
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Amount</span></label>
                          <input v-model.number="txForm.amount" type="number" step="0.01" min="0.01" class="input input-bordered w-full" placeholder="0.00" required />
                        </div>
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Date</span></label>
                          <input v-model="txForm.entry_date" type="date" class="input input-bordered w-full" required />
                        </div>
                      </div>

                      <div class="form-control">
                        <label class="label pb-1"><span class="label-text font-semibold">Description</span></label>
                        <input v-model="txForm.description" type="text" class="input input-bordered w-full" placeholder="e.g. Grocery run" required maxlength="255" />
                      </div>

                      <div class="form-control">
                        <label class="label pb-1"><span class="label-text font-semibold">Category</span></label>
                        <input
                          v-model="txForm.category"
                          type="text"
                          class="input input-bordered w-full"
                          placeholder="e.g. Food"
                          list="tx-category-list"
                          required
                        />
                        <datalist id="tx-category-list">
                          <option v-for="cat in props.categories" :key="cat" :value="cat" />
                        </datalist>
                      </div>

                      <div class="flex gap-2 mt-2">
                        <button type="button" @click="modalView = 'detail'" class="btn btn-ghost flex-1">Cancel</button>
                        <button type="submit" class="btn btn-primary text-white flex-1" :disabled="txProcessing">
                          <span v-if="txProcessing" class="loading loading-spinner loading-sm"></span>
                          {{ txProcessing ? 'Saving...' : 'Save Transaction' }}
                        </button>
                      </div>
                    </form>
                  </div>
                </template>

                <!-- ── EDIT ACCOUNT VIEW ── -->
                <template v-else-if="modalView === 'editAccount'">
                  <div class="px-6 pt-6 pb-4 border-b border-base-200 flex items-center gap-3 pr-10">
                    <button @click="modalView = 'detail'" class="btn btn-ghost btn-sm btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 class="text-xl font-bold">Edit Bank Account</h2>
                  </div>
                  <div class="px-6 py-4 overflow-y-auto flex-1">
                    <form @submit.prevent="saveEdit" v-if="editAccount">
                      <p v-if="editFormError" class="mb-3 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">{{ editFormError }}</p>
                      <div class="flex flex-col gap-3">
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Bank Name</span></label>
                          <input v-model="editAccount.bank_name" class="input input-bordered w-full" required />
                        </div>
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Account Number</span></label>
                          <input v-model="editAccount.account_number" class="input input-bordered w-full" required />
                        </div>
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Account Name</span></label>
                          <input v-model="editAccount.account_name" class="input input-bordered w-full" required />
                        </div>
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Branch</span></label>
                          <input v-model="editAccount.branch" class="input input-bordered w-full" />
                        </div>
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Notes</span></label>
                          <textarea v-model="editAccount.notes" class="textarea textarea-bordered w-full"></textarea>
                        </div>
                        <div class="form-control">
                          <label class="label pb-1"><span class="label-text font-semibold">Current Saving</span></label>
                          <input v-model.number="editAccount.balance" type="number" step="0.01" class="input input-bordered w-full" />
                        </div>
                      </div>
                      <div class="mt-6 flex justify-end gap-2">
                        <button type="button" @click="modalView = 'detail'" class="btn btn-ghost">Cancel</button>
                        <button type="submit" class="btn btn-primary text-white">Save</button>
                      </div>
                    </form>
                  </div>
                </template>

              </div>
            </div>
          </transition>

          <!-- Add Bank Account Modal -->
          <transition name="fade">
            <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @click.self="closeAddModal">
              <div class="bg-base-100 rounded-lg shadow-2xl p-6 w-full max-w-2xl relative animate-popup">
            <button @click="closeAddModal" class="absolute top-3 right-3 text-base-content/60 hover:text-base-content text-xl">&times;</button>
                <h2 class="text-2xl font-bold mb-4">Add Bank Account</h2>
                <form @submit.prevent="submitBankAccount">
                  <p v-if="addFormError" class="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                    {{ addFormError }}
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="form-control w-full gap-2">
                      <span class="label-text font-semibold text-base-content">Bank Name</span>
                      <input v-model="form.bank_name" type="text" class="input input-bordered w-full bg-base-100 text-base-content" required />
                    </label>
                    <label class="form-control w-full gap-2">
                      <span class="label-text font-semibold text-base-content">Account Number</span>
                      <input v-model="form.account_number" type="text" class="input input-bordered w-full bg-base-100 text-base-content" required />
                    </label>
                    <label class="form-control w-full gap-2">
                      <span class="label-text font-semibold text-base-content">Account Name</span>
                      <input v-model="form.account_name" type="text" class="input input-bordered w-full bg-base-100 text-base-content" required />
                    </label>
                    <label class="form-control w-full gap-2">
                      <span class="label-text font-semibold text-base-content">Bank Branch</span>
                      <input v-model="form.branch" type="text" class="input input-bordered w-full bg-base-100 text-base-content" />
                    </label>
                    <label class="form-control md:col-span-2 w-full gap-2">
                      <span class="label-text font-semibold text-base-content">Notes</span>
                      <textarea v-model="form.notes" class="textarea textarea-bordered w-full bg-base-100 text-base-content" rows="2"></textarea>
                    </label>
                    <label class="form-control w-full gap-2">
                      <span class="label-text font-semibold text-base-content">Current Saving</span>
                      <input v-model.number="form.balance" type="number" step="0.01" class="input input-bordered w-full bg-base-100 text-base-content" />
                    </label>
                  </div>
                  <div class="mt-6 flex justify-end gap-2">
                    <button type="button" @click="closeAddModal" class="btn btn-ghost">Cancel</button>
                    <button type="submit" class="btn btn-primary text-white">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <!-- Create Recurring Payment modal removed -->
        </div>
      </main>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import AppSidebar from '@/Components/AppSidebar.vue'
import Chart from 'chart.js/auto'
import { showErrorToast } from '@/utils/toast'
import { SAFETY_MESSAGES } from '@/utils/validation'

const props = defineProps({
  auth: Object,
  bankAccounts: Object,
  totalBalance: Number,
  categories: Array,
  accountTransactions: Object,
  // upcomingRecurring removed
})

const form = ref({
  bank_name: '',
  account_number: '',
  account_name: '',
  branch: '',
  notes: '',
  balance: 0,
})

const blankFormError = SAFETY_MESSAGES.blank
const negativeBalanceError = SAFETY_MESSAGES.nonNegativeAmount
const addFormError = ref('')
const editFormError = ref('')

// Visibility controls: toggle totals and per-account amounts
const showTotals = ref(true)
const hiddenAccounts = ref([])

function toggleTotals() {
  showTotals.value = !showTotals.value
}

function toggleAccountVisibility(id) {
  if (id === undefined || id === null) return
  const idx = hiddenAccounts.value.indexOf(id)
  if (idx === -1) hiddenAccounts.value.push(id)
  else hiddenAccounts.value.splice(idx, 1)
}

function isAccountHidden(id) {
  return hiddenAccounts.value.includes(id)
}

// Modal state for adding a bank account
const showAddModal = ref(false)

function openAddModal() {
  // reset form and open modal
  form.value = { bank_name: '', account_number: '', account_name: '', branch: '', notes: '', balance: 0 }
  addFormError.value = ''
  showAddModal.value = true
}

function closeAddModal() {
  addFormError.value = ''
  showAddModal.value = false
}


const accounts = computed(() => {
  if (!props.bankAccounts) return []
  return Array.isArray(props.bankAccounts) ? props.bankAccounts : (props.bankAccounts.data || [])
})

// Recurring payments removed: UI and functionality deleted

function formatDate(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString()
  } catch (e) {
    return d
  }
}

function getAccountName(id) {
  const acc = accounts.value.find(a => a.id === id)
  return acc ? (acc.account_name || acc.bank_name) : null
}

// Chart setup
const balanceChart = ref(null)
let chartInstance = null

const accountLabels = computed(() => accounts.value.map(a => a.bank_name || `Acct ${a.id}`))
const accountBalances = computed(() => accounts.value.map(a => Number(a.balance || 0)))

function initChart() {
  if (!balanceChart.value) return
  const ctx = balanceChart.value.getContext('2d')
  // create a subtle vertical gradient for bars
  const grad = ctx.createLinearGradient(0, 0, 0, balanceChart.value.height)
  grad.addColorStop(0, 'rgba(124,58,237,0.95)')
  grad.addColorStop(1, 'rgba(251,191,36,0.65)')

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: accountLabels.value,
      datasets: [
        {
          label: 'Balance',
          data: accountBalances.value,
          backgroundColor: accountBalances.value.map(() => grad),
          borderColor: accountBalances.value.map(() => 'rgba(79,70,229,1)'),
          borderWidth: 0,
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(15,23,42,0.06)' },
          ticks: {
            callback: function(value) {
              try {
                return new Intl.NumberFormat(undefined, { style: 'currency', currency: (props.auth && props.auth.user && props.auth.user.currency) ? props.auth.user.currency : 'USD' }).format(value)
              } catch (e) {
                return value
              }
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.parsed.y ?? context.parsed ?? 0
              try {
                return new Intl.NumberFormat(undefined, { style: 'currency', currency: (props.auth && props.auth.user && props.auth.user.currency) ? props.auth.user.currency : 'USD' }).format(val)
              } catch (e) {
                return val
              }
            }
          }
        }
      },
      animation: { duration: 400 }
    },
  })
}

function updateChart() {
  if (!chartInstance) return initChart()
  chartInstance.data.labels = accountLabels.value
  chartInstance.data.datasets[0].data = accountBalances.value
  // update gradient in case canvas size changed
  const ctx = balanceChart.value.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 0, balanceChart.value.height)
  grad.addColorStop(0, 'rgba(124,58,237,0.95)')
  grad.addColorStop(1, 'rgba(251,191,36,0.65)')
  chartInstance.data.datasets[0].backgroundColor = accountBalances.value.map(() => grad)
  chartInstance.update()
}

onMounted(() => {
  initChart()

  // Auto-hide amounts on the first visit in this browser session.
  // If the user hasn't visited the bank accounts page this session, hide totals
  // and mask per-account balances, then mark the session as visited so this
  // only happens once per session.
  try {
    const key = 'stracker_bank_accounts_visited'
    if (!sessionStorage.getItem(key)) {
      showTotals.value = false
      // hide all accounts initially
      hiddenAccounts.value = accounts.value.map(a => a.id)
      sessionStorage.setItem(key, '1')
    }
  } catch (e) {
    // sessionStorage may be unavailable in some contexts; silently ignore
    // and keep default visibility.
  }
})

watch([accountLabels, accountBalances], () => {
  updateChart()
})

function goToPage(url) {
  if (!url) return
  router.get(url, {}, { preserveState: true, preserveScroll: true })
}

// Modal state
const showModal = ref(false)
const selectedAccount = ref(null)
const editAccount = ref(null)

function handleAccountClick(account) {
  selectedAccount.value = account
  // Deep copy to avoid mutating the list directly
  editAccount.value = { ...account }
  editFormError.value = ''
  showModal.value = true
}

function hasBlankRequiredBankAccountFields(account) {
  if (!account) return true

  return [account.bank_name, account.account_number, account.account_name]
    .some((value) => !String(value ?? '').trim())
}

function formatCurrency(amount) {
  const currency = (props.auth && props.auth.user && props.auth.user.currency) ? props.auth.user.currency : 'USD'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount || 0))
  } catch (e) {
    return Number(amount || 0).toFixed(2)
  }
}

function saveEdit() {
  if (!editAccount.value || !editAccount.value.id) return

  if (hasBlankRequiredBankAccountFields(editAccount.value)) {
    editFormError.value = blankFormError
    showErrorToast(blankFormError)
    return
  }

  if (Number(editAccount.value.balance || 0) < 0) {
    editFormError.value = negativeBalanceError
    showErrorToast(negativeBalanceError)
    return
  }

  editFormError.value = ''

  router.put(route('bank-accounts.update', editAccount.value.id), editAccount.value, {
    preserveScroll: true,
    onSuccess: () => {
      closeModal()
    },
    onFinish: () => {
      // ensure modal is closed after request completes
      closeModal()
    },
    onError: (errors) => {
      // optionally surface validation errors later
      console.error('Validation errors updating bank account:', errors)
    },
  })
}

function confirmDelete() {
  if (!editAccount.value || !editAccount.value.id) return
  if (!confirm('Are you sure you want to delete this bank account? This action cannot be undone.')) return

  // close modal immediately for a snappier UX, then perform delete
  closeModal()

  router.delete(route('bank-accounts.destroy', editAccount.value.id), {}, {
    preserveScroll: true,
    onError: (errors) => {
      console.error('Error deleting bank account:', errors)
    },
  })
}
function closeModal() {
  showModal.value = false
  selectedAccount.value = null
  editAccount.value = null
  editFormError.value = ''
}

function submitBankAccount() {
  if (hasBlankRequiredBankAccountFields(form.value)) {
    addFormError.value = blankFormError
    showErrorToast(blankFormError)
    return
  }

  if (Number(form.value.balance || 0) < 0) {
    addFormError.value = negativeBalanceError
    showErrorToast(negativeBalanceError)
    return
  }

  addFormError.value = ''

  router.post(route('bank-accounts.store'), form.value, {
    preserveScroll: true,
    onSuccess: () => {
      form.value = { bank_name: '', account_number: '', account_name: '', branch: '', notes: '', balance: 0 }
      closeAddModal()
    },
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes popup {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-popup {
  animation: popup 0.2s cubic-bezier(0.4,0,0.2,1);
}
</style>
