import jimp from 'jimp';
import sharp from 'sharp'
import * as fs from 'fs';
import {isNotJunk} from 'junk';
import {pdfToPng} from 'pdf-to-png-converter';
// 「process.argv[2]」に、引数として指定する変換対象ファイル名が渡される。

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
        const image = await jimp.read(logoDirectory + '/' + file);
        const image_2 = await jimp.read(logoDirectory + '/' + file);

        const image_normal = await logo_resize(image,[60,30]);
        const image_small = await logo_resize(image_2,[50,25]);

        // TODO: 拡張子対応しなければ
        await image_normal.writeAsync('img/image_normal.' + extend);
        await image_small.writeAsync('img/image_small.'+ extend);

        // 背景の余白を作成
        const backImage_normal = createBackImage(60,30)
        const backImage_small = createBackImage(50,25)

        //TODO: 画像の長さを見て、長さに合わせて、どちらをautoにするか決める必要あり
        await putLogo(backImage_normal,image_normal);
        await putLogo(backImage_small,image_small);

        await outputLogo(backImage_normal,'normal')
        await outputLogo(backImage_small,'small')
}

function createBackImage(x, y) {
    return new jimp(x, y, '#FFFFFF', (err, backImage) => {
        return backImage
    });
}

async function logo_resize(logo,size){
    const width = logo.bitmap.width
    const height = logo.bitmap.height
    if(width > height){
        const image = await logo.resize(size[0], jimp.AUTO);
        return image
    }else {
        const image = await logo.resize(jimp.AUTO, size[1]);
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