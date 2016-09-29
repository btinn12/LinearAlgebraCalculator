$(document).ready(function() {
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
});