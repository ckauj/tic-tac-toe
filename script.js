function gameBoard() {
    const dimensions = 3;
    const board = Array(dimensions).fill().map(() => Array(dimensions).fill(0));

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
        let route = []; // Returns winning route

        // check diagonal right
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


        // check diagonal left
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

        // check right
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

        // check down
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

    return {playRound, getActivePlayer, setPlayerName, getWinner};
}

function gameDisplay() {
    const newGame = playGame();
    const dimensions = 3;
    const squareContainerElem = document.querySelector('.square-container');
    const modalOuterElem = document.querySelector('.modal-outer');
    const modalInnerElem = document.querySelector('.modal-inner');
    const playerOneTurnElem = document.querySelector('.player-one-turn');
    const playerTwoTurnElem = document.querySelector('.player-two-turn');

    resetGameDisplay()
    removeSquaresFromBoard();
    
    // Removes open class from modal or does nothing
    // Modal exists if previous game ended naturally
    // Remove any message previously in modal
    modalOuterElem.classList.toggle('open', false);
    modalInnerElem.textContent = "";

    // Removes hide class from playerOneTurn div or does nothing
    // Displays 'Your Move!' in player one container
    playerOneTurnElem.classList.toggle('hide', false);
    
    const togglePlayerTurn = () => {
        playerOneTurnElem.classList.toggle('hide');
        playerTwoTurnElem.classList.toggle('hide');
    };

    endGameBtn.addEventListener('click', removeSquaresFromBoard);
    endGameBtn.addEventListener('click', resetGameDisplay);

    const setPlayerNames = (function() {
        const playerOneInpElem = document.getElementById('player-one-name');
        const playerTwoInpElem = document.getElementById('player-two-name');

        const playerOne = playerOneInpElem.value !== "" ? playerOneInpElem.value : 'Player One';
        const playerTwo = playerTwoInpElem.value !== "" ? playerTwoInpElem.value : 'Player Two';

        playerOneInpElem.value = "";
        playerTwoInpElem.value = "";

        // Changes player names in DOM to value of player name inputs
        document.getElementById('player-one').textContent = playerOne;
        document.getElementById('player-two').textContent = playerTwo;

        newGame.setPlayerName(playerOne, playerTwo);
    })();

    const squareClick = (square) => {
        const row = square.getAttribute('row');
        const col = square.getAttribute('col');

        square.disabled = true;
        
        nextMove = newGame.playRound(row, col);

        if(typeof nextMove === 'string') {
            square.textContent = nextMove;
            togglePlayerTurn();
        }
            
        isFinishedGame(newGame.getWinner());

    };

    const isFinishedGame = (gameStatus) => {
        // No winner/tie yet
        if(gameStatus === undefined) {
            return;
        }

        if(gameStatus === false) {
            modalInnerElem.textContent = 'This game was a tie!';
        } else {
            for(let square = 0; square < dimensions; square++) {

                // getWinner() returns route - which is winning squares on board
                const row = gameStatus.route[square].row;
                const col = gameStatus.route[square].col;
    
                const squareElem = document.querySelector(`[row="${row}"][col="${col}"]`);
                squareElem.classList.add('win-square');
                
                modalInnerElem.textContent = `${newGame.getActivePlayer()} is the winner!`;
            }
        }

        modalOuterElem.classList.toggle('open');
        
        // Disable all squares to avoid click events
        // Change unplayed squares background color for clarity
        squareContainerElem.querySelectorAll('button').forEach(
            (square) => {
                square.disabled = true;
                if(square.textContent === "") {
                    square.classList.toggle('disabled');
                }
            });

        resetGameDisplay()
    };

    // Inital squares added to game board
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

    function removeSquaresFromBoard() {
        while(squareContainerElem.firstChild) {
            squareContainerElem.removeChild(squareContainerElem.firstChild);
        }    
    }

    // Function to set things back to orignal state for next game
    // These occur whether game ends naturally or endGameBtn was clicked
    function resetGameDisplay() {
        const playerNamesContainerElem = document.querySelector('.player-names');

        playerNamesContainerElem.classList.toggle('hide');
        playerOneTurnElem.classList.toggle('hide', true);
        playerTwoTurnElem.classList.toggle('hide', true);
        endGameBtn.removeEventListener('click', removeSquaresFromBoard);
        endGameBtn.removeEventListener('click', resetGameDisplay);
        toggleGameBtns();
    }
}
const endGameBtn = document.querySelector('.footer-game-end-button');
endGameBtn.disabled = true;

const startGameBtn = document.querySelector('.footer-game-start-button');
startGameBtn.addEventListener('click', () => {
    gameDisplay();
});