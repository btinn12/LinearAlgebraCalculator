$(document).ready(function () {
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
		
		var amountOfMatrices = 0;
		var Matrices = [];
		$("#addMatrix").click(function() {handleAddMatrix()});
		$("#create").click(function() {createMatrix()});
		$("#add2x2").click(function() {addMatrix(2,2)});
		$("#add3x3").click(function() {addMatrix(3,3)});
		$("#add4x4").click(function() {addMatrix(4,4)});
		$("#add5x5").click(function() {addMatrix(5,5)});
		
		$("#submit").click(function() {retrieveMatrix("m1")});
		$("#clear").click(function() {clearEquation()});
		
		function handleAddMatrix() {
			$(".matrix-maker").css('display', 'inline-block');
		}
		
		function createMatrix()
		{
			var rows = $("#rows").val();
			var cols = $("#cols").val();
			if (rows == "" || rows == null || cols == "" || cols == null) {
				$("#error").html("Please fill out both fields.");
			}
			else if(rows > 10 || cols > 10) {
				$("#error").html("Max matrix size: 10 x 10")
			}
			else {
				$("div.matrix-maker").html("");
				addMatrix(rows,cols);
				$(".matrix-maker").css('display', 'none');
			}
		}
		
		function addMatrix(rows, cols) {
			amountOfMatrices++;
			var matrixName = "m" + amountOfMatrices;
			var matrixFieldset = $("<fieldset id=\"" + matrixName + "\" data-row=\"" + rows + "\" data-col=\"" + cols + "\"></fieldset>");
			$("#matrices-container").append(matrixFieldset);
			$("#" + matrixName).css('display', 'none');
			for(i = 0;i<rows*cols;i++)
			{
				$("#m" + amountOfMatrices).append($("<input class=\"matrix-input\" />"));
				
			}
			
			var fieldsetWidth = 10 + (cols-1)*5;
			var margin = 6.2 - 0.8*(cols-2);
			var inputWidth = (100 - margin*2*cols)/cols;
			
			$("#" + matrixName).css('width', fieldsetWidth + '%');
			$("#" + matrixName + " input").css('width', inputWidth + '%');
			$("#" + matrixName + " input").css('margin', margin + '%');
			$("#" + matrixName).css('display','inline-block');
		}
		
		function addOutputMatrix(matrix) {
			var matrixFieldset = $("<fieldset id=\"out\"></fieldset>");
			$("#outputWindow").append(matrixFieldset);
			for (var i = 0; i < matrix.rows; i++) {
				for (var j = 0; j < matrix.cols; j++) {
					var val = matrix.get(i, j);
					$("#out").append("<input type=\"text\" class=\"matrix-input\" value=\"" + val + "\" disabled />");
				}
			}
			
			var fieldsetWidth = 10 + (matrix.cols-1)*5;
			var margin = 6.2 - 0.8*(matrix.cols-2);
			var inputWidth = (100 - margin*2*matrix.cols)/matrix.cols;
			
			$("#out").css('width', fieldsetWidth + '%');
			$("#out input").css('width', inputWidth + '%');
			$("#out input").css('margin', margin + '%');
			$("#out").css('display','inline-block');
		}
		
		function clearEquation()
		{
			$("#matrices-container").html("");
		}

		function retrieveMatrix(matrixName) {
			var rows = $("#" + matrixName).attr("data-row");
			var cols = $("#" + matrixName).attr("data-col");
			var A = new Matrix(parseInt(rows), parseInt(cols));
			var inputs = $("#" + matrixName + " input");
			jQuery.each(inputs, function(i, el) {
				var element = $(el);
				A.set(element.val(), Math.floor(i/rows), i%rows);
			});
			Matrices[Matrices.length] = A;
		}
});
