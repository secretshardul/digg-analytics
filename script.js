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

// Get sett data