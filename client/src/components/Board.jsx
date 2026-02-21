import { useEffect, useState, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import { Plus, X, LogOut } from 'lucide-react';
import Card from './Card';
import { move, reorder } from '../utils/dragHelpers';
import AuthContext from '../context/AuthContext';

const Board = () => {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  
  const { logout } = useContext(AuthContext);

  // UI States
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingCardToList, setAddingCardToList] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  useEffect(() => {
    const initBoard = async () => {
      try {
        // 1. Get all boards
        const res = await api.get('/boards');
        let activeBoard = res.data[0]; // Pick the first board found

        // 2. If NO boards exist, create a default one automatically
        if (!activeBoard) {
          const newBoardRes = await api.post('/boards', { title: 'My First Project' });
          activeBoard = newBoardRes.data;
        }

        setBoard(activeBoard);

        // 3. Fetch Lists and Cards for this board
        if (activeBoard) {
          const listsRes = await api.get(`/boards/${activeBoard.id}/lists`);
          setLists(listsRes.data);
          const cardsRes = await api.get(`/boards/${activeBoard.id}/cards`);
          setCards(cardsRes.data);
        }
      } catch (err) {
        console.error("Error initializing board:", err);
      }
    };
    initBoard();
  }, []);

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
        await api.put(`/cards/${draggableId}/move`, { newListId: destination.droppableId });
      } catch (err) { console.error("Move failed", err); }
    }
  };

  // --- Handlers ---
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
      const res = await api.post('/cards', { title: newCardTitle, list_id: listId });
      setCards([...cards, res.data]);
      setNewCardTitle("");
      setAddingCardToList(null);
    } catch (err) { console.error(err); }
  };

  if (!board) return (
    <div className="h-screen flex items-center justify-center bg-blue-600 text-white font-bold animate-pulse">
      Loading Board Data...
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen flex flex-col bg-blue-600">
        
        {/* --- HEADER (Fixed) --- */}
        <div className="p-4 bg-black/20 text-white flex justify-between items-center shadow-md">
          <h2 className="font-bold text-xl">{board.title}</h2>
          
          <button 
            onClick={logout} 
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
        {/* ---------------------- */}

        <div className="flex-1 overflow-x-auto p-4 flex items-start space-x-4">
          {lists.map((list) => (
            <div key={list.id} className="w-72 flex-shrink-0 bg-gray-100 rounded-lg p-2 flex flex-col max-h-full">
              <h3 className="font-bold text-gray-700 p-2">{list.title}</h3>
              <Droppable droppableId={list.id.toString()}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 min-h-[50px] overflow-y-auto">
                    {cards.filter(c => c.list_id === list.id).map((card, index) => (
                        <Card key={card.id} card={card} index={index} />
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
      </div>
    </DragDropContext>
  );
};

export default Board;