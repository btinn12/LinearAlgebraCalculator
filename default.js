$(document).ready(function () {
		
	var numInputMatrices = 0;
	var numOutputMatrices = 0;
	var Matrices = [];
	var OutMatrices = [];
	
	$("#addMatrix").click(function() {handleAddMatrix()});
	$("#create").click(function() {createMatrix()});
	$("#closeCreation").click(function() {closeCreationRow()});
	$("#add2x2").click(function() {addMatrix(2, 2, "input")});
	$("#add3x3").click(function() {addMatrix(3, 3, "input")});
	$("#add4x4").click(function() {addMatrix(4, 4, "input")});
	$("#add5x5").click(function() {addMatrix(5, 5, "input")});
	
	$("#clear").click(function() {clearEquation()});
	$("#debug").click(function() {populateMatrices()});
	
	$("#paste").click(function() {handlePaste()});
	
	$("#determinant").click(function() {handleOperation(handleDeterminant)});
	$("#add").click(function() {handleOperation(handleAddition)});
	$("#subtract").click(function() {handleOperation(handleSubtraction)});
	$("#multiply").click(function() {handleOperation(handleMultiply)});
	$("#rref").click(function() {handleOperation(handleRREF)});
	$("#aug").click(function() {handleOperation(handleAugMatrix)});
	$("#inverse").click(function() {handleOperation(handleInverse)});
	
	function handleOperation(op) {
		retrieveInput();
		var inputCheck = Matrices;
		var valid = checkErrors(op, inputCheck);
		if (valid) {
			op();
			addMatrix(OutMatrices[0].rows, OutMatrices[0].cols, "output", OutMatrices[0]);
		}
	}
	
	function populateMatrices() {
		var inputs = $("#matrices-container input");
		jQuery.each(inputs, function(i,el) {
			$(el).val(Math.floor(Math.random()*10 + 1)*(Math.random() > 0.5 ? -1 : 1));
		});
	}
	
	// This code will need to be tweaked in order to get a fully funcitoning history working
	function handlePaste() {
		retrieveOutput();
		addMatrix(OutMatrices[0].rows, OutMatrices[0].cols, "input", OutMatrices[0]);
	}
	
	function handleAddMatrix() {
		$(".matrix-maker").css('display', 'inline-block');
	}
	
	function closeCreationRow() {
		$(".matrix-maker").css('display', 'none');
	}
	
	function handleDeterminant() {
		OutMatrices[0] = new Matrix(1, 1);
		OutMatrices[0].set(determinant(Matrices[0], Matrices[0].rows), 0, 0);
	}
	
	function handleAddition() {
		OutMatrices[0] = add(Matrices[0], Matrices[1]);
	}
	
	function handleSubtraction() {
		OutMatrices[0] = subtract(Matrices[0], Matrices[1]);
	}
	
	function handleMultiply() {
		OutMatrices[0] = matrixMult(Matrices[0], Matrices[1]);
	}
	
	function handleRREF() {
		OutMatrices[0] = RREF(Matrices[0], 0);
	}
	
	function handleAugMatrix() {
		OutMatrices[0] = RREF(Matrices[0], 1);
	}
	
	function handleInverse() {
		OutMatrices[0] = inverse(Matrices[0]);
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
			closeCreationRow();
		}
	}
	
	function addMatrix(rows, cols, location, matrix) {
		var matrixName;
		
		var fieldsetWidth = 10 + (cols-1)*8;
		var margin = 5 - 0.5*(cols-2);
		var inputWidth = (100 - margin*2*cols)/cols;
		
		if (matrix === undefined) {
			numInputMatrices++;
			matrixName = "m" + numInputMatrices;
			var matrixFieldset = $("<fieldset id=\"" + matrixName + "\" class=\"matrix-input\" data-row=\"" + rows + "\" data-col=\"" + cols + "\"></fieldset>");
			$("#matrices-container").append(matrixFieldset);
			$("#" + matrixName).css('display', 'none');
			for(i = 0;i<rows*cols;i++) {
				$("#" + matrixName).append($("<input class=\"matrix-input\" />"));
				
			}
		} else if (location === "input") {
			numInputMatrices++;
			matrixName = "m" + numInputMatrices;
			var matrixFieldset = $("<fieldset id=\"" + matrixName + "\" class=\"matrix-input\" data-row=" + rows + " data-col=" + cols + "></fieldset>");
			$("#matrices-container").append(matrixFieldset);
			for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					var val = OutMatrices[0].get(i, j);
					$("#" + matrixName).append("<input class=\"matrix-input\" value=\"" + val + "\" />");
				}
			}
		} else {
			clearOutput();
			numOutputMatrices++;
			matrixName = "o" + numOutputMatrices;
			var matrixFieldset = $("<fieldset id=" + matrixName + " class=\"matrix-output\" data-row=" + rows + " data-col=" + cols + "></fieldset>");
			$("#output-container").append(matrixFieldset);
			for (var i = 0; i < matrix.rows; i++) {
				for (var j = 0; j < matrix.cols; j++) {
					var val = matrix.get(i, j);
					var setValue = parseFloat(val);
					val = (setValue.toExponential().replace(/e[\+\-0-9]*$/, '').replace( /^0\.?0*|\./, '').length < 4 ? setValue : setValue.toPrecision(4));
					$("#" + matrixName).append("<input type=\"text\" class=\"matrix-output\" value=\"" + val + "\" disabled />");
				}
			}
		}
		
		$("#" + matrixName).css('width', fieldsetWidth + '%');
		$("#" + matrixName + " input").css('width', inputWidth + '%');
		$("#" + matrixName + " input").css('margin', margin + '%');
		$("#" + matrixName).css('display','inline-block');
	}
	
	function checkErrors(operation, input) {
		switch(operation) {
			case handleDeterminant:
				if (!checkNumInputs(numInputMatrices, 1)) {
					return false;
				} else if (input[0].rows !== input[0].cols) {
					addOutputMessage("3");
					return false;
				}
				return true;
			case handleAddition:
				if (!checkNumInputs(numInputMatrices, 2)) {
					return false;
				} else if (input[0].rows !== input[1].rows || input[0].cols !== input[1].cols) {
					addOutputMessage("3");
					return false;
				}
				return true;
			case handleSubtraction:
				if (!checkNumInputs(numInputMatrices, 2)) {
					return false;
				} else if (input[0].rows !== input[1].rows || input[0].cols !== input[1].cols) {
					addOutputMessage("3");
					return false;
				}
				return true;
			case handleMultiply:
				if (!checkNumInputs(numInputMatrices, 2)) {
					return false;
				} else if (input[0].cols !== input[0].rows) {
					addOutputMessage("3");
					return false;
				}
				return true;
			case handleRREF:
				if (!checkNumInputs(numInputMatrices, 1)) {
					return false;
				} else
				return true;
			case handleAugMatrix:
				if (!checkNumInputs(numInputMatrices, 1)) {
					return false;
				}
				return true;
			case handleInverse:
				if (!checkNumInputs(numInputMatrices, 1)) {
					return false;
				} else if (determinant(input[0], input[0].rows) == 0) {
					return false;
				}
				return true;
			default:
				return false;
		}
	}
	
	function checkNumInputs(numInputs, requiredInputs) {
		if (numInputs < requiredInputs) {
			addOutputMessage("1");
			return false;
		} else if (numInputs > requiredInputs) {
			addOutputMessage("2");
			return false;
		} else {
			return true;
		}
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
