import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle state
  const [error, setError] = useState(''); // Error message state
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (isRegistering) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/'); // Redirect to Board on success
    } catch (err) {
      // Handle errors from backend (e.g., "Username taken")
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        
        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              className="w-full border p-2 rounded focus:outline-blue-500" 
              placeholder="Enter username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              className="w-full border p-2 rounded focus:outline-blue-500" 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          <button className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200 mt-2">
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegistering ? "Already have an account?" : "New to Trello Clone?"}
          <span 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-blue-600 cursor-pointer font-bold ml-1 hover:underline"
          >
            {isRegistering ? "Log In" : "Register"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;