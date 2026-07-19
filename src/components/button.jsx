export const Button = ({
    className = "",
    size = "default",
    children,
    href,
    download,
    target,
    rel,
    type = "button",
    onClick,
}) => {
    const baseClasses =
        "relative inline-flex items-center justify-center font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-white tactile-button-3d select-none cursor-pointer";

    const sizeClasses = {
        sm: "px-4 py-1.5 text-sm rounded-lg",
        default: "px-6 py-2.5 text-base rounded-xl",
        lg: "px-8 py-3.5 text-lg rounded-2xl",
    };

    const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;
    const Component = href ? "a" : "button";

    return (
        <Component
            className={classes}
            href={href}
            download={download}
            target={target}
            rel={rel || (target === "_blank" ? "noreferrer" : undefined)}
            type={href ? undefined : type}
            onClick={onClick}
        >
            <span className="relative flex items-center justify-center gap-2">{children}</span>
        </Component>
    );
};