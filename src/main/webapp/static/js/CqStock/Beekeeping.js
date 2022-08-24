export default class beekeeping {
	stockNumber;
	sTurn;
	sPrice;
	lTurn;
	lPrice;
	profit;
	priority;

	constructor(stockNumber, sTurn, sPrice, lTurn, lPrice, profit) {
		this.stockNumber = stockNumber;
		this.sTurn = sTurn;
		this.sPrice = sPrice;
		this.lTurn = lTurn;
		this.lPrice = lPrice;
		this.profit = profit;
		this.priority = undefined;
	}

	/**
	   * @param {Number} priority
	   */
	set setPriority(priority) {
		this.priority = priority;
	}

	get getPriority() {
		return this.priority;
	}

	isOverlap(otherBeekeeping) {
		if ((this.sTurn <= otherBeekeeping.sTurn &&
			otherBeekeeping.sTurn < this.lTurn) ||
			(this.sTurn >= otherBeekeeping.sTurn &&
				this.sTurn < otherBeekeeping.lTurn)) {
			return true;
		} else {
			return false;
		}
	}

	isMe(otherBeekeeping) {
		if (this.stockNumber == otherBeekeeping.stockNumber &&
			this.sTurn == otherBeekeeping.sTurn &&
			this.lTurn == otherBeekeeping.lTurn)
			return true;
		else
			return false;
	}
};

