// Load google charts
google.charts.load('current', { 'packages': ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

// Get circulation data
async function getCirculation() {

}
// Draw the chart and set the chart values
async function drawChart () {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Work', 8],
        ['Eat', 2],
        ['TV', 4],
        ['Gym', 2],
        ['Sleep', 8]
    ])

    // Optional; add a title and set the width and height of the chart
    var options = { 'height': 300 }

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

window.onload(getSettData())