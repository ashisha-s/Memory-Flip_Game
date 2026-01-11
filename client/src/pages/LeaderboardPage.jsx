// client/src/pages/LeaderboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const [selectedSize, setSelectedSize] = useState(4);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sizes = [
        { size: 4, name: 'Easy (4x4)' },
        { size: 6, name: 'Moderate (6x6)' },
        { size: 8, name: 'Difficult (8x8)' },
    ];
    
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Fetch leaderboard data when selectedSize changes
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/leaderboard/${selectedSize}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data.');
                }
                const data = await response.json();
                setLeaderboardData(data);
            } catch (err) {
                setError('Could not connect to the server or fetch leaderboard data. Ensure the server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [selectedSize]);

    return (
        <div style={{ textAlign: 'center', padding: '50px 20px', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
            
            <button 
                onClick={() => navigate('/')} 
                style={{ float: 'left', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#B0BEC5', color: '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
            >
                ← Home
            </button>
            
            <h1 style={{ color: '#1A237E', fontSize: '2.5em', margin: '0 0 30px 0' }}>🏆 Global High Scores</h1>

            {/* Difficulty Selector Buttons */}
            <div style={{ marginBottom: '30px' }}>
                {sizes.map(({ size, name }) => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                            padding: '10px 20px',
                            margin: '0 10px',
                            cursor: 'pointer',
                            backgroundColor: selectedSize === size ? '#03A9F4' : '#CFD8DC',
                            color: selectedSize === size ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Leaderboard Table */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    
                    {loading && <p style={{ padding: '20px' }}>Loading scores...</p>}
                    {error && <p style={{ padding: '20px', color: '#F44336' }}>Error: {error}</p>}
                    
                    {!loading && !error && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#BBDEFB' }}> {/* Light Blue Header */}
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#1A237E' }}>#</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#1A237E' }}>Player</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#1A237E' }}>Time</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#1A237E' }}>Moves</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#1A237E', fontSize: '0.9em' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.length > 0 ? (
                                    leaderboardData.map((score, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                            <td style={{ padding: '15px', textAlign: 'left', fontWeight: index < 3 ? 'bold' : 'normal', color: index === 0 ? '#FFC107' : index === 1 ? '#9E9E9E' : index === 2 ? '#FF7043' : '#333' }}>{index + 1}</td>
                                            <td style={{ padding: '15px', textAlign: 'left' }}>{score.player_name}</td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>{formatTime(score.time_seconds)}</td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>{score.moves}</td>
                                            <td style={{ padding: '15px', textAlign: 'center', fontSize: '0.8em', color: '#777' }}>
                                                {new Date(score.completion_date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                                            No scores recorded yet for this difficulty.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;