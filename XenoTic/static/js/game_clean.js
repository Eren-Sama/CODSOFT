/**
 * XenoTic - Minimalist Tic-Tac-Toe Game Logic
 * Clean and simple game implementation
 */

class XenoTicGame {
    constructor() {
        this.gameState = null;
        this.isProcessing = false;
        this.gameStats = {
            humanWins: 0,
            aiWins: 0,
            draws: 0,
            totalGames: 0
        };
        
        this.initializeGame();
        this.setupEventListeners();
        this.loadStatistics();
    }
    
    /**
     * Initialize the game board and setup
     */
    initializeGame() {
        this.createGameBoard();
        this.startNewGame();
    }
    
    /**
     * Create the visual game board
     */
    createGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', (e) => this.handleCellClick(e));
                gameBoard.appendChild(cell);
            }
        }
    }
    
    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        // Game controls
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.getHint());
        document.getElementById('difficultySelect').addEventListener('change', (e) => this.changeDifficulty(e.target.value));
        document.getElementById('symbolSelect').addEventListener('change', () => this.startNewGame());
        
        // Modal controls
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.closeModal('gameModal');
            this.resetGame();
        });
        document.getElementById('newGameModalBtn').addEventListener('click', () => {
            this.closeModal('gameModal');
            this.startNewGame();
        });
        
        // Close modals on background click
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal('gameModal');
            }
        });
    }
    
    /**
     * Handle cell click events
     */
    async handleCellClick(event) {
        if (this.isProcessing) return;
        
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (cell.disabled || cell.textContent !== '') return;
        
        await this.makeMove(row, col);
    }
    
    /**
     * Start a new game
     */
    async startNewGame() {
        try {
            this.isProcessing = true;
            this.showLoadingOverlay(true);
            
            const difficulty = document.getElementById('difficultySelect').value;
            const humanSymbol = document.getElementById('symbolSelect').value;
            
            const response = await fetch('/api/new-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty: difficulty,
                    human_symbol: humanSymbol
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.gameState = data.game_state;
                this.updateBoard(this.gameState.board);
                this.updateGameStatus();
                this.updateHintButton();
            } else {
                console.error('Failed to start new game:', data.error);
            }
        } catch (error) {
            console.error('Error starting new game:', error);
        } finally {
            this.isProcessing = false;
            this.showLoadingOverlay(false);
        }
    }
    
    /**
     * Reset current game
     */
    async resetGame() {
        try {
            this.isProcessing = true;
            this.showLoadingOverlay(true);
            
            const response = await fetch('/api/reset-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.gameState = data.game_state;
                this.updateBoard(this.gameState.board);
                this.updateGameStatus();
                this.updateHintButton();
            }
        } catch (error) {
            console.error('Error resetting game:', error);
        } finally {
            this.isProcessing = false;
            this.showLoadingOverlay(false);
        }
    }
    
    /**
     * Make a move
     */
    async makeMove(row, col) {
        if (this.isProcessing || !this.gameState || this.gameState.game_over) return;
        
        try {
            this.isProcessing = true;
            this.showLoadingOverlay(true);
            
            const response = await fetch('/api/make-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, col })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.updateBoard(data.board);
                this.updateGameStatus();
                
                if (data.game_over) {
                    this.gameState.game_over = true;
                    this.gameState.winner = data.winner;
                    this.updateStatistics();
                    this.showGameResultModal(data);
                } else {
                    this.gameState.current_player = data.current_player;
                }
                
                this.updateHintButton();
            } else {
                console.error('Move failed:', data.error);
            }
        } catch (error) {
            console.error('Error making move:', error);
        } finally {
            this.isProcessing = false;
            this.showLoadingOverlay(false);
        }
    }
    
    /**
     * Change AI difficulty
     */
    async changeDifficulty(difficulty) {
        try {
            this.isProcessing = true;
            
            const response = await fetch('/api/change-difficulty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ difficulty })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.gameState = data.game_state;
                this.updateBoard(this.gameState.board);
                this.updateGameStatus();
                this.updateHintButton();
            }
        } catch (error) {
            console.error('Error changing difficulty:', error);
        } finally {
            this.isProcessing = false;
        }
    }
    
    /**
     * Get hint for best move
     */
    async getHint() {
        if (this.isProcessing || !this.gameState || this.gameState.game_over) return;
        
        try {
            const response = await fetch('/api/hint');
            const data = await response.json();
            
            if (data.success) {
                const { row, col } = data.hint;
                const targetCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                
                if (targetCell) {
                    // Highlight the suggested cell
                    targetCell.style.background = 'var(--warning)';
                    targetCell.style.color = 'white';
                    
                    setTimeout(() => {
                        targetCell.style.background = '';
                        targetCell.style.color = '';
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error getting hint:', error);
        }
    }
    
    /**
     * Show game result modal
     */
    showGameResultModal(data) {
        const title = document.getElementById('modalTitle');
        const message = document.getElementById('modalMessage');
        
        // Set modal content based on result
        if (data.winner === this.gameState.human_symbol) {
            title.textContent = 'You Win!';
            message.textContent = 'Congratulations! You beat the AI!';
            this.gameStats.humanWins++;
        } else if (data.winner === this.gameState.ai_symbol) {
            title.textContent = 'AI Wins';
            message.textContent = 'The AI has won this round. Try again!';
            this.gameStats.aiWins++;
        } else {
            title.textContent = 'Draw';
            message.textContent = "It's a tie! Well played!";
            this.gameStats.draws++;
        }
        
        this.gameStats.totalGames++;
        this.updateStatistics();
        this.saveStatistics();
        this.showModal('gameModal');
    }
    
    /**
     * Update board display
     */
    updateBoard(board) {
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
    
    /**
     * Update game status display
     */
    updateGameStatus() {
        if (!this.gameState) return;
        
        const currentPlayerElement = document.getElementById('currentPlayer');
        
        if (this.gameState.game_over) {
            currentPlayerElement.textContent = 'Game Over';
        } else {
            const isHumanTurn = this.gameState.current_player === this.gameState.human_symbol;
            currentPlayerElement.textContent = isHumanTurn ? 'Your Turn' : 'AI Turn';
        }
    }
    
    /**
     * Update statistics display
     */
    updateStatistics() {
        document.getElementById('winsCount').textContent = this.gameStats.humanWins;
        document.getElementById('lossesCount').textContent = this.gameStats.aiWins;
        document.getElementById('drawsCount').textContent = this.gameStats.draws;
    }
    
    /**
     * Update hint button state
     */
    updateHintButton() {
        const hintBtn = document.getElementById('hintBtn');
        const canUseHint = this.gameState && 
                          !this.gameState.game_over && 
                          this.gameState.current_player === this.gameState.human_symbol &&
                          !this.isProcessing;
        
        hintBtn.disabled = !canUseHint;
    }
    
    /**
     * Show/hide loading overlay
     */
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }
    
    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }
    
    /**
     * Close modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }
    
    /**
     * Save statistics to localStorage
     */
    saveStatistics() {
        try {
            localStorage.setItem('xenotic-stats', JSON.stringify(this.gameStats));
        } catch (error) {
            console.warn('Failed to save statistics:', error);
        }
    }
    
    /**
     * Load statistics from localStorage
     */
    loadStatistics() {
        try {
            const saved = localStorage.getItem('xenotic-stats');
            if (saved) {
                this.gameStats = { ...this.gameStats, ...JSON.parse(saved) };
                this.updateStatistics();
            }
        } catch (error) {
            console.warn('Failed to load saved statistics:', error);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new XenoTicGame();
});
