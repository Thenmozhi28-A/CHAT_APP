import React from 'react';
import { X, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RenameGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  renamingName: string;
  setRenamingName: (val: string) => void;
  handleRenameGroup: () => void;
}

const RenameGroupModal: React.FC<RenameGroupModalProps> = ({
  isOpen,
  onClose,
  renamingName,
  setRenamingName,
  handleRenameGroup
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1A1A24] border border-white/10 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Rename Group</h3>
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
                <label htmlFor="renameGroupName" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">New Group Name</label>
                <input 
                  type="text"
                  id="renameGroupName"
                  placeholder="Enter new group name..."
                  value={renamingName}
                  onChange={(e) => setRenamingName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={onClose} 
                  className="flex-1 px-6 py-4 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleRenameGroup} 
                  className="flex-1 px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RenameGroupModal;
