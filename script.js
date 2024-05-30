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
    const flagImage = document.getElementById('country' + order + 'Img');
    flagImage.src = imageUrl;
}

function match_country_code(countryName, order) {
    const apiUrlCountry = `http://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?ServiceKey=SCkTvRgui0ytJN0tRZIcizzqjJL2U6FXdXlaPcX62q3nVUjL78qp0CT%2BnScSK7viYrIg7s6Rcf7tdV1yB0O3kg%3D%3D&returnType=JSON&numOfRows=10&cond[country_nm::EQ]=${countryName}`;
    fetch(apiUrlCountry)
        .then(response => response.json())
        .then(data => {
            displayCountryFlag(data, order);
        })
        .catch(error => {
            console.error('Error fetching country flag data:', error);
        });
}

function getComparisonDate() {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    // 조회시간
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    var viewtime = document.getElementById('viewtime');
    viewtime.textContent = '(조회시간 : ' + formattedDate + ')';

    let comparisonDate;
    let todayDate;

    switch (dayOfWeek) {
        case 0: // Sunday
            todayDate = new Date(currentDate);
            todayDate.setDate(currentDate.getDate() - 2); // Friday
            comparisonDate = new Date(todayDate); // Friday
            document.getElementById('weekend-note').style.display = 'block';
            break;
        case 6: // Saturday
            todayDate = new Date(currentDate);
            todayDate.setDate(currentDate.getDate() - 1); // Friday
            comparisonDate = new Date(todayDate); // Friday
            document.getElementById('weekend-note').style.display = 'block';
            break;
        case 1: // Monday
            todayDate = new Date(currentDate);
            comparisonDate = new Date(todayDate);
            comparisonDate.setDate(todayDate.getDate() - 3); // Friday
            break;
        default:
            todayDate = new Date(currentDate);
            comparisonDate = new Date(todayDate);
            comparisonDate.setDate(todayDate.getDate() - 1); //previous day
            break;
    }

    return { todayDate, comparisonDate };
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

function fetchExchangeRates() {
    const { todayDate, comparisonDate } = getComparisonDate();
    const todayFormatted = formatDate(todayDate);
    const comparisonFormatted = formatDate(comparisonDate);

    const apiUrlToday = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=RZuk2sK0yoZiufnYTZbZQvm8wxo5wJvY&searchdate=${todayFormatted}&data=AP01`;
    const apiUrlComparison = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=RZuk2sK0yoZiufnYTZbZQvm8wxo5wJvY&searchdate=${comparisonFormatted}&data=AP01`;

    Promise.all([fetch(apiUrlToday), fetch(apiUrlComparison)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            var usdExchange = data[0].find(item => item.cur_unit === 'USD');
            var yesterdayusdExchange = data[1].find(item => item.cur_unit === 'USD');
            var country1 = document.getElementById('country1');
            country1.textContent = `${usdExchange.cur_nm}`;
            var country1Img = match_country_code('미합중국', 1);
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
            var country2Img = match_country_code('프랑스', 2);
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
            var country3Img = match_country_code('일본', 3);
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
            var country4Img = match_country_code('중국', 4);
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
}

// Display the note for weekends
function displayWeekendNote() {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        const weekendNote = document.createElement('div');
        weekendNote.id = 'weekend-note';
        weekendNote.textContent = '주말, 영업일 정보를 나타냅니다.';
        document.body.appendChild(weekendNote);
    }
}

fetchExchangeRates();
displayWeekendNote();

const countryCurrencyMap = {
    '건지': 'GBP',
    '과들루프': 'EUR',
    '그리스': 'EUR',
    '그린란드': 'DKK',
    '나우루': 'AUD', 
    '네덜란드': 'EUR',
    '노르웨이': 'NOK',
    '뉴질랜드': 'NZD',
    '니우에': 'NZD',
    '덴마크': 'DKK',
    '독일': 'EUR',
    '동티모르': 'USD',
    '라트비아': 'EUR',
    '레위니옹': 'EUR',
    '룩셈부르크': 'EUR',
    '리투아니아': 'EUR',
    '리히텐슈타인': 'CHF',
    '마르티니크': 'EUR',
    '마셜제도': 'USD',
    '말레이시아': 'MYR',
    '맨섬': 'GBP',
    '모나코': 'EUR',
    '몬테네그로': 'EUR',
    '몰타': 'EUR',
    '미합중국': 'USD',
    '사모아': 'USD',
    '미크로네시아': 'USD',
    '바레인': 'BHD',
    '버진 제도': 'USD',
    '벨기에': 'EUR',
    '보나이러': 'USD',
    '부베': 'NOK',
    '북마리아나제도': 'USD',
    '브루나이': 'BND', 
    '사우디아라비아': 'SAR',
    '산마리노': 'EUR',
    '생바르텔레미': 'EUR',
    '생피에르미클롱': 'EUR',
    '스웨덴': 'SEK',
    '스위스': 'CHF',
    '스페인': 'EUR',
    '슬로바키아': 'EUR',
    '슬로베니아': 'EUR',
    '싱가포르': 'SGD',
    '아랍에미리트': 'AED', 
    '아일랜드': 'EUR',
    '안도라': 'EUR',
    '에스토니아': 'EUR',
    '에콰도르': 'USD',
    '영국': 'GBP',
    '오스트리아': 'EUR',
    '올란드': 'EUR',
    '이탈리아': 'EUR',
    '인도네시아': 'IDR(100)',
    '일본': 'JPY(100)',
    '제르제': 'GBP',
    '중국': 'CNH',
    '캐나다': 'CAD',
    '코코스': 'AUD', 
    '쿠웨이트': 'KWD',
    '크리스마스섬': 'AUD', 
    '키리바시': 'AUD',
    '키프로스': 'EUR',
    '태국': 'THB',
    '터크스케이커스': 'USD',
    '토켈라우': 'NZD',
    '투발루': 'AUD',
    '파나마': 'USD',
    '팔라우': 'USD',
    '포르투갈': 'EUR',
    '푸에르토리코': 'USD',
    '프랑스': 'EUR',
    '핀란드': 'EUR',
    '핏케언': 'NZD',
    '대한민국': 'KRW',
    '호주': 'AUD',
    '홍콩': 'HKD'
};

function redirectToSearchPage() {
    var inputValue = document.getElementById('expand-input').value.trim();
    var mappingValue = countryCurrencyMap[inputValue];
    if (mappingValue) {
        window.location.href = 'searchpage.html?search=' + encodeURIComponent(mappingValue) + '&input=' + encodeURIComponent(inputValue);
    } else {
        console.error('Currency code not found for the given country');
    }
}

function viewSearchResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('search');
    const inputValue = urlParams.get('input');  // URL 파라미터에서 input 값을 가져옴

    if (inputValue) {
        document.getElementById('expand-input').value = inputValue;  // 검색어 창에 input 값을 설정
    }

    const { todayDate, comparisonDate } = getComparisonDate();
    const todayFormatted = formatDate(todayDate);
    const comparisonFormatted = formatDate(comparisonDate);

    const apiUrlToday = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=RZuk2sK0yoZiufnYTZbZQvm8wxo5wJvY&searchdate=${todayFormatted}&data=AP01`;
    const apiUrlComparison = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=RZuk2sK0yoZiufnYTZbZQvm8wxo5wJvY&searchdate=${comparisonFormatted}&data=AP01`;

    Promise.all([fetch(apiUrlToday), fetch(apiUrlComparison)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            var searchExchange = data[0].find(item => item.cur_unit === searchValue);
            var yesterdayExchange = data[1].find(item => item.cur_unit === searchValue);
            var country5 = document.getElementById('country-search');
            country5.textContent = `${searchExchange.cur_nm}`;
            var country5Img = match_country_code(inputValue, 5);
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
            } else if (diff_value5 < 0) {
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

document.addEventListener('DOMContentLoaded', function() {
    viewSearchResult();
});
