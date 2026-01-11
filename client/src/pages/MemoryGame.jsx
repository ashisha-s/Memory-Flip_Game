// client/src/pages/MemoryGame.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer.jsx';
import GameBoard from '../components/GameBoard.jsx';
import GameOverModal from '../components/GameOverModal.jsx'; 

// --- Helper Functions ---
const initializeCards = (gridSize) => {
    const totalCells = gridSize * gridSize;
    const numPairs = totalCells / 2;
    const allIcons = ['🍎', '🍌', '🥝', '🍇', '🍉', '🍍', '🍊', '🍓', '🍒', '🍋', '🥭', '🥥', '🍑', '🌶️', '🥦', '🥕', '🥔', '🍄', '🥚', '🧀', '🍔', '🍕', '🍣', '🍩', '🍪', '☕', '🍺', '🎾', '⚽', '🏀', '🏈', '⚾'];
    const selectedIcons = allIcons.slice(0, numPairs);
    let cards = [...selectedIcons, ...selectedIcons];
    cards.sort(() => Math.random() - 0.5);

    return cards.map((icon, index) => ({
        id: index,
        icon: icon,
        isFlipped: false,
        isMatched: false,
    }));
};

// --- Main Component ---
const MemoryGame = () => {
    const { size } = useParams();
    const navigate = useNavigate();
    const gridSize = parseInt(size, 10);

    // --- AUTHENTICATION CONTEXT ---
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!userId || !username) {
            alert("Please log in to play the game.");
            navigate('/');
        }
    }, [userId, username, navigate]);


    // --- GAME STATES ---
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false); // Used to block clicks during match check
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeInSeconds, setTimeInSeconds] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false); 
    const [scoreId, setScoreId] = useState(null); 
    const [initAttempted, setInitAttempted] = useState(false); // NEW: Prevents duplicate placeholder scores
    
    // --- Initial Game Setup and Placeholder Insertion ---
    useEffect(() => {
        // Prevent running if not logged in, score already exists, or init already attempted
        if (!userId || scoreId !== null || initAttempted) return; 

        const createPlaceholderScore = async () => {
            setInitAttempted(true); // Flag: We are starting the attempt now
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            try {
                const response = await fetch(`${apiUrl}/api/score/init`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        userId: userId, 
                        gridSize: gridSize 
                    }),
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create placeholder score.');
                }
                const data = await response.json();
                
                setScoreId(data.scoreId);
                setCards(initializeCards(gridSize));
                setTimerRunning(true); 

            } catch (error) {
                console.error('Error initializing score:', error);
                alert(`Game initialization failed: ${error.message}. Redirecting.`);
                navigate('/');
                // Optionally allow retry on error:
                setInitAttempted(false); 
            }
        };

        createPlaceholderScore();
        setMoves(0);
        setGameOver(false);
        setTimeInSeconds(0);
        setScoreSubmitted(false);

    }, [userId, gridSize, navigate, scoreId, initAttempted]); // Added initAttempted to dependencies

    // --- Match Checking Logic ---
    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsChecking(true);
            setMoves(m => m + 1);
            
            const [index1, index2] = flippedIndices;
            
            if (cards[index1].icon === cards[index2].icon) {
                // Match
                const newCards = [...cards];
                newCards[index1].isMatched = true;
                newCards[index2].isMatched = true;
                setCards(newCards);
                setFlippedIndices([]); 
                setIsChecking(false);
            } else {
                // No Match: flip back after a delay
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[index1].isFlipped = false;
                    newCards[index2].isFlipped = false;
                    setCards(newCards);
                    setFlippedIndices([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    }, [flippedIndices, cards]);

    // Win Condition Check
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setTimerRunning(false);
            setGameOver(true);
        }
    }, [cards]);

    // Card Click Handler 
    const handleCardFlip = useCallback((index) => {
        if (!timerRunning || isChecking || gameOver || cards[index].isMatched || cards[index].isFlipped || flippedIndices.length >= 2) {
            return;
        }

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);
        setFlippedIndices(prev => [...prev, index]);
        
    }, [cards, isChecking, gameOver, flippedIndices, timerRunning]);
    
    // Time update handler
    const handleTimeUpdate = useCallback((newTime) => {
        setTimeInSeconds(newTime);
    }, []);

    // --- Final Score Update Handler ---
    const handleUpdateScore = async () => {
        
        if (!scoreId) {
            alert("Error: Score ID missing. Cannot save score.");
            return;
        }
        
        setScoreSubmitted(true); 

        const scoreData = {
            timeSeconds: timeInSeconds,
            moves: moves,
        };

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
            
            const response = await fetch(`${apiUrl}/api/score/${scoreId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreData),
            });

            if (!response.ok) {
                throw new Error('Server update failed.');
            }

            console.log('Score updated successfully!');

        } catch (error) {
            console.error('Error updating score:', error);
            alert('Failed to update score. Check server logs.');
            setScoreSubmitted(false);
        }
    };

    // --- Render ---

    return (
        <div style={styles.container}>
            
            {/* 1. Header Row */}
            <header style={styles.header}>
                <button 
                    onClick={() => navigate('/')} 
                    style={styles.backButton}
                >
                    ← Back
                </button>
                
                <h2 style={styles.title}>
                    {gridSize}x{gridSize} Memory Match
                </h2>

                <div style={styles.headerStats}>
                    <p style={styles.statItem}>Player: **{username}**</p>
                    <Timer isRunning={timerRunning} onTimeUpdate={handleTimeUpdate} style={styles.statItem} /> 
                    <p style={styles.statItem}>Moves: **{moves}**</p>
                </div>
            </header>

            {/* 2. Game Board Area */}
            <main style={styles.mainContent}>
                {scoreId ? (
                    <>
                        {/* Game Board */}
                        {!gameOver && (
                            <GameBoard 
                                cards={cards} 
                                gridSize={gridSize} 
                                onCardClick={handleCardFlip} 
                                isChecking={isChecking} // Passed to block clicks
                            />
                        )}
                    </>
                ) : (
                    <p style={styles.initializationText}>
                        Initializing game... (Checking login and creating score record)
                    </p>
                )}
            </main>
            
            {/* --- Game Over Modal --- */}
            {gameOver && (
                <GameOverModal 
                    timeInSeconds={timeInSeconds}
                    moves={moves}
                    playerName={username} 
                    scoreSubmitted={scoreSubmitted}
                    handleUpdateScore={handleUpdateScore} 
                    navigate={navigate}
                />
            )}
        </div>
    );
};

// --- Styling Definitions ---
const styles = {
    container: {
        padding: '20px',
        width: '100%',
        minHeight: '100vh', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
    },
    header: {
        width: '100%',
        maxWidth: '1000px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '15px',
        borderBottom: '2px solid #ddd',
        marginBottom: '30px',
    },
    backButton: {
        padding: '8px 15px', 
        cursor: 'pointer', 
        backgroundColor: '#B0BEC5', 
        color: '#333', 
        border: 'none', 
        borderRadius: '4px', 
        fontWeight: 'bold',
        zIndex: 10,
    },
    title: {
        color: '#333', 
        textAlign: 'center', 
        margin: '0',
        fontSize: '1.8em',
        flexGrow: 1, 
    },
    headerStats: {
        display: 'flex',
        gap: '20px', 
        alignItems: 'center',
        fontSize: '1.1em',
        fontWeight: 'bold',
        minWidth: '350px', 
        justifyContent: 'flex-end',
    },
    statItem: {
        margin: '0',
        color: '#455A64',
    },
    mainContent: {
        flexGrow: 1, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        width: '100%',
    },
    initializationText: {
        marginTop: '50px', 
        fontSize: '1.5em', 
        color: '#1A237E'
    }
};

export default MemoryGame;