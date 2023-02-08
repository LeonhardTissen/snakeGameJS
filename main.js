// Get the canvas from the body
const cvs = document.getElementById('snakeGameCanvas');
const ctx = cvs.getContext('2d');

// Snake body
const snake = [];
const head = [5, 5];

// Snake growth
let growth = 0;
const growth_per_apple = 5;

// Game values
let direction = 'ArrowRight';
let ongoing_game = true;
let score = 0;
const score_per_apple = 100;

// Visuals
const snake_color = '#0B0';
const snake_dead_color = '#AAA';
const apple_colors = ['#F22', '#FF0', '#0FF', '#F0F'];
function randomAppleColor() {
    return apple_colors[Math.floor(Math.random() * apple_colors.length)];
}

// Utility functions
function randomPosition() {
    const x = Math.floor(Math.random() * cvs.width);
    const y = Math.floor(Math.random() * cvs.height);
    return [x, y];
}

// Food pieces
const apples = [];
for (let i = 0; i < 100; i ++) {
    apples.push({
        position: randomPosition(),
        color: randomAppleColor()
    })
};

// Keyboard Inputs
const validDirections = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
document.body.onkeydown = function(event) {
    // Only register if it's in the valid inputs for moving the snake
    if (validDirections.includes(direction)) {
        direction = event.key;
    }
};

// This runs every frame
function animate() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    
    // Draw the body pieces
    if (ongoing_game) {
        ctx.fillStyle = snake_color;
    } else {
        ctx.fillStyle = snake_dead_color;
    };
    snake.forEach((bodypart) => {
        ctx.fillRect(bodypart[0], bodypart[1], 1, 1);

        if (bodypart[0] == head[0] && bodypart[1] == head[1]) {
            ongoing_game = false;
        };
    });

    // Draw the apples
    apples.forEach((apple) => {
        ctx.fillStyle = apple.color;
        ctx.fillRect(apple.position[0], apple.position[1], 1, 1);

        if (apple.position[0] == head[0] && apple.position[1] == head[1]) {
            // Change the apple position
            const random = randomPosition();
            apple.position[0] = random[0];
            apple.position[1] = random[1];

            // Let the snake grow
            growth += growth_per_apple;
            score += score_per_apple;
        };
    });

    // If there's currently growth happening, don't remove bodies and wait until growth is depleted
    if (growth > 0) {
        growth --;
    } else {
        snake.splice(0, 1);
    };

    if (ongoing_game) {
        // Draw the head
        ctx.fillStyle = snake_color;
        ctx.fillRect(head[0], head[1], 1, 1);

        // Spawn another body piece at the head
        snake.push([head[0], head[1]]);
    
        // Move the head into the direction
        switch (direction) {
            case 'ArrowRight':
                head[0] ++;
                break;
            case 'ArrowLeft':
                head[0] --;
                break;
            case 'ArrowUp':
                head[1] --;
                break;
            case 'ArrowDown':
                head[1] ++;
                break;
        };
        
        // Check if touching the outer edges
        if (head[0] < 0 || head[0] > cvs.width || head[1] < 0 || head[1] > cvs.height) {
            ongoing_game = false;
        };
    } else if (snake.length == 0) {
        // When all snake body pieces have disappeared, display score and reload the page to restart the game
        alert("You died! Your final score: " + score);
        location.reload();
    }
};

// Run the game at 24 FPS
setInterval(animate, 1000 / 24)