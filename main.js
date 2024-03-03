// Get the canvas from the body
const cvs = document.getElementById('snakeGameCanvas');
const ctx = cvs.getContext('2d');

// Snake body
const snake = [];
const head = {x: 5, y: 5};

// Snake growth
let growth = 0;
const growthPerApple = 5;

// Game values
let direction = 'right';
let ongoing_game = true;
let score = 0;
const scorePerApple = 100;
const fps = 24;

// Visuals
const color = {
    snake: {
        alive: '#0B0',
        dead: '#AAA'
    },
    apple: [
        '#F22', 
        '#FF0', 
        '#0FF', 
        '#F0F'
    ],
    background: '#333'
}

function randomAppleColor() {
    return choice(color.apple);
}

// Utility functions
function random(max) {
    return Math.floor(Math.random() * max);
}

function randomPosition() {
    const x = random(cvs.width);
    const y = random(cvs.height);
    return {x, y};
}

function isSamePosition(a, b) {
    return a.x === b.x && a.y === b.y;
}

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Food pieces
const apples = [];
const appleCount = 100;
for (let i = 0; i < appleCount; i ++) {
    apples.push({
        position: randomPosition(),
        color: randomAppleColor()
    })
};

// Keyboard Inputs
const directionMapping = {
    ArrowRight: 'right',
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowDown: 'down',
    a: 'left',
    d: 'right',
    w: 'up',
    s: 'down',
}

// Opposite directions
const oppositeDirections = {
    right: 'left',
    left: 'right',
    up: 'down',
    down: 'up',
}

document.addEventListener('keydown', (event) => {
    // Check if the key is a valid direction
    if (!Object.keys(directionMapping).includes(event.key)) return;

    const newDirection = directionMapping[event.key];

    // Prevent the snake from going into the opposite direction
    if (direction === oppositeDirections[newDirection]) return;

    // Change the direction
    direction = newDirection;
});

// This runs every frame
function animate() {
    // Draw the background
    ctx.fillStyle = color.background;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Draw the body pieces
    ctx.fillStyle = color.snake[ongoing_game ? 'alive' : 'dead'];

    snake.forEach((bodyPart) => {
        ctx.fillRect(bodyPart.x, bodyPart.y, 1, 1);

        // Check if the snake is touching itself
        if (isSamePosition(bodyPart, head)) {
            ongoing_game = false;
        };
    });

    // Draw the apples
    apples.forEach((apple) => {
        ctx.fillStyle = apple.color;
        
        ctx.fillRect(apple.position.x, apple.position.y, 1, 1);

        // Check if the snake is touching the apple
        if (isSamePosition(apple.position, head)) {
            // Change the apple position
            apple.position = randomPosition();

            // Let the snake grow
            growth += growthPerApple;
            score += scorePerApple;
        };
    });

    // If there's currently growth happening, don't remove bodies and wait until growth is depleted
    if (growth > 0) {
        growth --;
    } else {
        // Remove the tail
        snake.splice(0, 1);
    };

    if (ongoing_game) {
        // Draw the head
        ctx.fillStyle = color.snake.alive;
        ctx.fillRect(head.x, head.y, 1, 1);

        // Spawn another body piece at the head, clone it to prevent it from moving with the head
        snake.push(JSON.parse(JSON.stringify(head)));
    
        // Move the head into the direction
        switch (direction) {
            case 'right':
                head.x ++;
                break;
            case 'left':
                head.x --;
                break;
            case 'up':
                head.y --;
                break;
            case 'down':
                head.y ++;
                break;
        };
        
        // Check if touching the outer edges
        if (
            head.x < 0 || head.x > cvs.width || 
            head.y < 0 || head.y > cvs.height
        ) {
            ongoing_game = false;
        };
    } else if (snake.length === 0) {
        // When all snake body pieces have disappeared, display score and reload the page to restart the game
        alert("You died! Your final score: " + score);
        
        // Reset the game
        location.reload();
    }
};

// Run the game loop
setInterval(animate, 1000 / fps)
