<template>
  <Modal :show="true" maxWidth="md" :onClose="closeModal">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-base-content">Add Transaction</h2>
          <p class="text-sm text-base-content/55">Record a new income or expense.</p>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-ghost btn-sm btn-circle shrink-0 text-base-content/50 hover:text-base-content"
        @click="closeModal"
        aria-label="Close"
      >✕</button>
    </div>

    <div class="divider my-4"></div>

    <form @submit.prevent="submit" class="space-y-4">
      <!-- Description + Amount -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-control gap-1">
          <label class="label py-0" for="description">
            <span class="label-text font-semibold">Description</span>
          </label>
          <input
            id="description"
            type="text"
            class="input input-bordered w-full"
            placeholder="e.g. Grocery run"
            v-model="form.description"
          />
          <InputError v-if="errors.description" :message="errors.description" />
        </div>
        <div class="form-control gap-1">
          <label class="label py-0" for="amount">
            <span class="label-text font-semibold">Amount</span>
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            class="input input-bordered w-full"
            placeholder="0.00"
            v-model="form.amount"
          />
          <InputError v-if="errors.amount" :message="errors.amount" />
        </div>
      </div>

      <!-- Type + Category -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-control gap-1">
          <label class="label py-0" for="type">
            <span class="label-text font-semibold">Type</span>
          </label>
          <select id="type" class="select select-bordered w-full" v-model="form.type">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <InputError v-if="errors.type" :message="errors.type" />
        </div>
        <div class="form-control gap-1">
          <label class="label py-0" for="category">
            <span class="label-text font-semibold">Category</span>
            <button
              type="button"
              class="label-text-alt link link-primary text-xs"
              @click="openCategoryModal"
            >Manage</button>
          </label>
          <select
            id="category"
            class="select select-bordered w-full"
            v-model="form.category"
          >
            <option v-if="categories.length === 0" value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <InputError v-if="errors.category" :message="errors.category" />
        </div>
      </div>

      <!-- Date -->
      <div class="form-control gap-1">
        <label class="label py-0" for="entry_date">
          <span class="label-text font-semibold">Date</span>
        </label>
        <input
          id="entry_date"
          type="date"
          class="input input-bordered w-full"
          v-model="form.entry_date"
        />
        <InputError v-if="errors.entry_date" :message="errors.entry_date" />
      </div>

      <!-- Actions -->
      <div class="modal-action mt-2">
        <button type="button" class="btn btn-ghost" @click="closeModal">Cancel</button>
<button type="submit" class="btn btn-primary !text-amber-400" :disabled="processing">
          <span v-if="processing" class="loading loading-spinner loading-sm"></span>
          Save Transaction
        </button>
      </div>
    </form>

    <!-- Manage Categories Modal -->
    <Modal :show="showCategoryModal" maxWidth="sm" :onClose="closeCategoryModal">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-base-content">Manage Categories</h3>
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content"
          @click="closeCategoryModal"
          aria-label="Close"
        >✕</button>
      </div>

      <div class="divider my-3"></div>

      <!-- New category input -->
      <div class="form-control gap-1 mb-4">
        <label class="label py-0" for="new-category">
          <span class="label-text font-semibold">New category name</span>
        </label>
        <div class="join w-full">
          <input
            id="new-category"
            type="text"
            class="input input-bordered join-item w-full"
            placeholder="e.g. Groceries"
            v-model="newCategory"
            @keyup.enter="saveCategory"
          />
          <button type="button" class="btn btn-primary join-item" @click="saveCategory">Add</button>
        </div>
        <InputError v-if="categoryError" :message="categoryError" />
      </div>

      <!-- Existing categories list -->
      <div v-if="categories.length" class="space-y-1 max-h-48 overflow-y-auto">
        <p class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Existing categories</p>
        <div
          v-for="cat in categories"
          :key="cat"
          class="flex items-center justify-between rounded-lg border border-base-200 bg-base-200/40 px-3 py-2"
        >
          <span class="text-sm font-medium text-base-content">{{ cat }}</span>
          <button
            type="button"
            class="btn btn-ghost btn-xs text-error"
            @click="deleteCategory(cat)"
          >Delete</button>
        </div>
      </div>

      <div class="modal-action mt-4">
        <button type="button" class="btn btn-ghost btn-sm" @click="closeCategoryModal">Done</button>
      </div>
    </Modal>
  </Modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import { router } from '@inertiajs/vue3'
