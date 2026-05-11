import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: any;
  onSave: (messageId: string, newContent: string) => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  onSave
}) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (message) {
      setContent(message.content || message.message || '');
    }
  }, [message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#1A1A24] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Edit Message</h3>
          <button 
            type="button"
            aria-label="Close modal"
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#63CBB3]/50 resize-none mb-8 custom-scrollbar"
          placeholder="Edit your message..."
        />

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-medium transition-all"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => {
              onSave(message.messageId || message.id, content);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-[#63CBB3] hover:bg-[#52ab96] text-[#0A0A0F] font-bold transition-all shadow-lg shadow-[#63CBB3]/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMessageModal;
