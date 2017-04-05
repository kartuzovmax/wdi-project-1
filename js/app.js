/*

Shades.
Developed by Maxim Kartuzov, 2017.
WDI-ldn-26 Project 1

Put bricks of same color on top of each other to merge them into a single brick.
Make a row of bricks of same color to dismiss the row and get points.
Game ends once a brick reaches the top.

*/

$(() => {

  // Arrow key listeners
  $(document).on('keydown', function (e) {
      // use e.which
    if (e.which === 37) {
      if (brickNotMovingDown) {
        moveBrickToLeft();
      }
    } else if (e.which === 39) {
      if (brickNotMovingDown) {
        moveBrickToRight();
      }
    } else if (e.which === 40) {
      moveBrickDown();
    } else if (e.which === 13) {
       // Start the game
      restartTheGame();
    } else if (e.which === 32) {
      $currentBrick.stop();
      $currentBrick.remove();
      restartTheGame();
    }
  });
});

var score = 0, currentColumn = 0;
var isAnimationRunning = false, shouldRemoveBrick = true, shouldCreateNewBrick = true, brickNotMovingDown = true, isNewBrickBeingFormed = true;
var logicArray = [];

const pointsArray = [1,2,4,8,16];
const shadesArray = ['#caf7d7','#85eea3','#43e36f','#26b34a','#125925'];


// Creating a future brick blueprint
const motherBrick = {
  color: shadesArray[0],
  points: 1
};
var $currentBrick = {
  color: motherBrick.color,
  points: 1
};

function restartTheGame() {

  // resetting all the flags
  isAnimationRunning = false;
  shouldRemoveBrick = true;
  shouldCreateNewBrick = true;
  brickNotMovingDown = true;
  isNewBrickBeingFormed = true;

  logicArray = [ // board 4x8
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0
  ]; // reseting logic

  score = 0; // reseting score
  const $scoreLabel = $('#score');
  $scoreLabel.html(score);

  document.getElementsByClassName('brick').remove(); // removing all bricks
  addBrickWithAnimation(); // start the game
}

function canLegallyMoveBrickLeft() {

  const tempArray = returnColumnArray(currentColumn+1); // checking the column on the right
  let collumnHeight = 400;
  // Calculating the amount of space taken by other blocks in next collumn
  for (let i = 0; i < tempArray.length; i++) {
    if(logicArray[tempArray[i]] !== 0) {
      collumnHeight -= 50;
    }
  }
  console.log('Next collumnHeight is ' + collumnHeight);
  if ($currentBrick.position().top + 50 >= collumnHeight) {
    // Can't move left
    return false;
  } else {
    return true;
  }
}

function canLegallyMoveBrickRight() {

  const tempArray = returnColumnArray(currentColumn-1); // checking the column on the right
  let collumnHeight = 400;
  // Calculating the amount of space taken by other blocks in next collumn
  for (let i = 0; i < tempArray.length; i++) {
    if(logicArray[tempArray[i]] !== 0) {
      collumnHeight -= 50;
    }
  }
  console.log('Next collumnHeight is ' + collumnHeight);
  if ($currentBrick.position().top + 50 >= collumnHeight) {
    // Can't move left
    return false;
  } else {
    return true;
  }
}

function moveBrickToLeft() {

  if(currentColumn===3 || isNewBrickBeingFormed || !canLegallyMoveBrickLeft()) return; // can't go left any further

  currentColumn++;
  $currentBrick.stop(true); // canceling current animation
  $currentBrick.css({marginLeft: '-=100px'}); // moving brick one cell left

  // Calculating when to stop animation
  var tempArray = returnColumnArray(currentColumn);
  var freeSpace = calculateDistanceToClosestBrick(tempArray); // holds distance for brick to travel
  var fallTime = calculateFallTimeBasedOnDistance(freeSpace); // holds time for brick to achieve the distance

  // Running a new animation

  $currentBrick.animate({
    top: freeSpace
  }, fallTime,'linear', function() {
    // Animation completed.
    isAnimationRunning = false;
    console.log('animation completed after move');
    if(placeTheBrick()) { // if false, it is Game Over
      if(shouldRemoveBrick) {
        $currentBrick.remove(); // Brick was placed, removing its copy
      }
      if (shouldCreateNewBrick) {
        addBrickWithAnimation(); // Adding a new brick!
      }
    } else {
      $currentBrick.remove(); // removing copy
      restartTheGame(); // restart the game
    }
  });
}

