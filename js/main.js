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

// キーボード
let key = [];
// キーが押されたとき
document.onkeydown = function (e) {
    key[e.key] = true;
}
// キーが離されたとき
document.onkeyup = function (e) {
    key[e.key] = false;
}

// 画像の読み込み
let spriteImage = new Image();
spriteImage.src = "./image/sprite.png"

// 画像情報クラス
class ImageInfo {

    // コンストラクター
    constructor(x, y, width, height) {
        // 画像座標
        this.x = x;
        this.y = y;
        // 画像の大きさ
        this.width = width;
        this.height = height;
    }
}

// プレイヤークラス
class Player {

    // 画像情報配列
    static #imageInfos = [
        new ImageInfo(0, 0, 22, 42),
        new ImageInfo(23, 0, 33, 42),
        new ImageInfo(57, 0, 43, 42),
        new ImageInfo(101, 0, 33, 42),
        new ImageInfo(135, 0, 21, 42),
    ];

    // コンストラクター
    constructor() {
        // カウンター（生存時間）
        this.count = 0;
        // 画像情報のindex
        this.imageIndex = 2;
        // 座標
        this.x = (FIELD_WIDTH / 2) << 8;
        this.y = (FIELD_HEIGHT / 2) << 8;
        // スピード
        this.speed = 1024;
    }

    // 情報更新
    update() {
        // カウント
        this.count++;

        // 左右キー押下時
        if (key["ArrowLeft"] && this.x > 0) {
            // 左へ移動
            this.x = this.x - this.speed;
            // 4フレーム単位で左傾き画像へ
            if (this.count % 4 == 0 && this.imageIndex > 0) {
                this.imageIndex--;
            }
        } else if (key["ArrowRight"] && this.x < (FIELD_WIDTH << 8)) {
            // 右へ移動
            this.x = this.x + this.speed;
            // 4フレーム単位で右傾き画像へ
            if (this.count % 4 == 0 && this.imageIndex < 4) {
                this.imageIndex++;
            }
        } else {
            // 4フレーム単位で正面画像へ
            if (this.count % 4 == 0) {
                if (this.imageIndex < 2) {
                    this.imageIndex++;
                } else if (this.imageIndex > 2) {
                    this.imageIndex--;
                }
            }
        }

        // 上キー押下時
        if (key["ArrowUp"] && this.y > 0) {
            this.y = this.y - this.speed;
        }
        // 下キー押下時
        if (key["ArrowDown"] && this.y < (FIELD_HEIGHT << 8)) {
            this.y = this.y + this.speed;
        }
    }

    // 描画処理
    draw() {
        // 画像情報
        let imageX = Player.#imageInfos[this.imageIndex].x;
        let imageY = Player.#imageInfos[this.imageIndex].y;
        let imageWidth = Player.#imageInfos[this.imageIndex].width;
        let imageHeight = Player.#imageInfos[this.imageIndex].height;
        // 位置座標
        let pX = this.x >> 8;
        let pY = this.y >> 8;
        // 画像の中心座標
        pX = pX - (imageWidth / 2);
        pY = pY - (imageHeight / 2);
        // 画像を指定の位置に描画
        vContext.drawImage(spriteImage, imageX, imageY, imageWidth, imageHeight,
            pX, pY, imageWidth, imageHeight);
    }

}

// プレイヤーの生成
let player = new Player();

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
    // プレイヤーの更新
    player.update();

    // 描画処理
    // 星の描画
    for (let index = 0; index < star.length; index++) {
        star[index].draw();
    }
    // プレイヤーの描画
    player.draw();

    // プレイヤーの範囲 0 ~ FIELD_WIDTH
    // カメラの範囲 0 ~ (FIELD_WIDTH - SCREEN_WIDTH)
    cameraX = Math.floor((player.x >> 8) / FIELD_WIDTH * (FIELD_WIDTH - SCREEN_WIDTH));
    cameraY = Math.floor((player.y >> 8) / FIELD_HEIGHT * (FIELD_HEIGHT - SCREEN_HEIGHT));

    // キャンバスの描画（仮想画面からコピー）
    context.drawImage(vCanvas, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT,
        0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
