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
      // $currentBrick.remove();
      // restartTheGame();
    }
  });

  playMusic();

  $('#audioSwitcher').on('click', function() {

    if(isMusicOn) {
      isMusicOn = false;
      console.log('Music off');
      $('#audioSwitcher').attr('src', 'audioOff.png');
      stopMusic();
    } else {
      isMusicOn = true;
      console.log('Music on');
      $('#audioSwitcher').attr('src', 'audioOn.png');
      playMusic();
    }
  });
});

var score = 0, currentColumn = 0;
var isAnimationRunning = false, shouldRemoveBrick = true, shouldCreateNewBrick = true, brickNotMovingDown = true, isNewBrickBeingFormed = true, isMusicOn = true;
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

  // if ($currentBrick) {
  //   $currentBrick.stop();
  //   $currentBrick.remove();
  // }

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
  isAnimationRunning = true;
  $currentBrick.animate({
    top: freeSpace
  }, fallTime,'linear', function() {
    // Animation completed.
    isAnimationRunning = false;
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
  isAnimationRunning = true;
  $currentBrick.animate({
    top: freeSpace
  }, fallTime,'linear', function() {
    // Animation completed.
    isAnimationRunning = false;
    if(placeTheBrick()) { // if false, it is Game Over
      if(shouldRemoveBrick) {
        $currentBrick.remove(); // Brick was placed, removing its copy
      }
      if (shouldCreateNewBrick) {
        addBrickWithAnimation(); // Adding a new brick!
      }
    } else {
      $currentBrick.remove(); // removing copy
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
    brickNotMovingDown = true;

    if(placeTheBrick()) { // if false, it is Game Over
      if(shouldRemoveBrick) {
        $currentBrick.remove(); // Brick was placed, removing its copy
      }
      if (shouldCreateNewBrick) {
        addBrickWithAnimation(); // Adding a new brick!
      }
    } else {
      $currentBrick.remove(); // removing copy
    }
  });
}

function calculateDistanceToClosestBrick(tempArray) {
  for (let i = tempArray.length-2; i > -1; i--) {
    if (logicArray[tempArray[i]] !== 0) {
      const brickID = `#${tempArray[i]}`;
      const $nextBrick = $(brickID);
      return $nextBrick.position().top - 50.0;
    }
  }
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

  // Spawning a brick
  $spawn.append($currentBrick);

  $currentBrick.animate({
    width: '100px',
    height: '50px',
    left: startDistance,
    backgroundColor: motherBrick.color
  }, 500,'linear', addBrick);

  // Adding a brick to board
  function addBrick() {

    isNewBrickBeingFormed = false;
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
    //$newBrick.css({top: 0, left: 0, position: 'relative'});

    isAnimationRunning = true;
    $currentBrick.animate({
      top: freeSpace
    }, fallTime,'linear', function() {
      // Animation completed.
      isAnimationRunning = false;
      if(placeTheBrick()) { // if false, it is Game Over
        if(shouldRemoveBrick) {
          $currentBrick.remove(); // Brick was placed, removing its copy
        }
        if (shouldCreateNewBrick) {
          addBrickWithAnimation(); // Adding a new brick!
        }// Adding a new brick!
      } else {
        $currentBrick.remove(); // removing copy
        // Game Over
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

function combineBricks(tempArray,indexOfBrick) {

  let numberOfBricksMerged = 0; // needed to call correct sound
  function mergeBricks(indexOfBrick) {

    shouldRemoveBrick = false;
    shouldCreateNewBrick = false;
    isAnimationRunning = false;
    isNewBrickBeingFormed = true;

    let brickPoints = logicArray[tempArray[indexOfBrick-1]];
    if (brickPoints < 16 && brickPoints !== 0) {
      console.log('Merging...');
      // Maximum value is not reached, can combine bricks
      brickPoints = brickPoints * 2; // duplicating the points!
      score += brickPoints; // adding score
      logicArray[tempArray[indexOfBrick]] = 0; // clearing new brick
      logicArray[tempArray[indexOfBrick-1]] = brickPoints;
      numberOfBricksMerged++;
      playSound(numberOfBricksMerged);

      if(document.getElementById(tempArray[indexOfBrick])) {
        document.getElementById(tempArray[indexOfBrick]).remove();
      }
      // Animating the merging effect
      $currentBrick.animate({
        top: '+=50px',
        backgroundColor: returnColorForPoints(brickPoints)
      }, 250, 'linear');
      // getting a darker shade
      $(document.getElementById(tempArray[indexOfBrick-1])).animate({
        backgroundColor: returnColorForPoints(brickPoints)
      }, 250, 'linear', function() {

        // Animation is over
        indexOfBrick--;
        // merging bricks untill it is not possible
        if (indexOfBrick > 0 && logicArray[tempArray[indexOfBrick]] === logicArray[tempArray[indexOfBrick-1]] && logicArray[tempArray[indexOfBrick]] !== 16) {
          mergeBricks(indexOfBrick);
        } else {
          // No more merging. Refreshing some info...

          // Checking if we can remove the row to free up space
          console.log('No more merging, removing row if needed');
          // Updating score label
          const $scoreLabel = $('#score');
          $scoreLabel.text(score);
          $currentBrick.remove();
          shouldRemoveBrick = true;
          shouldCreateNewBrick = true;
          isAnimationRunning = false;
          removeRowIfNeeded();
          //addBrickWithAnimation();
        }
      });

    }
  }
  // Call the function once if it is possible to merge the bricks
  if (indexOfBrick > 0 && logicArray[tempArray[indexOfBrick]] === logicArray[tempArray[indexOfBrick-1]] && logicArray[tempArray[indexOfBrick]] !== 16) {
    mergeBricks(indexOfBrick);
  } else {
    console.log('Stuck');
    // Updating score label
    const $scoreLabel = $('#score');
    $scoreLabel.text(score);
    $currentBrick.remove();
    shouldRemoveBrick = true;
    shouldCreateNewBrick = true;
    isAnimationRunning = false;
    removeRowIfNeeded();
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
            $currentBrick.remove();
            console.log('Creating brick with id ' + cell.getAttribute('value'));
            cell.insertBefore(createBrick(cell.getAttribute('value'),motherBrick.color), cell.firstChild);
            playSound(6);
            // Checking if we can remove the row to free up space
            removeRowIfNeeded();
            break; // exiting the loop
          }
        }
    }

    if (isGameOver) {
      return gameOver();
    } else {

      // Game is ON!
      const $scoreLabel = $('#score');
      $scoreLabel.text(score);
      return true;
    }
}
// function mergeMultipleBricksAtOnce() {
//
//   const tempArray1 = returnColumnArray(0);
//   const tempArray2 = returnColumnArray(1);
//   const tempArray3 = returnColumnArray(2);
//   const tempArray4 = returnColumnArray(3);
//
//   const tempArrays = [tempArray1, tempArray2, tempArray3, tempArray4];
//
//   for (let i = 0; i < tempArrays.length; i++) {
//     const currentTempArray = tempArrays[i];
//     for (let k = 1; k < currentTempArray.length; k++) {
//       if (logicArray[currentTempArray[k]] === logicArray[currentTempArray[k-1]] && logicArray[currentTempArray[k]] !== 16) {
//         // Brick can be merged
//         const brickID = `#${}`
//         $(brickID).addClass('mergeBrick');
//       }
//     }
//   }
//
// }
function removeRowIfNeeded() {

  let shouldCheckMerging = false;

  for (let i = 0; i < logicArray.length; i+=4) {

    // Cheking if all elements in the row are same
    if(logicArray[i] !== 0 && (logicArray[i] === logicArray[i+1] &&
       logicArray[i] === logicArray[i+2] &&
       logicArray[i] === logicArray[i+3])) {

      // shouldRemoveBrick = false;
      // shouldCreateNewBrick = false;
      // isAnimationRunning = false;
      // isNewBrickBeingFormed = true;
      // shouldCheckMerging = false;

      console.log('Removing row');
      score = score + logicArray[i] * 4; // Adding up score

      const reversedIndex = logicArray.length-1-i;
      const cell = document.getElementsByClassName('cell')[reversedIndex];

      let correctIndex = parseInt(cell.getAttribute('value'));

      // Removing row visually
      const brickOne = `#${correctIndex}`;
      const brickTwo = `#${correctIndex+1}`;
      const brickThree = `#${correctIndex+2}`;
      const brickFour = `#${correctIndex+3}`;

      $(brickOne).fadeOut(200);
      $(brickTwo).fadeOut(200);
      $(brickThree).fadeOut(200);
      $(brickFour).fadeOut(200);

      // Shifting the bricks on top and changing their IDs
      correctIndex += 3;
      console.log('logicArray before');
      console.log(logicArray);
      playSound(7);
      for (; correctIndex < logicArray.length; correctIndex++) {
        if (logicArray[correctIndex] !== 0) {

          // There is a brick which needs change
          const aBrick = `#${correctIndex}`;
          const brick  = $(aBrick);
          const newNum = `${correctIndex-4}`;
          brick.animate({
            top: '+=50px'
          }, 300, 'linear');
          brick.attr('id',newNum);
        }
      }
      logicArray.splice(i,4);
      logicArray.push(0,0,0,0);
      console.log('logicArray after');
      console.log(logicArray);
      shouldCheckMerging = true;
    }
  }
  // if(shouldCheckMerging) {
  //   console.log('Calling for merge!');
  //   // combineBricks(returnColumnArray(0),returnAmountOfBricksInColumn(0));
  //   // combineBricks(returnColumnArray(1),returnAmountOfBricksInColumn(1));
  //   // combineBricks(returnColumnArray(2),returnAmountOfBricksInColumn(2));
  //   // combineBricks(returnColumnArray(3),returnAmountOfBricksInColumn(3));
  //   // if(!isAnimationRunning) {
  //   //   isAnimationRunning = true;
  //   //   console.log('Add new brick!');
  //   //   addBrickWithAnimation();
  //   // }
  //
  // } else {
  console.log('No need to remove the row');
  shouldCreateNewBrick = true;
  shouldCheckMerging = false;
  if(!isAnimationRunning) {
    isAnimationRunning = true;
    console.log('Add new brick!');
    addBrickWithAnimation();
  }
  //}
}
function returnAmountOfBricksInColumn(col) {
  const tempArray = returnColumnArray(col);
  let numberOfBricks = 0;
  for (let i = 0; i < tempArray.length; i++) {
    if(logicArray[tempArray[i]] !== 0) {
      numberOfBricks++;
    } else {
      return numberOfBricks;
    }
  }
  return numberOfBricks;
}
// function mergeAllPossibleBricks() {
//
//    function startMerging() {
//
//      console.log('All Merging...');
//      shouldRemoveBrick = false;
//      shouldCreateNewBrick = false;
//      isAnimationRunning = false;
//      isNewBrickBeingFormed = true;
//    }
//
//    startMerging();
// }

// This function is called when no more space for new bricks are left
function gameOver() {
  document.getElementById('score').innerHTML = `Game Over! Score: ${score}`;
  return false; // this will trigger restart of the game
}

function playMusic() {
  var audio = document.getElementById('audio');
  audio = new Audio('sounds/forest.mp3');
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    //this.play();
  }, false);
  audio.play();
}

function stopMusic() {
  console.log('stop');
  var audio = document.getElementById('audio');
  audio.pause();
  // audio = new Audio('');
  // audio.play();
}

function playSound(beep) {
  let soundName;
  switch(beep) {
    case 1: soundName = 'sounds/beep1.wav'; break;
    case 2: soundName = 'sounds/beep2.wav'; break;
    case 3: soundName = 'sounds/beep3.wav'; break;
    case 4: soundName = 'sounds/beep4.wav'; break;
    case 6: soundName = 'sounds/place.wav'; break;
    case 7: soundName = 'sounds/row.wav'; break;
  }
  var sound = document.getElementById('sound');
  sound = new Audio(soundName);
  sound.play();
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
