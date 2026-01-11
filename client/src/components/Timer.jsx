// client/src/components/Timer.jsx (Can be reused from Sudoku)

import React, { useState, useEffect } from 'react';

const Timer = ({ isRunning, onTimeUpdate }) => {
    const [seconds, setSeconds] = useState(0);

    // Reset seconds when the game starts/restarts
    useEffect(() => {
        if (isRunning) {
            setSeconds(0);
            onTimeUpdate(0);
        }
    }, [isRunning, onTimeUpdate]);
    
    // Timer interval logic
    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    const newSeconds = prevSeconds + 1;
                    onTimeUpdate(newSeconds); // Send updated time to parent
                    return newSeconds;
                });
            }, 1000);
        } else if (!isRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, onTimeUpdate, seconds]); // Removed 'seconds' from dependency array to prevent issues, relying on prevSeconds

    // Format time (MM:SS)
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    return (
        <div style={{ fontSize: '1.8em', color: '#00796B', fontWeight: 'bold', marginBottom: '15px' }}>
            Time: {timeDisplay}
        </div>
    );
};

export default Timer;