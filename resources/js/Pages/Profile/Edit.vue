<template>
  <AuthenticatedLayout :user="auth.user">
    <Head title="Profile Settings" />

    <div class="min-h-screen w-full flex flex-col md:flex-row bg-base-200 text-base-content">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 flex md:flex-col flex-row items-stretch md:min-h-screen bg-base-100 border-b md:border-b-0 md:border-r border-base-200 sticky top-0 z-20 shadow-md">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-base-200 shrink-0">
          <img src="/public/images/stracker-logo.png" alt="Stracker Logo" class="h-8 w-auto" />
          <span class="hidden md:block font-bold text-base tracking-tight text-base-content">Stracker</span>
        </div>

        <!-- Navigation -->
        <ul class="menu menu-md px-3 py-4 gap-0.5 flex-1 w-full">
          <li>
            <button
              class="w-full justify-start gap-3 font-medium rounded-xl"
              @click="router.get(route('dashboard'))"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.75 4.5h7.5v7.5h-7.5zM12.75 4.5h7.5v7.5h-7.5zM12.75 13.5h7.5v7.5h-7.5zM3.75 13.5h7.5v7.5h-7.5z" />
              </svg>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              class="w-full justify-start gap-3 font-medium rounded-xl"
              @click="router.get(route('categories.index'))"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span>Categories</span>
            </button>
          </li>
          <li>
            <button
              class="w-full justify-start gap-3 font-medium rounded-xl"
              @click="router.get(route('transactions.recent'))"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6v6h4.5M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
              </svg>
              <span>Transactions</span>
            </button>
          </li>
        </ul>

        <!-- Add Transaction CTA -->
        <div class="px-4 pb-4 shrink-0">
          <button
            class="btn btn-primary w-full gap-2 font-semibold shadow-sm"
            @click="router.get(route('transactions.add'))"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Transaction
          </button>
        </div>

        <div class="divider my-0 mx-4 h-px"></div>

        <!-- User profile (active state) -->
        <div class="px-3 pb-5 pt-2 shrink-0">
          <div class="flex w-full items-center gap-3 rounded-xl p-3 bg-base-200">
            <div class="avatar placeholder shrink-0">
              <div class="bg-primary text-primary-content rounded-full w-8">
                <span class="text-xs font-bold">{{ auth.user.name?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div class="hidden md:block min-w-0">
              <p class="text-sm font-semibold text-base-content truncate leading-tight">{{ auth.user.name }}</p>
              <p class="text-xs text-base-content/50">Profile Settings</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 px-4 md:px-12 py-8 w-full space-y-6">
        <!-- Flash success -->
        <div v-if="status === 'profile-updated'" class="alert alert-success shadow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Profile updated successfully.</span>
        </div>

        <!-- Profile Info Card -->
        <div class="card bg-base-100 border border-base-200 shadow-xl">
          <div class="card-body gap-5">
            <div>
              <h2 class="text-lg font-bold text-base-content">Profile Information</h2>
              <p class="text-sm text-base-content/60 mt-0.5">Update your name and email address.</p>
            </div>

            <form @submit.prevent="submitProfile" class="space-y-4">
              <label class="form-control w-full gap-1">
                <span class="label-text font-semibold">Name</span>
                <input
                  v-model="profileForm.name"
                  type="text"
                  class="input input-bordered w-full bg-base-100"
                  required
                />
                <span v-if="profileForm.errors.name" class="label-text-alt text-error">{{ profileForm.errors.name }}</span>
              </label>

              <label class="form-control w-full gap-1">
                <span class="label-text font-semibold">Email</span>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="input input-bordered w-full bg-base-100"
                  required
                />
                <span v-if="profileForm.errors.email" class="label-text-alt text-error">{{ profileForm.errors.email }}</span>
              </label>

              <div class="flex justify-end">
                <button type="submit" class="btn btn-primary" :disabled="profileForm.processing">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Danger Zone Card -->
        <div class="card bg-base-100 border border-base-200 shadow-xl">
          <div class="card-body gap-5">
            <div>
              <h2 class="text-lg font-bold text-base-content">Account</h2>
              <p class="text-sm text-base-content/60 mt-0.5">Manage your session and account.</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                @click="logout"
                class="btn btn-outline btn-error gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.75 6.75L21 12m0 0-5.25 5.25M21 12H9m3.75 7.5H6.75A2.25 2.25 0 014.5 17.25v-10.5A2.25 2.25 0 016.75 4.5h6" />
                </svg>
                Logout
              </button>

              <button
                type="button"
                @click="showDeleteModal = true"
                class="btn btn-outline btn-error gap-2 opacity-70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">Delete Account</h3>
        <p class="py-3 text-sm text-base-content/70">
          This action is permanent and cannot be undone. Please enter your password to confirm.
        </p>
        <form @submit.prevent="submitDelete" class="space-y-4">
          <label class="form-control w-full gap-1">
            <span class="label-text font-semibold">Password</span>
            <input
              v-model="deleteForm.password"
              type="password"
              class="input input-bordered w-full"
              placeholder="Enter your password"
              required
            />
            <span v-if="deleteForm.errors.password" class="label-text-alt text-error">{{ deleteForm.errors.password }}</span>
          </label>
          <div class="modal-action">
            <button type="button" @click="showDeleteModal = false" class="btn btn-ghost">Cancel</button>
            <button type="submit" class="btn btn-error" :disabled="deleteForm.processing">Delete Account</button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="showDeleteModal = false"></div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref } from 'vue';
import { router, useForm, Head } from '@inertiajs/vue3';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout.vue';

const props = defineProps({
  auth: Object,
  mustVerifyEmail: Boolean,
  status: String,
});

const profileForm = useForm({
  name: props.auth.user.name,
  email: props.auth.user.email,
});

const deleteForm = useForm({
  password: '',
});

const showDeleteModal = ref(false);

function submitProfile() {
  profileForm.patch(route('profile.update'));
}

function logout() {
  router.post(route('logout'), {}, {
    onSuccess: () => {
      router.visit(route('login'));
    },
  });
}

function submitDelete() {
  deleteForm.delete(route('profile.destroy'), {
    onSuccess: () => {
      router.visit(route('login'));
    },
  });
}
</script>
