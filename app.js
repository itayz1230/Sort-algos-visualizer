const board = document.getElementById('board')
let element
let ran
let zeroPadIndex
let zeroPadSize
let input
let isThereBoard = false
let isThereNumber = true
let numOfShown
let speed
let nums = []
let algo
let iterationCount = 0
const iterations = document.getElementById('iterations')
const startBtn = document.getElementById('start')
const clrBtn = document.getElementById('clearBoard')
const fillBtn = document.getElementById('fillBoard')
const delay = ms => new Promise(res => setTimeout(res, ms))

// a function that returns an array [the index of the element, the value of the element]
function getIndexAndValue(el) {
  return [parseInt(el.id.substring(1, 5)), parseInt(el.id.substring(6))]
}

//A function that creates the board with random height of div elemenets
const setBoard = () => {
  //during the creation of the board- the buttons will be disabled
  fillBtn.disabled = true
  clrBtn.disabled = true
  startBtn.disabled = true
  clearBoard()
  speed = getSpeed()
  input = getInput()
  let numOfColumns = input
  //if the input of number of numbers is empty
  if (!isThereNumber) {
    alert('Please choose a number between 10 to 1000')
    fillBtn.disabled = false
    clrBtn.disabled = false
    startBtn.disabled = false
  }
  if (isThereNumber) {
    isThereBoard = true
    for (let i = 0; i < numOfColumns; i++) {
      setTimeout(function() {
        //ran- the height (size) of the element
        ran = Math.floor(Math.random() * 1000) + 1
        //padZero- a funciton that returns the number with 0s before
        zeroPadIndex = padZero(i)
        zeroPadSize = padZero(ran)
        //creating a div (a column)
        element = document.createElement('div')
        element.classList.add('column')
        //assigning an id to the div
        element.id = `i${zeroPadIndex}s${zeroPadSize}`
        element.style.height = `${parseFloat(ran / 10)}%`
        element.style.width = `${100 / numOfColumns}%`
        board.appendChild(element)
        // the array that contains all the elements (divs)
        nums.push(element)
      }, i * speed)
    }
    setTimeout(() => {
      //release the buttons
      numOfShown = numOfColumns
      fillBtn.disabled = false
      clrBtn.disabled = false
      startBtn.disabled = false
    }, speed * numOfColumns)
  }
}

//a funciton that returns the number with 0s before
const padZero = num => {
  if (num < 10) {
    return `000${num}`
  } else if (num < 100) {
    return `00${num}`
  } else if (num < 1000) {
    return `0${num}`
  } else {
    return `${num}`
  }
}

//a function that deletes all the board content
const clearBoard = () => {
  if (isThereBoard) {
    for (let i = 0; i < numOfShown; i++) {
      board.removeChild(board.lastElementChild)
    }
    isThereBoard = false
    numOfShown = 0
  }
  nums.length = 0
  iterationCount = 0
  iterations.textContent = `Iteations: \n`
}
//a function that reads and checks the number input
const getInput = () => {
  let input = parseInt(document.getElementById('length').value)
  if (
    input == undefined ||
    input == null ||
    isNaN(input) ||
    input == '' ||
    input < 10 ||
    input > 1000
  ) {
    isThereNumber = false
  } else {
    isThereNumber = true
  }
  return input
}
//a function that reads and checks the speed input
function getSpeed() {
  let speedInput = document.getElementById('speeds').value
  switch (speedInput) {
    case 'superSlow':
      return 1000
    case 'slow':
      return 100
    case 'medium':
      return 50
    case 'fast':
      return 7
    case 'superFast':
      return 0
  }
}
//the selection sort algorithm
const selectionSort = async () => {
  let minIndex
  // a sub function that returns the index of minimum element in the array of elements nums
  //starting from index i
  function findMin(i) {
    let minIndex = getIndexAndValue(nums[i])[0]
    let minValue = getIndexAndValue(nums[i])[1]
    for (let j = i; j < nums.length; j++) {
      iterationCount++
      iterations.textContent = `Iteations: \n${iterationCount}`
      const element = nums[j]
      if (getIndexAndValue(element)[1] < minValue) {
        minValue = getIndexAndValue(element)[1]
        minIndex = getIndexAndValue(element)[0]
      }
    }
    return minIndex
  }

  //a function that replaces between the values (heights) of the two given indexes
  const replace = async (i, j) => {
    // nums[minIndex].classList.toggle("selected");

    let iVal = getIndexAndValue(nums[i])[1]
    let jVal = getIndexAndValue(nums[j])[1]
    setValue(i, jVal)
    setValue(j, iVal)
  }

  //a for loop that runs over all columns and then checks if need to replace
  for (let i = 0; i < nums.length - 1; i++) {
    await delay(speed)
    const element = nums[i]
    minIndex = findMin(i + 1)
    nums[i].classList.toggle('selected')
    if (getIndexAndValue(element)[1] > getIndexAndValue(nums[minIndex])[1]) {
      nums[minIndex].classList.toggle('min')
      await delay(speed)
      replace(i, minIndex)
      nums[minIndex].classList.toggle('min')
    }
    nums[i].classList.toggle('selected')
    nums[i].classList.add('sorted')
  }
  nums[nums.length - 1].classList.add('sorted')
}

const insertionSort = async () => {}
// a function that gets an index and a wanted value and give the element
//in the { index } place the new value
function setValue(index, newValue) {
  nums[index].id = `${nums[index].id.substring(0, 5)}${padZero(newValue)}`
  nums[index].style.height = `${parseFloat(padZero(newValue) / 10)}%`
}
// a function that starts the visualization
function start() {
  if (!isThereBoard) {
    alert('Please create a borad first!')
  } else {
    fillBtn.disabled = true
    clrBtn.disabled = true
    startBtn.disabled = true
    speed = getSpeed()
    selectionSort()
    fillBtn.disabled = false
    clrBtn.disabled = false
    startBtn.disabled = false
  }
}

/*function getAlgo(){
    switch (algosBtn) {
        case "selection":
            algo = "selection";
            break;
        case "quick":
            algo = "quick";
            break;
    }
}*/

//event listeners for the buttons
fillBtn.addEventListener('click', setBoard)
clrBtn.addEventListener('click', clearBoard)
startBtn.addEventListener('click', start)
