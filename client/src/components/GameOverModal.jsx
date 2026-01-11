// client/src/components/GameOverModal.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const GameOverModal = ({ 
    timeInSeconds, 
    moves, 
    playerName, 
    scoreSubmitted, 
    handleUpdateScore, 
    navigate 
}) => {
    
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    const finalTime = formatTime(timeInSeconds);

    const modalButtonStyle = (bgColor, textColor = 'white') => ({
        padding: '10px 20px',
        fontSize: '0.9em',
        backgroundColor: bgColor,
        color: textColor,
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    });

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{ 
                backgroundColor: '#FFFDE7', 
                borderRadius: '16px', 
                padding: '40px',
                textAlign: 'center',
                maxWidth: '450px',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                transform: 'scale(1.05)', 
            }}>
                
                <h2 style={{ 
                    color: '#C62828', 
                    fontSize: '3em', 
                    marginBottom: '10px'
                }}>
                    YOU DID IT! 🌟
                </h2>
                
                <p style={{ color: '#333', fontSize: '1.3em', marginBottom: '10px', fontWeight: '500' }}>
                    Congratulations, **{playerName}**!
                </p>
                <p style={{ color: '#333', fontSize: '1.3em', marginBottom: '25px', fontWeight: '500' }}>
                    Your final score details:
                </p>
                
                {/* Score Display */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-around', 
                    backgroundColor: '#FFEB3B', 
                    padding: '20px 0',
                    borderRadius: '10px',
                    marginBottom: '35px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ color: '#333' }}>
                        <div style={{ fontSize: '2em', fontWeight: 'bolder' }}>{finalTime}</div>
                        <div style={{ fontSize: '1em', marginTop: '5px' }}>Time</div>
                    </div>
                    <div style={{ color: '#333' }}>
                        <div style={{ fontSize: '2em', fontWeight: 'bolder' }}>{moves}</div>
                        <div style={{ fontSize: '1em', marginTop: '5px' }}>Moves</div>
                    </div>
                </div>
                
                {/* Score Submission/Update Area */}
                {!scoreSubmitted ? (
                    <div style={{ marginTop: '20px' }}>
                         <p style={{ color: '#1A237E', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '15px' }}>
                            Ready to finalize your score?
                        </p>
                        <button 
                            onClick={handleUpdateScore} 
                            style={{ 
                                width: '100%',
                                padding: '15px 15px', 
                                fontSize: '1.1em', 
                                backgroundColor: '#00BCD4', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s',
                                textTransform: 'uppercase'
                            }}
                        >
                            FINALIZE AND SUBMIT
                        </button>
                    </div>
                ) : (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ color: '#00796B', fontWeight: 'bold', fontSize: '1.2em', marginBottom: '20px' }}>
                            Score updated successfully!
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                                <button style={modalButtonStyle('#03A9F4')}> 
                                    View Leaderboard 🏆
                                </button>
                            </Link>
                            <button onClick={() => navigate('/')} style={modalButtonStyle('#CFD8DC', '#333')}>
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameOverModal;