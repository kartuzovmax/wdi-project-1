$(() => {
  $('.rowButton').on('click', pickRow);
  generateNewMotherBrick();
});

var score = 0;
var logicArray = [ // board 4x8
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0
];

const pointsArray = [1,2,4,8,16];
const shadesArray = ['#ffc4f7','#ff95e8','#ff5cd6','#ff00bd','#bd008d'];

// Creating a future brick blueprint
const motherBrick = {
  color: shadesArray[0],
  points: 1
};

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
  }, 250);
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

  let k = i;
  while (k > 0 && logicArray[tempArray[k]] === logicArray[tempArray[k-1]] && logicArray[tempArray[i]] !== 16) {
    // Combining the bricks!
    console.log('Combining the bricks. K is ' + k);
    let brickPoints = logicArray[tempArray[k-1]];
    if (brickPoints < 16) {
      // Maximum value is not reached, can combine bricks
      brickPoints = brickPoints * 2; // duplicating the points!
      score += brickPoints; // adding score
      logicArray[tempArray[k]] = 0; // clearing new brick
      logicArray[tempArray[k-1]] = brickPoints;

      // getting a darker shade
      $(document.getElementById(tempArray[k-1])).animate({
        backgroundColor: returnColorForPoints(brickPoints)
      }, 250);
      if(document.getElementById(tempArray[k])) {
        console.log('Removing brick with id ' + tempArray[k]);
        document.getElementById(tempArray[k]).remove();
      }
    }
    k--;
  }
}
  function pickRow() {
    //console.log('pick row ' + this.getAttribute('value'));
    const row = parseInt(this.getAttribute('value'));
    let remainder = 0;
    if (row === 0) {
      remainder = 0;
    } else if (row === 1) {
      remainder = 1;
    } else if (row === 2) {
      remainder = 2;
    } else if (row === 3) {
      remainder = 3;
    }
    //console.log('remainder is ' + remainder);
    let tempArray = [];

    // Populating tempArray with correct values to determine a row
    for (var i = 0; i < document.getElementsByClassName('cell').length; i++) {
      if(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')) % 4 === remainder) {
        // console.log(document.getElementsByClassName('cell')[i].getAttribute('value'));
        tempArray.push(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')));
      }
    }
    tempArray = tempArray.reverse(); // it sorts the tempArray in correct order

    // creating a Game Over flag
    var isGameOver = true;

    // Checking if we can place another brick, if YES, do so, otherwise we call Game Over
    for (let i = 0; i < tempArray.length; i++) {

        // Checking if we can combine bricks
        console.log('i is ' + i);
        if (i !== 0 && (motherBrick.points === logicArray[tempArray[i-1]] && logicArray[tempArray[i]] === 0) && logicArray[tempArray[i-1]] !== 16) {
          console.log('Should combine bricks');
          isGameOver = false;
          //let k = i;
          logicArray[tempArray[i]] = motherBrick.points;
          combineBricks(tempArray,i);
          // while (k > 0 && logicArray[tempArray[k]] === logicArray[tempArray[k-1]] && logicArray[tempArray[i]] !== 16) {
          //   // Combining the bricks!
          //   console.log('Combining the bricks. K is ' + k);
          //   let brickPoints = logicArray[tempArray[k-1]];
          //   if (brickPoints < 16) {
          //     // Maximum value is not reached, can combine bricks
          //     brickPoints = brickPoints * 2; // duplicating the points!
          //     score += brickPoints; // adding score
          //     logicArray[tempArray[k]] = 0; // clearing new brick
          //     logicArray[tempArray[k-1]] = brickPoints;
          //
          //     // getting a darker shade
          //     $(document.getElementById(tempArray[k-1])).animate({
          //       backgroundColor: returnColorForPoints(brickPoints)
          //     }, 250);
          //     if(document.getElementById(tempArray[k])) {
          //       console.log('Removing brick with id ' + tempArray[k]);
          //       document.getElementById(tempArray[k]).remove();
          //     }
          //   }
          //   k--;
          // }
          break; // exiting the loop
        } else {
          console.log('Can not combine bricks');
          if(logicArray[tempArray[i]] === 0) {

            console.log('Placing the brick');
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
      gameOver();
      return;
    }

    // Updating score label
    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `Score: ${score}`;
    console.log('logicArray is ' + logicArray);
    generateNewMotherBrick(); // move is over, generating a new brick
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
  console.log('logicArray before combining bricks');
  console.log(logicArray);
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
    let tempArray = [];
    // Populating tempArray with correct values to determine a row
    for (var i = 0; i < document.getElementsByClassName('cell').length; i++) {
      if(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')) % 4 === remainder) {
        tempArray.push(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')));
      }
    }
    tempArray = tempArray.reverse(); // it sorts the tempArray in correct order
    console.log('tempArray before combining bricks');
    console.log(tempArray);
    combineBricks(tempArray,tempArray.length-1);
  }
}

// This function is called when no more space for new bricks are left
function gameOver() {
  document.getElementById('score').innerHTML = `Game Over! Score: ${score}`;
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
