const axios = require('axios');
const cheerio = require('cheerio');
import BeekeepingList from './BeekeepingList'

function createBeekeepingList() {
	let currentTurn = 'Turn 1';

	var stockTable = new Array(10);
	stockTable[0] = ['Turn 1', 1000, 2000, 1000, 1000, 2000];
	stockTable[1] = ['Turn 2', null, null, null, null, null];
	stockTable[2] = ['Turn 3', null, null, 2000, null, null];
	stockTable[3] = ['Turn 4', null, null, null, null, null];
	stockTable[4] = ['Turn 5', null, null, null, 3500, null];
	stockTable[5] = ['Turn 6', null, 1400, null, null, null];
	stockTable[6] = ['Turn 7', null, null, null, null, null];
	stockTable[7] = ['Turn 8', null, 4000, 4000, 5000, null];
	stockTable[8] = ['Turn 9', null, null, null, null, null];
	stockTable[9] = ['Turn 10', null, null, null, null, null];

	return {
		getShortestSolution:
			function getShortestSolution(current_Assets, hasAlreadyStockArray) {
				const t = this.validTable;
				let beekeepingList = new Array();

				for (let i = 1; i <= 5; i++) {
					let sTurn = 0, sPrice = 0;
					for (let j = 0; j < t.length; j++) {
						let m = t[j][i];
						if (sPrice == 0 || (m != null && m <= sPrice)) {
							sTurn = j;
							sPrice = m;
						} else if (m != null && m > sPrice) {  // 오름
							beekeepingList.push(new beekeeping(
								i - 1, sTurn, sPrice, j, m, Number(m) - Number(sPrice)));
							sPrice = m;
							sTurn = j;
						}
					}
				}

				beekeepingList.sort((a, b) => {
					return a.sTurn - b.sTurn;
				});

				console.log(beekeepingList);

				for (let idx = 1; idx < beekeepingList.length; idx++) {
					beekeepingList[0].setPriority = 1;
					if (isOverlap(beekeepingList[0], beekeepingList[idx]))
						beekeepingList[idx].Bbadda = 1;
					else
						beekeepingList[idx].Bbadda = 2;
				}

				function isOverlap(
					obj1, obj2) {  // 두 양봉이 겹치는 턴인지 아닌지 반환한다.
					if ((obj1.sTurn <= obj2.sTurn && obj2.sTurn < obj1.lTurn) ||
						(obj1.sTurn >= obj2.sTurn && obj1.sTurn < obj2.lTurn)) {
						return true;  // 겹친다.
					} else {
						return false;
					}
				}

				function getBiggerPrice(stockNumber) {
					let high = 0;
					let highTurn;
					for (let 인덱스 = 0; 인덱스 < t.length; 인덱스++) {
						if (high == 0 && t[인덱스][stockNumber + 1] != null) {
							high = t[인덱스][stockNumber + 1];
							highTurn = t[인덱스][0];
						} else if (
							high != 0 && t[인덱스][stockNumber + 1] != null &&
							high < t[인덱스][stockNumber + 1]) {
							high = high = t[인덱스][stockNumber + 1];
							highTurn = t[인덱스][0];
						}
					}
					return { stockNumber: stockNumber, high: high, highTurn: highTurn };
				}

				function isMe(obj1, obj2) {
					if (obj1.stockNumber == obj2.stockNumber &&
						obj1.sTurn == obj2.sTurn && obj1.lTurn == obj2.lTurn)
						return true;
					else
						return false;
				}

				/* 인수로 주어지는 obj를 매수할때 다른 주식들은 팔아야 할까 그냥
				 * 둬야 할까 */
				function getBest(obj, mo) {
					let highthisObj = getBiggerPrice(obj.stockNumber);
					let finalResult;
					if (mo.localStockArray[obj.stockNumber] != 0 &&
						obj.lTurn == highthisObj.highTurn) {  // 최고점 이므로 다 팜
						finalResult = (mo.localCa / obj.sPrice +
							mo.localStockArray[obj.stockNumber]) *
							obj.lPrice;
						mo.localStockArray[obj.stockNumber] = 0;
					} else if (
						mo.localStockArray[obj.stockNumber] != 0 &&
						obj.lTurn <
						highthisObj.highTurn) {  //최고점이 아직 오지 않음. 안팜
						finalResult = (mo.localCa / obj.sPrice) * obj.lPrice;
					}

					let rest = mo.localCa % obj.sPrice;

					// 중첩되는 다른 종목들의 보유주식을 팔아야할까 냅둬야 할까를
					// 고려한다.
					for (let idx = 0; idx < beekeepingList.length; idx++) {
						if (!(isMe(obj, beekeepingList[idx])) &&  // 자기자신이 아니고
							mo.localStockArray[beekeepingList[idx].stockNumber] != 0 /* &&
                  isOverlap(obj, beekeepingList[idx]) */
                  /*&& isMoreObjDown(obj, beekeepingList[idx]) */) {
							let highObj = getBiggerPrice(beekeepingList[idx].stockNumber);

							let sellAllThenBuyMore = finalResult;  // 다 팔아서 더 산 경우
							let doNotSellNow =
								finalResult;  // 안 팔고 나중에 최고점에 판 경우

							sellAllThenBuyMore +=
								(rest +  // 싹다 팔아서 더산 돈 더해줌
									(mo.localStockArray[beekeepingList[idx].stockNumber] *
										beekeepingList[idx].sPrice)) /
								obj.sPrice * obj.lPrice;

							sellAllThenBuyMore +=
								(rest +  // 싹다 팔아서 더사고 남은돈 더해줌
									(mo.localStockArray[beekeepingList[idx].stockNumber] *
										beekeepingList[idx].sPrice)) %
								obj.sPrice;

							doNotSellNow += highObj.high *
								mo.localStockArray[beekeepingList[idx].stockNumber];
							doNotSellNow += rest;

							if (sellAllThenBuyMore >= doNotSellNow) {
								mo.localStockArray[beekeepingList[idx].stockNumber] = 0;
								finalResult = sellAllThenBuyMore;
							} else {
								finalResult = doNotSellNow;
							}
						}
					}
					mo.localCa = finalResult;
				}

				function getNextObjArray(obj) {
					let result = {};
					for (let idx = 0; idx < beekeepingList.length; idx++) {
						if (isMe(obj, beekeepingList[idx])) {
							for (let i = idx + 1; i < beekeepingList.length; i++) {
								if (!isOverlap(beekeepingList[idx], beekeepingList[i])) {
									result.ns = i;
									for (let j = i + 1; j < beekeepingList.length; j++) {
										if (!isOverlap(beekeepingList[i], beekeepingList[j])) {
											result.ls = j - 1;
											return result;
										} else if (j == beekeepingList.length - 1) {
											result.ls = beekeepingList.length - 1;
											return result;
										}
									}
								} else if (i <= beekeepingList.length - 1) {
									result.ns = -1;
									return result;  // obj의 다음 스탭이 없다.
								}
							}
							result.ns = -1;
							return result;
						}
					}
				}
				// 남은 금액, 보유주식
				function func(obj, ca, stockArray) {
					let modifyObj = { localCa: ca, localStockArray: stockArray };
					if (obj.Bbadda == 1) {
						getBest(obj, modifyObj);  // 인자로 들어간 localCa의 값을 얻을수
						// 있는 최댓값으로 변경한다.
						let r = getNextObjArray(obj);
						if (r.ns == -1) {
							console.log('first bada final result : ' + modifyObj.localCa);
							return;
						}
						for (let i = r.ns; i <= r.ls; i++) {
							func(
								beekeepingList[i], modifyObj.localCa,
								modifyObj.localStockArray);
						}
					} else {
						getBest(obj, modifyObj);
						let r = getNextObjArray(obj);
						if (r.ns == -1) {
							console.log('final result : ' + modifyObj.localCa);
							return;
						}
						for (let i = r.ns; i <= r.ls; i++) {
							func(beekeepingList[i], modifyObj.localCa, localStockArray);
						}
					}
				}

				for (let iid = 0; iid < beekeepingList.length; iid++) {
					if (beekeepingList[iid].Bbadda == 1) {
						func(beekeepingList[iid], current_Assets, hasAlreadyStockArray);
					}
				}
			},

		get currentTurn() {
			return currentTurn;
		}
		, get stockTable() {
			return stockTable;
		}
		, get validTable() {
			for (let idx = stockTable.length - 1; idx >= 0; idx--) {
				let row = stockTable[idx];

				if (row[1] != null || row[2] != null || row[3] != null ||
					row[4] != null || row[5] != null) {
					return stockTable.slice(
						Number(currentTurn.substring(5)) - 1, idx + 1);
				}
			}
		}
	}
};

