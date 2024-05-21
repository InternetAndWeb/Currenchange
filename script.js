function expand_search() {
    document.getElementById('expand-search').style.display = 'flex';
    var searchElements = document.getElementsByClassName('search');
    for (var i = 0; i < searchElements.length; i++) {
        searchElements[i].style.display = 'none';
    }
    document.getElementById('expand-input').focus();
}

function close_search() {
    document.getElementById('expand-search').style.display = 'none';
    var searchElements = document.getElementsByClassName('search');
    for (var i = 0; i < searchElements.length; i++) {
        searchElements[i].style.display = 'inline';
    }
}

function displayCountryFlag(data, order) {
    const imageUrl = data.data[0].download_url;
    const flagImage = document.getElementById('country' + order +'Img'); 
    flagImage.src = imageUrl;
}


function match_country_code(currencyCode, order) {
    const isoCodes = {
        'USD': 'US',
        'EUR': 'EU',
        'JPY(100)': 'JP',
        'CNH': 'CN',

        // 이런 식으로 계속 나라와 해당하는 ISO 코드를 추가하세요.
    };

    const isoCode = isoCodes[currencyCode];
    if (!isoCode) {
        console.error('ISO 코드를 찾을 수 없습니다.');
        return;
    }

    const apiUrlCountry = `http://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?ServiceKey=SCkTvRgui0ytJN0tRZIcizzqjJL2U6FXdXlaPcX62q3nVUjL78qp0CT%2BnScSK7viYrIg7s6Rcf7tdV1yB0O3kg%3D%3D&returnType=JSON&numOfRows=10&cond[country_iso_alp2::EQ]=${isoCode}`;

    fetch(apiUrlCountry)
        .then(response => response.json())
        .then(data => {
            displayCountryFlag(data, order);
        })
        .catch(error => {
            console.error('Error fetching country flag data:', error);
        });
}


const currentDate = new Date();

const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();

const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

const year2 = currentDate.getFullYear();
const month2 = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day2 = (currentDate.getDate() - 1).toString().padStart(2, '0');
const yyyymmdd = year2 + month2 + day2;

// 나중에 고치기 -> 서버에 데이터 없을수도 error carch 추가 (주말인지 계산해서 주말이면 금요일 데이터와 오늘 데이터 비교하기) -> 맨 마지막에 구현//
const yesterday = (currentDate.getDate() - 1).toString().padStart(2, '0');

const yesterday_yyyymmdd = year2 + month2 + yesterday;

var viewtime = document.getElementById('viewtime');
viewtime.textContent = '(조회시간 : ' + formattedDate + ')';

var apiUrlToday = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=RZuk2sK0yoZiufnYTZbZQvm8wxo5wJvY&searchdate=' + yyyymmdd + '&data=AP01';

var apiUrlYesterday = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=RZuk2sK0yoZiufnYTZbZQvm8wxo5wJvY&searchdate=' + yesterday_yyyymmdd + '&data=AP01';

