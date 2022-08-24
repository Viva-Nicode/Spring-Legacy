const axios = require('axios');
const cheerio = require('cheerio');
const BeekeepingList = require('./BeekeepingList');


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

let sibal = new BeekeepingList(stockTable);



/* function func(obj, ca, stockArray) {
	let modifyObj = { localCa: ca, localStockArray: stockArray };
	if (obj.Bbadda == 1) {
		getBest(obj, modifyObj);
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
} */

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
