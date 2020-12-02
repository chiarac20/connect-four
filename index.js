const NUM_OF_ROWS=6;
const NUM_OF_COLS=7;
const gridDom=document.getElementById('grid');
createCells()
const cellsDom=[...document.getElementsByClassName("cell")];
const PLAYERS_COLOURS = ['red', 'blue'];
let usedCells = 0;
const USED_CELL='used-cell';

function createCells (){
    for (let rowNum=0; rowNum<NUM_OF_ROWS; rowNum++) {
        const divDom=document.createElement('div');
        gridDom.appendChild(divDom);
        divDom.classList.add('row');
        divDom.dataset.row=rowNum;
        for (let colNum=0; colNum<NUM_OF_COLS; colNum++) {
            const cellDom=document.createElement('button');
            divDom.appendChild(cellDom);
            cellDom.classList.add('cell');
            cellDom.dataset.column=colNum;
            cellDom.dataset.row=rowNum;
        }
    }
} 

cellsDom.forEach(cell=>{
    cell.addEventListener('click', ()=>{
        const columnClickedCell=cell.dataset.column;
        const cellToColour=identifyCellToColour(columnClickedCell); 
        const colour=colourCell(cellToColour);
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
    return checkVerticalCells(cellDom, PLAYERS_COLOURS[playerId]) ||
        checkHorizontalCells(cellDom, PLAYERS_COLOURS[playerId]);
    // checkDiagonalCells(cellDom, PLAYERS_COLOURS[playerId]);
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

function checkDiagonalCells(cell, colour) {
    const column= +cell.dataset.column;
    const row=+cell.dataset.row;
    const cellsDiagonal=document.querySelector(`.${colour}[data-row="${row-1}"][data-column="${column+1}"]`);
    console.log(cellsDiagonal)
}









