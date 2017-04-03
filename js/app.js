$(() => {
  $('.rowButton').on('click', pickRow);
  generateNewMotherBrick();
});

var score = 0;
var logicArray = [0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0];

const pointsArray = [1,2,4,8,16];
const shadesArray = ['#d7eaff','#add5ff','#62a5ff','#035fff','#023faa'];

const motherBrick = {
  color: shadesArray[0],
  points: 1
};

  // This function returns correct color based on points
  function returnColorForPoints(pts) {
    for (const i in pointsArray) {
      if(pointsArray[i] === pts) {
        return shadesArray[i];
      }
    }
    return shadesArray[4];
  }

  // This function creates a new brick
  function createBrick(idValue) {

    // Creating a new brick
    var newBrick = document.createElement('div');
    newBrick.className = 'brick';
    newBrick.id = idValue;
    newBrick.innerHTML = '';
    newBrick.style.backgroundColor = motherBrick.color;
    return newBrick;
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
    $('.motherBrick').css('background-color', motherBrick.color);
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

    // creating a game over flag
    var isGameOver = true;

    // Checking if we can place another brick, if YES, do so, otherwise we call Game Over
    for (let i = 0; i < tempArray.length; i++) {

      if(logicArray[tempArray[i]] === 0) {

        isGameOver = false; // We have place for another brick!
        logicArray[tempArray[i]] = motherBrick.points; // Setting correct points for current brick
        // Checking if we can combine bricks
        console.log('i is ' + i);
        if (i !== 0 && logicArray[tempArray[i]] === logicArray[tempArray[i-1]]) { // checking if it is not the first row since it is impossible to combine any lower
          let k = i;
          console.log('Not first row');

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
            document.getElementById(tempArray[k-1]).style.backgroundColor = returnColorForPoints(brickPoints);
            k--;
          }
          break; // exiting the loop

        } else {
          // Placing the brick
          console.log('Placing the brick');
          logicArray[tempArray[i]] = motherBrick.points;
          score += 2; // Adding up score
          // Getting the correct cell
          const reversedIndex = (logicArray.length-1)-tempArray[i];
          var cell = document.getElementsByClassName('cell')[reversedIndex];
          // Placing the new brick
          cell.insertBefore(createBrick(cell.getAttribute('value')), cell.firstChild);

          break; // exiting the loop
        }
      }
    }

    // Updating score label
    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `Score: ${score}`;
    if (isGameOver) {
      gameOver();
    }
    console.log('logicArray is ' + logicArray);
    generateNewMotherBrick(); // move is over, generating a new brick
  }

  function gameOver() {
    console.log('Game Over! Score is ' + score);
  }
