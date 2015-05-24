window.onload = function() {
	var rows = 8;
	var cols = 8;
	var bombs = 10;
	document.getElementById("rows").addEventListener('change', function() {
		rows = this.value;
	}, false);
	document.getElementById("cols").addEventListener('change', function() {
		cols = this.value;
	}, false);
	document.getElementById("bomb").addEventListener('change', function() {
		bombs = this.value;
	}, false);
	document.getElementById("start").addEventListener('click', function() {
		document.getElementById("support-data").style.display = "block";
		var game = grid(rows, cols, bombs);
		game.generate(rows, cols);
	}, false);
}

var grid = function(rows, cols, bombs) {
	var cellBlocks = rows * cols;
	this.generate = function(rows, cols) {
		//Generate grid
		var table = document.getElementById('main-table');
		table.innerHTML = "";
		for(var i=0; i<rows; i++) {
			var row = appendHtml('div', table, {class: "mine-row", id: i}, '');
			for(var j=0; j<cols; j++) {
				var cell = appendHtml('div', row, {class: "mine-cell inactive"}, '&nbsp;');
				this.cells.push(cell);
			}
		}
		//Place bombs at random locations
		for (var i=0; i<bombs; i++) {
			var bombLocation = Math.floor(Math.random() * cellBlocks);
			if (this.bombCells.indexOf(bombLocation) !== -1) {
				i--;
			} else {
				this.bombCells.push(bombLocation);
			}
		}
		console.log(bombCells);
		this.attachEvents();
		startTimer();
	};
	this.attachEvents = function() {
		for(var i=0; i<this.cells.length; i++) {
			(function(index) {
				this.cells[i].addEventListener('click', function() {
					if (hasClass(this, 'inactive') && flags.indexOf(index) == -1 && gameStatus === 1) {
						if (bombCells.indexOf(index) !== -1) {
							gameOver(this);
						} else {
							calculateBombCount(this, index);
						}
					}
				}, false);

				this.cells[i].addEventListener('contextmenu', function(ev) {
					ev.preventDefault();
					if (hasClass(this, 'inactive') && flags.indexOf(index) == -1 && gameStatus === 1 && (bombs - flags.length) >= 0) {
						this.innerHTML = "F";
						this.style.color = "#F00";
						this.style.fontWeight = "bold";
						flags.push(index);
						document.getElementById("flag-count").innerHTML = (bombs - flags.length);
						if (flags.length == bombs) {
							checkResult();
						}
					} else if (hasClass(this, 'inactive') && flags.indexOf(index) != -1 && gameStatus === 1) {
						removeFlag(this, index);
					}
				}, false);
			})(i);
		}
	};

	this.checkResult = function() {
		var valid = 0;
		for(var i=0; i<flags.length; i++) {
			if (bombCells.indexOf(flags[i]) !== -1) {
				valid++;
			}
		}
		if (valid == bombs) {
			alert("Congratulations! You won!");
			gameOver(flags[flags.length-1]);
		}
	}
	this.gameOver = function(cell) {
		cell.setAttribute("class", "mine-cell active bomb");
		document.getElementById("start").disabled = false;
		gameStatus = 3;
		stopTimer();
		for(var i=0; i<bombCells.length; i++) {
			cells[bombCells[i]].setAttribute("class", "mine-cell active bomb");
		}
		for(var i=0; i<flags.length; i++) {
			if (bombCells.indexOf(flags[i]) == -1) {
				cells[flags[i]].setAttribute("class", "mine-cell active no-bomb");
			}
		}
	};

	this.calculateBombCount = function(cell, cellIndex) {
		if (hasClass(cell, 'active')) {
			return false;
		}
		console.log(cellIndex);
		var spliceIndex = flags.indexOf(cellIndex);
		if (spliceIndex !== -1) {
			removeFlag(cell, cellIndex);
		}
		cell.setAttribute("class", "mine-cell active");
		var bombCount = 0;

		if (cellIndex-1 < cellBlocks && cellIndex-1 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex-1)/cols)) {
			bombCount += checkBombs(cellIndex-1);
		}
		if (cellIndex+1 < cellBlocks && cellIndex+1 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex+1)/cols)) {
			bombCount += checkBombs(cellIndex+1);
		}
		if (cellIndex-8 < cellBlocks && cellIndex-8 > -1) {
			bombCount += checkBombs(cellIndex-8);
		}
		if (cellIndex+8 < cellBlocks && cellIndex+8 > -1) {
			bombCount += checkBombs(cellIndex+8);
		}
		if (cellIndex-9 < cellBlocks && cellIndex-9 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex-9)/cols) + 1) {
			bombCount += checkBombs(cellIndex-9);
		}
		if (cellIndex+9 < cellBlocks && cellIndex+9 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex+9)/cols) - 1) {
			bombCount += checkBombs(cellIndex+9);
		}
		if (cellIndex-7 < cellBlocks && cellIndex-7 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex-7)/cols) + 1) {
			bombCount += checkBombs(cellIndex-7);
		}
		if (cellIndex+7 < cellBlocks && cellIndex+7 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex+7)/cols) - 1) {
			bombCount += checkBombs(cellIndex+7);
		}
		switch(bombCount) {
			case 0:
				if (cellIndex-1 < cellBlocks && cellIndex-1 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex-1)/cols)) {
					calculateBombCount(cells[cellIndex-1], cellIndex-1);
				}
				if (cellIndex+1 < cellBlocks && cellIndex+1 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex+1)/cols)) {
					calculateBombCount(cells[cellIndex+1], cellIndex+1);
				}
				if (cellIndex-8 < cellBlocks && cellIndex-8 > -1) {
					calculateBombCount(cells[cellIndex-8], cellIndex-8);
				}
				if (cellIndex+8 < cellBlocks && cellIndex+8 > -1) {
					calculateBombCount(cells[cellIndex+8], cellIndex+8);
				}
				if (cellIndex-9 < cellBlocks && cellIndex-9 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex-9)/cols) + 1) {
					calculateBombCount(cells[cellIndex-9], cellIndex-9);
				}
				if (cellIndex+9 < cellBlocks && cellIndex+9 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex+9)/cols) - 1) {
					calculateBombCount(cells[cellIndex+9], cellIndex+9);
				}
				if (cellIndex-7 < cellBlocks && cellIndex-7 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex-7)/cols) + 1) {
					calculateBombCount(cells[cellIndex-7], cellIndex-7);
				}
				if (cellIndex+7 < cellBlocks && cellIndex+7 > -1 && Math.floor(cellIndex/cols) == Math.floor((cellIndex+7)/cols) - 1) {
					calculateBombCount(cells[cellIndex+7], cellIndex+7);
				}
			break;
			case 1:
				cell.innerHTML = bombCount;
				cell.style.color = "#75CB64"; break;
			case 2:
				cell.innerHTML = bombCount;
				cell.style.color = "#368DB8"; break;
			case 3:
				cell.innerHTML = bombCount;
				cell.style.color = "#D2D229"; break;
			case 4:
				cell.innerHTML = bombCount;
				cell.style.color = "#C47525"; break;
			case 5:
				cell.innerHTML = bombCount;
				cell.style.color = "#A20301"; break;
			default:
				cell.innerHTML = bombCount;
				cell.style.color = "#F00"; break;
		}
	}

	this.checkBombs = function(index) {
		if (bombCells.indexOf(index) !== -1) {
			return 1;
		} else {
			return 0;
		}
	}

	var t;
	var seconds = 0;
	var startTimer = function() {
		this.gameStatus = 1;
		document.getElementById("start").disabled = true;
		t = setInterval(function() {
			seconds += 1;
			var timeString = "";
			var min = Math.floor(seconds / 60);
			timeString += ((min < 10) ? "0" + min : min) + ":";
			min = seconds % 60;
			timeString += (min < 10) ? "0" + min : min;
			document.getElementById("time").innerHTML = timeString;
		}, 1000);
	};
	var stopTimer = function() {
		clearInterval(t);
	};
	var resetTimer = function() {
		clearInterval(t);
		seconds = 0;
		document.getElementById("time").innerHTML = "00:00";
	};

	var removeFlag = function(cell, index) {
		cell.innerHTML = "&nbsp;";
		cell.style.color = "#000";
		cell.style.fontWeight = "normal";
		var spliceIndex = flags.indexOf(index);
		flags.splice(spliceIndex, 1);
		document.getElementById("flag-count").innerHTML = (bombs - flags.length);
	};

	this.cells = new Array();
	this.bombCells = new Array();
	this.gameStatus = 0;
	this.flags = new Array();
	return this;
}

function appendHtml(tag, parent, attr, html, prependFlag) {
	var ele = document.createElement(tag);
	for (var i in attr) {
		ele.setAttribute(i, attr[i]);
	}
	ele.innerHTML = html;
	if (prependFlag && prependFlag == true) {
		parent.insertBefore(ele, parent.firstChild);
	} else {
		parent.appendChild(ele);
	}
	return ele;
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++) {
			if (this[i] === obj) { return i; }
		}
		return -1;
	}
}