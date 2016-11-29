function Matrix(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.val = [];
	this.initialize();
}

Matrix.prototype.get = function(r, c) {
	return this.val[r][c];
};

Matrix.prototype.set = function(val, r, c) {
	this.val[r][c] = val;
};

Matrix.prototype.initialize = function() {
	for (var i = 0; i < this.rows; i++) {
		this.val[i] = new Array();
		for (var j = 0; j < this.cols; j++) {
			this.val[i][j] = 0;
		}
	}
};

function matrixMult(A, B) {
	var C = new Matrix(A.rows, B.cols);
	var sum = 0;
	for (var i = 0; i < B.cols; i++) {
		for (var j = 0; j < A.rows; j++) {
			for (var k = 0; k < A.cols; k++) {
				sum += A.get(j, k) * B.get(k, i);
			}
			C.set(sum, j, i);
			sum = 0;
		}
	}
	return C;
}

function add(m1, m2)
{
	var sum = new Matrix(m1.rows, m1.cols)
	for(var i = 0;i<m1.rows;i++)
	{
		for(var j = 0;j<m1.cols;j++)
		{
			var plus = parseInt(m1.get(i,j)) + parseInt(m2.get(i,j));
			sum.set(plus, i, j);
		}
	}
	return sum;
}

function subtract(m1, m2) {
	var difference = new Matrix(m1.rows, m2.cols);
	for (var i = 0; i < m1.rows; i++) {
		for (var j = 0; j < m1.cols; j++) {
			var sub = parseInt(m1.get(i, j)) - parseInt(m2.get(i, j));
			difference.set(sub, i, j);
		}
	}
	return difference;
}

function determinant(matrix, n)
{
	if(n == 2)
	{
		return matrix.get(0,0)*matrix.get(1,1) - matrix.get(0,1)*matrix.get(1,0);
	}
	else 
	{
		var sum = 0;
		for(var i = 0;i<n;i++)
		{
			sum += Math.pow(-1,i)*matrix.get(0,i)*determinant(createCofactor(matrix, i), n-1);
		}
		return sum;
	}
}

function createCofactor(matrix, col)
{
	var cofactor = new Matrix(matrix.rows - 1,matrix.cols - 1);
	var coIndex = 0;
	for(var i = 0;i<matrix.cols;i++)
	{
		if(i == col){}
		else
		{
			for(var j = 1;j<matrix.rows;j++)
			{
				cofactor.set(matrix.get(j,i), j-1, coIndex);
			}
			coIndex++;
		}
	}
	return cofactor;
}

function RREF(matrix) {
	var currentCol = 0;
	var currentRow = 0;
	var nonPivotValue = matrix.cols + 1;
	var pivotsFound = 0;
	var pivotRows = {};
	for (var i = 0; i < matrix.rows; i++) {
		pivotRows[i] = nonPivotValue;
	}
	//Cycle through the entire matrix looking for pivotsFound
	//When a pivot is found, do necessary row operations to simplify column
	while (pivotsFound < matrix.rows && currentCol < matrix.cols) {
		// IF statement checks if current location is a pivot
		if (matrix.get(currentRow, currentCol) != 0 && pivotRows[currentRow] == nonPivotValue) {
			pivotsFound++;
			pivotRows[currentRow] = currentCol;
			rowScaling(matrix, currentRow, 1/matrix.get(currentRow, currentCol));
			for (var i = 0; i < matrix.rows; i++) {
				if (i == currentRow) {
					
				} else {
					rowReplacement(matrix, i, (-1)*matrix.get(i, currentCol), currentRow);
				}
			}
		}
		// Go to the next location in the matrix
		if (currentRow + 1 < matrix.rows) {
			currentRow++;
		} else {
			currentRow = 0;
			currentCol++;
		}
	}
	// Reorder the rows so that the pivots are in descending order
	var end = matrix.rows - 1;
	var largest = 0;
	for (var i = end; i >= 0; i--) {
		for (var j = 0; j <= end; j++) {
			if (pivotRows[j] > pivotRows[largest]) {
				largest = i;
			}	
		}
		var temp = pivotRows[end];
		pivotRows[end] = pivotRows[largest];
		pivotRows[largest] = temp;
		rowInterchange(matrix, largest, end);
	}
	return matrix;
}

function inverse(matrix)
{
	var augMatrix = new Matrix(matrix.rows, matrix.cols*2);
	var n = matrix.rows;
	
	//Creates augmented matrix of [matrix | identity matrix]
	for(var i = 0;i < n;i++)
	{
		for(var j = 0;j < n;j++)
		{
			augMatrix.set(matrix.get(i,j), i, j);
			if(i == j) 
			{
				augMatrix.set(1, i, j+n);
			}
		}
	}
	
	RREF(augMatrix);
	
	//Extracts right-hand side of augmented matrix as output
	for(var i = 0;i < n;i++)
	{
		for(var j = 0;j < n;j++)
		{
			matrix.set(augMatrix.get(i,j+n),i,j);
		}
	}
}

function rowScaling(matrix, row, c) {
	for (var i = 0; i < matrix.cols; i++) {
		matrix.set(c * matrix.get(row, i), row, i);
	}
}

function rowReplacement(matrix, row1, c, row2) {
	for (var i = 0; i < matrix.cols; i++) {
		matrix.set(matrix.get(row1, i) + (c * matrix.get(row2, i)), row1, i);
	}
}

function rowInterchange(matrix, row1, row2) {
	var tempRow = [];
	for (var i = 0; i < matrix.cols; i++) {
		tempRow[i] = matrix.get(row1, i);
	}
	for (var i = 0; i < matrix.cols; i++) {
		matrix.set(matrix.get(row2, i), row1, i);
	}
	for (var i = 0; i < matrix.cols; i++) {
		matrix.set(tempRow[i], row2, i);
	}
}