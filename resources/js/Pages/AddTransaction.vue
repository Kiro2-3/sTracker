<template>
  <Modal :show="true" maxWidth="md" :onClose="closeModal">
    <div class="card w-full max-w-lg bg-base-100 border border-base-200">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h2 class="font-semibold text-2xl text-base-content tracking-tight">Add Transaction</h2>
              <p class="text-sm text-base-content/60">Quickly record a new income or expense.</p>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
            @click="closeModal"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      <form @submit.prevent="submit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <InputLabel value="Description" htmlFor="description" />
            <TextInput
              id="description"
              type="text"
              placeholder="Description"
              v-model="form.description"
            />
            <InputError v-if="errors.description" :message="errors.description" />
          </div>
          <div class="form-control">
            <InputLabel value="Amount" htmlFor="amount" />
            <TextInput
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              v-model="form.amount"
            />
            <InputError v-if="errors.amount" :message="errors.amount" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <InputLabel value="Type" htmlFor="type" />
            <select
              id="type"
              class="select select-bordered w-full bg-base-100 text-base-content"
              v-model="form.type"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <InputError v-if="errors.type" :message="errors.type" />
          </div>
          <div class="form-control">
            <InputLabel value="Category" htmlFor="category" />
            <select
              id="category"
              class="select select-bordered w-full bg-base-100 text-base-content"
              :class="form.type === 'income' ? 'select-disabled opacity-60' : ''"
              v-model="form.category"
              :disabled="form.type === 'income'"
            >
              <option v-if="form.type === 'income'" value="Salary">Salary</option>
              <template v-else>
                <option v-for="cat in expenseCategories" :key="cat" :value="cat">{{ cat }}</option>
              </template>
            </select>
            <InputError v-if="errors.category" :message="errors.category" />

          </div>
        </div>
        <div class="form-control">
          <InputLabel value="Date" htmlFor="entry_date" />
          <input
            id="entry_date"
            type="date"
            class="input input-bordered w-full bg-base-100 text-base-content"
            v-model="form.entry_date"
          />
          <InputError v-if="errors.entry_date" :message="errors.entry_date" />
        </div>
        <div class="flex justify-end mt-8">
          <PrimaryButton
            type="submit"
            class="w-full md:w-1/3 text-base font-semibold shadow"
            :disabled="processing"
          >
            Save 
          </PrimaryButton>
        </div>
      </form>

    </div>
    <Modal :show="showCategoryModal" maxWidth="sm" :onClose="closeCategoryModal">
      <div class="card w-full max-w-sm bg-base-100 border border-base-200">
        <div class="card-body p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-base text-base-content">Add Category</h3>
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-base-content"
              @click="closeCategoryModal"
              aria-label="Close category modal"
            >
              ✕
            </button>
          </div>
          <div class="form-control mb-4">
            <InputLabel value="Category name" htmlFor="new-category" />
            <TextInput
              id="new-category"
              type="text"
              v-model="newCategory"
              placeholder="e.g. Groceries"
            />
            <InputError v-if="categoryError" :message="categoryError" />
          </div>
          <div v-if="categories.length" class="mt-2 max-h-40 overflow-y-auto text-xs text-base-content/80">
            <p class="mb-1 font-semibold">Existing categories</p>
            <ul class="space-y-1">
              <li
                v-for="cat in categories"
                :key="cat"
                class="flex items-center justify-between gap-2"
              >
                <span>{{ cat }}</span>
                <button
                  v-if="cat !== 'Salary'"
                  type="button"
                  class="btn btn-ghost btn-xs text-error"
                  @click="deleteCategory(cat)"
                >
                  Delete
                </button>
                <span v-else class="text-[10px] text-base-content/50">Default</span>
              </li>
            </ul>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button type="button" class="btn btn-ghost btn-sm" @click="closeCategoryModal">Cancel</button>
            <button type="button" class="btn btn-primary btn-sm" @click="saveCategory">Save</button>
          </div>
        </div>
      </div>
    </Modal>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import { useForm, router } from '@inertiajs/vue3';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import Modal from '@/Components/Modal.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['Food', 'Rent', 'Leisure', 'Bills'],
  },
  standalone: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const categories = ref([...props.categories]);

const form = ref({
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  entry_date: new Date().toISOString().split('T')[0],
});
const errors = ref({});
const processing = ref(false);

const showCategoryModal = ref(false);
const newCategory = ref('');
const categoryError = ref('');

// Categories to use when type is expense (exclude 'Salary' if present)
const expenseCategories = computed(() => categories.value.filter(cat => cat !== 'Salary'));

watch(() => form.value.type, (newType) => {
  if (newType === 'income') {
    form.value.category = 'Salary';
  } else if (newType === 'expense' && form.value.category === 'Salary') {
    form.value.category = 'Food';
  }
});

function openCategoryModal() {
  newCategory.value = '';
  categoryError.value = '';
  showCategoryModal.value = true;
}

function closeCategoryModal() {
  showCategoryModal.value = false;
}

function saveCategory() {
  const name = newCategory.value.trim();
  if (!name) {
    categoryError.value = 'Category name is required.';
    return;
  }
  if (categories.value.includes(name)) {
    categoryError.value = 'This category already exists.';
    return;
  }
  categoryError.value = '';

  axios.post(route('categories.store'), { name })
    .then((response) => {
      const savedName = response.data.name ?? name;
      if (!categories.value.includes(savedName)) {
        categories.value.push(savedName);
      }
      form.value.category = savedName;
      showCategoryModal.value = false;
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.name) {
        categoryError.value = error.response.data.errors.name[0];
      } else {
        categoryError.value = 'Unable to save category.';
      }
    });
}

function deleteCategory(name) {
  if (name === 'Salary') {
    categoryError.value = 'The Salary category cannot be deleted.';
    return;
  }

  categories.value = categories.value.filter(cat => cat !== name);

  if (form.value.category === name) {
    const fallback = categories.value.find(cat => cat !== 'Salary') || 'Food';
    form.value.category = fallback;
  }

  categoryError.value = '';
}

function submit() {
  processing.value = true;
  router.post(route('transactions.store'), form.value, {
    preserveScroll: true,
    onSuccess: () => {
      form.value = {
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        entry_date: new Date().toISOString().split('T')[0],
      };
      errors.value = {};
      processing.value = false;
      emit('close');
    },
    onError: (e) => {
      errors.value = e;
      processing.value = false;
    }
  });
}

function closeModal() {
  emit('close');
  if (props.standalone) {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.get(route('dashboard'));
    }
  }
}
</script>

<style scoped>

</style>
