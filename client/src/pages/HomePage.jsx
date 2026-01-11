// client/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal.jsx'; 

const HomePage = () => {
    const navigate = useNavigate();
    
    // --- AUTHENTICATION STATE ---
    const [user, setUser] = useState({ userId: null, username: null });
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Check localStorage for persistent login state on initial load
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        if (storedUserId && storedUsername) {
            setUser({ userId: parseInt(storedUserId, 10), username: storedUsername });
        }
    }, []);

    const handleAuthSuccess = (userId, username) => {
        // Save state globally and persist in localStorage
        setUser({ userId, username });
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        setShowAuthModal(false);
    };

    const handleLogout = () => {
        setUser({ userId: null, username: null });
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    };

    const difficulties = [
        { name: 'Easy', size: 4, description: '4x4 Grid (8 pairs)' },
        { name: 'Moderate', size: 6, description: '6x6 Grid (18 pairs)' },
        { name: 'Difficult', size: 8, description: '8x8 Grid (32 pairs)' },
    ];

    const buttonStyle = (name) => ({
        padding: '15px 30px',
        margin: '15px',
        fontSize: '1.2em',
        textDecoration: 'none',
        color: 'white',
        borderRadius: '10px', 
        transition: 'background-color 0.3s, transform 0.2s',
        cursor: user.userId ? 'pointer' : 'not-allowed', 
        opacity: user.userId ? 1 : 0.5,
        fontWeight: 'bold',
        
        backgroundColor: name === 'Easy' ? '#4CAF50' :         
                         name === 'Moderate' ? '#FF9800' :      
                         '#E91E63',                             
        display: 'block',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
    });
    
    // Custom Link component to prevent navigation if not logged in
    const AuthLink = ({ children, to, style }) => (
        user.userId 
            ? <Link to={to} style={style}>{children}</Link>
            : <div style={style} onClick={() => setShowAuthModal(true)}>{children}</div> 
    );


    return (
        <div style={{ textAlign: 'center', padding: '50px 20px', minHeight: '100vh', width: '100%', boxSizing: 'border-box', backgroundColor: '#E3F2FD' }}>
            
            {/* --- User Profile Section --- */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'right' }}>
                {user.userId ? (
                    <div
                        style={{
                            padding: '10px',
                            backgroundColor: '#BBDEFB',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '15px'
                        }}
                        >
                        <p
                            style={{
                            margin: 0,
                            fontWeight: 'bold',
                            color: '#1A237E',
                            display: 'flex',
                            alignItems: 'center'
                            }}
                        >
                            <span style={{ fontSize: '1.5em', marginRight: '8px' }}>👤</span>
                            {user.username}
                        </p>

                        <button onClick={handleLogout} style={authButtonStyle('#F44336')}>
                            Logout
                        </button>
                    </div>

                ) : (
                    <button onClick={() => setShowAuthModal(true)} style={authButtonStyle('#03A9F4')}>
                        Login / Register
                    </button>
                )}
            </div>

            <h1 style={{ color: '#1A237E', fontSize: '2.8em', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>🧠 Memory Flip</h1>
            <p style={{ color: '#455A64', fontSize: '1.2em', marginBottom: '40px' }}>
                {user.userId ? `Welcome back, ${user.username}! Select a challenge.` : 'Please log in or register to start playing.'}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {difficulties.map(level => (
                    <AuthLink 
                        key={level.name}
                        to={`/play/${level.size}`} 
                        style={buttonStyle(level.name)}
                    >
                        {level.name}
                        <div style={{ fontSize: '0.8em', marginTop: '5px', fontWeight: 'normal' }}>
                            {level.description}
                        </div>
                    </AuthLink>
                ))}
            </div>

            <button
                onClick={() => navigate('/leaderboard')}
                style={{
                    marginTop: '40px',
                    padding: '12px 28px',
                    fontSize: '1.1em',
                    backgroundColor: '#03A9F4', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
            >
                View Leaderboard 🏆
            </button>
            
            {/* --- Authentication Modal --- */}
            <AuthModal 
                isVisible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onAuthSuccess={handleAuthSuccess}
                navigate={navigate}
            />
        </div>
    );
};

const authButtonStyle = (bgColor) => ({
    padding: '8px 15px',
    backgroundColor: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
});

export default HomePage;