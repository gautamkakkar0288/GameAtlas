// Button variants — use instead of raw <button> everywhere
// Usage: <Button variant="primary" size="lg" loading={true}>Save</Button>

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  children,
  className = "",
  ...props
}) => {
  const variantClass = {
    primary:   "btn-primary",
    secondary: "btn-secondary",
    ghost:     "btn-ghost",
    danger:    "btn-danger",
  }[variant] || "btn-primary";

  const sizeClass = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
    icon: "btn-icon",
  }[size] || "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${fullWidth ? "btn-full" : ""} ${className}`}
      disabled={disabled || loading}
      style={{ opacity: (disabled || loading) ? 0.6 : 1 }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: 16, height: 16,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
