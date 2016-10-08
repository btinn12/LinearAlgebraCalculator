function Matrix(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.val = [];
	this.initialize();
}

Matrix.prototype.get = function(r, c) {
	return this.val[r][c];
}

Matrix.prototype.set = function(val, r, c) {
	this.val[r][c] = val;
}

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
				sum += A[j][k] + B[k][i];
			}
			C[j][i] = sum;
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