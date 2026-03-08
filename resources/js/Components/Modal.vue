<template>
  <TransitionRoot :show="show" as="template">
    <Dialog
      as="div"
      id="modal"
      class="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
      @close="close"
    >
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="absolute inset-0 bg-gray-500/75" />
      </TransitionChild>
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leave-from="opacity-100 translate-y-0 sm:scale-100"
        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <DialogPanel :class="['mb-6 transform overflow-hidden rounded-lg bg-base-100 shadow-xl transition-all sm:mx-auto sm:w-full', maxWidthClass]">
          <slot />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { computed } from 'vue';
const props = defineProps({
  show: Boolean,
  maxWidth: { type: String, default: '2xl' },
  closeable: { type: Boolean, default: true },
  onClose: { type: Function, default: () => {} }
});
const close = () => {
  if (props.closeable) {
    props.onClose();
  }
};
const maxWidthClass = computed(() => {
  return {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[props.maxWidth];
});
</script>

<style scoped>
</style>
