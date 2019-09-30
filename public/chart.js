var options = {
    chart: {
        height: 300,
        type: 'line',
        shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 1
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#77B6EA', '#545454', '#33cea2', '#ce3333', '#ab27db', '#dbc027'],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth'
    },
    series: [
        {
            name: "Anteil A",
            data: []
        },
        {
            name: "Anteil B",
            data: []
        },
        {
            name: "Anteil C",
            data: []
        },
        {
            name: "Anteil D",
            data: []
        },
        {
            name: "Anteil E",
            data: []
        },
        {
            name: "Anteil F",
            data: []
        }

    ],
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    markers: {
        size: 4
    },
    xaxis: {
        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]//,
        //min: 0,
        //max: 13
    },
    yaxis: {
        min: 50,
        max: 200,
    }    ,
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: 0,
        offsetX: 0
    }
};

