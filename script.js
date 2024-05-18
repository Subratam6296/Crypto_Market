document.addEventListener('DOMContentLoaded', async function () {
    const searchInput = document.getElementById('searchInput');
    const sortMarketCapBtn = document.getElementById('sortMarketCapBtn');
    const sortPercentageChangeBtn = document.getElementById('sortPercentageChangeBtn');
    const cryptoData = document.getElementById('cryptoData');
    const sortingInfo = document.getElementById('sortingInfo');

    let originalData = [];
    let filteredData = [];
    let currentSortingCriteria = '';
    let isAscending = true;

    async function fetchData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
            originalData = await response.json();
            filteredData = [...originalData];
            renderData(originalData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderData(data) {
        cryptoData.innerHTML = '';
        if (data.length === 0) {
            const noResultRow = document.createElement('tr');
            noResultRow.innerHTML = '<td colspan="7" style="text-align: center;">No results found</td>';
            cryptoData.appendChild(noResultRow);
        } else {
            data.forEach(coin => {
                const row = document.createElement('tr');
                const percentageChange = coin.price_change_percentage_24h;
                const color = percentageChange >= 0 ? 'green' : 'red';
                row.innerHTML = `
                    <td><img src="${coin.image}" alt="${coin.name}" width="50"></td>
                    <td>${coin.name}</td>
                    <td>${coin.symbol.toUpperCase()}</td>
                    <td>$${coin.current_price}</td>
                    <td>$${coin.total_volume}</td>
                    <td style="color: ${color}">${percentageChange.toFixed(2)}%</td>
                    <td>Mkt Cap: $${coin.market_cap}</td>
                `;
                cryptoData.appendChild(row);
            });
        }
    }

    function updateSortingInfo(criteria) {
        sortingInfo.textContent = `Sorted by ${criteria}`;
    }

    function search() {
        const searchValue = searchInput.value.trim().toLowerCase();
        filteredData = originalData.filter(coin => coin.name.toLowerCase().includes(searchValue) || coin.symbol.toLowerCase().includes(searchValue));
        currentSortingCriteria = 'Search';
        renderData(filteredData);
        updateSortingInfo('Search');
    }

    function sortData(criteria) {
        if (criteria === currentSortingCriteria) {
            isAscending = !isAscending;
        } else {
            isAscending = true;
            currentSortingCriteria = criteria;
        }

        switch (criteria) {
            case 'MarketCap':
                filteredData.sort((a, b) => (isAscending ? 1 : -1) * (a.market_cap - b.market_cap));
                break;
            case 'PercentageChange':
                filteredData.sort((a, b) => (isAscending ? 1 : -1) * (a.price_change_percentage_24h - b.price_change_percentage_24h));
                break;
            default:
                break;
        }

        renderData(filteredData);
        updateSortingInfo(`${criteria} ${isAscending ? 'Ascending' : 'Descending'}`);
    }

    function sortMarketCap() {
        sortData('MarketCap');
    }

    function sortPercentageChange() {
        sortData('PercentageChange');
    }

    searchInput.addEventListener('input', search);
    sortMarketCapBtn.addEventListener('click', sortMarketCap);
    sortPercentageChangeBtn.addEventListener('click', sortPercentageChange);

    await fetchData();
});
  