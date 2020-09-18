/**
 * 
 * 盤面を自由に動かして描画する
 * 
 */

'use strict';
{
    function Vec2(x,y) {
        this.x = x;
        this.y = y;
    }
    const boardSize = new Vec2(8, 8);
    
    var diskType = new function () {
        this.none = -1; 
        this.black = 0; 
        this.white = 1; 
        this.max = 2; 
    };




        
    var board = new Array(boardSize.y);
    for (var i = 0; i < boardSize.y; i++){
        board[i] = new Array(boardSize.x);
        for ( var j = 0; j < boardSize.x; j++){
            board[i][j] = diskType.none;
        }
    }
    var cursorPosition = new Vec2(0, 0);


    
    //画面を描画する関数
    function draw() {
        
        let html = "";
        for (let i = 0; i < boardSize.y; i++) {
            for (let j = 0; j < boardSize.x; j++) {
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
            if (i === cursorPosition.y) {
                html += "←";
            }
            html += "<br>";
        }
        for (let i = 0; i < boardSize.x; i++) { 
            if (i === cursorPosition.x) {
                //x座標のカーソルを移動させる
                html += "↑";
            } else {
                html += "　";
            }
        }

        const div = document.querySelector('div');
        div.innerHTML = html;
    };


    board[3][3] = diskType.white;
    board[3][4] = diskType.black;
    board[4][3] = diskType.black;
    board[4][4] = diskType.white;

    //描画関数を呼ぶ
    draw();

    
    
    onkeydown = function (e) {
        // console.log(e);

        //押下されたキーによって分岐させる
        switch (e.key) {
            case "w":
                if (cursorPosition.y === 0) {
                    cursorPosition.y = 8;
                }
                cursorPosition.y--;
                break;
            case "s":
                if (cursorPosition.y === 7) {
                    cursorPosition.y = -1;
                }
                cursorPosition.y++;
                break;
            case "a":
                if (cursorPosition.x === 0) {
                    cursorPosition.x = 8;
                }
                cursorPosition.x--;
                break;
            case "d":
                if (cursorPosition.x === 7) {
                    cursorPosition.x = -1;
                }
                cursorPosition.x++;
                break;
            default:
                break;
        }
        console.log(cursorPosition.x + "," + cursorPosition.y);
        draw();
    }
    
}