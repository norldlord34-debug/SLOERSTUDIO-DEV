import React from 'react';
import ReactDOM from 'react-dom/client';
import FloatingWidget from './components/FloatingWidget';
import './index.css';

ReactDOM.createRoot(document.getElementById('widget-root')!).render(
    <React.StrictMode>
        <FloatingWidget />
    </React.StrictMode>
);
