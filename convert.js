const jimp = require("jimp");
const sharp = require("sharp");
// 「process.argv[2]」に、引数として指定する変換対象ファイル名が渡される。

async function main(type,number) {
    console.log(type,number)
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
    await backImage.writeAsync('img/dummy.png')
    await sharp('img/dummy.png')
            .toFormat("gif")
            .toFile('img/' + number + '.gif');
}

function createBackImage(x, y) {
    return new jimp(x, y, '#FFFFFF', (err, backImage) => {
        return backImage
    });
}

// NOTE: 引数取得
const args = process.argv.slice(2)
// NOTE: 引数を関数に渡す
if(args[0] && args[1]){
    main(type=args[0],number=args[1]);
}