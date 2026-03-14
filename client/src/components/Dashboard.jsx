import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, Plus, LogOut, Trash2} from 'lucide-react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (err) {
      console.error("Failed to fetch boards", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle) return;
    
    try {
      const res = await api.post('/boards', { title: newBoardTitle });
      // Redirect straight to the new board!
      navigate(`/b/${res.data.id}`); 
    } catch (err) {
      console.error("Failed to create board", err);
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.preventDefault(); // Stops the click from opening the board
    
    if (!window.confirm("Are you sure you want to delete this entire project? This cannot be undone!")) return;
    
    try {
      await api.delete(`/boards/${boardId}`);
      // Remove it from the screen instantly
      setBoards(boards.filter(b => b.id !== boardId)); 
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete board");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-600">
          <Kanban size={24} />
          <span className="font-bold text-xl text-gray-900">ZenBoard Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Hi, {user?.username || 'User'}</span>
          <button onClick={logout} className="text-gray-500 hover:text-red-500 transition"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Boards</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Create New Board Tile */}
          {isCreating ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-32 flex flex-col justify-between">
              <form onSubmit={handleCreateBoard}>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Board title..." 
                  className="w-full p-2 border border-blue-500 rounded focus:outline-none mb-2"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded font-medium">Create</button>
                  <button type="button" onClick={() => setIsCreating(false)} className="text-gray-500 text-sm hover:text-gray-800">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-gray-100/50 hover:bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-xl p-6 h-32 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 transition group"
            >
              <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Create new board</span>
            </button>
          )}

          {/* Render Existing Boards */}
          {boards.map(board => (
            <Link 
              key={board.id} 
              to={`/b/${board.id}`}
              className="bg-white hover:bg-blue-50 rounded-xl shadow-sm border border-gray-200 p-6 h-32 flex flex-col justify-between group transition cursor-pointer relative"
            >
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 truncate pr-6">{board.title}</h3>
              
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium uppercase tracking-wide">
                <span>{board.role === 'admin' ? 'Owner' : 'Member'}</span>
              </div>

              {/* Only show the delete button if they are the admin! */}
              {board.role === 'admin' && (
                <button 
                  onClick={(e) => handleDeleteBoard(e, board.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition opacity-0 group-hover:opacity-100"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </Link>
          ))}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;