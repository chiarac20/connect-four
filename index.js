const NUM_OF_ROWS=6;
const NUM_OF_COLS=7;
const gridDom=document.getElementById('grid');
const PLAYERS_COLOURS = ['red', 'blue'];
let usedCells = 0;
const USED_CELL='used-cell';
init();

function init() {
    const grid=document.getElementById('grid');
    grid.innerText='';
    createCells();
    winner=null;
}

function createCells(){
    for (let rowNum=0; rowNum<NUM_OF_ROWS; rowNum++) {
        const divDom=document.createElement('div');
        gridDom.appendChild(divDom);
        divDom.classList.add('row');
        divDom.dataset.row=rowNum;
        for (let colNum=0; colNum<NUM_OF_COLS; colNum++) {
            const cellDom=document.createElement('button');
            divDom.appendChild(cellDom);
            cellDom.dataset.cell=('cell')
            cellDom.dataset.column=colNum;
            cellDom.dataset.row=rowNum;
            cellDom.addEventListener('click', ()=>{
                checkWinner(cellDom);
            })
        }
    }
} 

function checkWinner (cell) {
    if (winner) {
        return;
    }
    const columnClickedCell=cell.dataset.column;
    const cellToColour=identifyCellToColour(columnClickedCell); 
    const winningCells=colourCell(cellToColour);
    if (winningCells) {
        winner=winningCells[0].dataset.colour;
        winningCells.forEach(winningCell=>{
            winningCell.classList.add('winning-cell');
        })
        setTimeout((()=>{
            alert('The winner is '+ winner)
            init()
        }), 0)
    }   
}

function identifyCellToColour (colNum){
    const cells=[...document.querySelectorAll('[data-column="'+colNum+'"][data-row]')].reverse();
    return cells.find(cell => {    
        return checkStatus(cell, PLAYERS_COLOURS);
    });
}

function colourCell(cellDom){
    if (!cellDom) {
        return;
    }
    const playerId = usedCells%PLAYERS_COLOURS.length;
    cellDom.dataset.colour=PLAYERS_COLOURS[playerId];
    usedCells++; 
    const diagonalCells=getDiagonalCells(cellDom)
    return checkVerticalCells(cellDom, PLAYERS_COLOURS[playerId]) ||
        checkHorizontalCells(cellDom, PLAYERS_COLOURS[playerId]) ||
        checkDiagonalCells(diagonalCells, PLAYERS_COLOURS[playerId])
}

function checkStatus (element, status) {
    return !status.some(colour=>element.dataset.colour===colour);
}

function checkVerticalCells(cell, colour) {
    const column= +cell.dataset.column;
    const row=+cell.dataset.row;
    const cellsSameCol=[...document.querySelectorAll(`[data-colour="${colour}"][data-column="${column}"]`)];
    const winningCells= cellsSameCol.filter(cell=>{
        return cell.dataset.row<=row+3;
    });
    return (winningCells.length<4) ? undefined : winningCells;
}

function checkHorizontalCells(cell, colour){
    const column= +cell.dataset.column;
    const row=+cell.dataset.row;
    const cellsRightSide=getHorizontalCells(row, column);
    const cellsLeftSide=getHorizontalCells(row, column-3);
    const cells1Right2Left=getHorizontalCells(row, column-2);
    const cells2Right1Left=getHorizontalCells(row, column-1);
    const winnerCombination=[cellsRightSide, cellsLeftSide, cells1Right2Left, cells2Right1Left].find((element)=>{
        return checkColouredCells(element, colour);
    });
    return winnerCombination;
}

function getHorizontalCells (row, column) {
    return [getCell(row, column), getCell(row, column+1), getCell(row, column+2), getCell(row, column+3)];
}

function getCell(row, column) {
    return document.querySelector(`[data-row="${row}"][data-column="${column}"]`);
}

function checkColouredCells(cells, colour){
    return cells.every (cell=>{
        return cell && cell.dataset.colour === colour;
    })
}

function getDiagonalCells (cell) {
    const column= +cell.dataset.column;
    const row=+cell.dataset.row;
    const lastFilledCell = getCell(row, column);
    return [
        //1Up2DownRight
        [lastFilledCell, getCell(row+1, column+1), getCell(row+2, column+2), getCell(row-1, column-1)],
        //1Up2DownLeft
        [lastFilledCell, getCell(row+1, column-1), getCell(row+2, column-2), getCell(row-1, column+1)],
        //downRigth
        [lastFilledCell, getCell(row+1, column+1), getCell(row+2, column+2), getCell(row+3, column+3)],
        //downLeft
        [lastFilledCell, getCell(row+1, column-1), getCell(row+2, column-2), getCell(row+3, column-3)],
        //2Up1DownRight
        [lastFilledCell, getCell(row+1, column-1), getCell(row-1, column+1), getCell(row-2, column+2)],
        //2Up1DownLeft
        [lastFilledCell, getCell(row+1, column+1), getCell(row-1, column-1), getCell(row-2, column-2)],
        //upRight
        [lastFilledCell, getCell(row-1, column+1), getCell(row-2, column+2), getCell(row-3, column+3)],
        //upLeft
        [lastFilledCell, getCell(row-1, column-1), getCell(row-2, column-2), getCell(row-3, column-3)]
    ]
}

function checkDiagonalCells(cells, colour) {
    return cells
        .find((element)=>checkColouredCells(element, colour));
}









