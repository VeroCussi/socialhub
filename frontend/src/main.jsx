// importaciones obligatorias de react
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


// Importar assets (recursos: CSS, fuentes, imagenes, etc.)
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'; // cambiar fuente a una que me guste más
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

// arrancar la app de react
createRoot(document.getElementById('root')).render(
  <App />
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
