const NUM_OF_ROWS=6;
const NUM_OF_COLS=7;
const gridDom=document.getElementById('grid');
init()
const cellsDom=[...document.querySelectorAll('[data-cell]')];
const PLAYERS_COLOURS = ['red', 'blue'];
let usedCells = 0;
const USED_CELL='used-cell';
let winner=null;

function init(){
    const grid=document.getElementById('grid');
    grid.innerText='';
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
        }
    }
} 

cellsDom.forEach(cell=>{
    cell.addEventListener('click', ()=>{
        if (winner) {
            return;
        }
        const columnClickedCell=cell.dataset.column;
        const cellToColour=identifyCellToColour(columnClickedCell); 
        const winningCells=colourCell(cellToColour);
        if(winningCells) {
            winner=winningCells[0].classList;
            setTimeout((()=>{
                alert('The winner is '+ winner)
                init()
            }), 500)
        }
    })
})

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
    cellDom.classList.add(PLAYERS_COLOURS[playerId]);
    usedCells++; 
    const diagonalCells=getDiagonalCells(cellDom)
    return checkVerticalCells(cellDom, PLAYERS_COLOURS[playerId]) ||
        checkHorizontalCells(cellDom, PLAYERS_COLOURS[playerId]) ||
        checkDiagonalCells(diagonalCells, PLAYERS_COLOURS[playerId])
}

function checkStatus (element, status) {
    return !status.some(colour=>element.classList.contains(colour));
}

function checkVerticalCells(cell, colour) {
    const column= +cell.dataset.column;
    const row=+cell.dataset.row;
    const cellsSameCol=[...document.querySelectorAll(`.${colour}[data-column="${column}"]`)];
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
    })
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
        if(cell!==null) {
            return cell.classList.contains(colour);
        }  
    })
}

function getDiagonalCells (cell) {
    const column= +cell.dataset.column;
    const row=+cell.dataset.row;
    return [
        //1Up2DownRight
        [getCell(row, column), getCell(row+1, column+1), getCell(row+2, column+2), getCell(row-1, column-1)],
        //1Up2DownLeft
        [getCell(row, column), getCell(row+1, column-1), getCell(row+2, column-2), getCell(row-1, column+1)],
        //downRigth
        [getCell(row, column), getCell(row+1, column+1), getCell(row+2, column+2), getCell(row+3, column+3)],
        //downLeft
        [getCell(row, column), getCell(row+1, column-1), getCell(row+2, column-2), getCell(row+3, column-3)],
        //2Up1DownRight
        [getCell(row, column), getCell(row+1, column-1), getCell(row-1, column+1), getCell(row-2, column+2)],
        //2Up1DownLeft
        [getCell(row, column), getCell(row+1, column+1), getCell(row-1, column-1), getCell(row-2, column-2)],
        //upRight
        [getCell(row, column), getCell(row-1, column+1), getCell(row-2, column+2), getCell(row-3, column+3)],
        //upLeft
        [getCell(row, column), getCell(row-1, column-1), getCell(row-2, column-2), getCell(row-3, column-3)]
    ]
}

function checkDiagonalCells(cells, colour) {
    const oneUpTwoDownRight=cells[0];
    const oneUpTwoDownLeft=cells[1];
    const DownRight=cells[2];
    const DownLeft=cells[3];
    const twoUpOneDownRight=cells[4];
    const twoUpOneDownLeft=cells[5];
    const upRight=cells[6];
    const upLeft=cells[7];
    const winnerCombination=[oneUpTwoDownRight, oneUpTwoDownLeft, DownRight, DownLeft, twoUpOneDownRight,
    twoUpOneDownLeft, upRight, upLeft].find((element)=>{
        return checkColouredCells(element, colour);
    })
    return winnerCombination;
}









