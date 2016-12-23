/*
*The History() object keeps track of past operations by holding the inputs, outputs, and
*operations performed in different arrays. The input and output arrays are arrays of objects,
*which hold all the matrices that were inputed or outputed during the operation. The op array
*just holds strings which correspond to potential operations performed. All these arrays are
*implemented in a queue-like fashion so that a maximum number of objects are held to save memory.
*It does this by overwriting the oldest values in the arrays with the newest. 
*/
function History() {
	this.historyLength = 10;
	this.tail = 0;
	
	this.input = [];
	this.output = [];
	this.op = [];
}

History.prototype.add = function(obj) {
	this.input[this.input.length % this.historyLength] = obj.input;
	this.output[this.output.length % this.historyLength] = obj.output;
	this.op[this.op.length % this.historyLength] = obj.op;
	this.tail = this.tail + 1 % this.historyLength;
}

// Will return an object with the information of the operation performed,
// with index being equal to the number of operations you want to go back
History.prototype.lookUp = function(index) {
	if (index < this.historyLength && index > 0) {
		var returnObj = {
			"input": this.input[index + (this.historyLength - this.tail) % this.historyLength],
			"output": this.output[index + (this.historyLength - this.tail) % this.historyLength],
			"op": this.op[index + (this.historyLength - this.tail) % this.historyLength]
		};
		return returnObj;
	}
}

History.prototype.clear = function() {
	this.tail = 0;
	this.input = [];
	this.output = [];
	this.op = [];
}