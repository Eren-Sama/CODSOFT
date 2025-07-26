/**
 * Simple XenoTic Game - No Hint Version
 */

let gameState = null;
let isProcessing = false;
let gameStats = {
    wins: 0,
    draws: 0,
    losses: 0
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple game initializing...');
    loadStatistics();
    createBoard();
    setupEventListeners();
    startNewGame();
});

function loadStatistics() {
    const savedStats = localStorage.getItem('xenoticStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }
    
    // Update display
    document.getElementById('winsCount').textContent = gameStats.wins;
    document.getElementById('drawsCount').textContent = gameStats.draws;
    document.getElementById('lossesCount').textContent = gameStats.losses;
    
    console.log('Statistics loaded:', gameStats);
}

function createBoard() {
    console.log('Creating board...');
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.dataset.row = Math.floor(i / 3);
        cell.dataset.col = i % 3;
        cell.onclick = function() { handleCellClick(this); };
        gameBoard.appendChild(cell);
    }
    console.log('Board created with 9 cells');
}

function setupEventListeners() {
    document.getElementById('newGameBtn').onclick = startNewGame;
    
    // Modal event listeners
    document.getElementById('playAgainBtn').onclick = function() {
        document.getElementById('gameModal').style.display = 'none';
        startNewGame();
    };
    
    document.getElementById('newGameModalBtn').onclick = function() {
        document.getElementById('gameModal').style.display = 'none';
        startNewGame();
    };
    
    // Close modal when clicking outside
    document.getElementById('gameModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    };
}

function handleCellClick(cell) {
    console.log('Cell clicked:', cell.dataset);
    
    if (isProcessing || !gameState) {
        console.log('Click ignored - processing or no game state');
        return;
    }
    
    if (cell.textContent !== '' || cell.disabled) {
        console.log('Click ignored - cell occupied or disabled');
        return;
    }
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    makeMove(row, col);
}

async function startNewGame() {
    console.log('Starting new game...');
    isProcessing = true;
    
    try {
        const difficulty = document.getElementById('difficultySelect').value;
        const humanSymbol = document.getElementById('symbolSelect').value;
        
        const response = await fetch('/api/new-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, human_symbol: humanSymbol })
        });
        
        const data = await response.json();
        console.log('New game response:', data);
        
        if (data.success) {
            gameState = data.game_state;
            updateBoard(gameState.board);
            updateStatus();
            
            // If AI goes first
            if (data.ai_goes_first) {
                setTimeout(() => makeAIFirstMove(), 500);
            }
        }
    } catch (error) {
        console.error('Error starting new game:', error);
    } finally {
        isProcessing = false;
    }
}

async function makeAIFirstMove() {
    console.log('Making AI first move...');
    isProcessing = true;
    
    try {
        const response = await fetch('/api/ai-first-move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        console.log('AI first move response:', data);
        
        if (data.success) {
            updateBoard(data.board);
            gameState.current_player = data.current_player;
            updateStatus();
        }
    } catch (error) {
        console.error('Error making AI first move:', error);
    } finally {
        isProcessing = false;
    }
}

async function makeMove(row, col) {
    console.log(`Making move at [${row}][${col}]`);
    isProcessing = true;
    
    try {
        const response = await fetch('/api/make-move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ row, col })
        });
        
        const data = await response.json();
        console.log('Move response:', data);
        
        if (data.success) {
            updateBoard(data.board);
            
            if (data.game_over) {
                gameState.game_over = true;
                gameState.winner = data.winner;
                
                // Show game result with proper messages
                showGameResult(data);
            } else {
                gameState.current_player = data.current_player;
            }
            
            updateStatus();
        } else {
            console.error('Move failed:', data.error);
        }
    } catch (error) {
        console.error('Error making move:', error);
    } finally {
        isProcessing = false;
    }
}

function updateBoard(board) {
    console.log('Updating board:', board);
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const value = board[row][col];
        
        if (value) {
            cell.textContent = value;
            cell.disabled = true;
        } else {
            cell.textContent = '';
            cell.disabled = false;
        }
    });
}

function updateStatus() {
    if (gameState) {
        document.getElementById('currentPlayer').textContent = gameState.current_player || '-';
    }
}

function showGameResult(data) {
    let title = 'Game Over';
    let message = '';
    let emoji = '';
    
    if (data.winner === gameState.human_symbol) {
        title = '🎉 Congratulations!';
        message = 'Wow! You Won! 🎊';
        emoji = '🏆';
    } else if (data.winner === gameState.ai_symbol) {
        title = '🤖 AI Wins';
        message = 'Sorry! AI Won this round! 🔥';
        emoji = '💪';
    } else {
        title = '🤝 Draw';
        message = "It's a tie! Well played! ⚖️";
        emoji = '🤝';
    }
    
    // Show modal
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.innerHTML = title;
    modalMessage.innerHTML = message;
    modal.style.display = 'flex';
    
    // Update statistics
    updateStatistics(data.winner);
    
    console.log('Game result displayed:', { title, message, winner: data.winner });
}

function updateStatistics(winner) {
    if (winner === gameState.human_symbol) {
        gameStats.wins++;
    } else if (winner === gameState.ai_symbol) {
        gameStats.losses++;
    } else {
        gameStats.draws++;
    }
    
    // Update the display
    document.getElementById('winsCount').textContent = gameStats.wins;
    document.getElementById('drawsCount').textContent = gameStats.draws;
    document.getElementById('lossesCount').textContent = gameStats.losses;
    
    // Save to localStorage
    localStorage.setItem('xenoticStats', JSON.stringify(gameStats));
    
    console.log('Statistics updated:', gameStats);
}
