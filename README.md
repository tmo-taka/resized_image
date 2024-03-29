# resized_image

## 概要
 弊社で行う企業ロゴ画像のリサイズが可能です。  
 PDF非対応(2022/08/23現在)  
 **最終的に生成されたものは目視で必ずご確認ください**

## 環境
node: 17系
MacOSの場合は、`pdfToPng`ライブラリを使用しているためMacOS M1でないと使用できません。

## 使い方
 1. imgフォルダ内にあるlogoフォルダに対象ロゴ画像を突っ込んでください。(ファイル名は任意です、画像はlogoフォルダに一つだけにしてください)
 2. 下記コマンド引数に従って、コマンドを入力してください。
 3. 入力しましたらimgフォルダ内にあるoutputフォルダにロゴ画像がコマンド通りの命名で出力されます。

## コマンド引数について
 ``` 
 サイト名 企業ID 余白を取り除くかの判別子
 ```

 実行コマンド例
 ``` 
 node convert.js HIKKOSHI 2103 true
 ```

| 引数 | 型 | 必須 | 例 |
| -- | -- | -- | -- |
| サイト名 | String | ○ | HIKKOSHI or PIANO |
| 企業ID | Number | ○ | 2103 |
| 余白を取り除くかの判別子 | Any(Boolean推奨) |  | true |

「余白を取り除くか」は [sharp.trim()](https://sharp.pixelplumbing.com/api-resize#trim)を使っているため外側からピクセルのエッジが単調なものを取り除きます。最終的に生成されたものをご確認ください。

## 使っている技術について
| ライブラリ名 | 内容 |
| -- | -- |
| jimp | 画像変換ライブラリ |
| sharp | 画像変換ライブラリ(jimpの場合はgif画像での書き出しできないため使用) |
| fs | ファイルアクセスのため |
| junk | macで行った場合、logoディレクトリに変化元画像を入れた際に見えないファイルの「.DS_Store」を除外して考えたいため導入 |
| pdfToPng | PDFファイルをPNGファイルに変換するため(Macの場合はM1でないと動かない...) |