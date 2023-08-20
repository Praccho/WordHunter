require('file-loader?name=[name].[ext]!./index.html');
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.js';
import './index.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement)

root.render(
    <StrictMode>
        <App />
    </StrictMode>
)