function moveBrickToRight() {

  if(currentColumn===0 || isNewBrickBeingFormed || !canLegallyMoveBrickRight()) return; // cen't go right

  currentColumn--;
  $currentBrick.stop(true); // canceling current animation
  $currentBrick.css({marginLeft: '+=100px'});

  // Calculating when to stop animation
  var tempArray = returnColumnArray(currentColumn);
  var freeSpace = calculateDistanceToClosestBrick(tempArray); // holds distance for brick to travel
  var fallTime = calculateFallTimeBasedOnDistance(freeSpace); // holds time for brick to achieve the distance

  // Running a new animation
  $currentBrick.animate({
    top: freeSpace
  }, fallTime,'linear', function() {
    // Animation completed.
    isAnimationRunning = false;
    console.log('animation completed after move');
    if(placeTheBrick()) { // if false, it is Game Over
      if(shouldRemoveBrick) {
        $currentBrick.remove(); // Brick was placed, removing its copy
      } else {
        console.log('Not allowed to remove brick');
      }
      if (shouldCreateNewBrick) {
        addBrickWithAnimation(); // Adding a new brick!
        console.log('Not allowed to make a new brick');
      }
    } else {
      $currentBrick.remove(); // removing copy
      restartTheGame(); // restart the game
    }
  });
}

function moveBrickDown() {

  if(isAnimationRunning === false || isNewBrickBeingFormed) return;
  $currentBrick.stop(true);
  brickNotMovingDown = false;
  isAnimationRunning = false;
  var tempArray = returnColumnArray(currentColumn);
  var freeSpace = calculateDistanceToClosestBrick(tempArray); // holds distance for brick to travel

  $currentBrick.animate({
    top: freeSpace
  }, 80,'linear', function() {
    // Animation completed.
    console.log('animation completed after move down');
    brickNotMovingDown = true;

    if(placeTheBrick()) { // if false, it is Game Over
      if(shouldRemoveBrick) {
        $currentBrick.remove(); // Brick was placed, removing its copy
      } else {
        console.log('Not allowed to remove brick');
      }
      if (shouldCreateNewBrick) {
        addBrickWithAnimation(); // Adding a new brick!
        console.log('Not allowed to make a new brick');
      }
    } else {
      $currentBrick.remove(); // removing copy
      restartTheGame(); // restart the game
    }
  });
}

function calculateDistanceToClosestBrick(tempArray) {

  //Need to calculate when to stop in new animation
  console.log($currentBrick.position().top);

  // Finding the cell which we will place the brick
  for (let i = tempArray.length-2; i > -1; i--) {

    if (logicArray[tempArray[i]] !== 0) {

      // There is brick here, putting new brick on top
      console.log('Current brick position: ' + $currentBrick.position().top);
      const brickID = `#${tempArray[i]}`;
      const $nextBrick = $(brickID);
      console.log('Next brick position: ' + $nextBrick.position().top);
      console.log(brickID);
      return $nextBrick.position().top - 50.0;
    }
  }
  // No bricks below, putting new brick on the lowest row
  return 350;
}

function calculateFallTimeBasedOnDistance(dist) {

  var distanceBetweenBricks = dist - $currentBrick.position().top;
  if (distanceBetweenBricks < 50.0) {
    return distanceBetweenBricks * 20;
  } else {
    return ((dist - $currentBrick.position().top) / 50) * 1000;
  }
}


// This function generates a future brick blueprint
function generateNewMotherBrick() {

  const min = Math.ceil(0);
  const max = Math.floor(3);
  const randIndex = Math.floor(Math.random() * (max - min)) + min;

  // Different colors stand for different value
  switch(randIndex) {
    case 0: motherBrick.points = 1; break;
    case 1: motherBrick.points = 2; break;
    case 2: motherBrick.points = 4; break;
    case 3: motherBrick.points = 8; break;
    case 4: motherBrick.points = 16; break;
    default: motherBrick.points = 0; break;
  }
  // Setting the color
  motherBrick.color = shadesArray[randIndex];
  $('.motherBrick').animate({
    backgroundColor: motherBrick.color
  }, 0);
}

function createNewBrickInColumn() {

  generateNewMotherBrick(); // Generating a blue print for the new brick

  var $newBrick = $(document.createElement('div'));
  $newBrick.attr('class', 'newBrick');
  $newBrick.attr('id', '666');
  $newBrick.css('background-color', motherBrick.color);
  $newBrick.css({top: 0, left: 0, position: 'relative'});
  $newBrick.css('width', 400);
  $newBrick.css('height', 50);

  return $newBrick;
}

