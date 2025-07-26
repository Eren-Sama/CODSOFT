"""
XenoTic - Advanced Tic-Tac-Toe Game with Unbeatable AI
Flask backend with RESTful API for game operations
"""

from flask import Flask, render_template, request, jsonify, session
import json
import uuid
from datetime import datetime
import logging
from minimax import TicTacToeAI, create_empty_board, validate_move, make_move

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'xenotic_super_secret_key_2025'

# Game statistics storage (in production, use a database)
game_stats = {
    'total_games': 0,
    'human_wins': 0,
    'ai_wins': 0,
    'draws': 0,
    'total_moves': 0
}

class GameSession:
    """Manages individual game sessions"""
    
    def __init__(self, game_id: str, difficulty: str = 'impossible', human_symbol: str = 'X'):
        self.game_id = game_id
        self.board = create_empty_board()
        self.difficulty = difficulty
        self.human_symbol = human_symbol
        self.ai_symbol = 'O' if human_symbol == 'X' else 'X'
        # X always goes first in tic-tac-toe
        self.current_player = 'X'
        self.game_over = False
        self.winner = None
        self.moves_count = 0
        self.start_time = datetime.now()
        self.ai_engine = TicTacToeAI(ai_symbol=self.ai_symbol, human_symbol=human_symbol)
        
        logger.info(f"New game session created: {game_id}, Difficulty: {difficulty}")
    
    def make_human_move(self, row: int, col: int) -> dict:
        """Process human move and return game state"""
        if self.game_over:
            return {'success': False, 'error': 'Game is already over'}
        
        if self.current_player != self.human_symbol:
            return {'success': False, 'error': 'Not your turn'}
        
        if not validate_move(self.board, row, col):
            return {'success': False, 'error': 'Invalid move'}
        
        # Make human move
        make_move(self.board, row, col, self.human_symbol)
        self.moves_count += 1
        self.current_player = self.ai_symbol
        
        # Check game status after human move
        game_status = self.ai_engine.get_game_status(self.board)
        
        if game_status['game_over']:
            self.game_over = True
            self.winner = game_status['winner']
            self._update_game_stats(game_status['status'])
            
            return {
                'success': True,
                'board': self.board,
                'game_over': True,
                'winner': self.winner,
                'message': game_status['message'],
                'stats': self._get_session_stats()
            }
        
        return {
            'success': True,
            'board': self.board,
            'game_over': False,
            'current_player': self.current_player
        }
    
    def make_ai_move(self) -> dict:
        """Process AI move and return game state"""
        if self.game_over:
            return {'success': False, 'error': 'Game is already over'}
        
        if self.current_player != self.ai_symbol:
            return {'success': False, 'error': 'Not AI turn'}
        
        # Get AI move
        ai_row, ai_col = self.ai_engine.get_best_move(self.board, self.difficulty)
        
        # Make AI move
        make_move(self.board, ai_row, ai_col, self.ai_symbol)
        self.moves_count += 1
        self.current_player = self.human_symbol
        
        # Check game status after AI move
        game_status = self.ai_engine.get_game_status(self.board)
        
        if game_status['game_over']:
            self.game_over = True
            self.winner = game_status['winner']
            self._update_game_stats(game_status['status'])
        
        return {
            'success': True,
            'board': self.board,
            'ai_move': {'row': ai_row, 'col': ai_col},
            'game_over': game_status['game_over'],
            'winner': self.winner,
            'message': game_status['message'] if game_status['game_over'] else None,
            'current_player': self.current_player,
            'nodes_evaluated': self.ai_engine.nodes_evaluated,
            'stats': self._get_session_stats() if game_status['game_over'] else None
        }
    
    def _update_game_stats(self, status: str):
        """Update global game statistics"""
        global game_stats
        game_stats['total_games'] += 1
        game_stats['total_moves'] += self.moves_count
        
        if status == 'human_wins':
            game_stats['human_wins'] += 1
        elif status == 'ai_wins':
            game_stats['ai_wins'] += 1
        elif status == 'draw':
            game_stats['draws'] += 1
    
    def _get_session_stats(self) -> dict:
        """Get statistics for this game session"""
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        return {
            'moves_count': self.moves_count,
            'duration_seconds': round(duration, 2),
            'difficulty': self.difficulty,
            'nodes_evaluated': self.ai_engine.nodes_evaluated
        }
    
    def get_game_state(self) -> dict:
        """Get complete current game state"""
        game_status = self.ai_engine.get_game_status(self.board)
        analysis = self.ai_engine.analyze_position(self.board)
        
        return {
            'game_id': self.game_id,
            'board': self.board,
            'current_player': self.current_player,
            'human_symbol': self.human_symbol,
            'ai_symbol': self.ai_symbol,
            'difficulty': self.difficulty,
            'game_over': game_status['game_over'],
            'winner': self.winner,
            'moves_count': self.moves_count,
            'analysis': analysis
        }
    
    def reset_game(self):
        """Reset the game to initial state"""
        self.board = create_empty_board()
        # X always goes first in tic-tac-toe
        self.current_player = 'X'
        self.game_over = False
        self.winner = None
        self.moves_count = 0
        self.start_time = datetime.now()
        self.ai_engine = TicTacToeAI(ai_symbol=self.ai_symbol, human_symbol=self.human_symbol)
        
        logger.info(f"Game session reset: {self.game_id}")

