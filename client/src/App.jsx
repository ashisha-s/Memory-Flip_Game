// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

import HomePage from './pages/HomePage.jsx';
import MemoryGame from './pages/MemoryGame.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';

const App = () => {
    return (
        <Router>
            <div className="App"> 
                <div style={{ width: '100%', minHeight: '100vh' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/play/:size" element={<MemoryGame />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} /> 
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;