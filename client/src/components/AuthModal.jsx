// client/src/components/AuthModal.jsx

import React, { useState } from 'react';

const AuthModal = ({ isVisible, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isVisible) return null;

    // CRITICAL: Targeting Port 5000
    const apiUrl = 'http://localhost:5000';
    
    const endpoint = isLogin ? `${apiUrl}/api/auth/login` : `${apiUrl}/api/auth/register`;
    const actionText = isLogin ? 'LOG IN' : 'REGISTER';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            if (!response.ok) {
                // Try to parse JSON error from server
                const data = await response.json(); 
                throw new Error(data.error || `Server responded with status: ${response.status}`);
            }
            
            // Success case (Status 200 or 201)
            const data = await response.json();
            
            onAuthSuccess(data.userId, data.username);
            onClose(); 

        } catch (err) {
            console.error('Auth request error:', err);
            // Updated error message to debug connectivity
            setError(err.message || 'Connection failed. Is the backend server running on http://localhost:5000?');
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        setIsLogin(!isLogin);
        setError(null);    
        setUsername('');   
        setPassword('');
    };

    return (
        <div style={backdropStyle}>
            <div style={modalContentStyle}>
                
                <h2 style={{ color: '#1A237E', fontSize: '1.8em', marginBottom: '10px' }}>
                    {isLogin ? 'Sign In' : 'Register Account'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        disabled={loading}
                        style={{ ...inputStyle, marginBottom: '15px' }}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        disabled={loading}
                        style={inputStyle}
                    />
                    
                    {error && <p style={{ color: '#E91E63', marginTop: '15px', fontWeight: 'bold' }}>{error}</p>}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            ...buttonStyle,
                            backgroundColor: loading ? '#B0BEC5' : (isLogin ? '#03A9F4' : '#4CAF50')
                        }}
                    >
                        {loading ? 'Processing...' : actionText}
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', fontSize: '0.9em' }}>
                    <button
                        onClick={handleSwap}
                        style={swapButtonStyle}
                    >
                        {isLogin ? 'Need an account? Sign up!' : 'Already a user? Log in!'}
                    </button>
                </div>
                <button 
                    onClick={onClose} 
                    style={{ background: 'none', border: 'none', color: '#555', marginTop: '10px', cursor: 'pointer' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// --- Styling Definitions ---
const backdropStyle = {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 2000 
};
const modalContentStyle = { 
    backgroundColor: 'white', borderRadius: '12px', padding: '40px',
    textAlign: 'center', maxWidth: '380px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
};
const inputStyle = {
    padding: '12px', fontSize: '1em', width: '100%', border: '1px solid #CFD8DC',
    borderRadius: '8px', boxSizing: 'border-box'
};
const buttonStyle = {
    width: '100%', padding: '12px 15px', fontSize: '1.1em', color: 'white', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s',
    marginTop: '20px'
};
const swapButtonStyle = {
    background: 'none', border: 'none', color: '#3F51B5', cursor: 'pointer', fontWeight: 'bold'
};

export default AuthModal;