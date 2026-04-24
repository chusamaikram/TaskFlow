import { Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title = "Delete Task", message = "Are you sure you want to delete this task? This action cannot be undone." }) {
  const { isDark } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        {/* Icon + message */}
        <div className="flex gap-4 items-start">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <Trash2 size={18} style={{ color: "#f87171" }} />
          </div>
          <p className="text-sm leading-relaxed pt-1" style={{ color: isDark ? "#94a3b8" : "#475569" }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" className="flex-1" onClick={handleConfirm}>
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
