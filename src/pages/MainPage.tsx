import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
  useGetLastChatsQuery,
  useRetrieveMessagesQuery,
  useLazySearchByNameQuery,
  useToggleFavoriteMutation,
  useUploadFileMutation,
  useRemoveChatMutation,
  chatApi
} from '@/store/api/chatApi';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'sonner';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router';

// Components
import MainSidebar from '@/components/chat/MainSidebar';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

// Modals
import CreateGroupModal from '@/components/chat/modals/CreateGroupModal';
import RenameGroupModal from '@/components/chat/modals/RenameGroupModal';
import ManageMembersModal from '@/components/chat/modals/ManageMembersModal';
import EditMessageModal from '@/components/chat/modals/EditMessageModal';
import PinnedMessagesModal from '@/components/chat/modals/PinnedMessagesModal';

const MainPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const [mainTab, setMainTab] = useState('CHAT');
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'GROUP' | 'FAVORITE'>('ALL');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groupMemberSearch, setGroupMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [renamingName, setRenamingName] = useState('');
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPinnedModalOpen, setIsPinnedModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingFileType, setPendingFileType] = useState<string>('');
  const [chatToDelete, setChatToDelete] = useState<any>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, any>>({});
  const typingTimeouts = useRef<Record<string, any>>({});

  // Search API for modal
  const [triggerModalSearch, { data: modalSearchData }] = useLazySearchByNameQuery();
  
  const activityTimeoutRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resetActivityTimer = () => {
    setIsUserActive(true);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 60000); 
  };

  const isImageUrl = (content: string) => {
    if (typeof content !== 'string') return false;
    return content.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) !== null || 
           content.includes('chat-files') && !content.match(/\.(pdf|mp4|webm|wav|mp3|ogg)/i);
  };

  const isVideoUrl = (content: string) => {
    if (typeof content !== 'string') return false;
    return content.match(/\.(mp4|webm|ogg)/i) !== null;
  };

  const isAudioUrl = (content: string) => {
    if (typeof content !== 'string') return false;
    return content.match(/\.(mp3|wav|ogg)/i) !== null;
  };

  const isPdfUrl = (content: string) => {
    if (typeof content !== 'string') return false;
    return content.match(/\.(pdf|doc|docx|txt)/i) !== null;
  };

  const { data: messagesData, isLoading: isMessagesLoading, refetch: refetchMessages } = useRetrieveMessagesQuery(
    { userId: userId || '', conversationId: selectedChat?.conversationId || '' },
    { skip: !userId || !selectedChat?.conversationId }
  );

  const { data: chatListData, isLoading: isChatsLoading, refetch: refetchChats } = useGetLastChatsQuery(
    { userId: userId || '', type: activeTab }, 
    { skip: !userId }
  );
  
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [uploadFile] = useUploadFileMutation();
  const [removeChat] = useRemoveChatMutation();
  const [triggerSearch, { data: searchResults }] = useLazySearchByNameQuery();

  // Sync selectedChat with chatListData for rename/member count updates
  useEffect(() => {
    if (selectedChat?.conversationId && chatListData?.data) {
      const updatedChat = chatListData.data.find((c: any) => (c.conversation?.id || c.id) === selectedChat.conversationId);
      if (updatedChat) {
        const conversation = updatedChat.conversation || updatedChat;
        const isGroup = conversation.type === 'GROUP';
        let displayName = conversation.name;
        
        if (!isGroup && !displayName) {
          const otherMember = conversation.members?.find((m: any) => m.user?.id !== userId);
          displayName = otherMember?.user?.name || 'Private Chat';
        }

        setSelectedChat((prev: any) => ({
          ...prev,
          name: displayName || prev.name,
          conversation: conversation,
          isFavorite: !!(updatedChat.isFavorite || updatedChat.favorite)
        }));
      }
    }
  }, [chatListData, userId, selectedChat?.conversationId]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUpdate = (data: any) => {
      const eventData = Array.isArray(data) ? data[0] : data;
      const socketEventType = eventData.socketEventType || eventData.type || eventData.eventType;
      const cid = eventData.conversationId || eventData.id || eventData.cid || selectedChat?.conversationId;
      
      console.log('[Socket Debug] Handling event:', socketEventType, 'for CID:', cid);

      if (cid && userId) {
        dispatch(
          chatApi.util.updateQueryData('retrieveMessages', { userId: userId || '', conversationId: cid }, (draft: any) => {
            if (!draft || !Array.isArray(draft.data)) return;

            const targetId = eventData.messageId || eventData.id || eventData._id;
            const msgIndex = draft.data.findIndex((m: any) => {
              const mid = m.messageId || m.id || m._id;
              return mid === targetId || mid === eventData.id || mid === eventData.messageId;
            });

            console.log(`[Socket Debug] Target: ${targetId}, Index: ${msgIndex}, Event: ${socketEventType}`);

            if (msgIndex !== -1) {
              const currentMsg = draft.data[msgIndex];
              
              if (socketEventType === 'EDIT' || eventData.newContent) {
                currentMsg.content = eventData.newContent || eventData.content;
                currentMsg.isEdited = true;
              } else if (socketEventType === 'PIN' || socketEventType === 'message_pinned') {
                currentMsg.isPinned = true;
              } else if (socketEventType === 'UNPIN' || socketEventType === 'message_unpinned') {
                currentMsg.isPinned = false;
              } else if (socketEventType === 'REACTION' || socketEventType === 'REACTION_TOGGLED' || socketEventType === 'reaction_toggled') {
                currentMsg.reactions = eventData.reactions || currentMsg.reactions || [];
                // Fallback: If reactions are empty or missing in payload, refetch to be sure
                if (!eventData.reactions) refetchMessages();
              } else if (eventData.isDeleted || socketEventType === 'DELETE' || socketEventType === 'message_deleted') {
                currentMsg.isDeleted = true;
                currentMsg.content = 'message deleted';
              } else if (socketEventType === 'READ' || socketEventType === 'message_read' || socketEventType === 'message_read_receipt') {
                currentMsg.status = 'READ';
                console.log(`[Socket Debug] Message ${targetId} marked as READ`);
              } else if (socketEventType === 'DELIVERED' || socketEventType === 'message_delivered') {
                if (currentMsg.status !== 'READ') {
                  currentMsg.status = 'DELIVERED';
                  console.log(`[Socket Debug] Message ${targetId} marked as DELIVERED`);
                }
              }
              
              if (socketEventType === 'REACTION' || socketEventType === 'EDIT' || socketEventType === 'PIN' || socketEventType === 'message_pinned') {
                 const { createdAt, ...rest } = eventData;
                 draft.data[msgIndex] = { ...currentMsg, ...rest };
              }
              console.log(`[Socket Debug] Cache patched for ${targetId}`);
            } else {
              console.warn(`[Socket Debug] Message ${targetId} not found in draft (size: ${draft.data.length})`);
              const isGroupEvent = ['MEMBER_ADDED', 'MEMBER_REMOVED', 'RENAME', 'SYSTEM'].includes(socketEventType);
              const isNewMessage = socketEventType === 'RECEIVE' || isGroupEvent || !socketEventType;
              
              if (isNewMessage) {
                // Generate content for group events if missing
                if (isGroupEvent && !eventData.content) {
                  if (socketEventType === 'MEMBER_ADDED') eventData.content = `➕ Users added/reactivated: [${eventData.user?.name || 'New Member'}]`;
                  else if (socketEventType === 'MEMBER_REMOVED') eventData.content = `🚫 Users removed: [${eventData.user?.name || 'Member'}]`;
                  else if (socketEventType === 'RENAME') eventData.content = `🖊️ Group name changed to "${eventData.newName || eventData.name}"`;
                  else if (socketEventType === 'SYSTEM') eventData.content = eventData.message || "Group updated";
                }
                
                // If we still have no content for a system message, don't add it
                if (!eventData.content && isGroupEvent) return;
                
                const targetId = eventData.messageId || eventData.id || eventData._id || `system-${Date.now()}`;
                const exists = draft.data.some((m: any) => (m.messageId || m.id || m._id) === targetId);
                if (!exists) {
                  draft.data.push({
                    ...eventData,
                    senderId: eventData.senderId || (isGroupEvent ? 'system' : undefined),
                    messageType: isGroupEvent ? 'SYSTEM' : (eventData.messageType || undefined),
                    createdAt: eventData.createdAt || Date.now()
                  });
                  console.log('[Socket Debug] New message (type: ' + (socketEventType || 'RECEIVE') + ') added to cache');
                }
                // Force a refetch to ensure media types and IDs are synced with server
                setTimeout(() => refetchMessages(), 100);
              }
            }
          })
        );

        // Also update chat list for last message
        dispatch(
          chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab }, (draft: any) => {
            if (!draft || !Array.isArray(draft.data)) return;
            const chatIndex = draft.data.findIndex((c: any) => (c.conversationId || c.conversation?.id || c.id) === cid);
            if (chatIndex !== -1) {
              const chat = draft.data[chatIndex];
              if (eventData.content) chat.content = eventData.content;
              chat.createdAt = eventData.createdAt || Date.now();
              if (socketEventType === 'RECEIVE') {
                 if (cid === selectedChat?.conversationId) {
                   chat.unreadCount = 0;
                   // Also emit read receipt back
                   socket.emit('mark_as_read', { conversationId: cid });
                 } else {
                   chat.unreadCount = (chat.unreadCount || 0) + 1;
                 }
              } else if (socketEventType === 'READ' || socketEventType === 'message_read' || socketEventType === 'read_receipt') {
                chat.unreadCount = 0;
              }
            }
          })
        );
      }

      // Instant UI update for group members
      if (cid === selectedChat?.conversationId) {
        if (eventData.socketEventType === 'MEMBER_ADDED') {
          setSelectedChat((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              conversation: {
                ...prev.conversation,
                members: [...(prev.conversation?.members || []), { user: eventData.user || eventData.member }]
              }
            };
          });
          refetchMessages();
          refetchChats();
        } else if (eventData.socketEventType === 'MEMBER_REMOVED' || socketEventType === 'MEMBER_REMOVED') {
          const targetId = eventData.userId || 
                           eventData.targetUserId || 
                           eventData.memberId || 
                           eventData.id || 
                           eventData.user?.id ||
                           eventData.user?._id ||
                           eventData.data?.userId || 
                           eventData.data?.memberId;
                           
          console.log('[Socket Debug] Member removal event for:', targetId, 'Full Data:', eventData);
          
          if (!targetId) {
             console.warn('[Socket Debug] MEMBER_REMOVED event missing targetId, refetching everything...');
             refetchMessages();
             refetchChats();
          }
          setSelectedChat((prev: any) => {
            if (!prev?.conversation?.members) return prev;
            const updatedMembers = prev.conversation.members.filter((m: any) => {
              const mid = m.user?.id || m.id || m.userId || m._id;
              // Check if mid matches any of the common ID fields in eventData
              const matches = mid === targetId || 
                              mid === eventData.id || 
                              mid === eventData.userId || 
                              mid === (eventData.data?.userId || eventData.data?.memberId);
              return !matches;
            });
            console.log('[Socket Debug] Members after removal:', updatedMembers.length);
            return {
              ...prev,
              conversation: {
                ...prev.conversation,
                members: updatedMembers
              }
            };
          });
          refetchMessages();
          // Also update the chat list last message for removal
          dispatch(
            chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab }, (draft: any) => {
              if (!draft || !Array.isArray(draft.data)) return;
              const chatIndex = draft.data.findIndex((c: any) => (c.conversationId || c.conversation?.id || c.id) === cid);
              if (chatIndex !== -1) {
                draft.data[chatIndex].content = eventData.content || `🚫 Users removed`;
                draft.data[chatIndex].createdAt = Date.now();
              }
            })
          );
          // Also refetch chats to update sidebar counts
          refetchChats();
        } else if (eventData.socketEventType === 'RENAME') {
          setSelectedChat((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              name: eventData.newName || eventData.name,
              conversation: {
                ...prev.conversation,
                name: eventData.newName || eventData.name
              }
            };
          });
          refetchMessages();
          refetchChats();
        } else if (socketEventType === 'PRESENCE' || eventData.online !== undefined || eventData.status !== undefined) {
          const isOnline = eventData.online === true || eventData.status === 'online' || eventData.isOnline === true;
          const targetUserId = eventData.userId || eventData.id || eventData.user?.id || eventData.userId;
          
          console.log('[Socket Debug] Presence update for:', targetUserId, 'Online:', isOnline);
          
          // Update selected chat header status if it matches the user
          const isTargetInSelected = selectedChat && (
            String(targetUserId) === String(selectedChat.id) || 
            String(targetUserId) === String(selectedChat.userId) || 
            selectedChat.conversation?.members?.some((m: any) => String(m.user?.id || m.userId || m.id) === String(targetUserId))
          );

          if (isTargetInSelected) {
            setSelectedChat((prev: any) => ({ ...prev, online: isOnline, isOnline: isOnline }));
          }
          
          // Patch getLastChats cache to update sidebar dots
          dispatch(
            chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab }, (draft: any) => {
              if (!draft || !Array.isArray(draft.data)) return;
              draft.data.forEach((c: any) => {
                const isMatch = 
                  String(c.id) === String(targetUserId) || 
                  String(c.userId) === String(targetUserId) ||
                  c.conversation?.members?.some((m: any) => 
                    String(m.user?.id || m.userId || m.id) === String(targetUserId) && String(m.user?.id || m.userId || m.id) !== String(userId)
                  );

                if (isMatch) {
                  c.online = isOnline;
                  c.isOnline = isOnline;
                }
              });
            })
          );
        } else if (socketEventType === 'TYPING' || eventData.socketEventType === 'TYPING' || eventData.typing !== undefined) {
          const { conversationId, userId: typingId, userName, typing } = eventData;
          const cidKey = conversationId || cid;
          
          if (!cidKey || typingId === userId) return;

          setTypingUsers(prev => {
            const next = { ...prev };
            const convTyping = { ...(next[cidKey] || {}) };
            
            if (typing) {
              convTyping[typingId] = userName || 'Someone';
              // Set auto-clear timeout (5 seconds)
              if (typingTimeouts.current[typingId]) clearTimeout(typingTimeouts.current[typingId]);
              typingTimeouts.current[typingId] = setTimeout(() => {
                setTypingUsers(p => {
                  const n = { ...p };
                  const c = { ...(n[cidKey] || {}) };
                  delete c[typingId];
                  if (Object.keys(c).length === 0) delete n[cidKey];
                  else n[cidKey] = c;
                  return n;
                });
              }, 5000);
            } else {
              delete convTyping[typingId];
              if (typingTimeouts.current[typingId]) clearTimeout(typingTimeouts.current[typingId]);
            }

            if (Object.keys(convTyping).length === 0) delete next[cidKey];
            else next[cidKey] = convTyping;
            return next;
          });
        }
      }

      // If we are in a new chat (no cid yet) and we get a message for it
      if (!selectedChat?.conversationId && eventData.socketEventType === 'RECEIVE') {
          const isForMe = (eventData.recipientId === userId || eventData.senderId !== userId);
          if (isForMe) {
             setSelectedChat((prev: any) => prev ? { ...prev, conversationId: cid } : prev);
          }
      }

      // Refresh chat list for last message/unread count
      // We can also manually patch the chat list cache if needed for better "Instant" feel
      dispatch(
        chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab }, (draft: any) => {
          if (!draft || !Array.isArray(draft.data)) return;
          const chatIndex = draft.data.findIndex((c: any) => (c.conversationId || c.conversation?.id || c.id) === cid);
          
          if (socketEventType === 'chat_deleted' || socketEventType === 'chat_blocked' || eventData.socketEventType === 'DELETE_CHAT') {
            if (chatIndex !== -1) {
              draft.data.splice(chatIndex, 1);
            }
            return;
          }

          if (chatIndex !== -1) {
            const chat = draft.data[chatIndex];
            // Move to top and update last message info
            const updatedChat = {
              ...chat,
              content: eventData.content || eventData.message || chat.content,
              createdAt: eventData.createdAt || Date.now(),
              sentBy: eventData.senderId === userId ? 'me' : 'them',
              unreadCount: (cid !== selectedChat?.conversationId && eventData.socketEventType === 'RECEIVE') 
                ? (chat.unreadCount || 0) + 1 
                : chat.unreadCount
            };
            draft.data.splice(chatIndex, 1);
            draft.data.unshift(updatedChat);
          }
        })
      );

      refetchChats();
    };

    const createHandler = (type: string) => (data: any) => {
      const eventData = Array.isArray(data) ? data[0] : data;
      handleUpdate({ ...eventData, socketEventType: type });
    };

    // --- Clean up old listeners to prevent duplicates ---
    const events = [
      'receive_message', 'new_message', 'GROUP_EVENT', 'SYSTEM_MESSAGE', 
      'group_created', 'message_read', 'chat_blocked', 'chat_deleted', 
      'member_added', 'member_removed', 'group_renamed', 'user_joined', 
      'user_left', 'message_edited', 'edit_message', 'message_pinned', 'message_unpinned',
      'REACTION_TOGGLED', 'reaction_toggled', 'USER_ONLINE', 'USER_OFFLINE', 'user_presence', 'user_status',
      'file_uploaded', 'file_upload_error'
    ];
    events.forEach(ev => socket.off(ev));

    // --- Register Listeners ---
    socket.on('receive_message', createHandler('RECEIVE'));
    socket.on('new_message', createHandler('RECEIVE'));
    socket.on('GROUP_EVENT', handleUpdate);
    socket.on('SYSTEM_MESSAGE', (data) => {
      const eventData = Array.isArray(data) ? data[0] : data;
      handleUpdate({ ...eventData, socketEventType: 'SYSTEM' });
    });
    socket.on('group_created', (data) => {
      const eventData = Array.isArray(data) ? data[0] : data;
      handleUpdate({ ...eventData, socketEventType: 'SYSTEM' });
      refetchChats();
    });
    socket.on('message_read', createHandler('READ'));
    socket.on('message_delivered', createHandler('DELIVERED'));
    socket.on('read_receipt', createHandler('READ'));
    socket.on('user_presence', createHandler('PRESENCE'));
    socket.on('USER_ONLINE', createHandler('PRESENCE'));
    socket.on('USER_OFFLINE', createHandler('PRESENCE'));
    socket.on('user_status', createHandler('PRESENCE'));
    socket.on('user_status_change', createHandler('PRESENCE'));
    
    socket.on('chat_blocked', handleUpdate);
    socket.on('chat_deleted', handleUpdate);
    socket.on('member_added', createHandler('MEMBER_ADDED'));
    socket.on('member_removed', createHandler('MEMBER_REMOVED'));
    socket.on('group_renamed', createHandler('RENAME'));
    socket.on('group_updated', handleUpdate);
    socket.on('user_joined', handleUpdate);
    socket.on('user_left', handleUpdate);
    
    // Explicitly listen to the events mentioned in bug report
    socket.on('message_edited', createHandler('EDIT'));
    socket.on('edit_message', createHandler('EDIT'));
    socket.on('message_deleted', createHandler('DELETE'));
    socket.on('message_pinned', createHandler('PIN'));
    socket.on('message_unpinned', createHandler('UNPIN'));
    socket.on('REACTION_TOGGLED', createHandler('REACTION'));
    socket.on('reaction_toggled', createHandler('REACTION'));
    
    socket.on('user_typing_status', createHandler('TYPING'));
    socket.on('typing_status', createHandler('TYPING'));
    
    socket.on('file_uploaded', (data: any) => {
      const eventData = Array.isArray(data) ? data[0] : data;
      console.log('[Socket Debug] File Uploaded:', eventData);
      handleUpdate({ ...eventData, socketEventType: 'RECEIVE' });
    });
    
    socket.on('USER_ONLINE', createHandler('PRESENCE'));
    socket.on('USER_OFFLINE', createHandler('PRESENCE'));
    socket.on('user_presence', createHandler('PRESENCE'));
    socket.on('file_uploaded', createHandler('RECEIVE'));
    socket.on('file_upload_error', (data: any) => {
      console.error('Socket file upload error:', data);
      toast.error(typeof data === 'string' ? data : data.message || "File upload failed");
    });

    return () => {
      events.forEach(ev => socket.off(ev));
    };
  }, [socket, isConnected, userId, selectedChat?.conversationId]); 

  useEffect(() => {
    if (!socket || !isConnected || !selectedChat?.conversationId) return;
    const cid = selectedChat.conversationId;
    socket.emit('join_room', cid);
    return () => {
      socket.emit('leave_room', cid);
    };
  }, [socket, isConnected, selectedChat?.conversationId]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetActivityTimer));
    resetActivityTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetActivityTimer));
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, []);

  const handleChatSelect = (chat: any) => {
    // Determine the real CID and Name
    let cid = chat.conversationId || chat.conversation?.id || (chat.members ? null : chat.id);
    let name = chat.name || chat.conversation?.name || chat.sender?.name;
    const type = chat.type || chat.conversation?.type || 'PRIVATE';

    // If it's a raw user object from search (not a full conversation object)
    if (!cid && type === 'PRIVATE') {
       const existing = chatListData?.data?.find((c: any) => 
         c.conversation?.members?.some((m: any) => m.user?.id === (chat.id || chat.userId))
       );
       if (existing) {
         cid = existing.conversation?.id;
         name = existing.conversation?.name || chat.name || existing.name;
         chat = existing;
       }
    }

    setSelectedChat({ 
      ...chat, 
      conversationId: cid, 
      name: name || chat.firstName || chat.email?.split('@')[0] || 'New Chat',
      type: type 
    });
    setLocalMessages([]); 
    
    if (userId && cid && socket && isConnected) {
      socket.emit('mark_as_read', { conversationId: cid });
      
      // Patch local unread count to 0 immediately
      dispatch(
        chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab }, (draft: any) => {
          if (!draft || !Array.isArray(draft.data)) return;
          const chatIndex = draft.data.findIndex((c: any) => (c.conversationId || c.conversation?.id || c.id) === cid);
          if (chatIndex !== -1) {
            draft.data[chatIndex].unreadCount = 0;
          }
        })
      );
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 0) {
      triggerSearch({ name: val });
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedMembers.length === 0 || !socket || !isConnected) return;
    socket.emit('create_group', { 
      name: newGroupName, 
      memberIds: selectedMembers.map(m => m.id) 
    });
    toast.success("Group creation requested");
    setIsCreateGroupModalOpen(false);
    setNewGroupName('');
    setSelectedMembers([]);
  };

  const handleRenameGroup = () => {
    if (!renamingName.trim() || !selectedChat?.conversationId || !socket || !isConnected) return;
    socket.emit('change_group_name', { 
      conversationId: selectedChat.conversationId, 
      newName: renamingName 
    });
    toast.success("Rename requested");
    setIsRenameModalOpen(false);
  };

  const handleAddMemberToGroup = (user: any) => {
    if (!selectedChat?.conversationId || !socket || !isConnected) return;
    socket.emit('add_members', { 
      conversationId: selectedChat.conversationId, 
      memberIds: [user.id] 
    });
    toast.success(`Request to add ${user.name} sent`);
  };

  const handleRemoveMemberFromGroup = (targetUserId: string) => {
    if (!selectedChat?.conversationId || !socket || !isConnected) return;
    socket.emit('remove_members', { 
      conversationId: selectedChat.conversationId, 
      memberIds: [targetUserId] 
    });
    toast.success("Removal requested");
  };

  const handleLeaveGroup = () => {
    setShowLeaveConfirm(true);
  };

  const confirmLeaveGroup = async () => {
    if (!selectedChat?.conversationId || !socket || !isConnected) return;
    const cid = selectedChat.conversationId;
    
    // Optimistic Update
    dispatch(
      chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab }, (draft: any) => {
        if (!draft || !Array.isArray(draft.data)) return;
        const index = draft.data.findIndex((c: any) => (c.conversationId || c.conversation?.id || c.id) === cid);
        if (index !== -1) draft.data.splice(index, 1);
      })
    );

    try {
      socket.emit('leave_group', { conversationId: cid });
      await removeChat(cid).unwrap();
      toast.success("Group left and removed");
    } catch (err) {
      console.error("Error leaving/removing group:", err);
    }
    
    setSelectedChat(null);
    setShowLeaveConfirm(false);
    refetchChats();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleTyping = (cid: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', { conversationId: cid, typing: isTyping });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageText.trim() && !pendingFile) || !selectedChat || !userId) return;
    
    // Stop typing immediately when sending
    if (selectedChat.conversationId) handleTyping(selectedChat.conversationId, false);

    // For new conversations, we might not have a cid yet
    const cid = selectedChat.conversationId;

    const tempId = `local-${Date.now()}`;
    const currentMsg = messageText;
    const currentFile = pendingFile;
    const currentFileType = pendingFileType;

    setMessageText('');
    setPendingFile(null);
    setPendingFileType('');

    try {
      let content = currentMsg;
      let type = 'TEXT';
      let fileName = undefined;

      if (currentFile) {
        const toastId = toast.loading(`Uploading ${currentFile.name}...`);
        const formData = new FormData();
        formData.append('files', currentFile);
        
        // Add metadata as a blob under the 'data' key as per API requirement
        const metadata = {
          senderId: userId,
          conversationId: cid,
          messageType: currentFileType
        };
        formData.append('data', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        
        const uploadResponse = await uploadFile(formData).unwrap();
        const fileUrl = uploadResponse.data?.url || 
                        uploadResponse.url || 
                        uploadResponse.content || 
                        uploadResponse.data?.content || 
                        (typeof uploadResponse.data === 'string' ? uploadResponse.data : null) ||
                        (uploadResponse.data?.[0]?.content); // Check for array response

        if (!fileUrl) {
          console.error("Upload response missing URL:", uploadResponse);
          throw new Error('Upload failed - No URL returned');
        }
        
        content = fileUrl;
        type = currentFileType;
        fileName = currentFile.name;
        toast.success(`${currentFile.name} uploaded`, { id: toastId });
      }

      // ONLY emit send_message if it's a text message. 
      // For files, the server automatically broadcasts the message via the upload API.
      if (socket && isConnected && !currentFile) {
        socket.emit('send_message', {
          senderId: userId,
          senderName: user?.firstName || 'User',
          conversationId: cid,
          recipientId: !cid && selectedChat.type === 'PRIVATE' ? (selectedChat.id || selectedChat.userId) : undefined,
          content: content,
          messageType: type,
          fileName: fileName,
          createdAt: Date.now()
        });

        // Add optimistic local message for text
        const newMessage = {
          messageId: tempId,
          content: content,
          sentBy: 'me',
          messageType: type,
          fileName: fileName,
          createdAt: Date.now(),
          senderId: userId
        };
        setLocalMessages(prev => [...prev, newMessage]);
        
        setTimeout(() => {
          setLocalMessages(prev => prev.filter(m => m.messageId !== tempId));
        }, 1000);
      }
    } catch (err: any) {
      console.error("Message send error:", err);
      toast.error(err.message || "Failed to send message");
    }
  };

  const handleEditMessage = (msg: any) => {
    setEditingMessage(msg);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (messageId: string, newContent: string) => {
    if (!socket || !isConnected || !selectedChat?.conversationId) return;
    
    // Optimistic Update
    dispatch(
      chatApi.util.updateQueryData('retrieveMessages', { userId: userId || '', conversationId: selectedChat.conversationId }, (draft: any) => {
        if (!draft || !Array.isArray(draft.data)) return;
        const msg = draft.data.find((m: any) => (m.messageId || m.id) === messageId);
        if (msg) {
          msg.content = newContent;
          msg.isEdited = true;
          msg.edited = true;
        }
      })
    );

    socket.emit('edit_message', {
      messageId,
      id: messageId,
      newContent: newContent,
      conversationId: selectedChat.conversationId
    });
    toast.success("Edit requested");
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!socket || !isConnected || !selectedChat?.conversationId) return;
    socket.emit('delete_message', { 
      messageId,
      conversationId: selectedChat.conversationId 
    });
    toast.success("Delete requested");
  };

  const handlePinMessage = (msg: any) => {
    if (!socket || !isConnected || !selectedChat?.conversationId) return;
    const msgId = msg.messageId || msg.id;

    // Optimistic Update
    dispatch(
      chatApi.util.updateQueryData('retrieveMessages', { userId: userId || '', conversationId: selectedChat.conversationId }, (draft: any) => {
        if (!draft || !Array.isArray(draft.data)) return;
        const target = draft.data.find((m: any) => (m.messageId || m.id) === msgId);
        if (target) {
          target.isPinned = true;
          target.pinned = true;
        }
      })
    );

    socket.emit('pin_message', { 
      messageId: msgId,
      id: msgId,
      conversationId: selectedChat.conversationId
    });
    toast.success("Pin requested");
  };

  const handleUnpinMessage = (messageId: string) => {
    if (!socket || !isConnected || !selectedChat?.conversationId) return;

    // Optimistic Update
    dispatch(
      chatApi.util.updateQueryData('retrieveMessages', { userId: userId || '', conversationId: selectedChat.conversationId }, (draft: any) => {
        if (!draft || !Array.isArray(draft.data)) return;
        const target = draft.data.find((m: any) => (m.messageId || m.id) === messageId);
        if (target) {
          target.isPinned = false;
          target.pinned = false;
        }
      })
    );

    socket.emit('unpin_message', { 
      messageId: messageId,
      id: messageId,
      conversationId: selectedChat.conversationId
    });
    toast.success("Unpin requested");
  };

  const handleGroupReact = (messageId: string, emoji: string) => {
    if (!socket || !isConnected || !selectedChat?.conversationId) return;
    const cleanEmoji = emoji.replace(/^ADD:\s*/i, '').trim(); // strip ADD: prefix
    socket.emit('group_react_message', {
      messageId,
      id: messageId,
      emoji: cleanEmoji,
      reaction: cleanEmoji, // Providing both emoji and reaction as per payload confirmation
      conversationId: selectedChat.conversationId,
      reactionType: 'ADD'
    });
  };

  const onScrollToMessage = (msgId: string) => {
    setHighlightedMessageId(msgId);
    const element = document.getElementById(`message-${msgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setHighlightedMessageId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      toast.error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max limit is 20MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const type = file.type.startsWith('image/') ? 'IMAGE' : 
                 file.type.startsWith('video/') ? 'VIDEO' :
                 file.type.startsWith('audio/') ? 'AUDIO' : 'DOCUMENT';

    setPendingFile(file);
    setPendingFileType(type);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAction = async (e: React.MouseEvent, chat: any, action: 'fav' | 'block' | 'delete') => {
    e.stopPropagation();
    const conversationId = chat.conversationId || chat.conversation?.id || chat.id;
    const isFavorite = !!(chat.isFavorite || chat.favorite);
    
    if (!userId || !conversationId) return;

    try {
      if (action === 'fav') {
        await toggleFavorite({ userId, conversationId, isFavorite: !isFavorite }).unwrap();
        toast.success(`Chat ${isFavorite ? "removed from" : "added to"} favorites`);
      } else if (action === 'block' && socket && isConnected) {
        socket.emit('block_chat', { conversationId });
        toast.success("Block requested");
      } else if (action === 'delete') {
        setChatToDelete(chat);
      }
    } catch (err) {}
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete || !socket || !isConnected) return;
    const conversationId = chatToDelete.conversationId || chatToDelete.conversation?.id || chatToDelete.id;
    
    // Optimistic Update
    dispatch(
      chatApi.util.updateQueryData('getLastChats', { userId: userId || '', type: activeTab } as any, (draft: any) => {
        if (!draft || !Array.isArray(draft.data)) return;
        const index = draft.data.findIndex((c: any) => (c.conversationId || c.conversation?.id || c.id) === conversationId);
        if (index !== -1) draft.data.splice(index, 1);
      })
    );

    try {
      socket.emit('delete_chat', { conversationId });
      await removeChat(conversationId).unwrap();
      toast.success("Conversation removed");
    } catch (err) {
      console.error("Error removing chat:", err);
    }
    
    if (selectedChat?.conversationId === conversationId) setSelectedChat(null);
    setChatToDelete(null);
    refetchChats();
  };

  return (
    <div className="flex h-screen bg-[#0A0A0F] text-gray-100 overflow-hidden font-sans relative">
      <MainSidebar 
        activeTab={mainTab} 
        onTabChange={(tab) => {
          setMainTab(tab);
          if (tab !== 'CHAT') {
            // handle process views if any
          }
        }} 
        onLogout={() => setShowLogoutConfirm(true)} 
      />

      {mainTab === 'CHAT' ? (
        <>
          <ChatSidebar 
            user={user}
            isConnected={isConnected}
            isUserActive={isUserActive}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            searchResults={searchResults}
            handleChatSelect={handleChatSelect}
            isChatsLoading={isChatsLoading}
            chatListData={chatListData}
            selectedChat={selectedChat}
            handleAction={handleAction}
            setIsCreateGroupModalOpen={setIsCreateGroupModalOpen}
            userId={userId}
            typingUsers={typingUsers}
          />

          <ChatWindow 
            selectedChat={selectedChat}
            userId={userId}
            messagesData={messagesData}
            localMessages={localMessages}
            isMessagesLoading={isMessagesLoading}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef as any}
            messagesEndRef={messagesEndRef as any}
            toggleFavorite={toggleFavorite}
            setIsRenameModalOpen={setIsRenameModalOpen}
            setIsManageMembersModalOpen={setIsManageMembersModalOpen}
            setIsAddingMembers={setIsAddingMembers}
            handleLeaveGroup={handleLeaveGroup}
            setRenamingName={setRenamingName}
            isImageUrl={isImageUrl}
            isVideoUrl={isVideoUrl}
            isAudioUrl={isAudioUrl}
            isPdfUrl={isPdfUrl}
            handleEditMessage={handleEditMessage}
            handleDeleteMessage={handleDeleteMessage}
            handlePinMessage={handlePinMessage}
            handleUnpinMessage={handleUnpinMessage}
            handleGroupReact={handleGroupReact}
            pinnedMessages={(messagesData?.data || []).filter((m: any) => m.isPinned || m.pinned || m.favorite)}
            onScrollToMessage={onScrollToMessage}
            highlightedMessageId={highlightedMessageId}
            setIsPinnedModalOpen={setIsPinnedModalOpen}
            pendingFile={pendingFile}
            setPendingFile={setPendingFile}
            handleTyping={handleTyping}
            typingUsers={typingUsers}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#0D0D12]">
            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Process in progress...</h2>
            <p className="text-gray-500 max-w-sm">This section is currently being processed. Please check back later.</p>
        </div>
      )}

      {/* Modals */}
      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        groupMemberSearch={groupMemberSearch}
        setGroupMemberSearch={setGroupMemberSearch}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        triggerModalSearch={triggerModalSearch}
        modalSearchData={modalSearchData}
        handleCreateGroup={handleCreateGroup}
      />

      <RenameGroupModal 
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        renamingName={renamingName}
        setRenamingName={setRenamingName}
        handleRenameGroup={handleRenameGroup}
      />

      <ManageMembersModal 
        isOpen={isManageMembersModalOpen}
        onClose={() => setIsManageMembersModalOpen(false)}
        selectedChat={selectedChat}
        userId={userId}
        isAddingMembers={isAddingMembers}
        setIsAddingMembers={setIsAddingMembers}
        triggerModalSearch={triggerModalSearch}
        modalSearchData={modalSearchData}
        handleAddMemberToGroup={handleAddMemberToGroup}
        handleRemoveMemberFromGroup={handleRemoveMemberFromGroup}
      />

      <EditMessageModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMessage(null);
        }}
        message={editingMessage}
        onSave={handleSaveEdit}
      />

      <PinnedMessagesModal 
        isOpen={isPinnedModalOpen}
        onClose={() => setIsPinnedModalOpen(false)}
        pinnedMessages={(messagesData?.data || []).filter((m: any) => m.isPinned || m.pinned || m.favorite)}
        onScrollToMessage={onScrollToMessage}
        onUnpin={handleUnpinMessage}
      />

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div onClick={() => setShowLogoutConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#1A1A24] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-2">Sign Out?</h3>
            <p className="text-gray-400 text-center mb-8 font-medium">Are you sure you want to log out?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-bold transition-all">Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Delete Confirmation */}
      {chatToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div onClick={() => setChatToDelete(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#1A1A24] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-2 text-red-500">Delete Chat?</h3>
            <p className="text-gray-400 text-center mb-8 font-medium">This cannot be undone. All messages will be lost.</p>
            <div className="flex gap-4">
              <button onClick={() => setChatToDelete(null)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all">Cancel</button>
              <button onClick={confirmDeleteChat} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-bold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Group Confirmation */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div onClick={() => setShowLeaveConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#1A1A24] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-2 text-red-500">Leave Group?</h3>
            <p className="text-gray-400 text-center mb-8 font-medium">Are you sure you want to leave this group? You will no longer receive messages.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLeaveConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all">Cancel</button>
              <button onClick={confirmLeaveGroup} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-bold transition-all">Leave</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}} />
    </div>
  );
};

export default MainPage;
