document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const newGameButton = document.getElementById("new-game");
    const undoButton = document.getElementById("undo");

    let grid = Array.from({ length: 16 }, () => null);
    let score = 0;
    let previousState = [];
    let dragStartX = 0;
    let dragStartY = 0;
    let selectedTileIndex = null;

    function initializeGame() {
        addRandomTile();
        addRandomTile();
        updateGrid();
        updateScore();
    }

    function addRandomTile() {
        const emptyCells = grid.map((tile, index) => tile === null ? index : null).filter(index => index !== null);
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell] = Math.random() < 0.9 ? 2 : 4;
    }

    function updateGrid() {
        gridContainer.innerHTML = "";
        grid.forEach((tile, index) => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            tileElement.dataset.index = index;
            if (tile) {
                tileElement.textContent = tile;
                tileElement.classList.add(`tile-${tile}`);
                switch (tile) {
                    case 2:
                        tileElement.style.backgroundColor = "#FFD700";
                        break;
                    case 4:
                        tileElement.style.backgroundColor = "#FF6347";
                        break;
                    case 8:
                        tileElement.style.backgroundColor = "#4682B4";
                        break;
                    case 16:
                        tileElement.style.backgroundColor = "#32CD32";
                        break;
                    case 32:
                        tileElement.style.backgroundColor = "#8A2BE2";
                        break;
                    case 64:
                        tileElement.style.backgroundColor = "#FF69B4";
                        break;
                    case 128:
                        tileElement.style.backgroundColor = "#00CED1";
                        break;
                    case 256:
                        tileElement.style.backgroundColor = "#FF8C00";
                        break;
                    case 512:
                        tileElement.style.backgroundColor = "#800080";
                        break;
                    case 1024:
                        tileElement.style.backgroundColor = "#008080";
                        break;
                    case 2048:
                        tileElement.style.backgroundColor = "#FF1493";
                        break;
                    default:
                        tileElement.style.backgroundColor = "#A9A9A9";
                        break;
                }                
            }
            gridContainer.appendChild(tileElement);
        });
    }

    function updateScore() {
        scoreDisplay.textContent = score;
    }

    function moveTile(index, direction) {
        saveState();
        let moved = false;

        const row = Math.floor(index / 4);
        const col = index % 4;

        let targetIndex;

        switch (direction) {
            case "up":
                if (row > 0) {
                    targetIndex = index - 4;
                }
                break;
            case "down":
                if (row < 3) {
                    targetIndex = index + 4;
                }
                break;
            case "left":
                if (col > 0) {
                    targetIndex = index - 1;
                }
                break;
            case "right":
                if (col < 3) {
                    targetIndex = index + 1;
                }
                break;
        }

        if (targetIndex !== undefined) {
            if (grid[targetIndex] === null) {
                grid[targetIndex] = grid[index];
                grid[index] = null;
                moved = true;
            } else if (grid[targetIndex] === grid[index]) {
                grid[targetIndex] *= 2;
                grid[index] = null;
                score += grid[targetIndex];
                moved = true;
            }
        }

        if (moved) {
            addRandomTile();
            updateGrid();
            updateScore();
            checkGameOver();
        }
    }

    function saveState() {
        previousState = { grid: [...grid], score };
    }

    function undo() {
        if (previousState.grid) {
            grid = [...previousState.grid];
            score = previousState.score;
            updateGrid();
            updateScore();
        }
    }

    function checkGameOver() {
        if (!grid.includes(null) && !canMove()) {
            alert("Game Over!");
        }
    }

    function canMove() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (j < 3 && grid[i * 4 + j] === grid[i * 4 + j + 1]) return true;
                if (i < 3 && grid[i * 4 + j] === grid[(i + 1) * 4 + j]) return true;
            }
        }
        return false;
    }

    function handleTouchStart(e) {
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        const target = e.target.closest(".tile");
        if (target) {
            selectedTileIndex = parseInt(target.dataset.index, 10);
        }
    }

    function handleTouchEnd(e) {
        const dragEndX = e.changedTouches[0].clientX;
        const dragEndY = e.changedTouches[0].clientY;
        const dx = dragEndX - dragStartX;
        const dy = dragEndY - dragStartY;

        if (selectedTileIndex !== null) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) moveTile(selectedTileIndex, "right");
                else moveTile(selectedTileIndex, "left");
            } else {
                if (dy > 0) moveTile(selectedTileIndex, "down");
                else moveTile(selectedTileIndex, "up");
            }
            selectedTileIndex = null;
        }
    }

    function handleMouseStart(e) {
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const target = e.target.closest(".tile");
        if (target) {
            selectedTileIndex = parseInt(target.dataset.index, 10);
        }
    }

    function handleMouseEnd(e) {
        const dragEndX = e.clientX;
        const dragEndY = e.clientY;
        const dx = dragEndX - dragStartX;
        const dy = dragEndY - dragStartY;

        if (selectedTileIndex !== null) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) moveTile(selectedTileIndex, "right");
                else moveTile(selectedTileIndex, "left");
            } else {
                if (dy > 0) moveTile(selectedTileIndex, "down");
                else moveTile(selectedTileIndex, "up");
            }
            selectedTileIndex = null;
        }
    }

    document.addEventListener("mousedown", handleMouseStart);
    document.addEventListener("mouseup", handleMouseEnd);

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    newGameButton.addEventListener("click", () => {
        grid = Array.from({ length: 16 }, () => null);
        score = 0;
        initializeGame();
    });

    undoButton.addEventListener("click", undo);

    initializeGame();
});
