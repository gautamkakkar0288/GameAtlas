import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",          // "sm" | "md" | "lg" | "full"
  showClose = true,
  footer,
}) => {
  // Close on Escape key
  const handleKey = useCallback(
    (e) => { if (e.key === "Escape") onClose?.(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  const maxWidth = { sm: 400, md: 520, lg: 720, full: "95vw" }[size] || 520;

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="modal-box" style={{ maxWidth }}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {showClose && (
            <button className="modal-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
