<template>
  <Head title="Reset Password" />
  <div class="login-bg min-h-screen flex flex-col">
    <header class="login-hero-nav">
      <div class="login-hero-nav-left">
        <img :src="logoUrl" alt="sTracker logo" class="login-hero-logo shadow-md" />
        <span class="login-hero-brand font-bold text-lg">sTracker</span>
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-16">
      <div class="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div class="card-body gap-6">

          <!-- Icon + heading -->
          <div class="flex flex-col items-center gap-2 text-center">
            <div class="rounded-full bg-primary/10 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold">Set new password</h1>
            <p class="text-sm text-base-content/60 max-w-xs">
              Choose a strong password you haven't used before.
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="submit" class="flex flex-col gap-4">
            <!-- Email (hidden but submitted for token validation) -->
            <div class="form-control">
              <label class="label pb-1" for="email">
                <span class="label-text font-medium">Email address</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="input input-bordered w-full"
                :class="{ 'input-error': form.errors.email }"
                required
                autocomplete="username"
              />
              <p v-if="form.errors.email" class="mt-1.5 text-xs text-error">
                {{ form.errors.email }}
              </p>
            </div>

            <!-- New password -->
            <div class="form-control">
              <label class="label pb-1" for="password">
                <span class="label-text font-medium">New password</span>
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="input input-bordered w-full pr-10"
                  :class="{ 'input-error': form.errors.password }"
                  placeholder="••••••••"
                  required
                  autofocus
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-base-content/40 hover:text-base-content/70 transition-colors"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <p v-if="form.errors.password" class="mt-1.5 text-xs text-error">
                {{ form.errors.password }}
              </p>
            </div>

            <!-- Confirm password -->
            <div class="form-control">
              <label class="label pb-1" for="password_confirmation">
                <span class="label-text font-medium">Confirm new password</span>
              </label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                class="input input-bordered w-full"
                :class="{ 'input-error': form.errors.password_confirmation }"
                placeholder="••••••••"
                required
                autocomplete="new-password"
              />
              <p v-if="form.errors.password_confirmation" class="mt-1.5 text-xs text-error">
                {{ form.errors.password_confirmation }}
              </p>
            </div>

            <button
              type="submit"
              class="btn btn-block btn-lg mt-1 rounded-xl font-bold tracking-wide border-0 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_4px_rgba(124,58,237,0.45)] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #2563eb 100%);"
              :disabled="form.processing"
            >
              <span v-if="form.processing" class="loading loading-spinner loading-sm"></span>
              {{ form.processing ? 'Resetting...' : 'Reset password' }}
            </button>
          </form>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Head, useForm } from '@inertiajs/vue3'
import logoUrl from '@/../../public/images/str.png'

const props = defineProps({
  email: String,
  token: String,
})

const showPassword = ref(false)

const form = useForm({
  token: props.token,
  email: props.email,
  password: '',
  password_confirmation: '',
})

function submit() {
  form.post(route('password.store'), {
    onFinish: () => form.reset('password', 'password_confirmation'),
  })
}
</script>

<style scoped>
@import '../../../css/login.css';
</style>