# In-memory storage for game sessions (use Redis/database in production)
active_games = {}

@app.route('/')
def index():
    """Main game page"""
    return render_template('index.html')

@app.route('/api/new-game', methods=['POST'])
def new_game():
    """Create a new game session"""
    try:
        data = request.get_json() or {}
        
        # Generate unique game ID
        game_id = str(uuid.uuid4())
        
        # Get game parameters
        difficulty = data.get('difficulty', 'impossible')
        human_symbol = data.get('human_symbol', 'X')
        
        # Validate parameters
        valid_difficulties = ['easy', 'medium', 'hard', 'impossible']
        if difficulty not in valid_difficulties:
            difficulty = 'impossible'
        
        if human_symbol not in ['X', 'O']:
            human_symbol = 'X'
        
        # Create new game session
        game_session = GameSession(game_id, difficulty, human_symbol)
        active_games[game_id] = game_session
        
        # Store game ID in session
        session['game_id'] = game_id
        
        logger.info(f"New game created: {game_id}, Difficulty: {difficulty}, Human: {human_symbol}")
        
        # Determine message and whether AI goes first
        ai_goes_first = (human_symbol == 'O')
        message = 'AI goes first!' if ai_goes_first else 'You go first!'
        
        return jsonify({
            'success': True,
            'game_id': game_id,
            'game_state': game_session.get_game_state(),
            'ai_goes_first': ai_goes_first,
            'message': message
        })
        
    except Exception as e:
        logger.error(f"Error creating new game: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to create new game'}), 500

@app.route('/api/ai-first-move', methods=['POST'])
def ai_first_move():
    """Handle AI making the first move when human chooses O"""
    try:
        game_id = session.get('game_id')
        
        if not game_id or game_id not in active_games:
            return jsonify({'success': False, 'error': 'No active game session'}), 400
        
        game_session = active_games[game_id]
        
        # Verify that it's AI's turn and game just started
        if game_session.moves_count > 0:
            return jsonify({'success': False, 'error': 'Game already in progress'}), 400
        
        if game_session.current_player != game_session.ai_symbol:
            return jsonify({'success': False, 'error': 'Not AI turn'}), 400
        
        # Process AI move
        ai_result = game_session.make_ai_move()
        
        if not ai_result['success']:
            return jsonify(ai_result), 500
        
        logger.info(f"AI first move in game {game_id}: ({ai_result.get('ai_move', {})})")
        
        return jsonify(ai_result)
        
    except Exception as e:
        logger.error(f"Error processing AI first move: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to process AI first move'}), 500

@app.route('/api/make-move', methods=['POST'])
def make_move_endpoint():
    """Process human move and AI response"""
    try:
        data = request.get_json()
        game_id = session.get('game_id')
        
        if not game_id or game_id not in active_games:
            return jsonify({'success': False, 'error': 'No active game session'}), 400
        
        game_session = active_games[game_id]
        
        # Get move coordinates
        row = data.get('row')
        col = data.get('col')
        
        if row is None or col is None:
            return jsonify({'success': False, 'error': 'Missing move coordinates'}), 400
        
        # Validate coordinates
        if not (0 <= row <= 2 and 0 <= col <= 2):
            return jsonify({'success': False, 'error': 'Invalid move coordinates'}), 400
        
        # Process human move
        human_result = game_session.make_human_move(row, col)
        
        if not human_result['success']:
            return jsonify(human_result), 400
        
        # If game ended after human move, return result
        if human_result['game_over']:
            return jsonify(human_result)
        
        # Process AI move
        ai_result = game_session.make_ai_move()
        
        if not ai_result['success']:
            return jsonify(ai_result), 500
        
        logger.info(f"Move processed in game {game_id}: Human({row},{col}) -> AI({ai_result.get('ai_move', {})})")
        
        return jsonify(ai_result)
        
    except Exception as e:
        logger.error(f"Error processing move: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to process move'}), 500

@app.route('/api/game-state')
def get_game_state():
    """Get current game state"""
    try:
        game_id = session.get('game_id')
        
        if not game_id or game_id not in active_games:
            return jsonify({'success': False, 'error': 'No active game session'}), 400
        
        game_session = active_games[game_id]
        
        return jsonify({
            'success': True,
            'game_state': game_session.get_game_state()
        })
        
    except Exception as e:
        logger.error(f"Error getting game state: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to get game state'}), 500

@app.route('/api/reset-game', methods=['POST'])
def reset_game():
    """Reset current game"""
    try:
        game_id = session.get('game_id')
        
        if not game_id or game_id not in active_games:
            return jsonify({'success': False, 'error': 'No active game session'}), 400
        
        game_session = active_games[game_id]
        game_session.reset_game()
        
        return jsonify({
            'success': True,
            'game_state': game_session.get_game_state(),
            'message': 'Game reset! You go first.'
        })
        
    except Exception as e:
        logger.error(f"Error resetting game: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to reset game'}), 500

@app.route('/api/change-difficulty', methods=['POST'])
def change_difficulty():
    """Change AI difficulty"""
    try:
        data = request.get_json()
        game_id = session.get('game_id')
        
        if not game_id or game_id not in active_games:
            return jsonify({'success': False, 'error': 'No active game session'}), 400
        
        game_session = active_games[game_id]
        difficulty = data.get('difficulty', 'impossible')
        
        # Validate difficulty
        valid_difficulties = ['easy', 'medium', 'hard', 'impossible']
        if difficulty not in valid_difficulties:
            return jsonify({'success': False, 'error': 'Invalid difficulty level'}), 400
        
        # Update difficulty and reset game
        game_session.difficulty = difficulty
        game_session.reset_game()
        
        return jsonify({
            'success': True,
            'difficulty': difficulty,
            'game_state': game_session.get_game_state(),
            'message': f'Difficulty changed to {difficulty.title()}! Game reset.'
        })
        
    except Exception as e:
        logger.error(f"Error changing difficulty: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to change difficulty'}), 500

@app.route('/api/stats')
def get_stats():
    """Get game statistics"""
    try:
        global game_stats
        
        # Calculate win rates
        total_games = game_stats['total_games']
        if total_games > 0:
            human_win_rate = (game_stats['human_wins'] / total_games) * 100
            ai_win_rate = (game_stats['ai_wins'] / total_games) * 100
            draw_rate = (game_stats['draws'] / total_games) * 100
            avg_moves = game_stats['total_moves'] / total_games
        else:
            human_win_rate = ai_win_rate = draw_rate = avg_moves = 0
        
        stats_data = {
            'total_games': total_games,
            'human_wins': game_stats['human_wins'],
            'ai_wins': game_stats['ai_wins'],
            'draws': game_stats['draws'],
            'human_win_rate': round(human_win_rate, 1),
            'ai_win_rate': round(ai_win_rate, 1),
            'draw_rate': round(draw_rate, 1),
            'average_moves_per_game': round(avg_moves, 1),
            'active_games': len(active_games)
        }
        
        return jsonify({
            'success': True,
            'stats': stats_data
        })
        
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to get statistics'}), 500

# Cleanup inactive games periodically (simple implementation)
@app.before_request
def cleanup_old_games():
    """Remove old inactive game sessions"""
    if len(active_games) > 100:  # Simple cleanup when too many games
        # Remove oldest games (in production, use proper TTL/Redis)
        old_games = list(active_games.keys())[:50]
        for game_id in old_games:
            if game_id in active_games:
                del active_games[game_id]
        logger.info(f"Cleaned up {len(old_games)} old game sessions")

if __name__ == '__main__':
    logger.info("🎮 Starting XenoTic - Advanced Tic-Tac-Toe Game")
    logger.info("🤖 AI powered by Minimax with Alpha-Beta Pruning")
    logger.info("🚀 Ready to play at http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
