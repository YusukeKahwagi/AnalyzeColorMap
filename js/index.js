document.getElementById('imageUploader').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {

    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const img = new Image();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function (e) {
        img.src = e.target.result;
    };

    img.onload = function () {
        const originalWidth = img.width;
        const originalHeight = img.height;
        let newWidth = originalWidth;
        let newHeight = originalHeight;
        let aspectRatio;
        //幅と高さのどちらかが500PX以上の場合は長辺を500PXにする
        if (originalHeight > 500 || originalWidth > 500) {
            if (originalWidth > originalHeight) {
                newWidth = 500; // 縮小後の幅
                aspectRatio = originalHeight / originalWidth;
                newHeight = newWidth * aspectRatio; // アスペクト比を維持した高さ
            } else {
                newHeight = 500;
                aspectRatio = originalWidth / originalHeight;
                newWidth = newHeight * aspectRatio;
            }
        }
        // Canvasのサイズを更新
        canvas.width = newWidth;
        canvas.height = newHeight;

        // 画像を縮小して描画
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        extractHSV(ctx, newWidth, newHeight);
    };

    reader.readAsDataURL(file);
}

function extractHSV(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);

    //画像データはピクセル数*4（RSVA）の一次元配列に変換される
    const hsvData = [];

    //画像のhsvデータの出現回数を保存するhsvData配列の作成
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i] / 255;
        const g = imageData.data[i + 1] / 255;
        const b = imageData.data[i + 2] / 255;

        //rgb値をHSVに変換（この時にHは１２０段階、SとVは２０段階で振り分けられる）
        const hsv = rgbToHsv(r, g, b);

        //hsvdata配列の中で、HSV全て同一のモノがあればそれのamountを＋１する。なければpush
        let flag = false;
        for (let i = 0; i < hsvData.length; i++) {
            if (hsvData[i].h === hsv.h && hsvData[i].s === hsv.s && hsvData[i].v === hsv.v) {
                hsvData[i].amount += 1;
                flag = true;
                break;
            }
        }
        if (!flag) {
            hsvData.push(hsv);
        }
    }
    //hsvDataをamount多い順でソート
    hsvData.sort((b, a) => a.amount - b.amount);
    //ピクセル数を算出
    const allPixelAmount = imageData.data.length / 4
    displayCharts(hsvData, allPixelAmount);  // グラフを先に表示
    displayHSVData(hsvData, allPixelAmount);
}


