import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import App from './App'
import { syncQueue } from './lib/queue'
import './index.css'

defineCustomElements(window)
window.addEventListener('online', () => void syncQueue())
void syncQueue()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
