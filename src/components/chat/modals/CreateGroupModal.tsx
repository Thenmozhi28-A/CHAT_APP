import React from 'react';
import { X, Search, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  newGroupName: string;
  setNewGroupName: (val: string) => void;
  groupMemberSearch: string;
  setGroupMemberSearch: (val: string) => void;
  selectedMembers: any[];
  setSelectedMembers: (val: any[]) => void;
  triggerModalSearch: (data: any) => void;
  modalSearchData: any;
  handleCreateGroup: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  newGroupName,
  setNewGroupName,
  groupMemberSearch,
  setGroupMemberSearch,
  selectedMembers,
  setSelectedMembers,
  triggerModalSearch,
  modalSearchData,
  handleCreateGroup
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#1A1A24] border border-white/10 p-8 rounded-[2rem] max-w-lg w-full relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Create New Group</h3>
              </div>
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Group Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Project Alpha Team"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Add Members</label>
                <div className="relative group mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Search users..."
                    value={groupMemberSearch}
                    onChange={(e) => {
                      setGroupMemberSearch(e.target.value);
                      if (e.target.value.length > 0) triggerModalSearch({ name: e.target.value });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>

                {groupMemberSearch.length > 0 && modalSearchData?.data?.users?.length > 0 && (
                  <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2 mb-4 p-2 bg-white/5 rounded-xl border border-white/10">
                    {modalSearchData.data.users.map((u: any) => (
                      <div 
                        key={u.id}
                        onClick={() => {
                          if (!selectedMembers.find(m => m.id === u.id)) {
                            setSelectedMembers([...selectedMembers, u]);
                          }
                          setGroupMemberSearch('');
                        }}
                        className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-[#8B5CF6] overflow-hidden shrink-0">
                            {u.photo && u.photo !== '-' && u.photo.startsWith('http') ? (
                              <img src={u.photo} alt={u.name || "User profile"} className="w-full h-full object-cover" />
                            ) : (u.name || u.firstName || u.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{u.name || u.firstName || u.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                )}

                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMembers.map((u: any) => (
                      <div key={u.id} className="flex items-center gap-2 bg-[#8B5CF6]/10 text-[#8B5CF6] px-3 py-1.5 rounded-full border border-[#8B5CF6]/20 text-[10px] font-bold tracking-wider">
                        {u.name || u.firstName || u.email?.split('@')[0]}
                        <button 
                          type="button"
                          aria-label={`Remove ${u.name || u.email}`}
                          onClick={() => setSelectedMembers(selectedMembers.filter(m => m.id !== u.id))} 
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    setSelectedMembers([]);
                  }}
                  className="flex-1 px-6 py-4 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleCreateGroup}
                  className={`flex-1 px-6 py-4 rounded-xl text-sm font-semibold transition-all ${
                    newGroupName && selectedMembers.length > 0 
                    ? 'bg-[#2D4F46] text-[#63CBB3] hover:bg-[#345B51]' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!newGroupName || selectedMembers.length === 0}
                >
                  Create Group
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;