Promise.all([fetch(apiUrlToday), fetch(apiUrlYesterday)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        var usdExchange = data[0].find(item => item.cur_unit === 'USD');
        var yesterdayusdExchange = data[1].find(item => item.cur_unit === 'USD');
        var country1 = document.getElementById('country1');
        country1.textContent = `${usdExchange.cur_nm}`;
        var country1Img = match_country_code('USD', 1);
        var unit1 = document.getElementById('unit1');
        unit1.textContent = `(${usdExchange.cur_unit})`;
        var exchange1 = document.getElementById('exchange-rate1');
        exchange1.textContent = `${usdExchange.deal_bas_r}`;
        var diff1 = document.getElementById('diff1');
        var replaced_usddeal = usdExchange.deal_bas_r.replace(',', '');
        var replaced_yesterdayusddeal = yesterdayusdExchange.deal_bas_r.replace(',', '');
        var diff_value1 = parseFloat(replaced_usddeal) - parseFloat(replaced_yesterdayusddeal);
        diff1.textContent = `${diff_value1.toFixed(2)}`;
        if (diff_value1 > 0) {
            document.getElementById('diff1').style.color = 'red';
        }
        else if (diff_value1 < 0) {
            document.getElementById('diff1').style.color = 'blue';
        }
        var buy1 = document.getElementById('buy1');
        buy1.textContent = `${usdExchange.ttb}`;
        var sell1 = document.getElementById('sell1');
        sell1.textContent = `${usdExchange.tts}`;
        var send1 = document.getElementById('year1');
        send1.textContent = `${usdExchange.yy_efee_r}`;
        var get1 = document.getElementById('10day1');
        get1.textContent = `${usdExchange.ten_dd_efee_r}`;

        var eurExchange = data[0].find(item => item.cur_unit === 'EUR');
        var yesterdayeurExchange = data[1].find(item => item.cur_unit === 'EUR');
        var country2 = document.getElementById('country2');
        country2.textContent = `${eurExchange.cur_nm}`;
        var country2Img = match_country_code('EUR', 2);
        var unit2 = document.getElementById('unit2');
        unit2.textContent = `(${eurExchange.cur_unit})`;
        var exchange2 = document.getElementById('exchange-rate2');
        exchange2.textContent = `${eurExchange.deal_bas_r}`;
        var diff2 = document.getElementById('diff2');
        var replaced_eurdeal = eurExchange.deal_bas_r.replace(',', '');
        var replaced_yesterdayeurdeal = yesterdayeurExchange.deal_bas_r.replace(',', '');
        var diff_value2 = parseFloat(replaced_eurdeal) - parseFloat(replaced_yesterdayeurdeal);
        diff2.textContent = `${diff_value2.toFixed(2)}`;
        if (diff_value2 > 0) {
            document.getElementById('diff2').style.color = 'red';
        }
        else if (diff_value2 < 0) {
            document.getElementById('diff2').style.color = 'blue';
        }
        var buy2 = document.getElementById('buy2');
        buy2.textContent = `${eurExchange.ttb}`;
        var sell2 = document.getElementById('sell2');
        sell2.textContent = `${eurExchange.tts}`;
        var send2 = document.getElementById('year2');
        send2.textContent = `${eurExchange.yy_efee_r}`;
        var get2 = document.getElementById('10day2');
        get2.textContent = `${eurExchange.ten_dd_efee_r}`;

        var jpyExchange = data[0].find(item => item.cur_unit === 'JPY(100)');
        var yesterdayjpyExchange = data[1].find(item => item.cur_unit === 'JPY(100)');
        var country3 = document.getElementById('country3');
        country3.textContent = `${jpyExchange.cur_nm}`;
        var country3Img = match_country_code('JPY(100)', 3);
        var unit3 = document.getElementById('unit3');
        unit3.textContent = `(${jpyExchange.cur_unit})`;
        var exchange3 = document.getElementById('exchange-rate3');
        exchange3.textContent = `${jpyExchange.deal_bas_r}`;
        var diff3 = document.getElementById('diff3');

        var replaced_jpydeal = jpyExchange.deal_bas_r.replace(',', '');
        var replaced_yesterdayjpydeal = yesterdayjpyExchange.deal_bas_r.replace(',', '');
        var diff_value3 = parseFloat(replaced_jpydeal) - parseFloat(replaced_yesterdayjpydeal);
        diff3.textContent = `${diff_value3.toFixed(2)}`;
        if (diff_value3 > 0) {
            document.getElementById('diff3').style.color = 'red';
        }
        else if (diff_value3 < 0) {
            document.getElementById('diff3').style.color = 'blue';
        }
        var buy3 = document.getElementById('buy3');
        buy3.textContent = `${jpyExchange.ttb}`;
        var sell3 = document.getElementById('sell3');
        sell3.textContent = `${jpyExchange.tts}`;
        var send3 = document.getElementById('year3');
        send3.textContent = `${jpyExchange.yy_efee_r}`;
        var get3 = document.getElementById('10day3');
        get3.textContent = `${jpyExchange.ten_dd_efee_r}`;

        var cnhExchange = data[0].find(item => item.cur_unit === 'CNH');
        var yesterdaycnhExchange = data[1].find(item => item.cur_unit === 'CNH');
        var country4 = document.getElementById('country4');
        country4.textContent = `${cnhExchange.cur_nm}`;
        var country4Img = match_country_code('CNH', 4);
        var unit4 = document.getElementById('unit4');
        unit4.textContent = `(${cnhExchange.cur_unit})`;
        var exchange4 = document.getElementById('exchange-rate4');
        exchange4.textContent = `${cnhExchange.deal_bas_r}`;
        var diff4 = document.getElementById('diff4');
        var replaced_cnhdeal = cnhExchange.deal_bas_r.replace(',', '');
        var replaced_yesterdaycnhdeal = yesterdaycnhExchange.deal_bas_r.replace(',', '');
        var diff_value4 = parseFloat(replaced_cnhdeal) - parseFloat(replaced_yesterdaycnhdeal);
        diff4.textContent = `${diff_value4.toFixed(2)}`;
        if (diff_value4 > 0) {
            document.getElementById('diff4').style.color = 'red';
        }
        else if (diff_value4 < 0) {
            document.getElementById('diff4').style.color = 'blue';
        }
        var buy4 = document.getElementById('buy4');
        buy4.textContent = `${cnhExchange.ttb}`;
        var sell4 = document.getElementById('sell4');
        sell4.textContent = `${cnhExchange.tts}`;
        var send4 = document.getElementById('year4');
        send4.textContent = `${cnhExchange.yy_efee_r}`;
        var get4 = document.getElementById('10day4');
        get4.textContent = `${cnhExchange.ten_dd_efee_r}`;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function redirectToSearchPage() {
    var inputValue = document.getElementById('expand-input').value;
    window.location.href = 'searchpage.html?search=' + encodeURIComponent(inputValue);
}

function viewSearchResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('search');
    Promise.all([fetch(apiUrlToday), fetch(apiUrlYesterday)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            var searchExchange = data[0].find(item => item.cur_unit === searchValue);
            var yesterdayExchange = data[1].find(item => item.cur_unit === searchValue);
            var country5 = document.getElementById('country-search');
            country5.textContent = `${searchExchange.cur_nm}`;
            var unit5 = document.getElementById('unit-search');
            unit5.textContent = `(${searchExchange.cur_unit})`;
            var exchange5 = document.getElementById('exchange-rate-search');
            exchange5.textContent = `${searchExchange.deal_bas_r}`;
            var diff5 = document.getElementById('diff-search');
            var replaced_todaydeal = searchExchange.deal_bas_r.replace(',', '');
            var replaced_yesterdaydeal = yesterdayExchange.deal_bas_r.replace(',', '');
            var diff_value5 = parseFloat(replaced_todaydeal) - parseFloat(replaced_yesterdaydeal);
            diff5.textContent = `${diff_value5.toFixed(2)}`;
            if (diff_value5 > 0) {
                document.getElementById('diff-search').style.color = 'red';
            }
            else if (diff_value5 < 0) {
                document.getElementById('diff-search').style.color = 'blue';
            }
            var buy5 = document.getElementById('buy-search');
            buy5.textContent = `${searchExchange.ttb}`;
            var sell5 = document.getElementById('sell-search');
            sell5.textContent = `${searchExchange.tts}`;
            var send5 = document.getElementById('year-search');
            send5.textContent = `${searchExchange.yy_efee_r}`;
            var get5 = document.getElementById('10day-search');
            get5.textContent = `${searchExchange.ten_dd_efee_r}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

}
