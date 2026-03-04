import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 pt-6">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-700 dark:text-gray-400" />
                </Link>
            </div>

            <div className="mt-6 w-full max-w-md card bg-base-100 shadow-xl">
                <div className="card-body">{children}</div>
            </div>
        </div>
    );
}