function addBrickWithAnimation() {

  //generateNewMotherBrick(); // Making a blueprint for the brick
  isNewBrickBeingFormed = true;
  currentColumn = Math.floor(Math.random() * 4);
  $currentBrick = createNewBrickInColumn(currentColumn);
  let startDistance = 0;
  switch (currentColumn) {
    case 0: startDistance = 300; break;
    case 1: startDistance = 200; break;
    case 2: startDistance = 100; break;
    case 3: startDistance = 0; break;
  }
  const $spawn = $('.spawn');
  const $board = $('.board');
  console.log('Current brick position', $currentBrick.position().left);
  //console.log('Current spawn position', $spawn.position().left);
  $spawn.append($currentBrick);

  $currentBrick.animate({
    width: '100px',
    height: '50px',
    left: startDistance,
    backgroundColor: motherBrick.color
  }, 500,'linear', addBrick);

  function addBrick() {

    isNewBrickBeingFormed = false;
    console.log('should push brick');
    $currentBrick.css({top: -50, left: startDistance, position: 'relative'});
    $board.append($currentBrick);

    // Calculating when to stop animation
    var tempArray = returnColumnArray(currentColumn);
    var freeSpace = 0; // holds distance for brick to travel
    var fallTime = 0; // holds time for brick to achieve the distance

    // calculating distance and time
    for (let i = tempArray.length-2; i > -1; i--) {

      if (logicArray[tempArray[i]] === 0) {
        freeSpace += 50;
        fallTime += 800;
      } else {
        break;
      }
    }
    console.log('Free space is ' + freeSpace);
    //$newBrick.css({top: 0, left: 0, position: 'relative'});

    isAnimationRunning = true;
    $currentBrick.animate({
      top: freeSpace
    }, fallTime,'linear', function() {
      // Animation completed.
      isAnimationRunning = false;
      console.log('animation completed');
      if(placeTheBrick()) { // if false, it is Game Over
        if(shouldRemoveBrick) {
          $currentBrick.remove(); // Brick was placed, removing its copy
        } else {
          console.log('Not allowed to remove brick');
        }
        if (shouldCreateNewBrick) {
          addBrickWithAnimation(); // Adding a new brick!
          console.log('Not allowed to make a new brick');
        }// Adding a new brick!
      } else {
        $currentBrick.remove(); // removing copy
        restartTheGame(); // restart the game
      }
    });

  }
}

  // This function returns correct brick color based on its points
  function returnColorForPoints(pts) {
    for (const i in pointsArray) {
      if(pointsArray[i] === pts) {
        return shadesArray[i];
      }
    }
    return shadesArray[4];
  }

  // This function creates a new brick
  function createBrick(idValue, brickColor) {

    // Creating a new brick
    var newBrick = document.createElement('div');
    newBrick.className = 'brick';
    newBrick.id = idValue;
    newBrick.innerHTML = '';
    newBrick.style.backgroundColor = brickColor;
    return newBrick;
  }

function combineBricks(tempArray,i) {

  function mergeBricks(i) {

    console.log('Merging...');
    shouldRemoveBrick = false;
    shouldCreateNewBrick = false;
    isAnimationRunning = false;
    isNewBrickBeingFormed = true;

    let brickPoints = logicArray[tempArray[i-1]];
    if (brickPoints < 16) {
      // Maximum value is not reached, can combine bricks
      brickPoints = brickPoints * 2; // duplicating the points!
      score += brickPoints; // adding score
      logicArray[tempArray[i]] = 0; // clearing new brick
      logicArray[tempArray[i-1]] = brickPoints;

      if(document.getElementById(tempArray[i])) {
        document.getElementById(tempArray[i]).remove();
      }
      // Animating the merging effect
      $currentBrick.animate({
        top: '+=50px',
        backgroundColor: returnColorForPoints(brickPoints)
      }, 300, 'linear');
      // getting a darker shade
      $(document.getElementById(tempArray[i-1])).animate({
        backgroundColor: returnColorForPoints(brickPoints)
      }, 350, 'linear', function() {


        i--;
        // merging bricks untill it is not possible
        if (i > 0 && logicArray[tempArray[i]] === logicArray[tempArray[i-1]] && logicArray[tempArray[i]] !== 16) {
          mergeBricks(i);
        } else {
          // No more merging. Refreshing some info...

          // Checking if we can remove the row to free up space
          removeRowIfNeeded();
          // Updating score label
          const $scoreLabel = $('#score');
          $scoreLabel.text(score);
          $currentBrick.remove();
          shouldRemoveBrick = true;
          shouldCreateNewBrick = true;
          isAnimationRunning = false;
          addBrickWithAnimation();
        }
      });
    }
  }
  // Call the function once if it is possible to merge the bricks
  if (i > 0 && logicArray[tempArray[i]] === logicArray[tempArray[i-1]] && logicArray[tempArray[i]] !== 16) {
    mergeBricks(i);
  }
}


