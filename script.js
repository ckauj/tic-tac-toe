function gameBoard() {
    dimensions = 3;
    board = Array(dimensions).fill().map(() => Array(dimensions).fill(0));

    const getSquareValue = (row, col) => {
        return board[row][col];
    };

    const setSquareValue = (row, col, symbol) => {
        board[row][col] = symbol;
    };

    const flattenBoard = () => {
        return board.flat();
    };

    return {getSquareValue, setSquareValue, flattenBoard};
}