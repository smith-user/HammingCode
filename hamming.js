function code() {
	let message = document.getElementById('inputData').value;
	let inputDigits = message.split('');
	for (let i = 0; i < inputDigits.length; i++)
		inputDigits[i] = parseInt(inputDigits[i]);
	inputDigits.push(
		(inputDigits[0] + inputDigits[2] + inputDigits[3]) % 2);
	inputDigits.push(
		(inputDigits[0] + inputDigits[1] + inputDigits[3]) % 2);
	inputDigits.push(
		(inputDigits[1] + inputDigits[2] + inputDigits[3]) % 2);
	document.getElementById('codedData').value = inputDigits.join('');
}
			
function decode() {
	let arrayOfCircles = new Array(
		new Circle(0, 2, 3, 4),
		new Circle(0, 1, 3, 5),
		new Circle(1, 2, 3, 6)
	);
	
	for (let i = 0; i < 3; i++)
		if (arrayOfCircles[i].sumInCircleIsEven())
			arrayOfCircles[i].isNotSuspect();
	let codedData = document.getElementById('codedData').value;
	let decodeData = codedData.split('');
	let badCell = getBadCell(arrayOfCircles[0].cells, arrayOfCircles[1].cells, arrayOfCircles[2].cells);
	if (badCell != -1) {
		decodeData[badCell] = Math.abs(codedData[badCell] - 1);
		document.getElementById('result').innerHTML = 'Error found:';
		document.getElementById('lineWithCode').innerHTML = `${codedData}`;
		document.getElementById('cursor').innerHTML = `${'_'.repeat(badCell)}^${'_'.repeat(6-badCell)}`;
	} else {
		document.getElementById('result').innerHTML = 'Error not found.';
		document.getElementById('lineWithCode').innerHTML = '';
		document.getElementById('cursor').innerHTML = '';
	}
	document.getElementById('decodedData').value = decodeData.join('').substring(0, 4);
}
			
function Circle(cell0, cell1, cell2, cell3)
{
	this.cells = new Array();
	this.cells[cell0] = false;
	this.cells[cell1] = false;
	this.cells[cell2] = false;
	this.cells[cell3] = false;
}

Circle.prototype.sumInCircleIsEven = function () {
	let amount = 0; 
	let input = document.getElementById('codedData').value;
	let inputDigits = input.split('');
	for (cell in this.cells)
		amount += parseInt(inputDigits[cell]);
	return amount % 2 == 0;
}

Circle.prototype.isNotSuspect = function () {
	for (cell in this.cells)
		this.cells[cell] = true;
	}

function getBadCell(cells0, cells1, cells2) {
	let badCell = -1;
	let badCells = new Array();
	for(let i = 0; i < 7; i++)
		if ( !(cells0[i] || cells1[i] || cells2[i]) )
			badCells.push(i);
	if (badCells.length == 7) 
		badCell = 3;
	else if (badCells.length > 0)
		badCell = Math.min.apply(null, badCells);
	return badCell;
}
