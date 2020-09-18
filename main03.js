/**
 * 
 * 石をおく処理を書く
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

    //ターンを宣言する
    let turn = diskType.black;
    
    
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
                white: html += "←";
            }
            html += "<br>";
        }
        for (let i = 0; i < boardSize.x; i++) { 
            if (i === cursorPosition.x) {
                
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

    
    draw();

    
    
    onkeydown = function (e) {
        // console.log(e);
        
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
            case "Enter":
                //ボードに現在のターンの石を置く
                board[cursorPosition.y][cursorPosition.x] = turn;
                
                //排他的論理和で白黒を入れ替える
                //turn ^= 1;
                if (turn === diskType.black) {
                    turn = diskType.white; //黒なら白に変える
                } else {
                    turn = diskType.black; //黒じゃなければ(即ち白なら）黒に変える
                }
                break;
            default:
                // break;
        }
        // console.log(cursorPosition.x + "," + cursorPosition.y);
        draw();
    }
    
}