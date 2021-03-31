// Load google charts
google.charts.load('current', { 'packages': ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

async function getTotalSupply() {
    const resp = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=digg')
        .then(result => result.json())
    console.log('Digg stats', resp)

    const supply = resp[0].total_supply
    console.log('Supply', supply)
    return supply
}

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

// Draw the chart and set the chart values
async function drawChart () {

    const majorDiggHolders = {
        'Team vesting funds': '0x124fd4a9bd4914b32c77c9ae51819b1181dbb3d4',
        'Rewards escrow': '0x19d099670a21bc0a8211a89b84cedf59abb4377f',
        'DAO funds': '0x5a54ca44e8f5a1a695f8621f15bfa159a140bb61'
    }

    const supply = await getTotalSupply()

    const bal1 = await getBalance(majorDiggHolders['Team vesting funds'])
    const bal2 = await getBalance(majorDiggHolders['Rewards escrow'])
    const bal3 = await getBalance(majorDiggHolders['DAO funds'])

    const other = supply - (bal1 + bal2 + bal3)


    var data = google.visualization.arrayToDataTable([
        ['Ownership', 'DIGG tokens'],
        ['Team vesting funds', bal1],
        ['Rewards escrow', bal2],
        ['DAO funds', bal3],
        ['Other', other]
    ])

    // Optional; add a title and set the width and height of the chart
    var options = {
        chartArea: { width: '100%', height: '100%' },
        // 'height': 400,
        // 'width': 700,
        pieSliceText: 'value-and-percentage'
     }

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'))
    chart.draw(data, options)
}

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
// Get sett data
async function getSettData() {
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
