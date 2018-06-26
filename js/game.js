"use strict";

let rows = 14;
let colums = 14;
let mines = 32;
let data = [];
let htmlObj = '';
let randomMines = []
const contentDom = document.getElementById("mw-canvas-content");
const contentBlockDom = document.getElementById("mw-canvas-block");

function Cell(rowId, columnId, cellId, mine) {
	this.rowId = rowId;
	this.columnId = columnId;
	this.cellId = cellId;
	this.mine = mine;
	this.neighbors = 0;
	this.flagged = false;
	this.selected = false;
}

function buildOject() {
	let cellId = 0;
	for (let r = 0; r < rows; r++) {
		let newRow = [];
		let colsHtml = '';

		for (let c = 0; c < colums; c++) {
			let mine = false;
	    	if (randomMines.indexOf(cellId) != -1) {
	    		mine = true;
	    	}

	    	const newCell = new Cell(r, c, cellId, mine);
			newRow.push(newCell);
			colsHtml += `<span class="mw-col mw-mine-${mine}" row="${r}" col="${c}" id="cell-${cellId}" onclick="cellClick(${r}, ${c})" oncontextmenu="rightClick(${r}, ${c})">.</span>`;
			cellId++;
		}
		const rowHtml = `<div class="mw-row" row="${r}">${colsHtml}</div>`;
		htmlObj += rowHtml;
		data.push(newRow);
	}

	contentDom.innerHTML = htmlObj;
}

function assignRandomMines() {
    while (randomMines.length < mines) {
    	const numRandom = Math.floor(Math.random() * (rows * colums));
    	const numIndex = randomMines.indexOf(numRandom);

    	if (numIndex == -1) {
    		randomMines.push(numRandom);
    	}
    }
}

function assignNeighbors() {
    data.forEach(function(row, rowI) {
    	row.forEach(function(col, colI) {
	    	if (!col.mine) {
	    		reveal(rowI, colI, 'neighbors');
	    	}
	    });
    });
}

function reveal(row, col, type) {
	let total = 0;
	const obj = data[row][col];
	//left cell
	checkObj(row, col + 1);
	//right cell
	checkObj(row, col - 1);

	if (row < rows - 1) {
		//right Down cell
		checkObj(row + 1, col + 1);
		//down cell
		checkObj(row + 1, col);
		//left Down cell
		checkObj(row + 1, col - 1);
	}
	
	if (row > 0) {
		//right Up cell
		checkObj(row - 1, col + 1);
		//up cell
		checkObj(row - 1, col);
		//left Up cell
		checkObj(row - 1, col - 1);
	}	

	function checkObj(row2, col2) {
		const cell = data[row2][col2];
		if (cell) {
			if (type == 'neighbors') {
				if (cell.mine) total++;
			} else {
				if (cell.neighbors === 0 && !cell.selected) {
					cellClick(row2, col2)
				}
			}
		}
	}

	if (total > 0) {
		const cellDom = document.getElementById('cell-' + obj.cellId);
		addClass(cellDom, 'mw-neighbors-' + total);
		cellDom.innerHTML = total;
		obj.neighbors = total;
	}
}

function cellClick(row, col) {
	const obj = data[row][col];
	const cellDom = document.getElementById('cell-' + obj.cellId);
	const state = obj.selected;
	if (!obj.flagged) {
		obj.selected = true;
		selectObj(obj)
	}
	
	if (obj.neighbors === 0 && !state && !obj.mine && !obj.flagged) {
		reveal(row, col, 'click');
	}

	if (obj.mine && !obj.flagged) {
		revealMines(obj);
		addClass(cellDom, 'selected-over');
		gameOver();
	}
}

function rightClick(row, col) {
	const obj = data[row][col];
	const cellDom = document.getElementById('cell-' + obj.cellId);
	console.log('obj',obj );

	if (obj.flagged) {
		removeClass(cellDom, 'flagged');
	} else {
		addClass(cellDom, 'flagged');
	}

	obj.flagged = !obj.flagged;
	return false;
}

function selectObj(obj) {
	const cellDom = document.getElementById('cell-' + obj.cellId);
	addClass(cellDom, 'selected');
}

function gameOver() {
	addClass(contentBlockDom, 'active');
}

function revealMines() {
	data.forEach(function(row, rowI) {
    	row.forEach(function(col, colI) {
    		const obj = data[rowI][colI];
	    	if (col.mine) {
	    		selectObj(obj)
	    	}
	    });
    });
}

assignRandomMines();
buildOject();
assignNeighbors();

