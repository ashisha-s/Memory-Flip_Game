// client/src/components/GameBoard.jsx

import React from 'react';

const GameBoard = ({ cards, gridSize, onCardClick, isChecking }) => {
    
    // --- Responsive Sizing Parameters ---
    const containerSizeUnit = 'vmin'; 
    const containerSizeValue = 90; 
    const gapSize = 1.5; 
    const paddingSize = 2; 

    const gridTotalSize = `${containerSizeValue}${containerSizeUnit}`;
    
    // NOTE: cardSizeCalc removed, using aspect-ratio for square cards
    
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridGap: `${gapSize}${containerSizeUnit}`, 
        
        width: gridTotalSize,
        height: gridTotalSize, // Ensures the overall board is square
        
        padding: `${paddingSize / 2}${containerSizeUnit}`,
        
        overflow: 'hidden', 
        
        // Aesthetic Styling
        border: 'none', 
        backgroundColor: '#CFD8DC', 
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)', 
        boxSizing: 'border-box',
        
        margin: '0 auto', 
    };

    const cardStyle = (isFlipped, isMatched) => ({
        // Using aspect-ratio to ensure the card is always square
        aspectRatio: '1 / 1', 
        
        minWidth: '30px', 
        minHeight: '30px', 
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        fontSize: gridSize === 4 ? '6vmin' : gridSize === 6 ? '4.5vmin' : '3.5vmin', 
        borderRadius: '8px',
        
        // Block click and change cursor when checking
        cursor: isFlipped || isMatched 
            ? 'default' 
            : isChecking 
                ? 'wait' 
                : 'pointer',
        
        // COLOR SCHEME
        backgroundColor: isMatched ? '#A5D6A7' :         
                         isFlipped ? 'white' :           
                         '#3F51B5',                      
        
        color: isFlipped || isMatched ? '#333' : 'white',
        
        border: isMatched ? '3px solid #4CAF50' : 'none', 
        
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
        transform: isFlipped || isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
        opacity: isMatched ? 0.9 : 1,
        boxShadow: isFlipped ? '0 2px 4px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.2)', 
    });

    if (cards.length === 0) {
        return <div>Initializing Game...</div>; 
    }

    return (
        <div style={gridStyle}>
            {cards.map((card, index) => (
                <div 
                    key={card.id} 
                    style={{ 
                        perspective: '1000px', 
                        transformStyle: 'preserve-3d',
                        width: '100%', 
                        height: '100%' 
                    }} 
                    // BLOCK CLICKING IF isChecking IS TRUE
                    onClick={isChecking ? null : () => onCardClick(index)}
                >
                    <div 
                        style={cardStyle(card.isFlipped, card.isMatched)}
                    >
                        {(card.isFlipped || card.isMatched) ? card.icon : ' '}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GameBoard;