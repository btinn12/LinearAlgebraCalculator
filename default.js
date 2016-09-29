$(document).ready(function() {
	function Matrix(rows, cols) {

    this.rows = rows;
    this.cols = cols;
    this.val = [];
    this.initialize = function() {
      for (var i = 0; i < rows; i++) {
          this.val[i] = new Array();
          for (var j = 0; j < cols; j++) {
              this.val[i][j] = 0;
          }
      }
    };
    this.get = function(r, c) {
        return this.val[r][c];
    };

  }
});