<template>
  <Head title="Log in" />
  <div class="login-bg">
    <div class="login-inspiration-container">
      <div class="login-inspiration-form">
        <div class="login-inspiration-header">
          <div class="login-inspiration-branding">
            <img :src="logoUrl" alt="sTracker Logo" class="login-inspiration-logo" />
            <div>
              <div class="login-inspiration-brand">sTracker</div>
              <p class="login-inspiration-brand-copy">Track income, expenses, and trends in one place.</p>
            </div>
          </div>
          <div class="login-inspiration-header-actions">
            <span class="login-inspiration-register">
              Don't have an account?
              <Link :href="route('register')" class="login-inspiration-register-link">Register</Link>
            </span>
          </div>
        </div>
        <div class="login-inspiration-card">
          <div class="login-inspiration-card-header">
            <span class="login-inspiration-eyebrow">Welcome back</span>
            <div class="login-inspiration-title">Sign in to your finance workspace</div>
            <p class="login-inspiration-description">
              Access your transactions, recent activity, and visual reports with one secure login.
            </p>
            <div class="login-inspiration-chip-row">
              <span class="login-inspiration-chip">Secure login</span>
              <span class="login-inspiration-chip">Real-time overview</span>
              <span class="login-inspiration-chip">Fast access</span>
            </div>
          </div>
          <div v-if="status" class="login-inspiration-status">
            {{ status }}
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
            <div class="login-inspiration-helper-box">
              <strong>Quick tip:</strong> Use the email and password from your registered account to continue where you left off.
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
          <div class="login-inspiration-support-row">
            <span class="login-inspiration-support-text">Simple, secure, and designed for daily finance tracking.</span>
          </div>
        </div>
        <div class="login-inspiration-footer">© 2026 sTracker.</div>
      </div>

      <div class="login-inspiration-preview">
        <div class="login-inspiration-preview-glow login-inspiration-preview-glow-one"></div>
        <div class="login-inspiration-preview-glow login-inspiration-preview-glow-two"></div>
        <div class="login-inspiration-preview-content">
  
        
          <p class="login-inspiration-preview-copy">
            Monitor balances, review transaction history, and spot income versus expense trends from a clean dashboard.
          </p>

          <div class="login-preview-stat-grid">
            <div class="login-preview-stat-card">
              <span class="login-preview-stat-label">Total Income</span>
              <strong class="login-preview-stat-value text-income">₱620,544.01</strong>
            </div>
            <div class="login-preview-stat-card">
              <span class="login-preview-stat-label">Total Expenses</span>
              <strong class="login-preview-stat-value text-expense">₱81,978.98</strong>
            </div>
            <div class="login-preview-stat-card login-preview-stat-card-wide">
              <span class="login-preview-stat-label">Total Revenue</span>
              <strong class="login-preview-stat-value text-revenue">₱538,565.03</strong>
            </div>
          </div>

          <div class="login-inspiration-dashboard-frame">
            <img
              :src="dashboardPreviewUrl"
              alt="sTracker dashboard preview"
              class="login-inspiration-preview-img"
            />
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dashboardPreviewUrl from '@/../../public/images/dashboard-preview.png';
import logoUrl from '@/../../public/images/stracker-logo.png';
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
