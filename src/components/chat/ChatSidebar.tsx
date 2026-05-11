import React from 'react';
import { Search, Plus, X, MoreVertical, Heart, ShieldAlert, Trash2, Users, User, Circle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/DropdownMenu';
import { formatChatTimestamp } from '@/utils/dateUtils';

interface ChatSidebarProps {
  user: any;
  isConnected: boolean;
  isUserActive: boolean;
  activeTab: 'ALL' | 'UNREAD' | 'GROUP' | 'FAVORITE';
  setActiveTab: (tab: 'ALL' | 'UNREAD' | 'GROUP' | 'FAVORITE') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults: any;
  handleChatSelect: (chat: any) => void;
  isChatsLoading: boolean;
  chatListData: any;
  selectedChat: any;
  handleAction: (e: React.MouseEvent, chat: any, action: 'fav' | 'block' | 'delete') => void;
  setIsCreateGroupModalOpen: (open: boolean) => void;
  userId: string | undefined;
  typingUsers: Record<string, any>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  user,
  isConnected,
  isUserActive,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  handleChatSelect,
  isChatsLoading,
  chatListData,
  selectedChat,
  handleAction,
  setIsCreateGroupModalOpen,
  userId,
  typingUsers = {}
}) => {
  return (
    <div className="w-96 border-r border-white/5 flex flex-col bg-[#0D0D12]">
      <div className="p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chats</h1>
          <button 
            type="button"
            aria-label="Create Group"
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="p-1.5 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-all border border-purple-500/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative group mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-10 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 text-sm"
          />
          {searchQuery && (
            <button 
              type="button"
              aria-label="Clear Search"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-full mt-2 bg-[#1A1A24] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[500px] flex flex-col"
              >
                <div className="overflow-y-auto custom-scrollbar p-2">
                  {(() => {
                    const data = searchResults?.data || { messages: [], groups: [], users: [] };
                    const messages = data.messages || [];
                    const groups = data.groups || [];
                    const users = data.users || [];

                    const conversationsMap = new Map();
                    messages.forEach((msg: any) => {
                      const conv = msg.conversation;
                      if (conv && !conversationsMap.has(conv.id)) {
                        conversationsMap.set(conv.id, {
                          id: conv.id,
                          name: conv.name || msg.sender?.name,
                          type: conv.type,
                          profileImage: conv.profileImage || msg.sender?.photo,
                          lastMessage: msg.content,
                          timestamp: msg.createdAt,
                          ...conv
                        });
                      }
                    });

                    const combinedConversations = [...conversationsMap.values()];
                    groups.forEach((g: any) => {
                      if (!conversationsMap.has(g.id)) {
                        combinedConversations.push(g);
                      }
                    });

                    return (
                      <>
                        {users.length > 0 && (
                          <div className="p-4 border-b border-white/5">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Users</h4>
                            <div className="space-y-2">
                              {users.map((u: any) => (
                                <div 
                                  key={u.id}
                                  onClick={() => {
                                    handleChatSelect({ ...u, type: 'PRIVATE', members: [{ user: u }] });
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-[#8B5CF6] overflow-hidden border border-white/5 shrink-0">
                                    {u.photo && u.photo !== '-' && u.photo.startsWith('http') ? (
                                      <img src={u.photo} alt={u.name || "User profile"} className="w-full h-full object-cover" />
                                    ) : (u.name || u.firstName || u.email || '?').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{u.name || u.firstName || u.email?.split('@')[0]}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-4 border-b border-white/5">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">People & Groups</h4>
                          <div className="space-y-2">
                            {combinedConversations.length > 0 ? (
                              combinedConversations.map((item: any) => (
                                <div 
                                  key={item.id}
                                  onClick={() => {
                                    handleChatSelect({ conversationId: item.id, name: item.name, conversation: item });
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                                    {item.profileImage && item.profileImage !== '-' ? (
                                      <img src={item.profileImage} alt={item.name || "Conversation profile"} className="w-full h-full object-cover" />
                                    ) : (
                                      item.type === 'GROUP' ? (
                                        <Users className="w-5 h-5 text-gray-500" />
                                      ) : (
                                        <span className="text-sm font-bold text-[#8B5CF6] uppercase">
                                          {item.name?.charAt(0) || '?'}
                                        </span>
                                      )
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{item.lastMessage || (item.type === 'GROUP' ? 'Group' : 'Private Chat')}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-600 text-center py-2">No conversations found</p>
                            )}
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Messages</h4>
                          <div className="space-y-2">
                            {messages.length > 0 ? (
                              messages.map((item: any) => (
                                <div 
                                  key={item.id}
                                  onClick={() => {
                                    handleChatSelect({ 
                                      conversationId: item.conversation?.id, 
                                      name: item.conversation?.type === 'GROUP' ? item.conversation?.name : item.sender?.name,
                                      conversation: item.conversation
                                    });
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                                    {item.sender?.photo && item.sender.photo !== '-' ? (
                                      <img src={item.sender.photo} alt={item.sender.name || "Sender profile"} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-sm font-bold text-[#8B5CF6] uppercase">
                                        {item.sender?.name?.charAt(0) || '?'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <p className="text-sm font-semibold truncate">
                                        {item.sender?.name} 
                                        {item.conversation?.type === 'GROUP' && (
                                          <span className="text-[10px] font-normal text-gray-500 ml-1">in {item.conversation.name}</span>
                                        )}
                                      </p>
                                      <span className="text-[10px] text-gray-600 whitespace-nowrap ml-2">
                                        {formatChatTimestamp(item.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 truncate line-clamp-1 mt-0.5">{item.content}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-600 text-center py-2">No messages found</p>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mb-2">
          {(['ALL', 'UNREAD', 'GROUP', 'FAVORITE'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
        {isChatsLoading ? (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse flex gap-3 p-3">
                 <div className="w-12 h-12 rounded-2xl bg-white/5" />
                 <div className="flex-1 space-y-2 py-1">
                   <div className="h-4 bg-white/5 rounded w-3/4" />
                   <div className="h-3 bg-white/5 rounded w-1/2" />
                 </div>
              </div>
            ))}
          </div>
        ) : (chatListData?.data || []).length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-20">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-gray-700" />
             </div>
             <h3 className="text-xl font-bold mb-2">No conversations</h3>
             <p className="text-gray-500 text-sm">
               {activeTab === 'UNREAD' ? 'No unread chats found' : 
                activeTab === 'GROUP' ? 'No groups found' : 
                activeTab === 'FAVORITE' ? 'No favorite chats found' : 
                'No conversations found'}
             </p>
          </div>
        ) : (
          <div className="space-y-1">
            {(chatListData?.data || [])?.map((chat: any, idx: number) => {
              const isGroup = chat.conversation?.type === 'GROUP';
              const conversationId = chat.conversation?.id;
              
              let displayName = chat.conversation?.name;
              if (!isGroup && !displayName) {
                const otherMember = chat.conversation?.members?.find((m: any) => m.user?.id !== userId);
                displayName = otherMember?.user?.name || 'Private Chat';
              }

              return (
                <div
                  key={conversationId || chat.messageId || `chat-${idx}`}
                  onClick={() => handleChatSelect({ ...chat, conversationId, name: displayName })}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group cursor-pointer ${
                    selectedChat?.conversationId === conversationId 
                    ? 'bg-white/10 shadow-lg' 
                    : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0 shadow-inner">
                      {chat.conversation?.profileImage ? (
                          <img src={chat.conversation.profileImage} alt={displayName || "Chat profile"} className="w-full h-full object-cover" />
                      ) : (
                          isGroup ? (
                            <Users className="w-5 h-5 text-gray-500" />
                          ) : (
                            <span className="text-lg font-bold text-[#8B5CF6] uppercase">
                              {displayName?.charAt(0) || '?'}
                            </span>
                          )
                      )}
                    </div>
                    {!isGroup && chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0D0D12]" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-semibold text-gray-200 truncate group-hover:text-white transition-colors flex items-center gap-2 mb-1 text-sm">
                      {displayName}
                      {(chat.isFavorite || chat.favorite) && <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />}
                    </h3>
                    <p className={`text-xs truncate line-clamp-1 ${typingUsers[conversationId] ? 'text-purple-400 font-medium' : 'text-gray-500'}`}>
                      {(() => {
                        const typers = typingUsers[conversationId];
                        if (typers) {
                          const names = Object.values(typers);
                          if (names.length === 1) return 'Typing...';
                          return `${names.length} people typing...`;
                        }

                        if (!chat.content) return chat.conversation?.type === 'GROUP' ? 'Group created' : 'New conversation';
                        
                        const content = chat.content.trim();
                        const prefix = chat.sentBy === 'me' ? 'You: ' : '';
                        
                        if (/\.(jpg|jpeg|png|gif|webp|heic)(\?.*)?$/i.test(content)) return `${prefix}📷 Image`;
                        if (/\.(mp4|mov|avi|mkv|webm)(\?.*)?$/i.test(content)) return `${prefix}🎥 Video`;
                        if (/\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(content)) return `${prefix}🎵 Audio`;
                        if (/\.(pdf|doc|docx|xls|xlsx|txt|zip|rar)(\?.*)?$/i.test(content)) return `${prefix}📄 Document`;
                        
                        return prefix + chat.content;
                      })()}
                    </p>
                  </div>
                  {chat.content && (
                    <div className="flex flex-col items-end gap-2 min-w-[60px]">
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {formatChatTimestamp(chat.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {chat.unreadCount > 0 && (
                          <div className="w-5 h-5 rounded-full bg-purple-500 text-[10px] flex items-center justify-center font-bold">
                            {chat.unreadCount}
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button 
                              type="button"
                              aria-label="More Options"
                              className="p-1 hover:bg-white/10 rounded-lg transition-all text-gray-500 hover:text-white"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1A1A24] border-white/10 text-gray-300 min-w-[140px] rounded-xl shadow-2xl p-1">
                            <DropdownMenuItem onClick={(e) => handleAction(e, chat, 'fav')} className="gap-2 focus:bg-white/5 cursor-pointer rounded-lg">
                              <Heart className={`w-4 h-4 ${(chat.isFavorite || chat.favorite) ? 'fill-red-500 text-red-500' : ''}`} />
                              {(chat.isFavorite || chat.favorite) ? 'Unfavorite' : 'Favorite'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleAction(e, chat, 'block')} className="gap-2 focus:bg-white/5 cursor-pointer rounded-lg">
                              <ShieldAlert className="w-4 h-4" />
                              Block
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleAction(e, chat, 'delete')} className="gap-2 focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer rounded-lg">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0F0F15]">
        <div className="flex items-center gap-4 p-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
            {(user?.firstName || 'U').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{user?.firstName}</h4>
            <div className="flex items-center gap-1.5">
              <Circle className={`w-2 h-2 fill-current ${isConnected && isUserActive ? 'text-green-500' : 'text-gray-600'}`} />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                  {isConnected && isUserActive ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <button 
            type="button"
            aria-label="Profile Options"
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
              <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