function returnColumnArray(col) {
  var tempArray = [];
  for (var i = 0; i < document.getElementsByClassName('cell').length; i++) {
    if(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')) % 4 === col) {
      // console.log(document.getElementsByClassName('cell')[i].getAttribute('value'));
      tempArray.push(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')));
    }
  }
  tempArray = tempArray.reverse();
  return tempArray;
}
  function placeTheBrick() {

    const tempArray = returnColumnArray(currentColumn);

    // creating a Game Over flag
    var isGameOver = true;

    // Checking if we can place another brick, if YES, do so, otherwise we call Game Over
    for (let i = 0; i < tempArray.length; i++) {

        // Checking if we can combine bricks
        if (i !== 0 && (motherBrick.points === logicArray[tempArray[i-1]] && logicArray[tempArray[i]] === 0) && logicArray[tempArray[i-1]] !== 16) {

          isGameOver = false;
          //let k = i;
          logicArray[tempArray[i]] = motherBrick.points;
          combineBricks(tempArray,i);

          break; // exiting the loop
        } else {

          if(logicArray[tempArray[i]] === 0) {

            isGameOver = false; // We have place for another brick!
            logicArray[tempArray[i]] = motherBrick.points; // Setting correct points for current brick
            // Placing the brick
            logicArray[tempArray[i]] = motherBrick.points;
            score += 2; // Adding up score
            // Getting the correct cell
            const reversedIndex = (logicArray.length-1)-tempArray[i];
            var cell = document.getElementsByClassName('cell')[reversedIndex];
            // Placing the new brick
            cell.insertBefore(createBrick(cell.getAttribute('value'),motherBrick.color), cell.firstChild);

            break; // exiting the loop
          }
        }
    }

    // Checking if we can remove the row to free up space
    removeRowIfNeeded();

    if (isGameOver) {
      setTimeout(gameOver,2000);
      return gameOver();
    }

    // Updating score label
    const $scoreLabel = $('#score');
    $scoreLabel.text(score);

    return true;
}

function removeRowIfNeeded() {
  for (let i = 0; i < logicArray.length; i+=4) {

    // Cheking if all elements in the row are same
    if(logicArray[i] !== 0 && (logicArray[i] === logicArray[i+1] &&
       logicArray[i] === logicArray[i+2] &&
       logicArray[i] === logicArray[i+3])) {

      console.log('Removing row');
      score = score + logicArray[i] * 4; // Adding up score
      // Shifting logicArray
      logicArray.splice(i,4);
      // Adding new empty row on top
      logicArray.push(0,0,0,0);
      redrawBricks(); // creating new board
    }
  }
}

// This function is called when row is removed so it could redraw the board according to a logicArray
function redrawBricks() {
  document.getElementsByClassName('brick').remove();

  for (let i = 0; i < logicArray.length; i++) {

    if (logicArray[i] !== 0) {
      const reversedIndex = (logicArray.length-1)-i;
      var cell = document.getElementsByClassName('cell')[reversedIndex];
      // Placing the new brick
      cell.insertBefore(createBrick(cell.getAttribute('value'),returnColorForPoints(logicArray[i])), cell.firstChild);
    }
  }
  // After board redraw, it could be that some bricks could be combined, so let's check for that
  for (let remainder = 0; remainder < 4; remainder++) {
    let tempArray = []; // this represents a collumn
    // Populating tempArray with correct values to determine a row
    for (var i = 0; i < document.getElementsByClassName('cell').length; i++) {
      if(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')) % 4 === remainder) {
        tempArray.push(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')));
      }
    }
    tempArray = tempArray.reverse(); // it sorts the tempArray in correct order
    for (let i = 0; i < tempArray.length; i++) {

      if (i !== 0 && (logicArray[tempArray[i]] === logicArray[tempArray[i-1]]) /*&& logicArray[tempArray[i]] === 0)*/ && logicArray[tempArray[i-1]] !== 16) {

        console.log(tempArray);
        combineBricks(tempArray,i);
      }
    }

  }
}

// This function is called when no more space for new bricks are left
function gameOver() {
  document.getElementById('score').innerHTML = `Game Over! Score: ${score}`;
  return false; // this will trigger restart of the game
}

// Functions to delete a child node. Source: http://stackoverflow.com/questions/3387427/remove-element-by-id
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};
