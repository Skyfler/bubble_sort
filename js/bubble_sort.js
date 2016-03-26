'use strict';

//-----------------------------------------//

function PageBubbleSort(options) {
	
	this._elem = options.element;
	
	this._arrayInput = new ArrayInput({
		element: this._elem.querySelector('[data-component="customArrayInput"]')
	})
	
	this._sortContainer = new SortContainer({
		element: this._elem.querySelector('[data-component="sortContainer"]')
	})
	
}

//-----------------------------------------//

function ArrayInput(options) {
	
	this._elem = options.element;
	
	this._input = this._elem.querySelector('[data-component="array_input"]');
	this._readArrayBtn = this._elem.querySelector('[data-component="readArray"]');

	this._readArrayBtn.addEventListener('click', this._getArray.bind(this));
	
}

ArrayInput.prototype._getArray = function() {
	
	var arr = this._input.value.split(' ');
	arrayToSort = arr;
	
	page._sortContainer.createArrayBlocks();
	
};

//-----------------------------------------//

function SortContainer(options) {
	
	this._elem = options.element;
	this._nextStepBtn = this._elem.querySelector('[data-component="nexstStep"]');
	this._resetBtn = this._elem.querySelector('[data-component="reset"]');
	this._autoSorting = this._elem.querySelector('[data-component="autosorting"]');
	
	this._currElemIndex;
	this._cyclePass;
	this._elemArray;
	
	this.createArrayBlocks();
	
	this._nextStepBtn.addEventListener('click', this.sortArrayBlocksStep.bind(this));	
	this._resetBtn.addEventListener('click', this.createArrayBlocks.bind(this));
	
}

SortContainer.prototype.createArrayBlocks = function() {
	
	this._elemArray = [];
	
	if (this.arrayBlockContainer) {
		this.arrayBlockContainer.parentElement.removeChild(this.arrayBlockContainer);
	}
	
	this.arrayBlockContainer = document.createElement('div');
	this.arrayBlockContainer.dataset.component = 'arrayBlockContainer';
	
	for (var i = 0; i < arrayToSort.length; i++) {
		var arrayBlock = document.createElement('div');
		arrayBlock.classList.add('arrayBlock');
		arrayBlock.innerHTML = arrayToSort[i];

		this._elemArray.push(arrayBlock);		
		this.arrayBlockContainer.appendChild(arrayBlock);
	}
	
	this._elem.insertBefore(this.arrayBlockContainer, this._elem.firstChild);
	
	this._currElemIndex = 0;
	this._cyclePass = 0;

}

SortContainer.prototype.sortArrayBlocksStep = function() {
	
	if (this._cyclePass == this._elemArray.length - 1) {
		return;
	}
	
	this._nextStepBtn.disabled = true;
	this._resetBtn.disabled = true;
	
	var curElem = this._elemArray[this._currElemIndex];
	var nextElem = this._elemArray[this._currElemIndex + 1];
	curElem.style.backgroundColor = '#A3AAFF';
	nextElem.style.backgroundColor = '#A3AAFF';
	
	if (parseFloat(curElem.innerHTML) > parseFloat(nextElem.innerHTML)) {
		
		var shiftLeft = getComputedStyle(nextElem).width;
		var shiftRight = getComputedStyle(curElem).width;
		
		curElem.style.transitionDuration = '';
		nextElem.style.transitionDuration = '';
		
		curElem.style.zIndex = '100';
		curElem.style.left = shiftLeft;
		nextElem.style.left = '-'+shiftRight;
		
		setTimeout(function() {
			nextElem.style.transitionDuration = '0s';
			curElem.style.left = '';
			nextElem.style.left = '';
			curElem.parentElement.insertBefore(curElem, nextElem.nextSibling);
			curElem.style.zIndex = '';
		}, 1000);
		
		var temp = this._elemArray[this._currElemIndex];
		this._elemArray[this._currElemIndex] = this._elemArray[this._currElemIndex + 1];
		this._elemArray[this._currElemIndex + 1] = temp;
	}
	
	setTimeout(function() {
		curElem.style.backgroundColor = '';
		nextElem.style.backgroundColor = '';
		this._nextStepBtn.disabled = false;
		this._resetBtn.disabled = false;
	}.bind(this), 1000);
	
	this._currElemIndex++
	
	if (this._currElemIndex == this._elemArray.length - this._cyclePass - 1) {
		var sortedIndex = this._currElemIndex;
		setTimeout(function() {
			this._elemArray[sortedIndex].classList.add('sorted');
		}.bind(this), 1000);
		this._currElemIndex = 0;
		this._cyclePass++;
		if (this._cyclePass == this._elemArray.length - 1) {
			setTimeout(function() {
				this._elemArray[0].classList.add('sorted');
			}.bind(this), 1000);
		}
	}
	
	setTimeout(function() {
		if (this._autoSorting.checked) {
			this.sortArrayBlocksStep();
		}
	}.bind(this), 1000);
}

//-----------------------------------------//

var arrayToSort = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

var page = new PageBubbleSort({	
	element: document.querySelector('[data-component="page"]')
});

//-----------------------------------------//