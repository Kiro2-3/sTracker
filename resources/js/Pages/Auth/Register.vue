<template>
  <Head title="Register" />
  <div class="login-bg">
    <div class="login-inspiration-container">
      <div class="login-inspiration-form">
        <div class="login-inspiration-header">
          <div class="login-inspiration-branding">
            <img :src="logoUrl" alt="sTracker Logo" class="login-inspiration-logo" />
            <div>
              <div class="login-inspiration-brand">sTracker</div>
              <p class="login-inspiration-brand-copy">Create your account and start tracking smarter.</p>
            </div>
          </div>
          <div class="login-inspiration-header-actions">
            <span class="login-inspiration-register">
              Already have an account?
              <Link :href="route('login')" class="login-inspiration-register-link">Sign in</Link>
            </span>
          </div>
        </div>

        <div class="login-inspiration-card">
          <div class="login-inspiration-card-header">
            <span class="login-inspiration-eyebrow">Get started</span>
            <div class="login-inspiration-title">Create your finance workspace</div>
            <p class="login-inspiration-description">
              Set up your account to manage transactions, monitor trends, and keep your financial overview organized.
            </p>
            <div class="login-inspiration-chip-row">
              <span class="login-inspiration-chip">Quick setup</span>
              <span class="login-inspiration-chip">Private account</span>
              <span class="login-inspiration-chip">Clear dashboard</span>
            </div>
          </div>

          <form @submit.prevent="submit" class="login-inspiration-form-fields">
            <div class="login-inspiration-inputs">
              <div>
                <InputLabel htmlFor="name" value="Full Name" class="login-label" />
                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  v-model="form.name"
                  autocomplete="name"
                  :isFocused="true"
                  placeholder="John Doe"
                  class="login-input"
                  required
                />
                <InputError :message="form.errors.name" class="mt-1" />
              </div>

              <div>
                <InputLabel htmlFor="email" value="Email Address" class="login-label" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  v-model="form.email"
                  autocomplete="username"
                  placeholder="you@example.com"
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
                  autocomplete="new-password"
                  placeholder="Create a strong password"
                  class="login-input"
                  required
                />
                <InputError :message="form.errors.password" class="mt-1" />
              </div>

              <div>
                <InputLabel htmlFor="password_confirmation" value="Confirm Password" class="login-label" />
                <TextInput
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  v-model="form.password_confirmation"
                  autocomplete="new-password"
                  placeholder="Repeat your password"
                  class="login-input"
                  required
                />
                <InputError :message="form.errors.password_confirmation" class="mt-1" />
              </div>
            </div>

            <div class="login-inspiration-helper-box">
              <strong>Quick tip:</strong> Use an email you check often so you can recover your account easily and stay updated.
            </div>

            <div class="login-inspiration-actions">
              <PrimaryButton class="login-btn login-inspiration-btn" :disabled="form.processing">
                {{ form.processing ? 'Creating account...' : 'Create Account' }}
              </PrimaryButton>
            </div>
          </form>

          <div class="login-inspiration-support-row">
            <span class="login-inspiration-support-text">By creating an account, you can start organizing your finances right away.</span>
          </div>
        </div>

        <div class="login-inspiration-footer">© 2026 sTracker.</div>
      </div>

      <div class="login-inspiration-preview">
        <div class="login-inspiration-preview-glow login-inspiration-preview-glow-one"></div>
        <div class="login-inspiration-preview-glow login-inspiration-preview-glow-two"></div>
        <div class="login-inspiration-image-showcase">
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
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

function submit() {
  form.post('/register', {
    onFinish: () => form.reset('password', 'password_confirmation'),
  });
}
</script>

<style scoped>
@import '../../../css/login.css';
</style>
