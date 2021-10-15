function code() {
	let message = document.getElementById('inputData').value;
	let inputDigits = getIntArrayFromString(message);
		
	let countTestBit = 0;
	let countInfBit = message.length;
	// количество контрольных разрядов k должно удовлетворять неравенству 2^k >= k + m + 1, где m - длина исходного кодового слова
	while(Math.pow(2, countTestBit) < countTestBit + countInfBit + 1) 
		countTestBit++;
	
	let codedData = new Array(countTestBit + countInfBit);
	let j = 0; // итератор по inputDigits
	for(let i = 0; i < codedData.length; i++) {
		// на позициях, номера которых представляют собой степени двойки, будут стоять проверочные биты
		if (digreeOfTwo(i + 1))   
			codedData[i] = 0;
		else {
			codedData[i] = inputDigits[j];
			j++;
		}
	}
	
	let testBits = getTestBitsAndSyndrom(codedData, countTestBit);
	for (let i = 0; i < testBits.length; i++) {
		codedData[Math.pow(2, i) - 1] = testBits[i];
	}
	document.getElementById('codedData').value = codedData.join('');
	clearFields('decodedData', 'result', 'lineWithCode', 'cursor');
}
			
function decode() {
	let codedData = document.getElementById('codedData').value;
	codedData = getIntArrayFromString(codedData);
	
	let countTestBit = 0;
	while (Math.pow(2, countTestBit) < codedData.length + 1)
		countTestBit++;
	
	let syndrom = getTestBitsAndSyndrom(codedData, countTestBit);
	// матрица синдромов представляет собой двоичную запись (младший разряд в первом элементе) номера позиции, в которой произошла ошибка
	let errorPosition = parseInt(syndrom.reverse().join(''), 2);
	
	if (errorPosition != 0) {
		codedData[errorPosition - 1] = Math.abs(codedData[errorPosition - 1] - 1); // изменение бита, в котором произошла ошибка
		document.getElementById('result').innerHTML = 'Error:';
		document.getElementById('lineWithCode').innerHTML = `${codedData.join('')}`;
		document.getElementById('cursor').innerHTML = 
			`${'_'.repeat(errorPosition - 1)}^${'_'.repeat(codedData.length - errorPosition)} (${errorPosition})`;
	} else {
		document.getElementById('result').innerHTML = 'Error not found.';
		clearFields('lineWithCode', 'cursor');
	}
	
	let decodedData = new Array();
	// Удаление контрольных разрядов
	for(let i = 0; i < codedData.length; i++){
		if (! digreeOfTwo(i + 1))
			decodedData.push(codedData[i]);
	}	
	document.getElementById('decodedData').value = decodedData.join('');
}

function digreeOfTwo(number) {
	let bin = number.toString(2);
	let sum = 0;
	for (let d of bin)
		sum += parseInt(d);
	return sum == 1;
}

/*
Алгоритм декодирования по Хэммингу абсолютно идентичен алгоритму кодирования.
Поэтому в кодировании и декодировании используется одна и та же функция.
Данная функция возвращает одномерный массив: 
	- матрицу-столбец контрольных разрядов (используется при кодировании);
	- матрицу-столбец синдромов (используется при декодировании)
*/
function getTestBitsAndSyndrom(inputDigits, countTestBits) {
	let numbers = new Array(inputDigits.length);
	let arrayResult = new Array(countTestBits);
	for(let i = 0; i < numbers.length; i++)
		numbers[i] = i + 1;
	
	let sumInLine = 0;
	for(let i = 0; i < arrayResult.length; i++){
		sumInLine = 0;
		for (let j = 0; j < inputDigits.length; j++) {
			sumInLine += (numbers[j] % 2) * inputDigits[j];
			numbers[j] =  parseInt(numbers[j] / 2);
		}
		arrayResult[i] = sumInLine % 2;
	}
	return arrayResult;
}

function getIntArrayFromString(line) {
	let arr = line.split('');
	for (let i = 0; i < arr.length; i++)
		arr[i] = parseInt(arr[i]);
	return arr;
}

function clearFields() {
	for(nameField of arguments) {
		document.getElementById(nameField).value = '';
		document.getElementById(nameField).innerHTML = '';
	}
}
