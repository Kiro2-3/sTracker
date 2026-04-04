<template>
  <Head title="Forgot Password" />
  <div class="login-bg min-h-screen flex flex-col">
    <header class="login-hero-nav">
      <div class="login-hero-nav-left">
        <img :src="logoUrl" alt="sTracker logo" class="login-hero-logo shadow-md" />
        <span class="login-hero-brand font-bold text-lg">sTracker</span>
      </div>
      <div class="login-hero-nav-actions">
        <Link :href="route('login')" class="btn btn-ghost btn-sm normal-case text-white/80">
          Back to login
        </Link>
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-16">
      <div class="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div class="card-body gap-6">

          <!-- Icon + heading -->
          <div class="flex flex-col items-center gap-2 text-center">
            <div class="rounded-full bg-primary/10 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold">Forgot your password?</h1>
            <p class="text-sm text-base-content/60 max-w-xs">
              No problem. Enter your email and we'll send you a reset link.
            </p>
          </div>

          <!-- Success status -->
          <div v-if="status" class="alert alert-success text-sm py-2" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ status }}</span>
          </div>

          <!-- Form -->
          <form @submit.prevent="submit" class="flex flex-col gap-4">
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
                placeholder="you@example.com"
                required
                autofocus
                autocomplete="username"
              />
              <p v-if="form.errors.email" class="mt-1.5 text-xs text-error">
                {{ form.errors.email }}
              </p>
            </div>

            <button
              type="submit"
              class="btn btn-block btn-lg mt-1 rounded-xl font-bold tracking-wide border-0 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_4px_rgba(124,58,237,0.45)] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #2563eb 100%);"
              :disabled="form.processing"
            >
              <span v-if="form.processing" class="loading loading-spinner loading-sm"></span>
              {{ form.processing ? 'Sending...' : 'Send reset link' }}
            </button>
          </form>

          <p class="text-center text-sm text-base-content/50">
            Remembered your password?
            <Link :href="route('login')" class="text-primary font-medium hover:underline">Sign in</Link>
          </p>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import logoUrl from '@/../../public/images/str.png'

defineProps({
  status: String,
})

const form = useForm({
  email: '',
})

function submit() {
  form.post(route('password.email'))
}
</script>

<style scoped>
@import '../../../css/login.css';
</style>
