function GameBoard() {
    this.dimensions = 3;
    this.board = Array(this.dimensions).fill().map(() => Array(this.dimensions).fill(0));

    this.getSquareValue = (row, col) => {
        return this.board[row][col];
    };

    this.setSquareValue = (row, col, symbol) => {
        this.board[row][col] = symbol;
    };

    this.flattenBoard = () => {
        return this.board.flat();
    };
}


