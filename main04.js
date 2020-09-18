/**
 * 
 * 石が置けるかを判別する
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
        this.dark = 0; 
        this.light = 1; 
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
    let turn = diskType.dark;
    
    
    function draw() {
        
        let html = "";
        for (let i = 0; i < boardSize.y; i++) {
            for (let j = 0; j < boardSize.x; j++) {
                switch (board[i][j]) {
                    case diskType.none:
                        html += "・";
                        break;
                    case diskType.dark:
                        html += "●";
                        break;
                    case diskType.light:
                        html += "○";
                        break;
                }
            }
            if (i === cursorPosition.y) {
                light: html += "←";
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


    board[3][3] = diskType.light;
    board[3][4] = diskType.dark;
    board[4][3] = diskType.dark;
    board[4][4] = diskType.light;

    
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
                //石が置けるかどうかをチェックし、又はひっくり返す関数
                function checkCanPlace(reverse) {
                    var canPlace = false;
                
                    //カーソルの場所に石が置かれていたらチェックをスキップする
                    if (board[cursorPosition.y][cursorPosition.x] !== diskType.none) {
                        return false;
                    }
                    //カーソルの周囲8方向のチェック
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            //各方向へのベクトルを生成
                            let dir = new Vec2(j, i);
    
                            //ベクトル[0, 0]ならスキップする
                            if (dir.x === 0 && dir.y === 0) {
                                continue;
                            }
                            //チェックする座標の隣の座標を取得する
                            var checkPosition = new Vec2(
                                cursorPosition.x + dir.x,
                                cursorPosition.y + dir.y
                            );
                            //渡された座標がボードの中かどうかを判定する関数
                            function isInBoard(v) {
                                return (v.x >= 0
                                    && v.x < boardSize.x
                                    && v.y >= 0
                                    && v.y < boardSize.y)
                            }
                            //チェックする座標がボード外ならスキップする
                            if (!isInBoard(checkPosition)) {
                                continue;
                            }
                            //敵の石の色を取得する
                            let opponent;
                            if (turn === diskType.dark) { //黒のターンなら
                                opponent = diskType.light; //相手は白
                            } else {
                                opponent = diskType.dark; //白のターンなら相手は黒
                            }
                            //隣が相手の色でなければスキップする
                            if (board[checkPosition.y][checkPosition.x] !== opponent) {
                                continue;
                            }
    
                            while (true) {
                                
                                //チェックするマスを移動する
                                checkPosition.x += dir.x;
                                checkPosition.y += dir.y;
                                //チェックする座標がボードの外なら処理をやめます
                                if (!isInBoard(checkPosition)) {
                                    break;
                                }
                                //チェックするマス目が自分の石なら
                                if (board[checkPosition.y][checkPosition.x] === turn) {
                                    //カーソルの座標に石が置けることが確定する
                                    canPlace = true;

                                    //ひっくり返すなら
                                    if (reverse) {
                                        //ひっくり返す座標を宣言し、カーソルの座標で初期化する
                                        var reversePosition = new Vec2(cursorPosition.x, cursorPosition.y);
                                        
                                        while (true) {
                                            //ひっくり返す座標を移動する
                                            reversePosition.x += dir.x;
                                            reversePosition.y += dir.y;
                                            //ひっくり返す座標がチェックする座標に到達したらループを抜ける
                                            if (reversePosition.x === checkPosition.x
                                                && reversePosition.y === checkPosition.y) {
                                                
                                                //ひっくり返しを終了する
                                                break;
                                            }
                                            //石をひっくり返す
                                            board[reversePosition.y][reversePosition.x] = turn;
                                        }
                                    }
                                }
                            }
                            
                        }
                    }
                    return canPlace;
                }
                var canPlace = checkCanPlace(false)
                if (canPlace) {
                    //石をひっくり返す
                    checkCanPlace(true);

                    board[cursorPosition.y][cursorPosition.x] = turn;


                    if (turn === diskType.dark) {
                        turn = diskType.light;
                    } else {
                        turn = diskType.dark;
                    }
                    break;
                }
                console.log(canPlace ? "置ける" : "置けない");
                console.log((turn === diskType.dark) ? "黒" : "白" + "のターン");
            default:
                
        }
        draw();
    }
    
}