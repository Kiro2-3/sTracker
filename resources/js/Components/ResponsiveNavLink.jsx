import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`btn btn-ghost w-full justify-start ${active ? 'btn-active' : ''} ` + className}
        >
            {children}
        </Link>
    );
}
