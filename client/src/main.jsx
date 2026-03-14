import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css'; // Or whatever your main css file is named

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
