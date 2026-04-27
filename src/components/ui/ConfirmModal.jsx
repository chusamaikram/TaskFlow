import { Trash2 } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title = "Delete Task", message = "Are you sure you want to delete this task? This action cannot be undone." }) {
  const handleConfirm = () => { onConfirm(); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-rose-500/10 border border-rose-500/20">
            <Trash2 size={18} className="text-rose-400" />
          </div>
          <p className="text-sm leading-relaxed pt-1 text-slate-400">{message}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" className="flex-1" onClick={handleConfirm}>
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
