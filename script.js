let myChart;

function fetchDataAndUpdateChart(year) {
    fetch(`api/data-ekyc-year.php?year=${year}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching data:', data.details);
                alert('Error fetching data: ' + data.error);
            } else {
                const ctx = document.getElementById('myChart').getContext('2d');
                if (myChart) {
                    myChart.data.labels = data.labels;
                    myChart.data.datasets[0].data = data.datasets[0].data;
                    myChart.data.datasets[1].data = data.datasets[1].data;
                    myChart.data.datasets[2].data = data.datasets[2].data;
                    
                    myChart.update();
                } else {
                    myChart = new Chart(ctx, {
                        type: 'bar',
                        data: data,
                        options: {
                            plugins: {
                                datalabels: {
                                    display: true,
                                    color: '#444',
                                    anchor: 'end',
                                    align: 'top',
                                    formatter: function(value) {
                                        return value;
                                    },
                                    font: {
                                        weight: 'bold'
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'เดือน'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'จำนวนสมาชิก'
                                    },
                                    ticks: {
                                        min: 0,
                                        max: 1000,
                                        stepSize: 100
                                    }
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    });
                }
                document.getElementById('totalMembers').innerText = `ยอดรวมทั้งหมดในปี: ${data.total_count} คน`;

                // อัปเดตวันที่และเวลาที่แสดงบน HTML
                const currentTime = new Date();
                const formattedDate = currentTime.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const formattedTime = currentTime.toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                document.getElementById('updateTime').innerText = `อัปเดตล่าสุดเมื่อ: ${formattedDate} เวลา ${formattedTime}`;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateChart() {
    const selectedYear = document.getElementById('yearSelect').value;
    if (selectedYear) {
        fetchDataAndUpdateChart(selectedYear);
    } else {
        console.warn('No year selected');
    }
}

setInterval(updateChart, 10000); // Update every 10 seconds (adjust as needed)
updateChart(); // Initial load
