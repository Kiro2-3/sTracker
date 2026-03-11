<template>
  <Head title="Log in" />
  <div class="login-bg">
    <div
      v-if="status"
      class="toast toast-top toast-end z-50"
    >
      <div class="alert alert-success" role="alert">
        <span>{{ status }}</span>
      </div>
    </div>

    <div class="login-hero-shell">
      <header class="login-hero-nav">
        <div class="login-hero-nav-left">
          <img :src="logoUrl" alt="sTracker preview" class="login-hero-logo rounded-xl shadow-md" />
          <span class="login-hero-brand font-bold text-lg">sTracker</span>
        </div>
 
      </header>

      <main class="login-hero-main">
        <section class="login-hero-grid">
          <div class="login-hero-copy">
            <div class="login-hero-badge">

            </div>
            <h1 class="login-hero-title"> 
              <span class="login-hero-title-highlight">Strike your Goals!</span>
            </h1>
            <p class="login-hero-subcopy">
              sTracker turns everyday income and expenses into clear, simple insights so you
              can budget with confidence, avoid surprises, and stay on top of your goals.
            </p>
            <div class="login-hero-cta-row">
              <Link :href="route('register')" class="login-hero-primary-cta btn btn-primary btn-lg normal-case">Start tracking for free</Link>
              <button type="button" class="login-hero-secondary-cta btn btn-ghost btn-lg normal-case">Learn more</button>
            </div>
          </div>

          <div class="login-hero-card-wrapper">
            <div class="login-inspiration-card card bg-base-100 shadow-xl border border-base-200">
              <div class="card-body w-full">
              <form @submit.prevent="submit" class="login-inspiration-form-fields space-y-6">
                <div class="login-inspiration-inputs">
                  <div>
                    <InputLabel htmlFor="email" value="Email Address" class="login-label" />
                    <TextInput
                      id="email"
                      type="email"
                      name="email"
                      v-model="form.email"
                      autocomplete="username"
                      :isFocused="true"
                      placeholder="Email"
                      class="login-input input input-bordered input-lg w-full"
                      required
                    />
                    <InputError :message="form.errors.email" class="mt-1" />
                  </div>
                  <div>
                    <InputLabel htmlFor="password" value="Password" class="login-label" />
                    <TextInput
                      id="password"
                      type="password"
                      name="password"
                      v-model="form.password"
                      autocomplete="current-password"
                      placeholder="Password"
                      class="login-input input input-bordered input-lg w-full"
                      required
                    />
                    <InputError :message="form.errors.password" class="mt-1" />
                  </div>
                </div>
                  <div class="login-inspiration-actions">
                  <div class="login-checkbox-row login-inspiration-checkbox-row flex items-center justify-between gap-2">
                    <Checkbox
                      id="remember"
                      name="remember"
                      v-model="form.remember"
                      class="checkbox checkbox-primary"
                    />
                    <label for="remember" class="login-checkbox-label">
                      Keep me logged in
                    </label>
                    <Link v-if="canResetPassword" :href="route('password.request')" class="login-inspiration-forgot">Forgot password?</Link>
                  </div>
                  <PrimaryButton class="login-btn login-inspiration-btn btn btn-primary btn-lg w-full" :disabled="form.processing">
                    {{ form.processing ? 'Signing in...' : 'Log In' }}
                  </PrimaryButton>
                </div>
              </form>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-10 px-3">
          <div class="grid gap-4 md:grid-cols-3">
            <div class="card bg-base-100 shadow-sm border border-base-200">
              <div class="card-body py-4 px-5">
                <h3 class="card-title text-sm font-semibold mb-1 text-base-content">Secure & private</h3>
                <p class="text-xs text-base-content/90">Your data is encrypted in transit and stored safely so only you can see your numbers.</p>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm border border-base-200">
              <div class="card-body py-4 px-5">
                <h3 class="card-title text-sm font-semibold mb-1 text-base-content">Works across devices</h3>
                <p class="text-xs text-base-content/90">Log in from desktop or mobile and pick up exactly where you left off.</p>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm border border-base-200">
              <div class="card-body py-4 px-5">
                <h3 class="card-title text-sm font-semibold mb-1 text-base-content">Export when you need</h3>
                <p class="text-xs text-base-content/90">Download your transactions for sharing with your accountant or for backup.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="login-hero-preview">
          <div class="login-hero-preview-inner">
            <div class="login-inspiration-dashboard-frame">
              <img
                :src="previewUrl"
                alt="sTracker preview"
                class="login-inspiration-preview-img"
              />
            </div>
          </div>
        </section>
      </main>

      <footer class="mt-12 bg-transparent text-black">
        <div class="max-w-6xl mx-auto px-6 py-10 md:py-12">
          <div class="grid gap-10 md:grid-cols-4">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="avatar placeholder">

                </div>
                <div>
                  <div class="text-sm font-semibold tracking-wide uppercase text-black">Rocky Penamante</div>
                  <p class="text-xs text-black/70">Tech Enthusiast</p>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-xs font-semibold tracking-[0.2em] uppercase text-black">Contact</h3>
              <ul class="space-y-1 text-xs text-black/80">
                <li>Eastwood Residence</li>
                <li>Rodriguez, Philippines</li>
                <li><span class="link link-hover">Get in touch</span></li>
              </ul>
            </div>



            <div class="space-y-4">
              <div>
                <h3 class="text-xs font-semibold tracking-[0.2em] uppercase text-black mb-2">Services</h3>
                <ul class="space-y-1 text-xs text-black/80">
                  <li>Web Development</li>
                  <li>Project Management</li>
                </ul>
              </div>

              <div>
                <h3 class="text-xs font-semibold tracking-[0.2em] uppercase text-black mb-2">Follow</h3>
                <div class="flex items-center gap-2">
                  <button type="button" class="btn btn-xs btn-circle btn-ghost border border-neutral-300 text-black">in</button>
                  <button type="button" class="btn btn-xs btn-circle btn-ghost border border-neutral-300 text-black">X</button>
                  <button type="button" class="btn btn-xs btn-circle btn-ghost border border-neutral-300 text-black">GH</button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-neutral-200 flex flex-col gap-2 text-[11px] text-black/70 md:flex-row md:items-center md:justify-between">
            <span>© 2026 Rocky Penamante. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import logoUrl from '@/../../public/images/stracker-logo.png';
import previewUrl from '@/../../public/images/preview.png';
import Checkbox from '@/Components/Checkbox.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
  status: String,
  canResetPassword: Boolean
});

const form = useForm({
  email: '',
  password: '',
  remember: false
});

function submit() {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  });
}
</script>

<style scoped>
@import '../../../css/login.css';
</style>
