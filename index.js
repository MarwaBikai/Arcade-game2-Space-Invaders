const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  alienPositions: [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    42,
    43,
    44,
    45,
    46,
    47, 
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    62,
    63,
    64,
    65,66,67,68,69,70,71,72,73,74,75,76,77
  ],
  
  gameOver: false  , score=0;
};

const setUpGame = (element) => {
  state.element = element;
  //query the age to insert my game
  //draw the game: grid etc
  drawGrid();

  //draw spaceship
  drawShip();
  //draw aliens
  drawAliens();
  //add instructions and the score
  drawScoreboard();
};
function drawGrid() {
  //create containing element
  const grid = document.createElement("div");
  grid.classList.add("grid");
  state.element.append(grid);
  //create a lot of cells -15x15 225cells
  for (let i = 0; i < state.numCells; i++) {
    //create cell
    //append cell to grid
    const cell = document.createElement("div");
     //append the cells to the elements and elements to the app
    grid.append(cell);
    //store cell in game state
    state.cells.push(cell);
  }
  
 
}

function drawShip() {
  state.cells[state.shipPosition].classList.add("spaceship");

  //find the current position of my ship
  //find the bottom row  , middle cell ( from game state ), add a big image
}

function drawAliens() {
  //adding the aliens to the grid , store positions for the aliens to the game state
  state.cells.forEach(( cell ,index) => {
    if (cell.classList.contains("alien")) {
      cell.classList.remove("alien");
    }
    //add image to the cell if index is in the set of alienPositions
    if (state.alienPositions.includes(index)) {
      cell.classList.add("alien");
    }
  });
}

function controlShip(event) {
  //if key is pressed left ? right ? space?
  if (state.gameOver) {
    return;
  }
  if (event.code === "ArrowLeft") {
    moveShip("left");
  } else if (event.code === "ArrowRight") {
    moveShip("right");
  } else if (event.code === "Space") {
   
    fire();
  }
}
function moveShip(direction) {
  //remove ship ( image) from it's current position
  state.cells[state.shipPosition].classList.remove("spaceship");

  if (direction === "left" && state.shipPosition % 20 !== 0) {  // 20 grids( cells ) in width of the big grid
    state.shipPosition--;
    console.log("moving left");
  } else if (direction === "right" && state.shipPosition % 20 !== 19) { // shipPosition % 20 == ( 20 minus 1 )
    state.shipPosition++;
    console.log("moving right");
  }

  //figure out the delta
  //add the ship (image) to new postition
  state.cells[state.shipPosition].classList.add("spaceship");
}

function fire() {
  //use interval run some code , after a specified time
  let interval;
  let laserPosition = state.shipPosition;
  interval = setInterval( () => {
    state.cells[laserPosition].classList.remove("laser");
    // remove laser image
    //laser starts at the ship position
    laserPosition -= 20 ;  // 20 cells on the width
    //decrease ( move up a row ) of the lase position
    if (laserPosition < 0) {
      //check if we are still in bounds !
      clearInterval(interval);
      return;
    }

    // if there's an alien , go BOOM !
    //clea te interval  , remove alien image , remove alien from alien positions , add the BOOM image , set a timeout to remove the BOOM
    if (state.alienPositions.includes(laserPosition)) {
      clearInterval(interval);
      state.alienPositions.splice(state.alienPositions.indexOf(laserPosition),
        1
      );
      state.cells.classList.remove("alien");
      state.cells.classList.add("BOOM");
      state.score++
      state.scoreElement.innerText = state.score
      setTimeout(() => {
        state.cells[laserPosition].classList.remove("BOOM");
      }, 200);
      return;
    }
    //add the laser image

    state.cells[laserPosition].classList.add("laser");
  }, 100);
}

function play() {
  //start moving the aliens
  let interval;
  let direction = "right";

  interval = setInterval(() => {
    let movement;
    if (direction === "right") {
      //if right at egde , increase position by 15 ,decrease 1
      if (atEdge("right")) {
        movement = 20 - 1;  // 20-1 movement of the aliens ( 20 cells on the width ) , when aliens are at the edge "right" it starts to go left 
        direction = "left";
      } else {
        //not at the edge , continue moving to the right 
        movement = 1;
      }
    } else if (direction === "left") {
      // left at edge , increase position by 15 increase 1
      if (atEdge("left")) {
        movement = 20 + 1;  // 20+1 movement of the aliens ( 20 cells on the width ) , when aliens are at the edge "left" it starts to go right 
        direction = "right";
      } else {
        //if left decrease position by 1
        movement = -1; //not at the edge , continue moving to the left
      }
    }
    //update the positions

    state.alienPositions = state.alienPositions.map(
      (position) => position + movement
    );

    //redraw aliens
    drawAliens();
    checkGameState(interval);
  }, 500); // more time , slower and better to be able to kill all aliens 

  //setup the ship controls
  window.addEventListener("keydown", controlShip);
}

function atEdge(side) {
  if (side === "left") {
    // are any aliens in the left corne

    return state.alienPositions.some((position) => position % 20 === 0);
  }
  if (side === "right") {
    // are any aliens in the right corner
    return state.alienPositions.some((position) => position % 20 === 19);
  }
}

function checkGameState(interval) {
  //has the aliens got to the bottom?
  if (state.alienPositions.length === 0) {
    // stop everything
    state.gameOver = true;
    //stop interval
    clearInterval(interval);

    drawMessage("HUMAN WINS!");
  } else if (
    state.alienPositions.some((position) => position >= state.shipPosition)
  ) {
    clearInterval(interval);
    state.gameOver = true;
    drawMessage("GAME OVER!");
    //make shio go BOOM
    //remove ship and explosion images
    state.cells[state.shipPosition].classList.remove("spaceship");
    state.cells[state.shipPosition].classList.add("BOOM");
  }

  //are aliens all DEAD?
}

function drawMessage(message) {
  //create message
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  const h1 = document.createElement("h1");
  messageElement.append(h1);

  //append to the app
  state.element.append(messageElement);
}
const drawScoreboard = () => {
  const heading = document.createElement("h1")
  heading.innerText = 'Space Invaders'
  const heading1 = document.createElement("h2");
  heading1.innerText = "Aliens got some help..."; // added a new title
  const paragraph1 = document.createElement("p")
  paragraph1.innerText = 'Press SPACE to shoot.'
  const paragraph2 = document.createElement("p")
  paragraph2.innerText = 'Press ← and → to move'
  const scoreboard = document.createElement('div')
  scoreboard.classList.add('scoreboard')
  const scoreElement = document.createElement('span')
  scoreElement.innerText = state.score
  const heading3 = document.createElement('h3')
  heading3.innerText = 'Score: '
  heading3.append(scoreElement)
  scoreboard.append(heading, heading1 ,paragraph1, paragraph2, heading3)

  state.scoreElement = scoreElement
  state.element.append(scoreboard)
}

const appElement = document.querySelector(".app");

setUpGame(appElement);

//play the game - start being to able to move the ship and aliends

play();
