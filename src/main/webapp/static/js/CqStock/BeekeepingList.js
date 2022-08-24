import Beekeeping from './Beekeeping'

/**
 * @param validStockTable 유효한 턴만 표현된 2차원 배열
 * @param beekeepingList validStockTable에서 양봉들만 추출한 배열
 * @param highestTurnArray 각 종목들의 최고점 정보 배열
 * @param currentTrun pureStockTable에서의 현재 턴 idx
 * @descripter 
 * obj의 프로퍼티인 stockNumber 는 0 ~ 4의 값을 가진다.
 */
export default class BeekeepingList {
	#validStockTable;
	#beekeepingList;
	#highestTurnArray;
	#currentTurn;

	constructor(pst) {
		/* login to get current Turn */

		this.#currentTurn = 0; /* current turn was supposed 0 */

		for (let idx = pst.length - 1; idx >= 0; idx--) {
			let row = pst[idx];

			if (row[1] != null || row[2] != null || row[3] != null ||
				row[4] != null || row[5] != null) {
				this.#validStockTable = pst.slice(this.#currentTurn, idx + 1);
			}
		}

		this.#beekeepingList = new Array();
		this.#highestTurnArray = new Array(5);

		for (let i = 1; i <= 5; i++) {
			let sTurn = 0, sPrice = 0;
			for (let j = 0; j < this.#validStockTable.length; j++) {
				let m = this.#validStockTable[j][i];
				if (sPrice == 0 || (m != null && m <= sPrice)) {
					sTurn = j;
					sPrice = m;
				} else if (m != null && m > sPrice) {  // 오름
					this.#beekeepingList.push(new Beekeeping(
						i - 1, sTurn, sPrice, j, m, Number(m) - Number(sPrice)));
					sPrice = m;
					sTurn = j;
				}
			}
		}

		this.#beekeepingList.sort((a, b) => {
			return a.sTurn - b.sTurn;
		});

		console.log(this.#beekeepingList);

		for (let idx = 1; idx < this.#beekeepingList.length; idx++) {
			this.#beekeepingList[0].setPriority(1);
			if (this.#beekeepingList[0].isOverlap(this.#beekeepingList[idx]))
				this.#beekeepingList[idx].setPriority(1);
			else
				this.#beekeepingList[idx].setPriority(2);
		}

		for (let colidx = 1; colidx <= 5; colidx++) {
			let high = 0;
			let highTurn;
			for (let rowidx = 0; rowidx < this.#validStockTable.length; rowidx++) {
				if (high == 0 && this.#validStockTable[rowidx][colidx] != null) {
					high = this.#validStockTable[rowidx][colidx];
					highTurn = this.#validStockTable[rowidx][0];
				} else if (
					high != 0 && this.#validStockTable[rowidx][colidx] != null &&
					high < this.#validStockTable[rowidx][colidx]) {
					high = high = this.#validStockTable[rowidx][colidx];
					highTurn = this.#validStockTable[rowidx][0];
				}
			}
			this.#highestTurnArray[colidx - 1] = { high: high, highTurn: highTurn };
		}
	}

	get getValidStockTable() {
		return this.#beekeepingList;
	}

	get getBeekeepingList() {
		return this.#beekeepingList;
	}

	get getHighestTurnArray() {
		return this.#highestTurnArray;
	}

	existOverlapBeekeeping(obj, stockNumber) {
		let list = this.getBeekeepingList;
		for (let idx = 0; idx < list.length; idx++) {
			if (list[idx].stockNumber == stockNumber && obj.isOverlap(list[idx]))
				return true;
		}
		return false;
	}

	isMoreBeekeepingDown(obj, stockNumber) {
		let objLturn = obj.lTurn;
		let list = this.getBeekeepingList;
		for (let idx = 0; idx < list.length; idx++) {
			if (list[idx].stockNumber == stockNumber && objLturn <= list[idx].sTurn)
				return true;
		}
		return false;
	}

	getBiggerPriceUntilHere(obj, stockNumber) {
		let objSturn = obj.sTurn;
		let result = {};
		for (let idx = 0; idx <= objSturn; idx++) {
			result.price = this.getValidStockTable[idx][stockNumber + 1] > result ? this.getValidStockTable[idx][stockNumber + 1] : result;
			result.turn = idx;
		}
		return result;
	}

	getBest(obj, propertyStatus) {
		const highthisObj = this.getHighestTurnArray[obj.stockNumber];
		let finalResult = (propertyStatus.localCa / obj.sPrice) * obj.lPrice;
		let rest = propertyStatus.localCa % obj.sPrice;

		if (propertyStatus.localStockArray[obj.stockNumber] != 0 &&
			obj.lTurn == highthisObj.highTurn) {
			finalResult += propertyStatus.localStockArray[obj.stockNumber] * obj.lPrice;
			propertyStatus.localStockArray[obj.stockNumber] = 0;
		}

		for (let stockId = 0; stockId < 5; stockId++) {
			if (stockId == obj.stockNumber)
				continue;
			/* exist Stock already but if nothing beekeeping The stock are not considered. */
			if (propertyStatus.localStockArray[stockId] >= 1 &&
				(this.existOverlapBeekeeping(obj, stockId) || this.isMoreBeekeepingDown(obj, stockId))) {

				const sellPrice = this.getBiggerPriceUntilHere(obj, stockId);
				const highObj = this.getHighestTurnArray[stockId];

				let sellAllThenBuyMore = finalResult;
				let doNotSellNow = finalResult;

				sellAllThenBuyMore +=
					(rest + propertyStatus.localStockArray[stockId] * sellPrice.price) /
					obj.sPrice * obj.lPrice;

				sellAllThenBuyMore +=
					(rest + propertyStatus.localStockArray[stockId] * sellPrice.price) %
					obj.sPrice;

				doNotSellNow += highObj.high * propertyStatus.localStockArray[stockId];
				doNotSellNow += rest;

				if (sellAllThenBuyMore > doNotSellNow) {
					propertyStatus.localStockArray[stockId] = 0;
					finalResult = sellAllThenBuyMore;
				} else {
					finalResult = doNotSellNow;
				}
			}
		}
		propertyStatus.localCa = finalResult;
	}

	getNextObjArray(obj) {
		let result = {};
		const list = this.getBeekeepingList;
		for (let idx = 0; idx < list.length; idx++) {
			if (obj.isMe(list[idx])) {
				for (let i = idx + 1; i < list.length; i++) {
					if (!list[idx].isOverlap(list[i])) {
						result.ns = i;
						for (let j = i + 1; j < list.length; j++) {
							if (!list[i].isOverlap(list[j])) {
								result.ls = j - 1;
								return result;
							} else if (j == list.length - 1) {
								result.ls = list.length - 1;
								return result;
							}
						}
					} else if (i <= list.length - 1) {
						result.ns = -1;
						return result;  // obj의 다음 스탭이 없다.
					}
				}
				result.ns = -1;
				return result;
			}
		}
	}
};

/*
function (전체 차트를 인자로 받음)
{
		beekeepingArray를 맴버로 가진다.

		받은 차트를 유효한 만큼 자르고 양봉리스트 생성.
		각 종목마다 최고점 턴, 최고점 값 가지는 배열 생성.

		function

}
*/