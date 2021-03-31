/** DIGG circulation pie chart */

// Major DIGG holders
const TEAM_VESTING_FUNDS = 'Team vesting funds'
const REWARDS_ESCROW = 'Rewards escrow'
const DAO_FUNDS = 'DAO funds'
const OTHER = 'Other'

const majorDiggHolders = {
    [TEAM_VESTING_FUNDS]: '0x124fd4a9bd4914b32c77c9ae51819b1181dbb3d4',
    [REWARDS_ESCROW]: '0x19d099670a21bc0a8211a89b84cedf59abb4377f',
    [DAO_FUNDS]: '0x5a54ca44e8f5a1a695f8621f15bfa159a140bb61'
}

// Balances to be displayed in circulation pie chart
let balances = {
    [TEAM_VESTING_FUNDS]: 0,
    [REWARDS_ESCROW]: 0,
    [DAO_FUNDS]: 0,
    [OTHER]: 0
}

/**
 * Returns total DIGG supply
 * @returns number
 */
async function getTotalSupply() {
    const resp = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=digg')
        .then(result => result.json())
    console.log('Digg stats', resp)

    const supply = resp[0].total_supply
    console.log('Supply', supply)
    return supply
}

/**
 * Returns DIGG balance for given address
 * @param {string} address
 * @returns number
 */
async function getBalance(address) {
    const sharesPerFragment = 43880509104374636998557764964276047643928934163648035762810023405
    const DIGG_CONTRACT_ADDR = '0x798d1be841a82a273720ce31c822c61a67a601c3'

    const query = `query getBalance($id: ID!) {
        tokenBalance(id: $id) {
            id
            balance
            token {
            name
            }
        }
    }`

    const graphResp = await fetch("https://api.thegraph.com/subgraphs/name/darruma/badger", {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables: {
                id: address + '-' + DIGG_CONTRACT_ADDR
            }
        }),
        method: 'POST',
    });
    const result = await graphResp.json()
    const shares = result.data.tokenBalance.balance

    const balance = shares / (sharesPerFragment * 10**9)
    console.log('Got balance', balance)
    return balance

}

/**
 * Helper function to get tuple for Google charts. Data contains account name and balance
 * @param {string} accountName
 * @returns [string, number]
 */
function pieChartData(accountName) {
    return [accountName, balances[accountName]]
}

// Load google charts
google.charts.load('current', { 'packages': ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

/**
 * Helper function to draw chart from saved balances
 */
function renderChart() {
    var data = google.visualization.arrayToDataTable([
        ['Ownership', 'DIGG tokens'],
        pieChartData(TEAM_VESTING_FUNDS),
        pieChartData(REWARDS_ESCROW),
        pieChartData(DAO_FUNDS),
        pieChartData(OTHER)
    ])

    var options = {
        chartArea: { width: '100%', height: '100%' },
        'height': 200,
        pieSliceText: 'value-and-percentage'
    }

    var chart = new google.visualization.PieChart(document.getElementById('piechart'))
    chart.draw(data, options)
}

/**
 * Get balances of major accounts and display a pie chart
 */
async function drawChart () {
    const supply = await getTotalSupply()
    const bal1 = await getBalance(majorDiggHolders[TEAM_VESTING_FUNDS])
    const bal2 = await getBalance(majorDiggHolders[REWARDS_ESCROW])
    const bal3 = await getBalance(majorDiggHolders[DAO_FUNDS])

    const other = supply - (bal1 + bal2 + bal3)

    balances = {
        [TEAM_VESTING_FUNDS]: bal1,
        [REWARDS_ESCROW]: bal2,
        [DAO_FUNDS]: bal3,
        [OTHER]: other
    }

    window.setTimeout(() => {
        renderChart()
    }, 2000)
}

// Redraw pie chart on screen resize
window.onresize = () => {
    window.setTimeout(() => {
        renderChart()
    }, 2000)
}


/** DIGG setts table */


/**
 * Returns HTML string for sett table rows
 * @param {string} rows
 * @returns string
 */
function getTable(rows) {
    return `<table class="table table-image">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Sett</th>
                        <th scope="col">DIGG</th>
                        <th scope="col">Value (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>`
}

/**
 * Fetch active DIGG setts and display their balance and locked value in tabular format
 */
async function renderSettTable() {
    console.log('Getting sett data')
    const settTable = document.getElementById('sett-table')
    const setts = ['DIGG', 'DIGG-WBTC', 'SLP-DIGG-WBTC']
    const resp = await fetch('https://api.badger.finance/v2/geysers?chain=eth')
    const geysers = await resp.json()
    console.log('Body', geysers)

    const result = geysers
        .filter((geyser) => setts.includes(geyser.asset))
        .map(geyser => {
            const tokenData = geyser.tokens.filter(data => {
                return data.name === 'Digg'
            })[0]
            return `<tr>
                        <td><img src="https://app.badger.finance/assets/icons/${geyser.asset.toLowerCase()}.png" class="img-fluid" width="40" height="40"></td>
                        <td>${geyser.name}</td>
                        <td>${tokenData.balance.toFixed(2)}</td>
                        <td>${tokenData.value.toFixed(2)}</td>
                    </tr>`
        }).reduce((previous, current) => {
            return previous += current
        })

    console.log('Result', result)

    settTable.innerHTML = getTable(result)

}
