// Importations obligatoires de React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


// Importer les assets (ressources : CSS, polices, images, etc.)
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'; // changer la police pour une qui me plaît plus
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

// Démarrer l'application React
createRoot(document.getElementById('root')).render(
  <App />
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
