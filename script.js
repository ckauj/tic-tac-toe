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

    // Only for console version
    const printBoard = () => {
        console.table(board);
    };

    return {getSquareValue, setSquareValue, flattenBoard, printBoard};
}

function playGame() {
    const board = gameBoard();
    const players = [
        {name: 'Player One', symbol: 'X'}, 
        {name: 'Player Two', symbol: 'O'}];
    
    let activePlayer = players[0];
    
    const setActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => {return activePlayer.name};

    const setPlayerName = (playerOne, playerTwo) => {
        players[0].name = playerOne;
        players[1].name = playerTwo; 
    };

    const playRound = (row, col) => {
        // Only for first move - best way I can think of fixing atm
        // Sets active player to O, so active player can be X in next if statement
        // Also lets HTML display correct person's turn on gamestart
        if(board.flattenBoard().every((val) => val === 0)) {
            setActivePlayer();
        }

        if(board.getSquareValue(row, col) === 0 && getWinner() === undefined) {
            setActivePlayer();
            board.setSquareValue(row, col, activePlayer.symbol);
            return activePlayer.symbol;
        }
    };

    const getWinner = () => {
        // tic-tac-toe board is  3 x 3
        // Not setting to static number incase dimensions change
        const len = Math.sqrt(board.flattenBoard().length);
        let matches = 0;
        let route = [];

        // diagonal right
        // diag right is (n, n) => (row, row)
        for(let row = 0; row < len; row++) {
            if(board.getSquareValue(row, row) !== activePlayer.symbol){
                matches = 0;
                route.splice(0);
                break;
            }
            route.push({row, col:row})
            matches++;
        }

        if(matches === len)
            return {flag: true , route};


        // diagonal left
        for(let row = 0, col = len - 1; row < len; row++, col--) {
            if(board.getSquareValue(row, col) !== activePlayer.symbol) {
                matches = 0;
                route.splice(0);
                break;
            }
            route.push({row, col})
            matches++;
        }

        if(matches === len) {
            return {flag: true , route};
        }

        // right
        for(let row = 0; row < len; row++) {
            for(let col = 0; col < len; col++) {
                if(board.getSquareValue(row, col) !== activePlayer.symbol) {
                    matches = 0;
                    route.splice(0);
                    break;
                }
                route.push({row, col})
                matches++;
            }

            if(matches === len) {
                return {flag: true , route};
            }

        }

        // down
        for(let col = 0; col < len; col++) {
            for(let row = 0; row < len; row++) {
                if(board.getSquareValue(row, col) !== activePlayer.symbol) {
                    matches = 0;
                    route.splice(0);
                    break;
                }

                route.push({row, col})
                matches++;
            }
            if(matches === len) {
                return {flag: true , route};
            }

        }

        if(board.flattenBoard().every((val) => val !== 0))
            return false;
    };

    const printGameBoard = () => {
        board.printBoard();
    };

    return {playRound, getActivePlayer, setPlayerName, printGameBoard, getWinner};
}

function gameDisplay() {
    const newGame = playGame();
    const dimensions = 3;
    const squareContainerElem = document.querySelector('.square-container');
    const modalOuterElem = document.querySelector('.modal-outer');
    const modalInnerElem = document.querySelector('.modal-inner');
    const playerNamesContainerElem = document.querySelector('.player-names');

    clearBoard();
    // Only toggles off or does nothing
    modalOuterElem.classList.toggle('open', false);
    playerNamesContainerElem.classList.toggle('hide', true);
    modalInnerElem.textContent = "";
    endGameBtn.addEventListener('click', clearBoard);

    const setPlayerNames = (function() {
        const playerOneInpElem = document.getElementById('player-one-name');
        const playerTwoInpElem = document.getElementById('player-two-name');

        const playerOne = playerOneInpElem.value !== "" ? playerOneInpElem.value : 'Player One';
        const playerTwo = playerTwoInpElem.value !== "" ? playerTwoInpElem.value : 'Player Two';

        document.getElementById('player-one').textContent = playerOne;
        document.getElementById('player-two').textContent = playerTwo;

        newGame.setPlayerName(playerOne, playerTwo);
    })();

    const squareClick = (btn) => {
        const row = btn.getAttribute('row');
        const col = btn.getAttribute('col');

        btn.disabled = true;
        nextMove = newGame.playRound(row, col);

        if(typeof nextMove === 'string') {
            btn.textContent = nextMove;
        }
            
        isWinner(newGame.getWinner());

    };

    const isWinner = (gameStatus) => {
        // No winner/tie yet
        if(gameStatus === undefined) {
            return;
        }

        if(gameStatus === false) {
            modalInnerElem.textContent = 'This game was a tie!';
        } else {
            for(let sqr = 0; sqr < dimensions; sqr++) {
                const row = gameStatus.route[sqr].row;
                const col = gameStatus.route[sqr].col;
    
                const squareElem = document.querySelector(`[row="${row}"][col="${col}"]`);
                squareElem.classList.add('win-square');
                modalInnerElem.textContent = `${newGame.getActivePlayer()} is the winner!`;
            }
        }

        // something that ends the game
        endGame();
    };

    const endGame = () => {
        modalOuterElem.classList.toggle('open');
        playerNamesContainerElem.classList.toggle('hide', false);
        // When startGame is clicked after win, old eventListener stays on endGameBtn
        // ...even though clearBoard() runs on new game
        endGameBtn.removeEventListener('click', clearBoard);
        toggleGameBtns();
    };

    for(let row = 0; row < dimensions; row++) {
        for(let col = 0; col < dimensions; col++) {
            const squareElem = document.createElement('button');
            squareElem.setAttribute('row', row);
            squareElem.setAttribute('col', col);
            squareElem.classList.add('square');
            squareElem.addEventListener('click', () => {
                squareClick(squareElem);
            });

            squareContainerElem.appendChild(squareElem);
        }
    }

    function toggleGameBtns() {
        startGameBtn.disabled = startGameBtn.disabled === true ? false : true;
        endGameBtn.disabled = endGameBtn.disabled === true ? false : true;
    }

    function clearBoard() {
        playerNamesContainerElem.classList.toggle('hide', false);
        while(squareContainerElem.firstChild) {
            squareContainerElem.removeChild(squareContainerElem.firstChild);
        }
        endGameBtn.removeEventListener('click', clearBoard);
        toggleGameBtns();
    }

}
const endGameBtn = document.querySelector('.footer-game-end-button');
endGameBtn.disabled = true;

const startGameBtn = document.querySelector('.footer-game-start-button');
startGameBtn.addEventListener('click', () => {
    gameDisplay();
});