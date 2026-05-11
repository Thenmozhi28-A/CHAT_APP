import React from 'react';
import { X, Search, UserPlus, UserMinus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: any;
  userId: string | undefined;
  isAddingMembers: boolean;
  setIsAddingMembers: (val: boolean) => void;
  triggerModalSearch: (data: any) => void;
  modalSearchData: any;
  handleAddMemberToGroup: (user: any) => void;
  handleRemoveMemberFromGroup: (id: string) => void;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  selectedChat,
  userId,
  isAddingMembers,
  setIsAddingMembers,
  triggerModalSearch,
  modalSearchData,
  handleAddMemberToGroup,
  handleRemoveMemberFromGroup
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="bg-[#1A1A24] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Manage Group Members</h3>
              <button 
                type="button"
                aria-label="Close modal"
                onClick={onClose} 
                className="p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-medium text-gray-400">Current Members ({selectedChat.conversation?.members?.length || 0})</label>
                  <button 
                    type="button"
                    onClick={() => setIsAddingMembers(!isAddingMembers)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2D4F46] text-[#63CBB3] rounded-xl text-sm font-semibold hover:bg-[#345B51] transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Members
                  </button>
                </div>

                {isAddingMembers && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mb-6 space-y-4"
                  >
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Search users to add..."
                        onChange={(e) => {
                          if (e.target.value.length > 0) triggerModalSearch({ name: e.target.value });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>

                    {modalSearchData?.data?.users?.length > 0 && (
                      <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2 p-2 bg-white/5 rounded-xl border border-white/10">
                        {modalSearchData.data.users
                          .filter((u: any) => !selectedChat.conversation?.members?.some((m: any) => m.user.id === u.id))
                          .map((u: any) => (
                          <div 
                            key={u.id} 
                            onClick={() => handleAddMemberToGroup(u)} 
                            className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-[#8B5CF6] overflow-hidden border border-white/5 shrink-0">
                                {u.photo && u.photo !== '-' && u.photo.startsWith('http') ? (
                                  <img src={u.photo} alt={u.name || "User profile"} className="w-full h-full object-cover" />
                                ) : (u.name || u.firstName || u.email || '?').charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">{u.name || u.firstName || u.email?.split('@')[0]}</p>
                                <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-[#63CBB3]" />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                  {selectedChat.conversation?.members?.map((member: any) => (
                    <div key={member.user?.id || member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group/member">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-bold text-[#8B5CF6] text-xl overflow-hidden shrink-0 shadow-inner">
                          {member.user?.photo && member.user.photo !== '-' ? (
                            <img src={member.user.photo} alt={member.user.name || "Member profile"} className="w-full h-full object-cover" />
                          ) : (member.user?.name || member.user?.firstName || member.user?.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-100 text-base truncate">{member.user?.name || member.user?.firstName || member.user?.email?.split('@')[0]}</p>
                          <p className="text-xs text-gray-500 truncate">{member.user?.email}</p>
                        </div>
                      </div>
                      
                      {member.role === 'ADMIN' ? (
                        <div className="px-4 py-1.5 bg-[#1B2B28] text-[#63CBB3] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#63CBB3]/20 shadow-sm">
                          Admin
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => handleRemoveMemberFromGroup(member.user?.id || member.id || member.userId)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#3E2723]/80 text-[#EF5350] rounded-xl text-xs font-bold hover:bg-[#4E342E] transition-all border border-red-500/10"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManageMembersModal;
