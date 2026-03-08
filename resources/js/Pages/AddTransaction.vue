<template>
  <Modal :show="true" maxWidth="md" :onClose="closeModal">
    <div class="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-bold text-2xl text-blue-600 dark:text-blue-300">Add Transaction</h2>
        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="closeModal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form @submit.prevent="submit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              class="select select-bordered w-full text-black bg-white"
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
              class="select select-bordered w-full text-black bg-white"
              :class="form.type === 'income' ? 'opacity-50 cursor-not-allowed' : ''"
              v-model="form.category"
              :disabled="form.type === 'income'"
            >
              <option v-if="form.type === 'income'" value="Salary">Salary</option>
              <template v-else>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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
            class="input input-bordered w-full text-black bg-white"
            v-model="form.entry_date"
          />
          <InputError v-if="errors.entry_date" :message="errors.entry_date" />
        </div>
        <div class="flex justify-end">
          <PrimaryButton
            type="submit"
            class="w-full md:w-1/3 text-base"
            :disabled="processing"
          >
            Save Transaction
          </PrimaryButton>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import Modal from '@/Components/Modal.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => ["Food", "Rent", "Leisure", "Bills"]
  }
});

const emit = defineEmits(['close']);

const form = ref({
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  entry_date: new Date().toISOString().split('T')[0],
});
const errors = ref({});
const processing = ref(false);

watch(() => form.value.type, (newType) => {
  if (newType === 'income') {
    form.value.category = 'Salary';
  } else if (newType === 'expense' && form.value.category === 'Salary') {
    form.value.category = 'Food';
  }
});

function submit() {
  processing.value = true;
  router.post(route('transactions.store'), form.value, {
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
}
</script>

<style scoped>
</style>
