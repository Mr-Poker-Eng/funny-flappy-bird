// Get the audio element
const backgroundMusic = document.getElementById("backgroundMusic");

// Control the volume (optional)
backgroundMusic.volume = 0.5; // Adjust volume between 0.0 and 1.0

// Control the loop
backgroundMusic.loop = true; // The music will keep playing in a loop

// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Variables
let frames = 0;
let score = 0;
let pipes = [];
let gameSpeed = 2;
let isGameRunning = false;

// Load Images
const images = {};
images.background = new Image();
images.background.src = "image/background.png"; // Canvas background image

images.bird = new Image();
images.bird.src = "image/bird.png"; // Bird image

images.pipe = new Image();
images.pipe.src = "image/pipe.png"; // Pipe image

// Bird Object
const bird = {
  x: 150,
  y: 150,
  width: 55,
  height: 70,
  gravity: 0.25,
  lift: -6,
  velocity: 0,
  draw() {
    ctx.drawImage(images.bird, this.x, this.y, this.width, this.height);
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Prevent bird from falling through the floor
    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocity = 0;
      gameOver();
    }

    // Prevent bird from going above the canvas
    if (this.y <= 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  flap() {
    this.velocity = this.lift;
  },
};

// Pipe Class
class Pipe {
  constructor() {
    this.top = (Math.random() * canvas.height) / 2 + 50;
    this.bottom = canvas.height - this.top - 200;
    this.x = canvas.width;
    this.width = 180;
    this.scored = false;
  }

  draw() {
    ctx.drawImage(images.pipe, this.x, 0, this.width, this.top);
    ctx.drawImage(
      images.pipe,
      this.x,
      canvas.height - this.bottom,
      this.width,
      this.bottom
    );
  }

  update() {
    this.x -= gameSpeed;

    // Score update
    if (!this.scored && this.x + this.width < bird.x) {
      score++;
      this.scored = true;
      document.getElementById("scoreboard").innerText = score;
    }

    // Remove pipes off-screen
    if (this.x + this.width < 0) {
      pipes.shift();
    }

    // Collision detection
    if (
      (bird.x < this.x + this.width &&
        bird.x + bird.width > this.x &&
        bird.y < this.top) ||
      (bird.x < this.x + this.width &&
        bird.x + bird.height > canvas.height - this.bottom)
    ) {
      gameOver();
    }
  }
}

// Background
const background = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  draw() {
    ctx.drawImage(images.background, this.x1, this.y, this.width, this.height);
    ctx.drawImage(images.background, this.x2, this.y, this.width, this.height);
  },
  update() {
    this.x1 -= gameSpeed / 2;
    this.x2 -= gameSpeed / 2;

    if (this.x1 <= -this.width) {
      this.x1 = this.x2 + this.width;
    }
    if (this.x2 <= -this.width) {
      this.x2 = this.x1 + this.width;
    }
  },
};

// Game Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (isGameRunning) {
      bird.flap();
    }
  }
});

// Start and Retry Buttons
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("retryButton").addEventListener("click", startGame);

// Game Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  background.draw();
  background.update();

  bird.draw();
  bird.update();

  // Handle Pipes
  const pipeSpacing = 220;

  if (frames % pipeSpacing === 0) {
    pipes.push(new Pipe());
  }

  pipes.forEach((pipe) => {
    pipe.draw();
    pipe.update();
  });

  frames++;
  if (isGameRunning) {
    requestAnimationFrame(animate);
  }
}

// Start Game Function
function startGame() {
  // Hide overlays
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";

  // Initialize game
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frames = 0;

  // Reset score and update scoreboard
  score = 0;
  document.getElementById("scoreboard").innerText = score;

  // Play background music
  backgroundMusic.play();

  isGameRunning = true;
  animate();
}

// Game Over Function
function gameOver() {
  // Pause background music
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0; // Optional: reset music to the beginning

  isGameRunning = false;
  document.getElementById("finalScore").innerText = `Score: ${score}`;
  document.getElementById("gameOverScreen").style.display = "block";
}
