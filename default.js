$(document).ready(function () {
		
	var numInputMatrices = 0;
	var Matrices = [];
	
	$("#addMatrix").click(function() {handleAddMatrix()});
	$("#create").click(function() {createMatrix()});
	$("#add2x2").click(function() {addMatrix(2,2)});
	$("#add3x3").click(function() {addMatrix(3,3)});
	$("#add4x4").click(function() {addMatrix(4,4)});
	$("#add5x5").click(function() {addMatrix(5,5)});
	
	$("#submit").click(function() {retrieveMatrix("m1")});
	$("#clear").click(function() {clearEquation()});
	$("#debug").click(function() {populateMatrices()});
	
	$("#determinant").click(function() {handleDeterminant()});
	$("#add").click(function() {handleAddition()});
	$("#subtract").click(function() {handleSubtraction()});
	$("#multiply").click(function() {handleMultiply()});
	$("#rref").click(function() {handleRREF()});
	$("#inverse").click(function() {handleInverse()});
	
	function populateMatrices() {
		var inputs = $("#matrices-container input");
		jQuery.each(inputs, function(i,el) {
			$(el).val(Math.floor(Math.random()*10 + 1)*(Math.random() > 0.5 ? -1 : 1));
		});
	}
	
	function handleAddMatrix() {
		$(".matrix-maker").css('display', 'inline-block');
	}
	
	function handleDeterminant() {
		var matrix = retrieveMatrix("m1");
		var output = determinant(matrix, matrix.rows);
		var outputMatrix = new Matrix(1,1);
		outputMatrix.set(output, 0, 0);
		addOutputMatrix(outputMatrix);	
	}
	
	function handleAddition() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 2);
		if(valid)
		{
			var matrix1 = Matrices[0];
			var matrix2 = Matrices[1];
			if(matrix1.rows != matrix2.rows || matrix1.cols != matrix2.cols)
			{
				addOutputMessage("3");
			} else {
				var outputMatrix = add(matrix1, matrix2);
				addOutputMatrix(outputMatrix);
			}
		}	
	}
	
	function handleSubtraction() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 2);
		if(valid) {
			var matrix1 = Matrices[0];
			var matrix2 = Matrices[1];
			if (matrix1.rows != matrix2.rows || matrix1.cols != matrix2.cols) {
				addOutputMessage("3");
			} else {
				var outputMatrix = subtract(matrix1, matrix2);
				addOutputMatrix(outputMatrix);
			}
		}
	}
	
	function handleMultiply() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 2);
		if(valid) {
			var matrix1 = Matrices[0];
			var matrix2 = Matrices[1];
			if (matrix1.cols != matrix2.rows) {
				addOutputMessage("3");
			} else {
				var outputMatrix = matrixMult(matrix1, matrix2);
				addOutputMatrix(outputMatrix);
			}
		}
	}
	
	function handleRREF() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 1);
		if(valid) {
			var matrix = Matrices[0];
			RREF(matrix);
			addOutputMatrix(matrix);
		}
	}
	
	function handleInverse() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 1);
		if (valid) {
			var matrix = Matrices[0];
			if(matrix.rows != matrix.cols)
			{
				addOutputMessage("3");
			}
			inverse(matrix);
			addOutputMatrix(matrix);
		}
	}
	
	function retrieveInput() {
		for (var i = 1; i <= numInputMatrices; i++) {
			Matrices[i - 1] = retrieveMatrix("m" + i);
		}
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
		numInputMatrices++;
		var matrixName = "m" + numInputMatrices;
		var matrixFieldset = $("<fieldset id=\"" + matrixName + "\" data-row=\"" + rows + "\" data-col=\"" + cols + "\"></fieldset>");
		$("#matrices-container").append(matrixFieldset);
		$("#" + matrixName).css('display', 'none');
		for(i = 0;i<rows*cols;i++)
		{
			$("#" + matrixName).append($("<input class=\"matrix-input\" />"));
			
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
		clearOutput();
		var matrixFieldset = $("<fieldset id=\"out\"></fieldset>");
		$("#output-container").append(matrixFieldset);
		for (var i = 0; i < matrix.rows; i++) {
			for (var j = 0; j < matrix.cols; j++) {
				var val = matrix.get(i, j);
				$("#out").append("<input type=\"text\" class=\"matrix-output\" value=\"" + val + "\" disabled />");
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
	
	function checkErrors(numInputMatrices, necessarryMatrices) 
	{
		if(numInputMatrices < necessarryMatrices)
		{
			addOutputMessage("1");
			return false;
		}
		else if(numInputMatrices > necessarryMatrices)
		{
			addOutputMessage("2");
			return false;
		}
		
		return true;
	}
	
	function addOutputMessage(msg)
	{
		var error = $("#outputError");
		switch(msg)
		{
			case "1": error.html("Not enough matrices to compute."); break;
			case "2": error.html("Too many matrices to compute."); break;
			case "3": error.html("Incorrect rows/columns to compute."); break;
			default: error.html(msg);
		}
	}
	
	function clearEquation()
	{
		$("#matrices-container").empty();
		numInputMatrices = 0;
	}
	
	function clearOutput() {
		$("#output-container").empty();
		
	}

	function retrieveMatrix(matrixName) {
		var rows = $("#" + matrixName).attr("data-row");
		var cols = $("#" + matrixName).attr("data-col");
		var A = new Matrix(parseInt(rows), parseInt(cols));
		var inputs = $("#" + matrixName + " input");
		jQuery.each(inputs, function(i, el) {
			var element = $(el).val();
			if (element != "")
			{
				A.set(parseInt(element), Math.floor(i/cols), i%cols);
			}
		});
		return A;
	}
});
