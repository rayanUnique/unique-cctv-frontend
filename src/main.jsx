import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter  } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'  // Make sure this imports .jsx
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)