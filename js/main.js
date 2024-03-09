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

// フィールド（仮想キャンバス）
let vCanvas = document.createElement("canvas");
vCanvas.width = FIELD_WIDTH;
vCanvas.height = FIELD_HEIGHT;
let vContext = vCanvas.getContext("2d");

// カメラ座標
let cameraX = 0;
let cameraY = 0;

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
        // 移動
        this.vx = 0;
        this.vy = rand(30, 200);
        // 星の大きさ
        this.size = rand(1, 2);
    }

    // 情報更新
    update() {
        // 移動
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;

        // 画面下まで移動したら、再度上から
        if ((FIELD_HEIGHT << 8) < this.y) {
            this.x = rand(0, FIELD_WIDTH) << 8;
            this.y = 0;
        }
    }

    // 描画
    draw() {
        // 星の瞬き（色をランダムに変化）
        let color = rand(0, 2) == 0 ? "#aaeeff" : "#6666ff";
        vContext.fillStyle = color;
        // 描画
        vContext.fillRect(this.x >> 8, this.y >> 8, this.size, this.size);
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

// ゲームスピード（1000msをフレーム数で割る）
const GAME_SPEED = 1000 / 60;

// フレーム単位で関数を呼び出す
setInterval(gameLoop, GAME_SPEED);

// ゲームループ関数
function gameLoop() {

    // 背景描画
    vContext.fillStyle = "black";
    vContext.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    // 情報更新処理
    // 星の更新
    for (let index = 0; index < star.length; index++) {
        star[index].update();
    }

    // 描画処理
    // 星の描画
    for (let index = 0; index < star.length; index++) {
        star[index].draw();
    }

    // キャンバスの描画（仮想画面からコピー）
    context.drawImage(vCanvas, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT,
        0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
