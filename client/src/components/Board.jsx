import { useEffect, useState, useContext } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import api from '../api/axios';
import { Plus, X, LogOut , UserPlus , Trash2} from 'lucide-react';
import Card from './Card';
import CardModal from './CardModal';
import { move, reorder } from '../utils/dragHelpers';
import AuthContext from '../context/AuthContext';
import { io } from 'socket.io-client'; 
import { useParams, useNavigate } from 'react-router-dom';

const Board = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const { logout } = useContext(AuthContext);

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingCardToList, setAddingCardToList] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  // --- INVITE STATE ---
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteStatus, setInviteStatus] = useState({ type: "", message: "" });

  // --- REUSABLE FETCH FUNCTION ---
  // We extract this so we can call it initially AND whenever Socket.io tells us to
  const fetchBoardData = async (activeBoardId) => {
    try {
      const listsRes = await api.get(`/boards/${activeBoardId}/lists`);
      setLists(listsRes.data);
      const cardsRes = await api.get(`/boards/${activeBoardId}/cards`);
      setCards(cardsRes.data);
    } catch (err) {
      console.error("Error fetching board data:", err);
    }
  };

  // --- INITIALIZATION & WEBSOCKET SETUP ---
  // --- INITIALIZATION & WEBSOCKET SETUP ---
  useEffect(() => {
    let socket;

    const initBoard = async () => {
      try {
        // Fetch the SPECIFIC board from the URL
        const res = await api.get(`/boards/${id}`);
        const activeBoard = res.data;

        setBoard(activeBoard);
        await fetchBoardData(activeBoard.id);

        // Connect to WebSocket
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        socket = io(backendUrl);
        socket.emit('join-board', activeBoard.id);

        socket.on('board-updated', () => {
          fetchBoardData(activeBoard.id); 
        });

      } catch (err) {
        console.error("Error initializing board:", err);
        navigate('/dashboard'); // If the board doesn't exist, kick them back to the dashboard!
      }
    };
    
    initBoard();

    return () => {
      if (socket && board) {
        socket.emit('leave-board', board.id);
        socket.disconnect();
      }
    };
  }, [id]); // 'id' as a dependency so it re-runs if the URL changes

  // --- HANDLERS (Updated to include boardId for the Backend) ---

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceListCards = cards.filter(c => c.list_id.toString() === source.droppableId);
    const destListCards = cards.filter(c => c.list_id.toString() === destination.droppableId);

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(sourceListCards, source.index, destination.index);
      const otherCards = cards.filter(c => c.list_id.toString() !== source.droppableId);
      setCards([...otherCards, ...reorderedCards]);
    } else {
      const result = move(sourceListCards, destListCards, source, destination);
      const otherCards = cards.filter(c => c.list_id.toString() !== source.droppableId && c.list_id.toString() !== destination.droppableId);
      setCards([...otherCards, ...result[source.droppableId], ...result[destination.droppableId]]);
      
      try {
        // We added boardId to the payload!
        await api.put(`/cards/${draggableId}/move`, { 
          newListId: destination.droppableId,
          boardId: board.id 
        });
      } catch (err) { console.error("Move failed", err); }
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle) return;
    try {
      const res = await api.post('/lists', { title: newListTitle, board_id: board.id });
      setLists([...lists, res.data]);
      setNewListTitle("");
      setIsAddingList(false);
    } catch (err) { console.error(err); }
  };

  const handleAddCard = async (e, listId) => {
    e.preventDefault();
    if (!newCardTitle) return;
    try {
      // We added boardId to the payload!
      const res = await api.post('/cards', { title: newCardTitle, list_id: listId, boardId: board.id });
      setCards([...cards, res.data]);
      setNewCardTitle("");
      setAddingCardToList(null);
    } catch (err) { console.error(err); }
  };

const handleDeleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list and all its cards?")) return;
    
    try {
      // Send the boardId as a query parameter for WebSockets
      await api.delete(`/lists/${listId}?boardId=${board.id}`);
      
      // Instantly remove the list AND its cards from the screen
      setLists(lists.filter(l => l.id !== listId));
      setCards(cards.filter(c => c.list_id !== listId));
    } catch (err) {
      console.error("Failed to delete list", err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteUsername) return;
    
    setInviteStatus({ type: "loading", message: "Inviting..." });
    
    try {
      const res = await api.post(`/boards/${board.id}/invite`, { username: inviteUsername });
      setInviteStatus({ type: "success", message: res.data.message });
      setInviteUsername(""); // Clear the input
      
      // Close modal automatically after 2 seconds
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteStatus({ type: "", message: "" });
      }, 2000);
      
    } catch (err) {
      setInviteStatus({ 
        type: "error", 
        message: err.response?.data?.error || "Failed to invite user." 
      });
    }
  };

  if (!board) return <div className="h-screen flex items-center justify-center bg-blue-600 text-white font-bold animate-pulse">Loading Board Data...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen flex flex-col bg-blue-600 overflow-hidden">
        
        <div className="p-4 bg-black/20 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-white/70 hover:text-white transition font-medium text-sm flex items-center gap-1">
               ← Dashboard
            </button>
            <h2 className="font-bold text-xl border-l border-white/20 pl-4">{board.title}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setShowInviteModal(true);
                setInviteStatus({ type: "", message: "" }); // Reset status on open
              }} 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
              <UserPlus size={16} /> Share
            </button>
            <button onClick={logout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-4 flex items-start space-x-4">
          {lists.map((list) => (
            <div key={list.id} className="w-72 flex-shrink-0 bg-gray-100 rounded-lg p-2 flex flex-col max-h-full">
              
              <div className="flex justify-between items-center p-2 group border-b border-gray-200 mb-2">
                <h3 className="font-bold text-gray-700">{list.title}</h3>
  
                  <button 
                    onClick={() => handleDeleteList(list.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded opacity-0 group-hover:opacity-100 transition"
                    title="Delete List"
                  >
                  <Trash2 size={16} />
                 </button>
            </div>
              <Droppable droppableId={list.id.toString()}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 min-h-[50px] overflow-y-auto">
                    {cards.filter(c => c.list_id === list.id).map((card, index) => (
                        <Card key={card.id} card={card} index={index} onClick={(clickedCard) => setSelectedCard(clickedCard)} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {addingCardToList === list.id ? (
                <form onSubmit={(e) => handleAddCard(e, list.id)} className="mt-2 p-1">
                  <textarea autoFocus placeholder="Title..." className="w-full p-2 rounded border text-sm" rows={2} value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} />
                  <div className="flex gap-2 mt-1"><button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button><button type="button" onClick={() => setAddingCardToList(null)}><X size={20}/></button></div>
                </form>
              ) : (
                <button onClick={() => setAddingCardToList(list.id)} className="text-gray-500 hover:bg-gray-200 p-2 rounded text-left mt-2 flex items-center gap-1 text-sm w-full"><Plus size={16} /> Add a card</button>
              )}
            </div>
          ))}
          <div className="w-72 flex-shrink-0">
             {!isAddingList ? (
                <button onClick={() => setIsAddingList(true)} className="w-full bg-white/20 hover:bg-white/30 text-white rounded-lg p-3 text-left font-bold flex items-center gap-2"><Plus size={20} /> Add list</button>
              ) : (
                <form onSubmit={handleAddList} className="bg-gray-100 p-2 rounded-lg"><input type="text" className="w-full p-2 rounded mb-2 text-sm" value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} autoFocus /><button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">Save</button></form>
              )}
          </div>
        </div>

        {selectedCard && (
          <CardModal 
            card={selectedCard} 
            boardId={board.id} // <-- PASS BOARD ID TO MODAL
            onClose={() => setSelectedCard(null)} 
            onUpdate={(updatedCard) => {
              if (updatedCard.isDeleted) {
                setCards(cards.filter(c => c.id !== updatedCard.id));
              } else {
                setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
              }
            }}
          />
        )}

        {/* INVITE MODAL */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-600" />
                  Invite to Board
                </h3>
                <button 
                  onClick={() => setShowInviteModal(false)} 
                  className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleInvite}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Member's Username</label>
                  <input
                    type="text"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., coolcoder99"
                    required
                  />
                  
                  {/* Status Message */}
                  {inviteStatus.message && (
                    <div className={`mt-3 p-3 rounded text-sm font-medium ${
                      inviteStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {inviteStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inviteStatus.type === 'loading'}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition"
                  >
                    {inviteStatus.type === 'loading' ? 'Sending...' : 'Send Invite'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </DragDropContext>
  );
};

export default Board;