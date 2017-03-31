$(() => {
  $('.motherBrick').on('click', changeShade);
  $('.rowButton').on('click', pickRow);

  $('.motherBrick').css('background-color', shadesArray[Math.floor(Math.random() * shadesArray.length-1)]);
});

var logicArray = [0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0];

//const valuesArray = [1,2,4,8,16];
const shadesArray = ['#f1aef3','#f37fe9','#f345e1','#f300c9','#93007a'];

function changeShade() {
  console.log('change shade');
  $(this).css('background-color', shadesArray[Math.floor(Math.random() * shadesArray.length-1)]);
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
  for (var i = 0; i < document.getElementsByClassName('cell').length; i++) {
    if(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')) % 4 === remainder) {
      // console.log(document.getElementsByClassName('cell')[i].getAttribute('value'));
      tempArray.push(parseInt(document.getElementsByClassName('cell')[i].getAttribute('value')));
    }
  }
  tempArray = tempArray.reverse();
  console.log('tempArray is ' + tempArray);

  for (const i in tempArray) {
    if(logicArray[tempArray[i]] === 0) {
      logicArray[tempArray[i]] = 1;
      const reversedIndex = (logicArray.length-1)-tempArray[i];
      document.getElementsByClassName('cell')[reversedIndex].style.backgroundColor = 'purple';
      break;
    }
  }
  console.log('logicArray is ' + logicArray);
}
