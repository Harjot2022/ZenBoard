import { useState } from 'react';
import { X, AlignLeft, CreditCard, Calendar, Trash2 } from 'lucide-react'; 
import api from '../api/axios';

const CardModal = ({ card, boardId, onClose, onUpdate }) => {
  const [description, setDescription] = useState(card.description || "");
  
  // Format the date for the HTML input field (YYYY-MM-DD)
  const initialDate = card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : "";
  const [dueDate, setDueDate] = useState(initialDate);
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Send BOTH description and due_date to the backend
      const res = await api.put(`/cards/${card.id}`, { 
        description, 
        due_date: dueDate || null, // Send null if cleared
        boardId: boardId // Include boardId for Socket.io notification
      });
      
      onUpdate(res.data); 
      onClose(); 
    } catch (err) {
      console.error("Failed to update card", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    // Add a quick confirmation so they don't click it by accident!
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    
    try {
      // Send the boardId as a query parameter for WebSockets
      await api.delete(`/cards/${card.id}?boardId=${boardId}`);
      onUpdate({ ...card, isDeleted: true }); // Tell Board.jsx to remove it from the screen
      onClose();
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-start p-6 pb-2 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 text-gray-700" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">{card.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-300 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
          {/* Main Content (Description) */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <AlignLeft className="mt-1 text-gray-700" size={20} />
              <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px] text-gray-700 bg-white"
                  placeholder="Add a more detailed description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="mt-3 flex gap-2">
                  <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:bg-blue-400">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Due Date Picker) */}
          <div className="w-full md:w-48 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar size={14} /> Due Date
              </h3>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Actions</h3>
              <button 
                onClick={handleDelete}
                className="w-full flex items-center gap-2 justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded border border-red-200 transition"
              >
                <Trash2 size={16} /> Delete Card
              </button>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CardModal;