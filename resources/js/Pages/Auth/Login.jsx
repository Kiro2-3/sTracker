import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

// Modern minimalist login page component.
// Props are injected by the server-side controller (status & canResetPassword).
export default function Login({ status, canResetPassword }) {
    // useForm hook manages form state, submission, and error handling
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Handle form submission to the server
    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
            <Head title="Log in" />

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-sm">Sign in to your account to continue</p>
                </div>

                <div className="card shadow-lg">
                    <div className="card-body">
                        {status && (
                            <div className="alert alert-success mb-4">
                                <span>{status}</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 select-none text-sm cursor-pointer"
                                >
                                    Keep me logged in
                                </label>
                            </div>

                            <PrimaryButton
                                className="w-full"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </PrimaryButton>
                        </form>

                        <div className="divider">OR</div>

                        <div className="text-center text-sm">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                            <span className="mx-1">·</span>
                            <Link href={route('register')} className="underline">
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs">
                    By signing in, you agree to our terms of service
                </p>
            </div>
        </div>
    );
}
