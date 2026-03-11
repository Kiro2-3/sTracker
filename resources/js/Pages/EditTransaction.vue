<template>
  <Modal :show="true" maxWidth="md" :onClose="closeModal">
    <div class="card w-full max-w-lg bg-base-100 border border-base-200">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16.862 4.487l1.687-1.687a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.5 7.125L16.875 4.5" />
              </svg>
            </div>
            <div>
              <h2 class="font-semibold text-2xl text-base-content tracking-tight">Edit Transaction</h2>
              <p class="text-sm text-base-content/60">Update the details of this record.</p>
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
              class="select select-bordered w-full bg-base-100 text-base-content select-disabled opacity-60"
              v-model="form.type"
              disabled
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
            Update Transaction
          </PrimaryButton>
        </div>
        </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import Modal from '@/Components/Modal.vue';

const props = defineProps({
  transaction: Object,
  categories: {
    type: Array,
    default: () => ["Food", "Rent", "Leisure", "Bills"]
  }
});

const emit = defineEmits(['close']);

const form = ref({
  description: props.transaction.description,
  amount: props.transaction.amount,
  type: props.transaction.type,
  category: props.transaction.category,
  entry_date: props.transaction.entry_date,
});
const errors = ref({});
const processing = ref(false);

function submit() {
  processing.value = true;
  router.put(route('transactions.update', props.transaction.id), form.value, {
    preserveScroll: true,
    onSuccess: () => {
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
