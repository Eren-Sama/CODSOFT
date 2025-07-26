"""
XenoTic - Advanced Minimax AI with Alpha-Beta Pruning
Implements an unbeatable AI for Tic-Tac-Toe using game theory
"""

import math
import copy
from typing import List, Tuple, Optional

class TicTacToeAI:
    """
    Advanced Tic-Tac-Toe AI using Minimax algorithm with Alpha-Beta Pruning
    """
    
    def __init__(self, ai_symbol='O', human_symbol='X'):
        self.ai_symbol = ai_symbol
        self.human_symbol = human_symbol
        self.nodes_evaluated = 0  # For performance tracking
    
    def evaluate_board(self, board: List[List[str]]) -> int:
        """
        Evaluate the current board state
        Returns: 10 if AI wins, -10 if human wins, 0 for draw/ongoing
        """
        # Check rows
        for row in board:
            if row[0] == row[1] == row[2] != '':
                return 10 if row[0] == self.ai_symbol else -10
        
        # Check columns
        for col in range(3):
            if board[0][col] == board[1][col] == board[2][col] != '':
                return 10 if board[0][col] == self.ai_symbol else -10
        
        # Check diagonals
        if board[0][0] == board[1][1] == board[2][2] != '':
            return 10 if board[0][0] == self.ai_symbol else -10
        
        if board[0][2] == board[1][1] == board[2][0] != '':
            return 10 if board[0][2] == self.ai_symbol else -10
        
        return 0  # No winner yet
    
    def is_board_full(self, board: List[List[str]]) -> bool:
        """Check if the board is completely filled"""
        for row in board:
            for cell in row:
                if cell == '':
                    return False
        return True
    
    def get_empty_cells(self, board: List[List[str]]) -> List[Tuple[int, int]]:
        """Get all empty cell positions"""
        empty_cells = []
        for i in range(3):
            for j in range(3):
                if board[i][j] == '':
                    empty_cells.append((i, j))
        return empty_cells
    
    def is_game_over(self, board: List[List[str]]) -> bool:
        """Check if the game is over (win or draw)"""
        return self.evaluate_board(board) != 0 or self.is_board_full(board)
    
    def minimax(self, board: List[List[str]], depth: int, is_maximizing: bool, 
                alpha: float = -math.inf, beta: float = math.inf) -> int:
        """
        Minimax algorithm with Alpha-Beta Pruning
        
        Args:
            board: Current game board state
            depth: Current search depth
            is_maximizing: True if maximizing player (AI), False if minimizing (human)
            alpha: Alpha value for pruning
            beta: Beta value for pruning
        
        Returns:
            Best score for the current position
        """
        self.nodes_evaluated += 1
        
        # Terminal state evaluation
        score = self.evaluate_board(board)
        
        # Base cases
        if score == 10:  # AI wins
            return score - depth  # Prefer faster wins
        
        if score == -10:  # Human wins
            return score + depth  # Delay losses
        
        if self.is_board_full(board):  # Draw
            return 0
        
        if is_maximizing:
            # AI's turn (maximizing player)
            max_eval = -math.inf
            
            for row, col in self.get_empty_cells(board):
                # Make move
                board[row][col] = self.ai_symbol
                
                # Recursive call
                eval_score = self.minimax(board, depth + 1, False, alpha, beta)
                
                # Undo move
                board[row][col] = ''
                
                # Update best score
                max_eval = max(max_eval, eval_score)
                
                # Alpha-Beta Pruning
                alpha = max(alpha, eval_score)
                if beta <= alpha:
                    break  # Beta cutoff
            
            return max_eval
        
        else:
            # Human's turn (minimizing player)
            min_eval = math.inf
            
            for row, col in self.get_empty_cells(board):
                # Make move
                board[row][col] = self.human_symbol
                
                # Recursive call
                eval_score = self.minimax(board, depth + 1, True, alpha, beta)
                
                # Undo move
                board[row][col] = ''
                
                # Update best score
                min_eval = min(min_eval, eval_score)
                
                # Alpha-Beta Pruning
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break  # Alpha cutoff
            
            return min_eval
    
    def get_best_move(self, board: List[List[str]], difficulty: str = 'impossible') -> Tuple[int, int]:
        """
        Get the best move for AI using Minimax algorithm
        
        Args:
            board: Current game board state
            difficulty: AI difficulty level ('easy', 'medium', 'hard', 'impossible')
        
        Returns:
            Tuple of (row, col) for the best move
        """
        self.nodes_evaluated = 0
        
        # Handle different difficulty levels
        if difficulty == 'easy':
            return self._get_random_move(board)
        elif difficulty == 'medium':
            return self._get_medium_move(board)
        elif difficulty == 'hard':
            return self._get_hard_move(board)
        else:  # impossible
            return self._get_impossible_move(board)
    
    def _get_random_move(self, board: List[List[str]]) -> Tuple[int, int]:
        """Easy difficulty: Random moves"""
        import random
        empty_cells = self.get_empty_cells(board)
        return random.choice(empty_cells) if empty_cells else (0, 0)
    
    def _get_medium_move(self, board: List[List[str]]) -> Tuple[int, int]:
        """Medium difficulty: Mix of smart and random moves"""
        import random
        
        # 70% chance to play optimally, 30% random
        if random.random() < 0.7:
            return self._get_impossible_move(board)
        else:
            return self._get_random_move(board)
    
    def _get_hard_move(self, board: List[List[str]]) -> Tuple[int, int]:
        """Hard difficulty: Mostly optimal with occasional mistakes"""
        import random
        
        # 90% chance to play optimally, 10% random
        if random.random() < 0.9:
            return self._get_impossible_move(board)
        else:
            return self._get_random_move(board)
    
    def _get_impossible_move(self, board: List[List[str]]) -> Tuple[int, int]:
        """Impossible difficulty: Perfect play using Minimax"""
        best_score = -math.inf
        best_move = (0, 0)
        
        # Try all possible moves
        for row, col in self.get_empty_cells(board):
            # Make move
            board[row][col] = self.ai_symbol
            
            # Calculate move score
            move_score = self.minimax(board, 0, False)
            
            # Undo move
            board[row][col] = ''
            
            # Update best move if this is better
            if move_score > best_score:
                best_score = move_score
                best_move = (row, col)
        
        return best_move
    
    def get_game_status(self, board: List[List[str]]) -> dict:
        """
        Get comprehensive game status
        
        Returns:
            Dictionary with game state information
        """
        score = self.evaluate_board(board)
        is_full = self.is_board_full(board)
        
        if score == 10:
            return {
                'status': 'ai_wins',
                'winner': self.ai_symbol,
                'message': 'AI Wins!',
                'game_over': True
            }
        elif score == -10:
            return {
                'status': 'human_wins',
                'winner': self.human_symbol,
                'message': 'You Win!',
                'game_over': True
            }
        elif is_full:
            return {
                'status': 'draw',
                'winner': None,
                'message': "It's a Draw!",
                'game_over': True
            }
        else:
            return {
                'status': 'ongoing',
                'winner': None,
                'message': 'Game in progress',
                'game_over': False
            }
    
    def analyze_position(self, board: List[List[str]]) -> dict:
        """
        Analyze the current position and provide insights
        
        Returns:
            Dictionary with position analysis
        """
        empty_cells = self.get_empty_cells(board)
        game_status = self.get_game_status(board)
        
        analysis = {
            'empty_cells': len(empty_cells),
            'game_progress': (9 - len(empty_cells)) / 9 * 100,
            'game_status': game_status,
            'position_evaluation': self.evaluate_board(board)
        }
        
        # Add strategic insights
        if not game_status['game_over']:
            if len(empty_cells) == 9:
                analysis['insight'] = "Game just started. Center or corner moves are typically best."
            elif len(empty_cells) > 6:
                analysis['insight'] = "Early game. Focus on controlling the center and corners."
            elif len(empty_cells) > 3:
                analysis['insight'] = "Mid-game. Look for winning opportunities and block opponent threats."
            else:
                analysis['insight'] = "End-game. Every move is critical!"
        
        return analysis

# Utility functions for board operations
def create_empty_board() -> List[List[str]]:
    """Create a new empty 3x3 board"""
    return [['' for _ in range(3)] for _ in range(3)]

def copy_board(board: List[List[str]]) -> List[List[str]]:
    """Create a deep copy of the board"""
    return [row[:] for row in board]

def board_to_string(board: List[List[str]]) -> str:
    """Convert board to string representation for debugging"""
    result = ""
    for i, row in enumerate(board):
        for j, cell in enumerate(row):
            result += cell if cell else '·'
            if j < 2:
                result += " | "
        if i < 2:
            result += "\n---------\n"
    return result

def validate_move(board: List[List[str]], row: int, col: int) -> bool:
    """Validate if a move is legal"""
    if not (0 <= row <= 2 and 0 <= col <= 2):
        return False
    return board[row][col] == ''

def make_move(board: List[List[str]], row: int, col: int, symbol: str) -> bool:
    """Make a move on the board if valid"""
    if validate_move(board, row, col):
        board[row][col] = symbol
        return True
    return False
