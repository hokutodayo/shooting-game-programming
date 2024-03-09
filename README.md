# shooting-game-programming

まずは、ゲームの土台となるhtmlを作成します  
- canvas: ゲーム画面となる場所
- main.js: プログラミングを書く場所

## 宇宙を背景にした画面の作成

### 画面の構成要素
- フィールド(field): ゲームを描画している仮想の場所（見えない）
- スクリーン(screen): フィールドの一部を抜き取った仮想の画面（見えない）
- キャンバス(canvas): スクリーンをコピーして実際に映した場所（見える）
※スクリーンとキャンバスのアスペクト比を合わせないと映像が引き伸ばされるので注意

main.jsからhtmlのキャンバスに描画できるように必要な設定をしていく
- getElementByIdでhtmlの要素をmain.jsの変数で扱えるようにする
- キャンバスの幅と高さを設定する
- getContext("2d")で平面として扱うことを宣言します

### ランダム生成関数の作成
最小値と最大値を入力すると、その範囲の値を整数としてランダムに返す  
- Math.random()は 0 ~ 1 の範囲で小数値を返す
- Math.floor(x)は x の小数部切り捨てる

### 星の作成
クラスを作成して、オブジェクトとして扱えるようにする
- コンストラクター
  - オブジェクトが生成されたときに最初に実行する
  - x,y: 位置、8bitシフト（256倍）した精度で管理する
  - size: 星の大きさ（単なる四角形の1辺）
- 描画
  - フレーム毎にキャンバスに描画する
  - 色: ランダムにすることで瞬きを表現
  - 描画: 位置と大きさを指定した四角形

### 描画処理
星オブジェクトをたくさん生成して、キャンバスに描画する
- 星の数を決めて、その分、生成処理をする
- 背景をブラックにしてキャンバスに描画する
- 生成した星をキャンバスに描画する
