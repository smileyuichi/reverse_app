'use strict';
{
    //2次元ベクトルオブジェクトを定義する
    function Vec2(x,y) {
        this.x = x;
        this.y = y;
    }
    //ボードのサイズを8*8で定義する
    const boardSize = new Vec2(8, 8);
    
    //石の種類を宣言する
    var diskType = new function () {
        this.none = -1; //石無し
        this.black = 0; //黒
        this.white = 1; //白
        this.max = 2; //石の種類の数
    };

    //ボードを生成
    var board = new Array(boardSize.y);
    for (var i = 0; i < boardSize.y; i++){
        board[i] = new Array(boardSize.x);
        for ( var j = 0; j < boardSize.x; j++){
            board[i][j] = diskType.none;
        }
    }

    board[3][3] = diskType.white;
    board[3][4] = diskType.black;
    board[4][3] = diskType.black;
    board[4][4] = diskType.white;

    //カーソルの初期位置
    var cursorPosition = new Vec2(0, 0);
    
    //描画するための文字列を初期化する
    let html = "";
    //ボードを描画する
    for (let i = 0; i < boardSize.y; i++) {
        for (let j = 0; j < boardSize.x; j++) {
            // html += "□";
            //ボードの石の種類で分岐していく
            switch (board[i][j]) {
                case diskType.none:
                    html += "□";
                    break;
                case diskType.black:
                    html += "●";
                    break;
                case diskType.white:
                    html += "○";
                    break;
            }
        }
        //y座標に矢印をおく
        if (i === cursorPosition.y) {
            html += "←";
        }
        html += "<br>";
    }
    //x座標に矢印をおく
    for (let i = 0; i < boardSize.x; i++) { 
        if (i === cursorPosition.x) {
            html += "↑";
        }
    }



    //htmlに描画していく
    const div = document.querySelector('div');
    div.innerHTML = html;

    
    onkeydown = function (e) {
        console.log(e);
    }
    
}