function displayHSVData(hsvData, allPixelAmount) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML=''; //既存のテーブルをクリア
    let table = '<table><thead><tr><th>ピクセル数</th><th>割合(%)</th><th>色相 (Hue)</th><th>彩度 (Saturation)</th><th>明度 (Value)</th><th>色のプレビュー</th></tr></thead><tbody>';

    hsvData.forEach((hsv, index) => {
        //色の出現パーセント情報を付与
        hsv.percent = hsv.amount * 100 / allPixelAmount
        //色のプレビュー表示情報を付与
        const rgb = hsvToRgb(hsv.h, hsv.s / 100, hsv.v / 100);
        const color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        table += `<tr>
            <td>${hsv.amount}</td>
            <td>${hsv.percent}</td>
            <td>${hsv.h}</td>
            <td>${hsv.s}</td>
            <td>${hsv.v}</td>
            <td style="background-color: ${color}; width: 50px; height: 20px;"></td>
            </tr>`;
    });

    table += '</tbody></table>';
    resultsDiv.innerHTML = table;
}


//グラフのインスタンスを初期値Nullで宣言（グローバル変数として保持）
let hueChart = null;
let svChart = null;
let saturationChart = null;
let valueChart = null;

function displayCharts(hsvData, allPixelAmount) {
    //色相の出現頻度を保存する配列を用意する（0から360まで、要素数361）
    const hueCounts = new Array(361).fill(0);

    //彩度と明度の出現頻度を保存する二次元配列（0から100までを双方５刻みなので、要素数21*21）
    const svCounts = new Array(21*21);
    //メモリ削減も見越して、0から始まり５の倍数の地点のみ要素数101の配列を入れ込む
    for(let i = 0; i < 21; i++){
        for(let j = 0; j < 21; j++){
            svCounts[i*21+j] = {x: i*5, y: j*5, r: 0};
        }
    }
    
    const saturationCounts = new Array(101).fill(0);
    const valueCounts = new Array(101).fill(0);


    //画像のHSV値の頻度を記録した配列データを使って色相カウント配列と彩度明度カウント配列に出現頻度を入れ込む
    hsvData.forEach(hsv => {
        if(hsv.s > 0){
            hueCounts[hsv.h] += hsv.amount;
        }else{
            console.log(hsv);
        }
        svCounts[hsv.s/5*21 + hsv.v/5].r += hsv.amount;
        
        saturationCounts[hsv.s] += hsv.amount;
        valueCounts[hsv.v] += hsv.amount;
    });

    //svCountsのrをパーセント反映できるように調整
    //const maxSV = Math.max(...svCounts.map(item => item.r));
    svCounts.forEach(item => {
        item.r = item.r/allPixelAmount * 100
        //item.r = item.r/maxSV*20;
    })
    
    

    //色相グラフを出力するキャンバスとCtxを定義
    const hueCanvas = document.getElementById('hueChart');
    const hueCtx = hueCanvas.getContext('2d');

    //チャートが既に存在している場合は削除する
    if(hueChart){
        hueChart.destroy();
    }

    //hueCountsをもとに色相グラフのラベルとデータを作る
    hueLabel = Array.from({ length: 360 }, (_, i) => i);
    hueData = hueCounts.map(count => (count / allPixelAmount) * 100);

    hueChart = new Chart(hueCtx, {
        type: 'bar',
        data: {
            labels: hueLabel,
            datasets: [{
                label: '色相 (Hue)',
                data: hueCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            maintainAspectRatio: false, // アスペクト比を保持しない
            responsive: true,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '色相 (Hue)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '出現頻度 (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const hueValue = hueLabel[index];
                    filterTableByHue(hueValue, hsvData);
                }
            }

        }
    });

    const testarray = [{ x:30, y: 10, r:8 },
        { x:40, y: 14, r:10 },
        { x:50, y: 15, r:15 },];
    //彩度と明度はバブルチャートで表示する
    const svCtx = document.getElementById('svChart').getContext('2d');
    if(svChart){
        svChart.destroy();
    }
    svChart = new Chart(svCtx, {
        type: 'bubble',
        data: {
            datasets : [{
                label: '彩度と明度(％)',
                data: svCounts,
                backgroundColor: '#f88'
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '明度 (Value)'
                    }
                    },
                x: {title: {
                        display: true,
                        text: '彩度(Saturation)' 
                }
                    },
              },
        },
    });



    const saturationCtx = document.getElementById('saturationChart').getContext('2d');
    const valueCtx = document.getElementById('valueChart').getContext('2d');
    if(saturationChart){
        saturationChart.destroy();
    }
    if(valueChart){
        valueChart.destroy();
    }

    saturationChart = new Chart(saturationCtx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 101 }, (_, i) => i),
            datasets: [{
                label: '彩度 (Saturation)',
                data: saturationCounts.map(count => (count / allPixelAmount) * 100),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false, // アスペクト比を保持しない
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '彩度 (Saturation)'
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '出現頻度 (%)'
                    }
                }
            }
        }
    });

    valueChart = new Chart(valueCtx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 101 }, (_, i) => i),
            datasets: [{
                label: '明度 (Value)',
                data: valueCounts.map(count => (count / allPixelAmount) * 100),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false, // アスペクト比を保持しない
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '明度 (Value)'
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '出現頻度 (%)'
                    }
                }
            }
        }
    });

}

function filterTableByHue(hueValue, hsvData) {
    const filteredData = hsvData.filter(data => data.h === hueValue);
    const allPixelAmount = hsvData.reduce((sum, data) => sum + data.amount, 0);

    displayHSVData(filteredData, allPixelAmount);
}