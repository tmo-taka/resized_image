import jimp from 'jimp';
import sharp from 'sharp'
import * as fs from 'fs';
import {isNotJunk} from 'junk';
import {pdfToPng} from 'pdf-to-png-converter';
// 「process.argv[2]」に、引数として指定する変換対象ファイル名が渡される。

// サイズ表のマップ
var sizeMap = new Map
sizeMap.set('normal',{width: 60, height:30});
sizeMap.set('small',{width: 50, height:25})
sizeMap.set('big',{width: 120, height:60})

async function main(type,number) {
    console.log(type,number)
    const logoDirectory = './img/logo' 
    let files = fs.readdirSync(logoDirectory)
    let file = files.filter(isNotJunk)[0]
    let extend = file.split(".").pop();

    if(extend === "pdf"){
        //NOTE: PDFの場合はPNGに変換する
        const filePath = logoDirectory + '/' + file;
        console.log(filePath);
        const img = await pdfToPng(filePath ,{
            outputFolder: logoDirectory,
        })
        file.replace('pdf','png');
        extend = 'png'
        console.log(img);

    }
    // ファイル読み込み
    if(type == "HIKKOSHI"){
        // TODO: 拡張子対応しなければ
        const image = await createOriginLogo(2,logoDirectory,file)

        const image_normal = await resize_writen(image[0],'normal',extend)
        const image_small = await resize_writen(image[1],'small',extend)

        // 背景の余白を作成
        const backImage_normal = createBackImage(60,30)
        const backImage_small = createBackImage(50,25)

        //TODO: 画像の長さを見て、長さに合わせて、どちらをautoにするか決める必要あり
        await putLogo(backImage_normal,image_normal);
        await putLogo(backImage_small,image_small);

        await outputLogo(backImage_normal,'normal')
        await outputLogo(backImage_small,'small')
}

async function createOriginLogo(number=2,logoDirectory,file) {
    const img = [];
    for (let i=0; i<number; i++ ){
        img[i] = await jimp.read(logoDirectory + '/' + file)
    }
    return img;
}

function createBackImage(x, y) {
    return new jimp(x, y, '#FFFFFF', (err, backImage) => {
        return backImage
    });
}

async function resize_writen(logo,key,extend) {
    const {width,height} = sizeMap.get(key);
    const image = await logo_resize(logo,{width,height});
    await image.writeAsync(`img/image_%{key}` + extend);
    return image;
}

async function logo_resize(logo,size){
    const {width, height} = size
    const logoWidth = logo.bitmap.width
    const logoHeight = logo.bitmap.height
    const widthAbsolute = Math.abs(logoWidth- width);
    const heighAbsolute = Math.abs(logoHeight- height);
    if(widthAbsolute > heighAbsolute){
        const image = await logo.resize(width, jimp.AUTO);
        return image
    }else {
        const image = await logo.resize(jimp.AUTO, height);
        return image
    }
}

async function putLogo(back,logo){
    const height = logo.bitmap.height
    const backHeight = back.bitmap.height

    if(height == backHeight){
        const centerPosion = (back.bitmap.width - logo.bitmap.width) / 2;
        await back.blit(logo,centerPosion,0);
    }else {
        const centerPosion = (back.bitmap.height - logo.bitmap.height) / 2;
        await back.blit(logo,0,centerPosion);
    }
}

async function outputLogo(back,type){
    var name
    switch(type){
        case 'small':
            name = 'logo_s';
            break;
        default:
            name = 'logo';
    }
    await back.writeAsync('img/' + number + '_' + name +'.png')
    await sharp('img/' + number + '_' + name +'.png')
            .toFormat("gif")
            .toFile('img/output/' + number + '_' + name +'.gif');
    }
}

// NOTE: 引数取得
const args = process.argv.slice(2)
// NOTE: 引数を関数に渡す
if(args[0] && args[1]){
    main(args[0],args[1]);
}