import InputError from '@/Components/InputError.vue'
import Modal from '@/Components/Modal.vue'
import { showErrorToast } from '@/utils/toast'
import { SAFETY_MESSAGES } from '@/utils/validation'

const props = defineProps({
  // categories: list of expense categories passed from the server
  categories: {
    type:    Array,
    default: () => ['Food', 'Rent', 'Leisure', 'Bills'],
  },
  // standalone: when true (opened as its own page), closeModal navigates back instead of just emitting
  standalone: {
    type:    Boolean,
    default: false,
  },
})

// Emits 'close' so the parent page can hide this modal
const emit = defineEmits(['close'])

// Local copy of categories so the user can add/delete categories within the session without a full reload
const categories = ref([...props.categories])

function getDefaultCategory() {
  return categories.value[0] ?? ''
}

// Form state with today's date pre-selected for convenience
const form = ref({
  description: '',
  amount:      '',
  type:        'expense',
  category:    getDefaultCategory(),
  entry_date:  new Date().toISOString().split('T')[0],
})

const errors            = ref({})   // server-side validation errors keyed by field name
const processing        = ref(false)
const showCategoryModal = ref(false)
const newCategory       = ref('')
const categoryError     = ref('')
const blankFormError    = SAFETY_MESSAGES.blank

// Keep the selected category valid when the available options change
watch(categories, () => {
  if (!categories.value.includes(form.value.category)) {
    form.value.category = getDefaultCategory()
  }
}, { deep: true })

function openCategoryModal() {
  newCategory.value     = ''
  categoryError.value   = ''
  showCategoryModal.value = true
}

function closeCategoryModal() {
  showCategoryModal.value = false
}

/**
 * POSTs a new category to the server via axios (not Inertia) to avoid a full
 * page reload; on success, adds the new name to the local categories list and
 * pre-selects it in the form.
 */
function saveCategory() {
  const name = newCategory.value.trim()

  if (!name) {
    categoryError.value = blankFormError
    showErrorToast(blankFormError)
    return
  }

  if (categories.value.includes(name)) {
    categoryError.value = 'This category already exists.'
    return
  }

  categoryError.value = ''

  axios.post(route('categories.store'), { name })
    .then((response) => {
      const savedName = response.data.name ?? name
      if (!categories.value.includes(savedName)) {
        categories.value.push(savedName)
      }
      form.value.category     = savedName
      showCategoryModal.value = false
    })
    .catch((error) => {
      categoryError.value = error.response?.data?.errors?.name?.[0] ?? 'Unable to save category.'
    })
}

/**
 * Removes a category from the local list.
 * If the deleted category was selected, falls back to the first available category.
 */
function deleteCategory(name) {
  categories.value = categories.value.filter((cat) => cat !== name)

  if (form.value.category === name) {
    const fallback      = getDefaultCategory()
    form.value.category = fallback
  }

  categoryError.value = ''
}

/**
 * Submits the new transaction via Inertia POST.
 * On success, resets the form and closes the modal.
 * On error, surfaces validation messages next to each field.
 */
function submit() {
  processing.value = true

  const blankErrors = {}
  const amount = Number(form.value.amount)

  if (!form.value.description?.trim()) blankErrors.description = blankFormError
  if (form.value.amount === '' || form.value.amount === null || Number.isNaN(amount)) blankErrors.amount = blankFormError
  else if (amount <= 0) blankErrors.amount = SAFETY_MESSAGES.positiveAmount
  if (!form.value.category?.trim()) blankErrors.category = blankFormError
  if (!form.value.entry_date) blankErrors.entry_date = blankFormError

  if (Object.keys(blankErrors).length > 0) {
    errors.value = blankErrors
    processing.value = false
    showErrorToast(Object.values(blankErrors)[0])
    return
  }

  errors.value = {}

  router.post(route('transactions.store'), form.value, {
    preserveScroll: true,
    onSuccess: () => {
      form.value = {
        description: '',
        amount:      '',
        type:        'expense',
        category:    getDefaultCategory(),
        entry_date:  new Date().toISOString().split('T')[0],
      }
      errors.value     = {}
      processing.value = false
      emit('close')
    },
    onError: (e) => {
      errors.value     = e
      processing.value = false
    },
  })
}

/**
 * Closes the modal.
 * In standalone mode (own page), navigates back so the browser history is clean.
 */
function closeModal() {
  emit('close')
  if (props.standalone) {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.get(route('dashboard'))
    }
  }
}
</script>

<style scoped>

</style>
