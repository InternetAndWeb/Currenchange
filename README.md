# Currenchange
환율 정보 API를 이용한 관심 국가 통화 비용 계산

Currenchange is a web application that provides real-time exchange rate information for various currencies. Users can view the latest exchange rates, compare them with previous days, and access detailed financial data for each currency. Additionally, users can register a country of interest to see its exchange rate on the main page.

## Project Structure

The project consists of the following files and directories:

```css
.
├── README.md
├── currenchange.html
├── img
│   ├── icon_star_empty.png
│   ├── icon_star_yellow.png
│   └── magnifying-glass.png
├── script.js
├── searchpage.html
├── server.js
└── style.css
```

## How to Launch the Website

1. Open a terminal and navigate to the project directory, `Currenchange`.
2. Start the server by running:
    
    ```
    node server.js
    ```
    
3. Open your browser and go to `http://127.0.0.1:3000/`.

If you encounter problems with API requests, resolve them by installing the "Allow CORS" extension in your Chrome browser.

## Team Members

| Name | GitHub Profile |
| --- | --- |
| KIM YUNHA (김윤하) | https://github.com/xdbsgk |
| KIM JINWOO (김진우) | https://github.com/Greenviee |

## Project Requirements

### Use Cases

1. **Default Exchange Rates**: When the website is first loaded, it displays exchange rate information for four major currencies by default.
2. **Search Functionality**: Users can search for exchange rates by country name using the search bar.
3. **Interest Country Feature**: Users can set a country of interest on the search results page. This country will be displayed on the main page and saved in local storage, maintaining the selection even after a page refresh.
4. **Home Navigation**: Clicking the Pusan National University logo at the top left of the screen will navigate back to the main page.

### Files

- **CSS File**: `style.css`
- **JavaScript File**: `script.js`

### Open APIs Used

1. **Korea Eximbank API**:
    - URL: [Korea Eximbank API](https://www.koreaexim.go.kr/site/program/financial/exchangeJSON)
    - Provides exchange rates, currency units, buying and selling prices, basic exchange rates, and rates announced by the Bank of Korea.
    - Data format: JSON
2. **Data.go.kr API**:
    - URL: [Data.go.kr API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15076263)
    - Provides national flag images by country and region.
    - Data format: JSON
