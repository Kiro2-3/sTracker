import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`btn btn-ghost ${active ? 'btn-active' : ''} ` + className}
        >
            {children}
        </Link>
    );
}
