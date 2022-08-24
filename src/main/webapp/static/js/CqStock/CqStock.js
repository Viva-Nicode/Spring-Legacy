const axios = require('axios');
const cheerio = require('cheerio');

function createStockObj() {
  /* 11일 점심 12 : 30 ~ 1 : 30 사이가 1턴 */
  let currentTurn;

  let now = new Date();
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  let pastDay = date - 11;

  if (pastDay <= 1) {
    currentTurn = 'Turn ' + (minutes > 30 ? hours + 1 + 12 : hours + 12);
  } else {
    let ee = ((pastDay - 1) * 24) + 12;
    currentTurn = 'Turn ' + (minutes > 30 ? ee + 1 + hours : ee + hours);
  }

  var stockTable = new Array(168);
  for (var i = 0; i < stockTable.length; i++) stockTable[i] = new Array(6);


  return {
    init:
        async function init() {
          const resp = await axios.get(
              'https://docs.google.com/spreadsheets/d/18_E4zHHakFvRqdtsVJvrjOPb4F-cfGpvAKFdxIxBXLY/htmlview?pru=AAABfDU3HiI');
          const $ = cheerio.load(resp.data);

          const elements = $('tr');

          elements.each((idx, el) => {
            if (idx >= 4) {
              const tds = $(el).children('td').toArray();

              if ($(tds[0]).html() == 'END') {
                return false;
              }

              stockTable[idx - 4][0] = $(tds[0]).html();
              /*2 5 8 11 14 */
              let ii = 1;
              for (let i = 2; i <= 14; i += 3) {
                const elem = $(tds[i]).html();
                if (elem.length > 5) {
                  stockTable[idx - 4][ii] = $(tds[i]).children('a').html();
                } else if (elem == '') {
                  stockTable[idx - 4][ii] = null;
                } else {
                  stockTable[idx - 4][ii] = elem;
                }
                ii++;
              }
            }
          });
        },

        getShortestSolution:
            function getShortestSolution(current_Assets, hasAlreadyStockArray) {
              const t = this.validTable;
              let objArray = new Array(20);

              for (let i = 1; i <= 5; i++) {
                let sTurn = 0, sPrice = 0;
                for (let j = 0; j < t.length; j++) {
                  let m = t[j][i];
                  if (sPrice == 0 || (m != null && m <= sPrice)) {
                    sTurn = j;
                    sPrice = m;
                  } else if (m != null && m > sPrice) {  // 오름
                    objArray.push({
                      stockNumber: i - 1,
                      sTurn: sTurn,
                      sPrice: sPrice,
                      lTurn: j,
                      lPrice: m,
                      profit: Number(m) - Number(sPrice)
                    });
                    sPrice = m;
                    sTurn = j;
                  }
                }
              }
              objArray.sort((a, b) => {
                return a.sTurn - b.sTurn;
              });

              for (let idx = 1; idx < objArray.length; idx++) {
                objArray[0].Bbadda = 1;
                if (isOverlap(objArray[0], objArray[i]))
                  objArray[i].Bbadda = 1;
                else
                  objArray[i].Bbadda = 2;
              }

              function isOverlap(
                  obj1, obj2) {  // 두 양봉이 겹치는 턴인지 아닌지 반환한다.
                if ((obj1.sTrun <= obj2.sTurn && obj2.sTrun < obj1.lTrun) ||
                    (obj1.sTrun >= obj2.sTurn && obj1.sTrun < obj2.lTrun))
                  return true;  // 겹친다.
                else
                  return false;
              }

              function getBiggerPrice(
                  stockNumber) {  //해당 종목의 최고점인 턴을 반환한다.
                                  // stockNumber = 0 ~ 4
                let high = 0;
                let highTurn;
                for (let 인덱스 = 0; 인덱스 < objArray.length; 인덱스++) {
                  if (hihg == 0 && objArray[인덱스][stockNumber + 1] != null) {
                    high = objArray[인덱스][stockNumber + 1];
                    highTurn = objArray[인덱스][0];
                  } else if (
                      high != 0 && objArray[인덱스][stockNumber + 1] != null &&
                      high < objArray[인덱스][stockNumber + 1]) {
                    high = high = objArray[인덱스][stockNumber + 1];
                    highTurn = objArray[인덱스][0];
                  }
                }
                return {
                  stockNumber: stockNumber,
                  high: high,
                  highTurn: highTurn
                };
              }

              function isMe(obj1, obj2) {
                if (obj1.stockNumber == obj2.stockNumber &&
                    obj1.sTrun == obj2.sTrun && obj1.lTrun == obj2.lTrun)
                  return true;
                else
                  return false;
              }

              /* 인수로 주어지는 obj를 매수할때 다른 주식들은 팔아야 할까 그냥
               * 둬야 할까 */
              function getBest(
                  obj, ca, hasa) {  // hasa는 하위 루트를 계산할때 반영되어야 함

                let bb = (ca / obj.sPrice + hasa[obj.stockNumber]) * obj.lPrice;
                let rest = ca % obj.sPrice;
                for (let idx = 0; idx < objArray.length; idx++) {
                  if (!(isMe(obj, objArray[idx])) &&  // 자기자신이 아니고
                      isOverlap(obj, objArray[idx]) &&  //중첩되며
                      hasa[objArray[idx].stockNumber] !=
                          0) {  //보유주식이 존재한다면
                    let highObj = getBiggerPrice(objArray[idx].stockNumber);
                    if (obj.sTrun >=  // 이미 보유중인 종목이 최고점을 지났다면
                        highObj.highTurn) {
                      bb += hasa[highObj.stockNumber] * highObj.high;
                      bb += rest;
                    } else {
                      let resultOne = bb;  //다 팔아서 더 산 경우
                      let resultTwo = bb;  //안 팔고 나중에 최고점에 판 경우

                      resultOne += (rest +  // 싹다 팔아서 더산 돈 더해줌
                                    (hasa[objArray[idx].stockNumber] *
                                     objArray[idx].sPrice)) /
                          obj.sPrice * obj.lPrice;
                      resultOne += (rest +  // 싹다 팔아서 더사고 남은돈 더해줌
                                    (hasa[objArray[idx].stockNumber] *
                                     objArray[idx].sPrice)) %
                          obj.sPrice;

                      resultTwo +=
                          highObj.high * hasa[objArray[idx].stockNumber];
                      resultTwo += rest;

                      if (resultOne >= resultTwo) {
                        hasa[objArray[idx].stockNumber] = 0;
                        bb = resultOne;
                      } else {
                        bb = resultTwo;
                      }
                    }
                  }
                }
                ca = bb;
              }

              function getNextObjArray(obj) {
                let result = {};
                for (let idx = 0; idx < objArray.length; idx++) {
                  if (isMe(obj, objArray[idx])) {
                    for (let i = idx + 1; i < objArray.length; i++) {
                      if (!isOverlap(objArray[idx], objArray[i])) {
                        result.ns = i;
                        for (let j = i + 1; j < objArray.length; j++) {
                          if (!isOverlap(objArray[i], objArray[j])) {
                            result.ls = j - 1;
                            return result;
                          } else if (j == objArray.length - 1) {
                            result.ls = objArray.length - 1;
                            return result;
                          }
                        }
                      } else if (i == objArray.length - 1) {
                        result.ns = -1;
                        return result;  // obj의 다음 스탭이 없다.
                      }
                    }
                  }
                }
              }

              // func() 자체를 루프돌려서 호출해줘야 한다.
              function func(obj, ca, stockArray) {
                let localCa = ca;
                let localStockArray = stockArray;
                if (obj.Bbadda == 1) {
                  getBest(
                      obj, localCa,
                      localStockArray);  // 인자로 들어간 localCa의 값을 얻을수
                                         // 있는 최댓값으로 변경한다.
                  let r = getNextObjArray(obj);
                  if (r.ns == -1) {
                    console.log('final result : ' + localCa);
					return;
                  }
                  for (let i = r.ns; i <= r.ls; i++) {
                    func(objArray[i], localCa, localStockArray);
                  }
                } else {
                  getBest(obj, ca, stockArray);
                  let r = getNextObjArray(obj);
                  if (r.ns == -1) {
                    console.log('final result : ' + localCa);
                    return;
                  }
                  for (let i = r.ns; i <= r.ls; i++) {
                    func(objArray[i], localCa, localStockArray);
                  }
                }
              }
              func();
            },

        get currentTurn() {
      return currentTurn;
    }
    , get stockTable() {
      return stockTable;
    }
    , get validTable() {
      for (let idx = stockTable.length - 1; idx >= 0; idx--) {
        const row = stockTable[idx];

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

(async function() {
  await stockObj.init();
  console.log(stockObj.validTable);
  stockObj.getShortestSolution();
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
