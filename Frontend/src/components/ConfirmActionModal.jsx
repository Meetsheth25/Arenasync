import React from "react";
import { createPortal } from "react-dom";
import "./ConfirmActionModal.css";

export default function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="confirm-action-overlay" onClick={isLoading ? null : onCancel}>
      <div className="confirm-action-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-action-title">{title}</h3>
        <p className="confirm-action-message">{message}</p>
        <div className="confirm-action-actions">
          <button
            type="button"
            className="confirm-action-btn confirm-action-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="confirm-action-btn confirm-action-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Clearing..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
