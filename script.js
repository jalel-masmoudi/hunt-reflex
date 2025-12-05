// Forest Hunter Game - Pure JavaScript
// Same config as original, just hunting theme

// === CONFIG (No Hardcodes!) ===
const difficultySettings = {
    easy: { time: 30, duration: 2.5, spawnRate: 1500 },
    medium: { time: 20, duration: 1.8, spawnRate: 1200 },
    hard: { time: 10, duration: 1.2, spawnRate: 800 }
};

const animals = ['🦌', '🐇', '🦊', '🦅']; // Rotating hunting targets

// === GAME STATE (Single Source of Truth) ===
const gameState = {
    isRunning: false,
    score: 0,
    timeLeft: 30,
    difficulty: 'easy',
    timerId: null,
    spawnId: null,
    targetDuration: 2.5
};

// === DOM ELEMENTS ===
const elements = {
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    difficulty: document.getElementById('difficulty'),
    gameArea: document.getElementById('gameArea'),
    target: document.getElementById('target'),
    gameOver: document.getElementById('gameOver'),
    finalScore: document.getElementById('finalScoreValue'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    playAgain: document.getElementById('playAgain'),
    difficultySelect: document.getElementById('difficultySelect')
};

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', init);
elements.startBtn.addEventListener('click', startGame);
elements.resetBtn.addEventListener('click', resetGame);
elements.playAgain.addEventListener('click', resetGame);
elements.difficultySelect.addEventListener('change', updateDifficulty);
elements.gameArea.addEventListener('click', handleClick);

// === CORE FUNCTIONS ===

function init() {
    updateDisplay();
    console.log('🌲 Forest Hunter loaded! Ready to hunt.');
}

function startGame() {
    if (gameState.isRunning) return;
    
    gameState.isRunning = true;
    gameState.timeLeft = difficultySettings[gameState.difficulty].time;
    gameState.targetDuration = difficultySettings[gameState.difficulty].duration;
    
    elements.startBtn.textContent = 'Hunting...';
    elements.startBtn.disabled = true;
    
    gameState.timerId = setInterval(updateTimer, 1000);
    spawnTarget();
    gameState.spawnId = setInterval(spawnTarget, difficultySettings[gameState.difficulty].spawnRate);
    
    console.log(`🏹 Hunt started: ${gameState.difficulty}`);
}

function resetGame() {
    clearInterval(gameState.timerId);
    clearInterval(gameState.spawnId);
    elements.gameOver.style.display = 'none';
    
    gameState.isRunning = false;
    gameState.score = 0;
    gameState.timeLeft = difficultySettings[gameState.difficulty].time;
    
    elements.startBtn.textContent = 'Start Hunt 🏹';
    elements.startBtn.disabled = false;
    
    elements.target.style.display = 'none';
    updateDisplay();
    
    console.log('🔄 Game reset');
}

function updateDifficulty() {
    gameState.difficulty = elements.difficultySelect.value;
    elements.difficulty.textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
    console.log(`⚙️ Difficulty: ${gameState.difficulty}`);
}

function updateTimer() {
    gameState.timeLeft--;
    updateDisplay();
    
    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

function spawnTarget() {
    if (!gameState.isRunning) return;
    
    const target = elements.target;
    target.style.display = 'flex';
    
    // Random animal
    target.innerHTML = animals[Math.floor(Math.random() * animals.length)];
    
    // Random position
    const gameAreaRect = elements.gameArea.getBoundingClientRect();
    const maxX = gameAreaRect.width - 80;
    const maxY = gameAreaRect.height - 80;
    
    target.style.left = Math.random() * maxX + 'px';
    target.style.top = Math.random() * maxY + 'px';
    
    // Auto-despawn
    setTimeout(() => {
        if (target.classList.contains('hit')) return;
        target.style.display = 'none';
    }, gameState.targetDuration * 1000);
}

function handleClick(e) {
    if (!gameState.isRunning) return;
    
    const target = elements.target;
    const rect = elements.gameArea.getBoundingClientRect();
    
    // Check if click hit target (20px tolerance)
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left - rect.left + targetRect.width / 2;
    const targetY = targetRect.top - rect.top + targetRect.height / 2;
    
    const distance = Math.sqrt((clickX - targetX) ** 2 + (clickY - targetY) ** 2);
    
    if (distance < 40) { // Hit tolerance
        hitTarget();
    }
}

function hitTarget() {
    gameState.score += 10;
    elements.target.classList.add('hit');
    
    // Hit sound effect (visual feedback)
    elements.gameArea.style.animation = 'shake 0.1s ease-in-out';
    setTimeout(() => {
        elements.gameArea.style.animation = '';
        elements.target.style.display = 'none';
        elements.target.classList.remove('hit');
    }, 300);
    
    updateDisplay();
    spawnTarget(); // Chain spawn
    console.log(`🎯 Hit! Score: ${gameState.score}`);
}

function endGame() {
    gameState.isRunning = false;
    clearInterval(gameState.timerId);
    clearInterval(gameState.spawnId);
    
    elements.finalScore.textContent = gameState.score;
    elements.gameOver.style.display = 'block';
    
    elements.startBtn.textContent = 'Start Hunt 🏹';
    elements.startBtn.disabled = false;
    
    console.log(`🏆 Hunt ended! Final score: ${gameState.score}`);
}

function updateDisplay() {
    elements.score.textContent = gameState.score;
    elements.timer.textContent = gameState.timeLeft;
    elements.difficulty.textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
}

// Add shake animation to CSS (already included in style.css)
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
