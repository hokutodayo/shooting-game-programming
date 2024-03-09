// スクリーンサイズ
const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 320;

// フィールドサイズ（多少大きくする）
const FIELD_WIDTH = SCREEN_WIDTH + 120;
const FIELD_HEIGHT = SCREEN_HEIGHT + 40;

// キャンバスサイズ（２倍に拡大表示）
const CANVAS_WIDTH = SCREEN_WIDTH * 2;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 2;

// キャンバス
let canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let context = canvas.getContext("2d");

// ランダム整数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 星クラス
class Star {

    constructor() {
        // 座標
        this.x = rand(0, FIELD_WIDTH) << 8;
        this.y = rand(0, FIELD_HEIGHT) << 8;
        // 星の大きさ
        this.size = rand(1, 2);
    }

    // 描画
    draw() {
        // 星の瞬き（色をランダムに変化）
        let color = rand(0, 2) == 0 ? "#aaeeff" : "#6666ff";
        context.fillStyle = color;
        // 描画
        context.fillRect(this.x >> 8, this.y >> 8, this.size, this.size);
    }
}

// 星の数
const MAX_STAR_NUM = 300;
// 星オブジェクト管理配列
let star = [];

// 星の生成
for (let index = 0; index < MAX_STAR_NUM; index++) {
    star[index] = new Star();
}

// 背景描画
context.fillStyle = "black";
context.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

// 描画
for (let index = 0; index < star.length; index++) {
    star[index].draw();
}
