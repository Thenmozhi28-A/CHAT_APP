import React, { useRef, useState, useEffect } from 'react';
import { 
  Users, 
  MoreVertical, 
  Edit, 
  LogOut, 
  FileText, 
  Download, 
  Paperclip, 
  Smile, 
  Send, 
  CheckCheck, 
  Check,
  Plus,
  MessageSquare,
  Ban,
  ChevronDown,
  Pin,
  SmilePlus,
  Trash2,
  PinOff,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { formatMessageTimestamp, formatDateSeparator } from '@/utils/dateUtils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/DropdownMenu';
import dayjs from 'dayjs';

// --- Sub-components ---

const DateSeparator = ({ date }: { date: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 my-10 px-8"
  >
    <div className="h-[1px] flex-1 bg-white/10" />
    <span className="text-[12px] text-gray-400 font-medium tracking-wide px-4 py-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
      {formatDateSeparator(date)}
    </span>
    <div className="h-[1px] flex-1 bg-white/10" />
  </motion.div>
);

const MessageBubble = ({ 
  msg, 
  isOwn, 
  isSystem, 
  userId,
  isConsecutive,
  renderContent,
  renderSystem,
  handleEdit,
  handleDelete,
  handlePin,
  handleUnpin,
  handleReact,
  setReactionId,
  reactionId,
  highlightedId
}: any) => {
  useEffect(() => {
    const hasReactions = msg.reactions || msg.messageReactions || msg.Reactions;
    const isP = msg.isPinned || msg.pinned || msg.is_pinned;
    const isE = msg.isEdited || msg.edited || msg.is_edited;
    
    if (hasReactions || isP || isE) {
      console.log(`[Persistence Debug] Msg ${msg.messageId || msg.id}:`, {
        reactions: hasReactions,
        pinned: isP,
        edited: isE,
        raw: msg
      });
    }
  }, [msg]);

  return (
    <motion.div 
      id={`message-${msg.messageId || msg.id}`}
      initial={{ opacity: 0, x: isOwn ? 20 : -20 }} 
      animate={{ 
        opacity: 1, 
        x: 0,
        backgroundColor: highlightedId === (msg.messageId || msg.id) ? 'rgba(139, 92, 246, 0.2)' : 'transparent'
      }} 
      className={`flex ${isSystem ? 'justify-center' : isOwn ? 'justify-end' : 'justify-start'} px-2 ${isConsecutive ? 'py-1.5' : 'py-5'} transition-colors duration-1000`}
    >
      <div className={`${isSystem ? 'max-w-[90%]' : 'max-w-[70%]'} group relative`}>
        {isSystem ? (
          renderSystem(msg)
        ) : (
          <>
            <div className={`relative mb-2 ${
              msg.isDeleted || msg.deleted 
                ? 'bg-white/5 border border-white/5 text-gray-500 opacity-60 pointer-events-none select-none grayscale'
                : (isOwn 
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-[1.5rem] rounded-tr-none shadow-xl' 
                    : 'bg-[#1A1A24]/80 text-gray-200 rounded-[1.5rem] rounded-tl-none border border-white/5 backdrop-blur-md shadow-lg'
                  )
            } ${
              (msg.messageType === 'IMAGE') 
              ? 'p-1 overflow-hidden' 
              : 'p-4'
            }`}>
              {msg.isDeleted || msg.deleted ? (
                 <div className="flex items-center gap-2 text-[13px] py-1 font-medium italic">
                   <Ban className="w-3.5 h-3.5 opacity-50" />
                   This message was deleted
                 </div>
              ) : (
                 <>
                   {renderContent(msg, isOwn)}
                   {(() => {
                      const isP = msg.isPinned || msg.pinned || msg.is_pinned || msg.pinnedAt || msg.pinned_at || msg.is_favorite || msg.favorite || msg.message?.isPinned || msg.message?.pinned;
                      if (isP && isP !== 'false' && isP !== 0) {
                        return (
                          <div className={`absolute -top-1.5 ${isOwn ? '-left-1.5' : '-right-1.5'} w-5 h-5 bg-[#1A1A24] border border-white/10 rounded-full flex items-center justify-center shadow-lg z-20`}>
                            <Pin className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                          </div>
                        );
                      }
                      return null;
                    })()}
                 </>
              )}
            </div>

            {/* Reactions - Overlapping at bottom corner */}
            {(msg.reactions || msg.messageReactions) && (msg.reactions || msg.messageReactions).length > 0 && (
              <div className={`absolute -bottom-2.5 ${isOwn ? '-left-1' : '-right-1'} flex gap-0.5 z-20`}>
                {Object.entries(
                  (() => {
                    const rawReactions = msg.reactions || msg.messageReactions || msg.Reactions || msg.message_reactions || msg.message?.reactions || [];
                    
                    // If it's already an object (e.g. { "😃": 1 }), just return it
                    if (rawReactions && typeof rawReactions === 'object' && !Array.isArray(rawReactions)) {
                      return rawReactions;
                    }

                    // Otherwise, reduce the array
                    const items = Array.isArray(rawReactions) ? rawReactions : 
                                  (rawReactions && typeof rawReactions === 'object' ? Object.values(rawReactions) : []);
                    
                    return items.reduce((acc: any, r: any) => {
                      let emoji = typeof r === 'string' ? r : (r.reaction || r.emoji || r.Reaction || r.Emoji || '');
                      if (emoji) {
                        emoji = emoji.replace(/^ADD:\s*/i, '').trim();
                        if (emoji) acc[emoji] = (acc[emoji] || 0) + 1;
                      }
                      return acc;
                    }, {});
                  })()
                ).map(([emoji, count]: [string, any], i) => (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={i} 
                    className="px-1.5 py-0.5 bg-[#1A1A24] border border-white/10 rounded-full text-xs shadow-xl flex items-center gap-1 cursor-default"
                  >
                    <span className="text-[13px]">{emoji}</span>
                    {count > 1 && <span className="text-[10px] font-bold text-gray-400">{count}</span>}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Metadata moved inside bubble */}

            {/* Context Menu - Disabled for deleted messages */}
            {!(msg.isDeleted || msg.deleted) && (
              <div className={`absolute top-0 ${isOwn ? '-left-8' : '-right-8'} z-30 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      type="button"
                      aria-label="Message options"
                      className="p-1.5 bg-[#1A1A24] border border-white/10 rounded-lg text-gray-500 hover:text-white shadow-xl"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isOwn ? 'end' : 'start'} className="bg-[#1A1A24] border-white/10 text-gray-300 min-w-[140px] p-1 shadow-2xl rounded-xl">
                    <DropdownMenuItem onClick={() => setReactionId(msg.messageId || msg.id)} className="gap-3 py-2 px-4 focus:bg-white/5 cursor-pointer rounded-lg">
                      <SmilePlus className="w-4 h-4 text-yellow-400" /> <span className="text-sm">Add Reaction</span>
                    </DropdownMenuItem>
                    {isOwn && (
                      <DropdownMenuItem onClick={() => handleEdit(msg)} className="gap-3 py-2 px-4 focus:bg-white/5 cursor-pointer rounded-lg">
                        <Edit className="w-4 h-4 text-blue-400" /> <span className="text-sm">Edit Message</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => (msg.isPinned) ? handleUnpin(msg.id || msg.messageId) : handlePin(msg)} className="gap-3 py-2 px-4 focus:bg-white/5 cursor-pointer rounded-lg">
                      {msg.isPinned ? <PinOff className="w-4 h-4 text-yellow-500" /> : <Pin className="w-4 h-4 text-purple-400" />}
                      <span className="text-sm">{msg.isPinned ? 'Unpin' : 'Pin Message'}</span>
                    </DropdownMenuItem>
                    <div className="h-px bg-white/5 my-1" />
                    <DropdownMenuItem onClick={() => handleDelete(msg.id || msg.messageId)} className="gap-3 py-2 px-4 focus:bg-red-500/10 text-red-500 cursor-pointer rounded-lg">
                      <Trash2 className="w-4 h-4" /> <span className="text-sm">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

// --- Main component ---

interface ChatWindowProps {
  selectedChat: any;
  userId: string | undefined;
  messagesData: any;
  localMessages: any[];
  isMessagesLoading: boolean;
  messageText: string;
  setMessageText: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  toggleFavorite: (data: any) => void;
  setIsRenameModalOpen: (open: boolean) => void;
  setIsManageMembersModalOpen: (open: boolean) => void;
  setIsAddingMembers: (open: boolean) => void;
  handleLeaveGroup: () => void;
  setRenamingName: (name: string) => void;
  isImageUrl: (content: string) => boolean;
  isVideoUrl: (content: string) => boolean;
  isAudioUrl: (content: string) => boolean;
  isPdfUrl: (content: string) => boolean;
  handleEditMessage: (msg: any) => void;
  handleDeleteMessage: (msgId: string) => void;
  handlePinMessage: (msg: any) => void;
  handleUnpinMessage: (msgId: string) => void;
  handleGroupReact: (messageId: string, emoji: string) => void;
  pinnedMessages: any[];
  onScrollToMessage: (msgId: string) => void;
  highlightedMessageId: string | null;
  setIsPinnedModalOpen: (open: boolean) => void;
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  handleTyping: (cid: string, isTyping: boolean) => void;
  typingUsers: Record<string, any>;
}

const TypingAnimation = () => (
  <div className="flex gap-1.5 items-center px-4 py-2.5 bg-white/5 rounded-2xl border border-white/5 w-fit ml-2 mb-6 shadow-xl backdrop-blur-sm">
    <div className="flex gap-1">
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
    </div>
    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">Typing</span>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const { 
    selectedChat, userId, messagesData, localMessages, isMessagesLoading,
    messageText, setMessageText, handleSendMessage, handleFileUpload,
    fileInputRef, messagesEndRef, setIsRenameModalOpen, setIsManageMembersModalOpen,
    setIsAddingMembers, handleLeaveGroup, setRenamingName, isImageUrl,
    isVideoUrl, isAudioUrl, isPdfUrl,
    handleEditMessage, handleDeleteMessage, handlePinMessage, handleUnpinMessage,
    handleGroupReact, pinnedMessages, onScrollToMessage, highlightedMessageId,
    setIsPinnedModalOpen, pendingFile, setPendingFile, handleTyping, typingUsers = {}
  } = props;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionMessageId, setReactionMessageId] = useState<string | null>(null);
  const typingTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedChat?.conversationId || !messageText.trim()) return;
    
    // Start typing
    handleTyping(selectedChat.conversationId, true);

    // Stop typing after 2 seconds of inactivity
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      handleTyping(selectedChat.conversationId, false);
    }, 2000);

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [messageText, selectedChat?.conversationId]);

  const allMessages = [...(messagesData?.data || []), ...localMessages]
    .sort((a, b) => {
      const timeA = typeof a.createdAt === 'string' && !isNaN(Number(a.createdAt)) ? Number(a.createdAt) : new Date(a.createdAt).getTime();
      const timeB = typeof b.createdAt === 'string' && !isNaN(Number(b.createdAt)) ? Number(b.createdAt) : new Date(b.createdAt).getTime();
      return timeA - timeB;
    });

  useEffect(() => {
    if (allMessages.length > 0) {
      console.log('[Persistence Debug] Latest message:', allMessages[allMessages.length - 1]);
    }
  }, [allMessages]);

  useEffect(() => {
    if (messagesEndRef.current && allMessages.length > 0) {
      const scrollOptions: ScrollIntoViewOptions = { 
        behavior: isMessagesLoading ? 'auto' : 'smooth',
        block: 'end'
      };
      messagesEndRef.current.scrollIntoView(scrollOptions);
    }
  }, [allMessages.length, isMessagesLoading]);

  if (!selectedChat || (!selectedChat.conversationId && !selectedChat.id && !selectedChat.userId)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#0A0A0F]">
         <div className="w-16 h-16 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
          <MessageSquare className="w-8 h-8 text-purple-500" />
        </div>
         <h2 className="text-2xl font-bold mb-2 text-white">Select a conversation</h2>
         <p className="text-gray-500 max-w-sm text-sm">Choose a chat from the sidebar to start messaging</p>
      </div>
    );
  }

  const renderMessageContent = (msg: any, isOwn: boolean) => {
    const content = msg.content || msg.message;
    const time = formatMessageTimestamp(msg.createdAt);

    const Metadata = () => (
      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded text-[10px] text-white flex items-center gap-1.5 z-10">
         {(msg.isEdited || msg.edited || msg.is_edited) && (
            <span className="italic">(edited)</span>
         )}
         {time}
         {isOwn && (
            msg.status === 'READ' ? <CheckCheck className="w-3 h-3 text-purple-400" /> : <CheckCheck className="w-3 h-3 text-gray-300" />
         )}
      </div>
    );

    const trimmedContent = (content || '').trim();

    // Get URL pathname (before query params) for reliable extension matching
    const urlPath = (() => {
      try { 
        const u = new URL(trimmedContent);
        return decodeURIComponent(u.pathname); // decode %20, spaces in filenames
      } 
      catch { return trimmedContent; }
    })();

    // Also check the raw content for encoded extensions like .jpg%3F or copy.jpg
    const decodedContent = (() => {
      try { return decodeURIComponent(trimmedContent); }
      catch { return trimmedContent; }
    })();

    const isImg = msg.messageType === 'IMAGE' || 
      /\.(jpg|jpeg|png|gif|webp|heic|bmp|svg|tiff|avif)/i.test(urlPath) ||
      /\.(jpg|jpeg|png|gif|webp|heic|bmp|svg|tiff|avif)/i.test(decodedContent);

    const isVid = msg.messageType === 'VIDEO' || 
      /\.(mp4|mov|avi|mkv|webm|m4v|flv)/i.test(urlPath) ||
      /\.(mp4|mov|avi|mkv|webm|m4v|flv)/i.test(decodedContent);

    const isAud = msg.messageType === 'AUDIO' || 
      /\.(mp3|wav|ogg|m4a|aac|flac|wma)/i.test(urlPath) ||
      /\.(mp3|wav|ogg|m4a|aac|flac|wma)/i.test(decodedContent);

    const isDoc = msg.messageType === 'DOCUMENT' || msg.messageType === 'FILE' || 
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z)/i.test(urlPath) ||
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z)/i.test(decodedContent);

    if (isImg) {
      return (
        <div className="relative group/img overflow-hidden rounded-xl bg-white/5 p-1 border border-white/10">
          <img src={content} alt="" className="max-w-[320px] max-h-[400px] w-full h-auto object-cover rounded-lg hover:scale-[1.02] transition-transform duration-500 cursor-pointer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <a href={content} download target="_blank" rel="noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all">
              <Download className="w-6 h-6 text-white" />
            </a>
          </div>
          <Metadata />
        </div>
      );
    }

    if (isVid) {
      return (
        <div className="relative max-w-[320px] rounded-xl overflow-hidden bg-black/20 border border-white/10 p-1 shadow-2xl">
          <video src={content} controls className="w-full h-auto rounded-lg" />
          <Metadata />
        </div>
      );
    }

    if (isAud) {
      return (
        <div className="relative min-w-[280px] p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-6 mt-1 px-1">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/20 shadow-inner">
              <Smile className="w-5 h-5 text-purple-400" />
            </div>
            <audio src={content} controls className="h-8 flex-1 custom-audio-player" />
          </div>
          <Metadata />
        </div>
      );
    }

    if (isDoc) {
      const fileName = content.split('/').pop()?.split('?')[0] || 'Document';
      return (
        <div className="relative min-w-[280px] p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group/doc">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/20 shadow-inner">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate pr-6">{fileName}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Click to download</p>
            </div>
            <a 
              href={content} 
              download 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 transition-all shadow-lg border border-white/5"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
          <Metadata />
        </div>
      );
    }

    return (
      <div className="relative pb-1">
        <p className="text-[14px] leading-relaxed break-words pr-2">
          {content}
          {(msg.isEdited || msg.edited || msg.is_edited || msg.isEditedMessage) && (
             <span className="text-[10px] italic font-medium opacity-40 ml-2 inline-block transform translate-y-[1px]">(edited)</span>
          )}
          <span className="inline-block w-[80px]" /> {/* Spacer for timestamp */}
        </p>
        <div className="absolute bottom-0 right-0 flex items-center gap-1.5 opacity-60">
            <span className="text-[10px] font-medium leading-none mb-0.5">{time}</span>
            {isOwn && (
              <div className="flex items-center">
                {msg.status === 'READ' || msg.isRead || msg.is_read || msg.readCount > 0 ? (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                ) : (msg.status === 'DELIVERED' || msg.deliveredCount > 0 || msg.is_delivered || msg.isDelivered || msg.is_delivered) ? (
                  <CheckCheck className="w-3.5 h-3.5 text-white/50" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-white/50" />
                )}
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderSystemMessage = (msg: any) => {
    const content = msg.content || msg.message;
    if (!content) return null;

    return (
      <div className="flex flex-col items-center gap-2 my-4">
        <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[11px] text-gray-300 backdrop-blur-md font-medium shadow-sm flex items-center gap-2">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0A0A0F] relative overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg border border-white/10">
            {selectedChat.conversation?.profileImage ? (
              <img src={selectedChat.conversation.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-white uppercase">{selectedChat.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{selectedChat.name || 'Chat'}</h3>
            <div className="flex items-center gap-2">
              {selectedChat.conversation?.type === 'GROUP' ? (
                <div 
                  onClick={() => setIsManageMembersModalOpen(true)}
                  className="flex items-center gap-1.5 cursor-pointer group/members transition-all"
                >
                   <Users className="w-3 h-3 text-gray-500 group-hover/members:text-purple-400" />
                   <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider group-hover/members:text-purple-400 transition-colors">
                     {selectedChat.conversation?.members?.length || 0} members
                   </span>
                </div>
              ) : (
                <>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedChat.isOnline ? 'bg-green-500' : 'bg-gray-600'}`} />
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{selectedChat.isOnline ? 'Online' : 'Offline'}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedChat.conversation?.type === 'GROUP' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button"
                  aria-label="Group menu"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1A1A24]/95 backdrop-blur-xl border-white/10 rounded-2xl p-2 shadow-2xl">
                <DropdownMenuItem 
                  onClick={() => {
                    setRenamingName(selectedChat.name);
                    setIsRenameModalOpen(true);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white transition-all group"
                >
                  <Edit className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                  <span className="font-medium">Rename Group</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setIsManageMembersModalOpen(true)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white transition-all group"
                >
                  <Users className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                  <span className="font-medium">Manage Members</span>
                </DropdownMenuItem>
                
                <div className="h-px bg-white/5 my-1" />
                
                <DropdownMenuItem 
                  onClick={handleLeaveGroup}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 cursor-pointer text-red-400/80 hover:text-red-400 transition-all group"
                >
                  <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  <span className="font-medium">Leave Group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Pinned Messages Banner */}
      {pinnedMessages && pinnedMessages.length > 0 && (
        <div className="bg-[#1A1A24]/60 backdrop-blur-md border-b border-white/5 px-8 py-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Pin className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pinned Message</p>
              <p 
                className="text-xs text-gray-200 truncate cursor-pointer hover:text-purple-400 transition-colors" 
                onClick={() => onScrollToMessage(pinnedMessages[pinnedMessages.length - 1].messageId || pinnedMessages[pinnedMessages.length - 1].id)}
              >
                {pinnedMessages[pinnedMessages.length - 1].content || pinnedMessages[pinnedMessages.length - 1].message}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsPinnedModalOpen(true)}
            className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20"
          >
            See all {pinnedMessages.length > 1 && `(${pinnedMessages.length})`}
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 flex flex-col space-y-1">
        {isMessagesLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          allMessages.map((msg: any, idx: number) => {
            const isSystem = 
              msg.sender?.id === 'system' || 
              msg.senderId === 'system' ||
              msg.messageType === 'SYSTEM' ||
              ['MEMBER_ADDED', 'MEMBER_REMOVED', 'RENAME', 'SYSTEM'].includes(
                msg.socketEventType || msg.eventType || msg.type
              );
            const isOwn = !isSystem && (msg.sentBy === 'me' || msg.senderId === userId || msg.me === true);
            
            const prevMsg = idx > 0 ? allMessages[idx-1] : null;
            const isConsecutive = prevMsg && (prevMsg.senderId === msg.senderId || prevMsg.sentBy === msg.sentBy) && !isSystem;

            // Handle date parsing for separator
            const parseDate = (d: any) => {
              if (typeof d === 'string' && !isNaN(Number(d)) && d.length > 8) return dayjs(Number(d));
              return dayjs(d);
            };

            const currentDate = parseDate(msg.createdAt);
            const prevDate = prevMsg ? parseDate(prevMsg.createdAt) : null;
            
            // Logic: Only show separator if it's the first message or if the day has changed
            const showSeparator = !prevDate || !currentDate.isSame(prevDate, 'day');

            return (
              <React.Fragment key={msg.messageId || idx}>
                {showSeparator && <DateSeparator date={msg.createdAt} />}
                <MessageBubble 
                  msg={msg}
                  isOwn={isOwn}
                  isSystem={isSystem}
                  userId={userId}
                  isConsecutive={isConsecutive}
                  renderContent={renderMessageContent}
                  renderSystem={renderSystemMessage}
                  handleEdit={handleEditMessage}
                  handleDelete={handleDeleteMessage}
                  handlePin={handlePinMessage}
                  handleUnpin={handleUnpinMessage}
                  handleReact={handleGroupReact}
                  setReactionId={setReactionMessageId}
                  reactionId={reactionMessageId}
                  highlightedId={highlightedMessageId}
                />
              </React.Fragment>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {selectedChat?.conversationId && typingUsers[selectedChat.conversationId] && (
          <TypingAnimation />
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Bar */}
      <div className="p-6 bg-gradient-to-t from-[#0A0A0F] to-transparent sticky bottom-0 z-50">
        {/* Pending File Preview */}
        <AnimatePresence>
          {pendingFile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 relative shadow-2xl"
            >
              <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center">
                {pendingFile.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(pendingFile)} alt="" className="w-full h-full object-cover" />
                ) : <FileText className="w-6 h-6 text-purple-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">{pendingFile.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{(pendingFile.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
              </div>
              <button 
                type="button"
                aria-label="Remove pending file"
                onClick={() => setPendingFile(null)} 
                className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-400"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form 
          onSubmit={handleSendMessage}
          className="w-full flex items-center gap-3 p-2 px-4 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl transition-all shadow-2xl focus-within:border-purple-500/50"
        >
          <input 
            type="file" 
            id="chat-file-input"
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            title="Upload file"
          />
          <button 
            type="button" 
            aria-label="Attach file"
            onClick={() => fileInputRef.current?.click()} 
            className="p-2.5 text-gray-500 hover:text-purple-400 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea 
            rows={1}
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-2 text-sm text-white placeholder:text-gray-600 max-h-32 custom-scrollbar"
          />

          <div className="flex items-center gap-1">
            <div className="relative">
              <button 
                type="button" 
                aria-label="Select emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                className={`p-2.5 transition-colors ${showEmojiPicker ? 'text-purple-400' : 'text-gray-500 hover:text-yellow-400'}`}
              >
                <Smile className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-6 z-[100]">
                    <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="relative z-[110] shadow-2xl rounded-2xl overflow-hidden border border-white/10"
                    >
                      <EmojiPicker 
                        theme={Theme.DARK}
                        lazyLoadEmojis={true}
                        onEmojiClick={(emojiData: EmojiClickData) => setMessageText(messageText + emojiData.emoji)}
                        autoFocusSearch={false}
                      />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
            <button 
              type="submit" 
              aria-label="Send message"
              disabled={!messageText.trim() && !pendingFile}
              className={`p-3 rounded-full transition-all ${
                (messageText.trim() || pendingFile) ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40 hover:scale-105 active:scale-95' : 'bg-white/5 text-gray-600'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Reaction Overlay */}
      {reactionMessageId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setReactionMessageId(null)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-[210]">
            <EmojiPicker theme={Theme.DARK} onEmojiClick={(e) => { handleGroupReact(reactionMessageId, e.emoji); setReactionMessageId(null); }} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
