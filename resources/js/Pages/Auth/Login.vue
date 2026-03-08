<template>
  <Head title="Log in" />
  <div class="login-bg">
    <div class="login-inspiration-container">
      <!-- Left: Login Form -->
      <div class="login-inspiration-form">
        <div class="login-inspiration-header">
          <img :src="logoUrl" alt="sTracker Logo" class="login-inspiration-logo" />
          <span class="login-inspiration-brand">sTracker</span>
          <span class="login-inspiration-register">
            Don't have an account?
            <Link :href="route('register')" class="login-inspiration-register-link">Register</Link>
          </span>
        </div>
        <div class="login-inspiration-card">
          <div class="login-inspiration-card-header">
            <div class="login-inspiration-icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#FFD700"/><path d="M24 24a6 6 0 100-12 6 6 0 000 12zM24 27c-5.33 0-16 2.67-16 8v3a1 1 0 001 1h30a1 1 0 001-1v-3c0-5.33-10.67-8-16-8z" fill="#7c3aed"/></svg>
            </div>
            <div class="login-inspiration-title">Log in to your account</div>
          </div>
          <form @submit.prevent="submit" class="login-inspiration-form-fields">
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
                  class="login-input"
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
                  class="login-input"
                  required
                />
                <InputError :message="form.errors.password" class="mt-1" />
              </div>
            </div>
            <div class="login-inspiration-actions">
              <div class="login-checkbox-row login-inspiration-checkbox-row">
                <Checkbox
                  id="remember"
                  name="remember"
                  v-model="form.remember"
                />
                <label for="remember" class="login-checkbox-label">
                  Keep me logged in
                </label>
                <Link v-if="canResetPassword" :href="route('password.request')" class="login-inspiration-forgot">Forgot password?</Link>
              </div>
              <PrimaryButton class="login-btn login-inspiration-btn" :disabled="form.processing">
                {{ form.processing ? 'Signing in...' : 'Log In' }}
              </PrimaryButton>
            </div>
          </form>
        </div>
        <div class="login-inspiration-footer">© 2026 sTracker.</div>
      </div>
      <!-- Right: Dashboard Preview & Marketing -->
      <div class="login-inspiration-preview">
        <div class="login-inspiration-preview-content">
          <span class="login-inspiration-badge">Smart Spend Tracking</span>
          <div class="login-inspiration-preview-title">Your go-to finance dashboard</div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logoUrl from '@/../../public/images/stracker-logo.png';
import Checkbox from '@/Components/Checkbox.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import LoginQuoteInfiniteSkewed30Down from './LoginQuoteInfiniteSkewed30Down.vue';

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
  // Log plain form data for debugging
  console.log('Submitting login form data:', { email: form.email, password: form.password, remember: form.remember });
  // Use explicit POST and URL to avoid route helper issues
  form.post('/login', {
    onFinish: () => form.reset('password'),
  });
}
</script>

<style scoped>
@import '../../../css/login.css';
</style>
