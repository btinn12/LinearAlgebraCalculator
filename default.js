$(document).ready(function () {
		
	var amountOfMatrices = 0;
	var Matrices = [];
	
	function retrieveInput() {
		for (var i = 0; i < numInputMatrices; i++) {
			inputMatrices[i] = retrieveMatrix("m" + i);
		}
	}
	
	$("#addMatrix").click(function() {handleAddMatrix()});
	$("#create").click(function() {createMatrix()});
	$("#add2x2").click(function() {addMatrix(2,2)});
	$("#add3x3").click(function() {addMatrix(3,3)});
	$("#add4x4").click(function() {addMatrix(4,4)});
	$("#add5x5").click(function() {addMatrix(5,5)});
	
	$("#submit").click(function() {retrieveMatrix("m1")});
	$("#clear").click(function() {clearEquation()});
	
	$("#determinant").click(function() {handleDeterminant()});
	$("#add").click(function() {handleAddition()});
	
	function handleAddition() {
		if(amountOfMatrices<2)
		{
			addOutputMessage("1");
		}
		else if(amountOfMatrices>2)
		{
			addOutputMessage("2");
		}
		else
		{
			var matrix1 = retrieveMatrix("m1");
			var matrix2 = retrieveMatrix("m2");
			if(matrix1.rows != matrix2.rows || matrix1.cols != matrix2.cols)
			{
				addOutputMessage("3");
			} else {
				var outputMatrix = add(matrix1, matrix2);
				addOutputMatrix(outputMatrix);
			}
		}	
	}
	
	function handleDeterminant() {
		var matrix = retrieveMatrix("m1");
		var output = determinant(matrix, matrix.rows);
		var outputMatrix = new Matrix(1,1);
		outputMatrix.set(output, 0, 0);
		addOutputMatrix(outputMatrix);
		
	}
	
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
	
	function addOutputMessage(msg)
	{
		var error = $("#outputError");
		switch(msg)
		{
			case "1": error.html("Not enough matrices to compute.");
			case "2": error.html("Too many matrices to compute.");
			case "3": error.html("Incorrect rows/columns to compute.")
			default: error.html(msg);
		}
	}
	
	function clearEquation()
	{
		$("#matrices-container").empty();
		amountOfMatrices = 0;
	}

	function retrieveMatrix(matrixName) {
		var rows = $("#" + matrixName).attr("data-row");
		var cols = $("#" + matrixName).attr("data-col");
		var A = new Matrix(parseInt(rows), parseInt(cols));
		var inputs = $("#" + matrixName + " input");
		jQuery.each(inputs, function(i, el) {
			var element = $(el);
			A.set(parseInt(element.val()), Math.floor(i/cols), i%cols);
		});
		Matrices[Matrices.length] = A;
		
		return A;
	}
});
