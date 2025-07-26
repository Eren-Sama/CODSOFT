# XenoTic - Advanced Tic-Tac-Toe Game 🎮

**XenoTic** is a modern, web-based Tic-Tac-Toe game featuring an unbeatable AI powered by the Minimax algorithm with Alpha-Beta Pruning. Experience cutting-edge game theory in action with a beautiful, responsive UI.

## ✨ Features

### 🤖 Advanced AI
- **Minimax Algorithm** with Alpha-Beta Pruning for optimal performance
- **4 Difficulty Levels**: Easy, Medium, Hard, and Impossible
- **Unbeatable AI** on Impossible difficulty
- **Real-time Performance Analytics** showing nodes evaluated

### 🎨 Modern UI/UX
- **Responsive Design** optimized for all devices
- **Dark/Light Theme Toggle** with system preference detection
- **Smooth Animations** and hover effects
- **Accessibility Features** including keyboard navigation

### 🎯 Game Features
- **Hint System** for move suggestions
- **Real-time Statistics** tracking wins, losses, and draws
- **Keyboard Shortcuts** for quick gameplay
- **Game Analytics** with detailed performance metrics
- **Session Management** with automatic cleanup

### 🔧 Technical Excellence
- **Modular Architecture** with separate AI logic
- **RESTful API** design for seamless frontend-backend communication
- **Progressive Enhancement** with fallback support
- **Performance Optimized** with efficient algorithms

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Modern web browser with JavaScript enabled

### Installation

1. **Clone or Download** the XenoTic project to your local machine

2. **Navigate to the project directory**:
   ```bash
   cd XenoTic
   ```

3. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**:
   ```bash
   python app.py
   ```

6. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## 🎮 How to Play

### Basic Rules
- Click on any empty cell to make your move
- Get three symbols in a row (horizontal, vertical, or diagonal) to win
- The AI will respond immediately after your move
- First player is determined by symbol selection (X goes first)

### Controls
- **Mouse**: Click cells to make moves
- **Keyboard Shortcuts**:
  - `Ctrl+N` or `Cmd+N`: New Game
  - `Ctrl+R` or `Cmd+R`: Reset Game
  - `H`: Get Hint
  - `1-9`: Make move in corresponding cell
  - `Escape`: Close modals

### Difficulty Levels
- **Easy** 😊: AI makes random moves
- **Medium** 🤔: AI plays optimally 70% of the time
- **Hard** 😤: AI plays optimally 90% of the time
- **Impossible** 🤖: AI always plays the perfect move (unbeatable)

### Features
- **Hint Button**: Get suggestions for the best move
- **Theme Toggle**: Switch between light and dark modes
- **Statistics**: View detailed game analytics

## 🏗️ Project Structure

```
XenoTic/
├── app.py                 # Flask backend and API routes
├── minimax.py            # AI logic with Minimax algorithm
├── requirements.txt      # Python dependencies
├── README.md            # This file
├── templates/
│   └── index.html       # Main game interface
└── static/
    ├── css/
    │   └── style.css    # Modern CSS with theme support
    └── js/
        ├── game.js      # Game logic and API communication
        └── ui.js        # UI management and theme system
```

## 🔧 API Endpoints

### Game Management
- `POST /api/new-game` - Start a new game session
- `POST /api/reset-game` - Reset current game
- `GET /api/game-state` - Get current game state

### Gameplay
- `POST /api/make-move` - Make a player move
- `GET /api/hint` - Get move suggestion
- `POST /api/change-difficulty` - Change AI difficulty

### Statistics
- `GET /api/stats` - Get game statistics

## 🤖 AI Algorithm Details

### Minimax with Alpha-Beta Pruning
The AI uses the Minimax algorithm enhanced with Alpha-Beta Pruning for optimal performance:

```python
def minimax(board, depth, is_maximizing, alpha=-∞, beta=+∞):
    # Terminal state evaluation
    if game_over(board):
        return evaluate(board)
    
    if is_maximizing:
        max_eval = -∞
        for move in get_possible_moves(board):
            eval = minimax(make_move(board, move), depth+1, False, alpha, beta)
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break  # Alpha-Beta Pruning
        return max_eval
    else:
        # Similar logic for minimizing player
```

### Key Features
- **Perfect Play**: The AI never makes suboptimal moves on Impossible difficulty
- **Efficient Pruning**: Alpha-Beta pruning reduces search space by up to 90%
- **Depth-Based Scoring**: Prefers faster wins and delayed losses
- **Performance Tracking**: Real-time node evaluation counting

## 🎨 Customization

### Themes
The game supports custom themes through CSS variables. To create a new theme:

1. Define new color variables in `:root` or `[data-theme="your-theme"]`
2. Update the theme toggle logic in `ui.js`
3. Add theme selection to the UI

### Sounds
Audio effects are generated procedurally using the Web Audio API. To customize:

1. Modify the sound generation functions in `audio.js`
2. Adjust frequency, duration, and waveform parameters
3. Add new sound effects for different game events

### AI Behavior
Customize AI difficulty by modifying the `get_best_move` method in `minimax.py`:

```python
def get_best_move(self, board, difficulty='impossible'):
    if difficulty == 'custom':
        # Implement your custom AI logic here
        return custom_ai_logic(board)
    # ... existing logic
```

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment

#### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Using Docker
Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

#### Environment Variables
Set these environment variables for production:
- `FLASK_ENV=production`
- `SECRET_KEY=your-secret-key`

## 🧪 Testing

### Manual Testing
1. Test all difficulty levels
2. Verify theme switching works
3. Check responsive design on different devices
4. Test keyboard shortcuts
5. Verify audio functionality

### Game Logic Testing
The AI can be tested by playing games and verifying:
- Impossible difficulty never loses
- AI finds winning moves when available
- AI blocks opponent winning moves
- Performance metrics are accurate

## 🔒 Security Features

- **CSRF Protection**: Session-based security
- **Input Validation**: All moves validated server-side
- **Rate Limiting**: Prevents API abuse
- **Secure Sessions**: Encrypted session management

## 📱 Browser Compatibility

### Supported Browsers
- **Chrome** 80+ ✅
- **Firefox** 75+ ✅
- **Safari** 13+ ✅
- **Edge** 80+ ✅

### Required Features
- ES6 JavaScript support
- CSS Grid and Flexbox
- Local Storage

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Follow PEP 8 for Python code
- Use meaningful variable names
- Add comments for complex logic
- Maintain consistent indentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Minimax Algorithm**: Based on game theory principles
- **Alpha-Beta Pruning**: Optimization technique for tree search
- **Web Audio API**: For procedural sound generation
- **CSS Grid & Flexbox**: For responsive layout design

## 📞 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure all dependencies are installed correctly
3. Verify your browser supports required features
4. Try disabling browser extensions that might interfere

## 🔮 Future Enhancements

### Planned Features
- **Multiplayer Mode**: Online player vs player
- **Tournament System**: Bracket-style competitions
- **AI Training**: Machine learning improvements
- **Mobile App**: Native mobile versions
- **Custom Board Sizes**: 4x4, 5x5 variants

### Technical Improvements
- **WebSocket Support**: Real-time multiplayer
- **Progressive Web App**: Offline functionality
- **Database Integration**: Persistent statistics
- **Analytics Dashboard**: Advanced game insights

---

**XenoTic** - Where Human Intelligence Meets Artificial Intelligence in the Ultimate Tic-Tac-Toe Challenge! 🎮🤖
