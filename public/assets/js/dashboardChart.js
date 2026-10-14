
// Revenue Generated Student Chart Example
        var dashboardChart = document.getElementById("RevenueGeneratedStudent").getContext("2d");

        var color1_gradient = dashboardChart.createLinearGradient(0, 0, 0, 600);
        color1_gradient.addColorStop(0, '#1f70a1');
        color1_gradient.addColorStop(1, '#e50041');

        var myBarChart = new Chart(dashboardChart, {
            type: "bar",
            data: {
                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                datasets: [
                    {
                        label: "Earnings",
                        lineTension: 0,
                        backgroundColor: color1_gradient,
                        data: [8, 15, 5, 7, 10, 8, 5, 7, 10, 9, 5.2, 10],
                        barThickness: 18,
                    },
                ],
            },
            options: {
                maintainAspectRatio: true,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0,
                    },
                },

                scales: {
                    xAxes: [
                        {
                            time: {
                                unit: "date",
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                maxTicksLimit: 12,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                maxTicksLimit: 10,
                                padding: 10,
                            },
                            gridLines: {
                                color: "#dddddd",
                                zeroLineColor: "rgb(234, 236, 244)",
                                drawBorder: true,
                                borderDash: [5],
                                zeroLineBorderDash: [5],
                            },
                        },
                    ],
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    backgroundColor: "#fff",
                    bodyFontColor: "#000",
                    titleMarginBottom: 10,
                    titleFontColor: "#000",
                    titleFontSize: 15,
                    borderColor: "#dddfed",
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: "index",
                    caretPadding: 10,
                    
                },
            },
        });
