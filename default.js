$(document).ready(function () {
		
	var numInputMatrices = 0;
	var numOutputMatrices = 0;
	var Matrices = [];
	var OutMatrices = [];
	
	$("#addMatrix").click(function() {handleAddMatrix()});
	$("#create").click(function() {createMatrix()});
	$("#add2x2").click(function() {addMatrix(2,2)});
	$("#add3x3").click(function() {addMatrix(3,3)});
	$("#add4x4").click(function() {addMatrix(4,4)});
	$("#add5x5").click(function() {addMatrix(5,5)});
	
	$("#clear").click(function() {clearEquation()});
	$("#debug").click(function() {populateMatrices()});
	
	$("#paste").click(function() {handlePaste()});
	
	$("#determinant").click(function() {handleDeterminant()});
	$("#add").click(function() {handleAddition()});
	$("#subtract").click(function() {handleSubtraction()});
	$("#multiply").click(function() {handleMultiply()});
	$("#rref").click(function() {handleRREF()});
	$("#aug").click(function() {handleAugMatrix()});
	$("#inverse").click(function() {handleInverse()});
	
	function populateMatrices() {
		var inputs = $("#matrices-container input");
		jQuery.each(inputs, function(i,el) {
			$(el).val(Math.floor(Math.random()*10 + 1)*(Math.random() > 0.5 ? -1 : 1));
		});
	}
	
	// This code will need to be tweaked in order to get a fully funcitoning history working
	function handlePaste() {
		retrieveOutput();
		clearEquation();
		var cols = OutMatrices[0].cols;
		var rows = OutMatrices[0].rows;
		var matrixName = "m0";
		var matrixFieldset = $("<fieldset id=" + matrixName + " data-row=" + rows + " data-col=" + cols + "></fieldset>");
		$("#matrices-container").append(matrixFieldset);
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				var val = OutMatrices[0].get(i, j);
				$("#" + matrixName).append("<input class=\"matrix-input\" value=\"" + val + "\" />");
			}
		}
		
		var fieldsetWidth = 10 + (cols-1)*5;
		var margin = 6.2 - 0.8*(cols-2);
		var inputWidth = (100 - margin*2*cols)/cols;
		
		$("#" + matrixName).css('width', fieldsetWidth + '%');
		$("#" + matrixName + " input").css('width', inputWidth + '%');
		$("#" + matrixName + " input").css('margin', margin + '%');
		$("#" + matrixName).css('display','inline-block');
	}
	
	function handleAddMatrix() {
		$(".matrix-maker").css('display', 'inline-block');
	}
	
	function handleDeterminant() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 1);
		if(valid)
		{
			if(Matrices[0].rows != Matrices[0].cols)
			{
				addOutputMessage("3");
			}
			var output = determinant(Matrices[0], Matrices[0].rows);
			var outputMatrix = new Matrix(1,1);
			outputMatrix.set(output, 0, 0);
			addOutputMatrix(outputMatrix);
		}
			
	}
	
	function handleAddition() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 2);
		if(valid)
		{
			if(Matrices[0].rows != Matrices[1].rows || Matrices[0].cols != Matrices[1].cols)
			{
				addOutputMessage("3");
			} else {
				var outputMatrix = add(Matrices[0], Matrices[1]);
				addOutputMatrix(outputMatrix);
			}
		}	
	}
	
	function handleSubtraction() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 2);
		if(valid) {
			if (Matrices[0].rows != Matrices[1].rows || Matrices[0].cols != Matrices[1].cols) {
				addOutputMessage("3");
			} else {
				var outputMatrix = subtract(Matrices[0], Matrices[1]);
				addOutputMatrix(outputMatrix);
			}
		}
	}
	
	function handleMultiply() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 2);
		if(valid) {
			if (Matrices[0].cols != Matrices[1].rows) {
				addOutputMessage("3");
			} else {
				var outputMatrix = matrixMult(Matrices[0], Matrices[1]);
				addOutputMatrix(outputMatrix);
			}
		}
	}
	
	function handleRREF() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 1);
		if(valid) {
			RREF(Matrices[0], 0);
			addOutputMatrix(Matrices[0]);
		}
	}
	
	function handleAugMatrix() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 1);
		if (valid) {
			RREF(Matrices[0], 1);
			addOutputMatrix(Matrices[0]);
		}
	}
	
	function handleInverse() {
		retrieveInput();
		var valid = checkErrors(numInputMatrices, 1);
		if (valid) {
			if(Matrices[0].rows != Matrices[0].cols)
			{
				addOutputMessage("3");
			}
			else if(determinant(Matrices[0], Matrices[0].rows) == 0)
			{
				addOutputMessage("Matrix is not invertible.");
			}
			else {
				inverse(Matrices[0]);
				addOutputMatrix(Matrices[0]);
			}
		}
	}
	
	function retrieveInput() {
		for (var i = 1; i <= numInputMatrices; i++) {
			Matrices[i - 1] = retrieveMatrix("m" + i);
		}
	}
	
	function retrieveOutput() {
		for (var i = 1; i <= numOutputMatrices; i++) {
			OutMatrices[i - 1] = retrieveMatrix("o" + i);
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
		
		var fieldsetWidth = 10 + (cols-1)*8;
		var margin = 5 - 0.5*(cols-2);
		var inputWidth = (100 - margin*2*cols)/cols;
		
		$("#" + matrixName).css('width', fieldsetWidth + '%');
		$("#" + matrixName + " input").css('width', inputWidth + '%');
		$("#" + matrixName + " input").css('margin', margin + '%');
		$("#" + matrixName).css('display','inline-block');
	}
	
	function addOutputMatrix(matrix) {
		clearOutput();
		numOutputMatrices++;
		var matrixName = "o" + numOutputMatrices;
		var matrixFieldset = $("<fieldset id=" + matrixName + " data-row=" + matrix.rows + " data-col=" + matrix.cols + "></fieldset>");
		$("#output-container").append(matrixFieldset);
		for (var i = 0; i < matrix.rows; i++) {
			for (var j = 0; j < matrix.cols; j++) {
				var val = matrix.get(i, j);
				$("#" + matrixName).append("<input type=\"text\" class=\"matrix-output\" value=\"" + val + "\" disabled />");
			}
		}
		
		var fieldsetWidth = 10 + (matrix.cols-1)*5;
		var margin = 6.2 - 0.8*(matrix.cols-2);
		var inputWidth = (100 - margin*2*matrix.cols)/matrix.cols;
		
		$("#" + matrixName).css('width', fieldsetWidth + '%');
		$("#" + matrixName + " input").css('width', inputWidth + '%');
		$("#" + matrixName + " input").css('margin', margin + '%');
		$("#" + matrixName).css('display','inline-block');
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
		var output;
		switch(msg)
		{
			case "1": output = "Not enough matrices to compute."; break;
			case "2": output = "Too many matrices to compute."; break;
			case "3": output = "Incorrect rows/columns to compute."; break;
			default: output = msg;
		}
		error.html(output);
	}
	
	function clearEquation()
	{
		$("#matrices-container").empty();
		$("#outputError").empty();
		numInputMatrices = 0;
	}
	
	function clearOutput() {
		$("#output-container").empty();
		numOutputMatrices = 0;
	}

	function retrieveMatrix(matrixName) {
		var rows = $("#" + matrixName).attr("data-row");
		var cols = $("#" + matrixName).attr("data-col");
		var A = new Matrix(rows, cols);
		var inputs = $("#" + matrixName + " input");
		jQuery.each(inputs, function(i, el) {
			var element = $(el).val();
			if (element != "")
			{
				A.set(parseFloat(element), Math.floor(i/cols), i%cols);
			}
		});
		return A;
	}
});