let stockObj = new createStockObj();

(async function () {
	stockObj.getShortestSolution(10000, [0, 0, 5, 0, 0]);

	/* console.log(stockObj.getShortestSolution()); */
}());

/*
고려해야 되는 변수들(인자)

input:
		현재 자산
		현재 이미 보유중인 주식 종류와 갯수는 input으로 넣지 않는다.
				그 이유는 현재 지표만 보고 미래에 가격이 떨어진다면 당장
팔라고할것이고 핸드폰 볼수있는 턴들 - 13~ 15, 18 ~22턴 볼수있습니다. 또는 계속
볼수있습니다 - 시간 빌게이츠

output:
		xxturn에 yy주식을 zz개 삽니다.
		xxturn에 yy주식을 zz개 팝니다.
		.
		.
		.
				가장 많이 벌었다의 기준은 주식으로 보유하고 있던, 팔아서 돈으로
바꿧던 같은 것으로 간주 (그니까 팔거나 가지고있거나는 사용자의 선택에 맡김)

문제1. 지금 말고 좀 더있다가 사면 더 ㄱㅇㄷ인데요? 가 반복되면 어떻하지??

해결 :
		그냥 지금 사면 이만큼 벌수있습니다.
		하지만 조금 기다리면 이만큼 더 벌수있습니다.
		선택하세요?
		나도 미래를 알수는 없으므로 사용자의 선택에 맡겨야 한다.

핸드폰 볼수있는 턴들을 제외한 나머지 턴들은 계산에서 고려되지 않는다.

알고리즘 루트
현재 보유한 주식이 있다면 이걸 나중에 파는게 이득인가 지금 싹다 돈으로 바꾸는게
이득인가.

고려되야 하는 테스트 케이스 :
		1. 이미 보유중인 주식x 현금만 있음
		2. 이미 보유중인 주식1은 5개 주식3은 4개 주식5는 40개 + 현금 40,000있음
		3. 모든 종류의 주식을 5개씩 가지고있음 현금은 500원있음

*/

/* npm install axios@0.21.1 cheerio@1.0.0-rc.9 puppeteer@9.1.1 lodash@4.17.20
 * date-fns@2.21.1 date-fns-tz@1.1.4 */
