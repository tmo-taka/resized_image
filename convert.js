const jimp = require("jimp");
// 「process.argv[2]」に、引数として指定する変換対象ファイル名が渡される。
async function main() {
    // ファイル読み込み
    const image = await jimp.read('img/logo.jpg');

    //TODO: 画像の長さを見て、長さに合わせて、どちらをautoにするか決める必要あり
    await image.resize(jimp.AUTO, 30);
    // 画像サイズを取得
    await image.writeAsync('img/convert_resize.jpg');

    // 背景の余白を作成
    const backImage = createBackImage(60,30)

    let centerPosionX = (backImage.bitmap.width - image.bitmap.width) / 2

    await backImage.blit(image,centerPosionX,0);
    console.log(backImage)
    await backImage.writeAsync('img/back.jpg')
}

function createBackImage(x, y) {
    return new jimp(x, y, '#FFFFFF', (err, backImage) => {
        return backImage
    });
}

main();