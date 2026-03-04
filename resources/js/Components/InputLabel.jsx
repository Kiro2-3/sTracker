export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`label text-sm font-medium ` + className}
        >
            <span className="label-text">{value ? value : children}</span>
        </label>
    );
}
