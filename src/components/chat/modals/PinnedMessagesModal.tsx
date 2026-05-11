import React from 'react';
import { X, Pin, MessageSquare, Trash2 } from 'lucide-react';
import { formatMessageTimestamp } from '@/utils/dateUtils';

interface PinnedMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedMessages: any[];
  onScrollToMessage: (msgId: string) => void;
  onUnpin: (msgId: string) => void;
}

const PinnedMessagesModal: React.FC<PinnedMessagesModalProps> = ({
  isOpen,
  onClose,
  pinnedMessages,
  onScrollToMessage,
  onUnpin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#1A1A24] border border-white/10 rounded-3xl p-8 shadow-2xl h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Pin className="w-5 h-5 text-purple-400" />
            </div>
            <div>
                <h3 className="text-xl font-bold">Pinned Messages</h3>
                <p className="text-xs text-gray-500">{pinnedMessages.length} messages pinned</p>
            </div>
          </div>
          <button 
            type="button"
            aria-label="Close modal"
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
          {pinnedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <MessageSquare className="w-12 h-12 mb-4" />
              <p>No pinned messages yet</p>
            </div>
          ) : (
            pinnedMessages.map((msg) => (
              <div 
                key={msg.messageId || msg.id}
                className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer relative"
                onClick={() => {
                  onScrollToMessage(msg.messageId || msg.id);
                  onClose();
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    {msg.sender?.name || 'User'}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {formatMessageTimestamp(new Date(msg.createdAt))}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                  {msg.content || msg.message}
                </p>
                
                <button 
                  type="button"
                  aria-label="Unpin message"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnpin(msg.messageId || msg.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PinnedMessagesModal;
