/**
 * 
 * どちらのターンかを表示する処理
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

    //石の名前の配列を宣言する
    var diskNames = ["黒","白"];

    //パスしたかどうかのフラグを宣言する
    var passed = [
        false, //黒
        false, //白
    ];

    //初期化関数
    function init() {
        for (var i = 0; i < boardSize.y; i++){
            board[i] = new Array(boardSize.x);
            for ( var j = 0; j < boardSize.x; j++){
                board[i][j] = diskType.none;
            }
        }
        window.onkeydown = onKeyDown;
        
    }
    //ゲームをリセットする関数
    function reset() {
        board[3][3] = diskType.light;
        board[3][4] = diskType.dark;
        board[4][3] = diskType.dark;
        board[4][4] = diskType.light;
    
        draw();
    } 


    var board = new Array(boardSize.y);

    var cursorPos = new Vec2(0, 0);

    
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
            if (i === cursorPos.y) {
                light: html += "←";
            }
            html += "<br>";
        }
        for (let i = 0; i < boardSize.x; i++) { 
            if (i === cursorPos.x) {
                
                html += "↑";
            } else {
                html += "　";
            }
        }

        const div = document.querySelector('div');
        //現在のターンの表示を追加する
        let span = document.querySelector('span');
        span.innerHTML = diskNames[turn]; 
        div.innerHTML = html;

    };
    //ターンを交代する関数
    function takeTurn() {
        if (turn === diskType.dark) {
            turn = diskType.light;
        } else {
            turn = diskType.dark;
        }
    }


    //警告文の要素を取得
    let caution = document.getElementById('caution');
    //キーが押された時に呼ばれる関数
    function onKeyDown(e) {
        // console.log(e);
        
        switch (e.key) {
            case "w":
                if (cursorPos.y === 0) {
                    cursorPos.y = 8;
                }
                cursorPos.y--;
                break;
            case "s":
                if (cursorPos.y === 7) {
                    cursorPos.y = -1;
                }
                cursorPos.y++;
                break;
            case "a":
                if (cursorPos.x === 0) {
                    cursorPos.x = 8;
                }
                cursorPos.x--;
                break;
            case "d":
                if (cursorPos.x === 7) {
                    cursorPos.x = -1;
                }
                cursorPos.x++;
                break;
            case "Enter":
                caution.innerText = "";
                
                if (checkCanPlace(cursorPos,false)) {
                    //石をひっくり返す
                    checkCanPlace(cursorPos,true);

                    board[cursorPos.y][cursorPos.x] = turn;
                    
                    //パスフラグを下げる
                    passed[turn] = false;

                    //ターンを交代する
                    takeTurn();
                    // 相手に置けるマスがなければ、
                    if (!checkCanPlaceAll()) {
                        //相手はパスをする
                        takeTurn();
                    
                        //両者置けるマスがなければ、ゲーム終了
                        if (!checkCanPlaceAll()) {
                            caution.innerText = "ゲーム終了！！";
                        } else {
                            caution.innerText = "相手はパスしました";
                        }
                    }
                    break;
                } else {
                    //石の置けない場所に警告文を表示する
                    caution.innerText = "そこには置けません";
                }
                // console.log(canPlace ? "置ける" : "置けない");
                console.log((turn === diskType.dark) ? "黒" : "白" + "のターン");
            default:
                
        }
        draw();
    }

    // for (var i = 0; i < boardSize.y; i++){
    //     board[i] = new Array(boardSize.x);
    //     for ( var j = 0; j < boardSize.x; j++){
    //         board[i][j] = diskType.none;
    //     }
    // }
    // this.onkeydown = onKeyDown;

    
    function checkCanPlace(pos, reverse) {
        
        var canPlace = false;
    
        
        if (board[pos.y][pos.x] !== diskType.none) {
            return false;
        }
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                
                let dir = new Vec2(j, i);

                if (dir.x === 0 && dir.y === 0) {
                    continue;
                }
                var checkPos = new Vec2(
                    pos.x + dir.x,
                    pos.y + dir.y
                );


                function isInBoard(v) {
                    return (v.x >= 0
                        && v.x < boardSize.x
                        && v.y >= 0
                        && v.y < boardSize.y)
                }
                if (!isInBoard(checkPos)) {
                    continue;
                }
                let opponent;
                if (turn === diskType.dark) { 
                    opponent = diskType.light; 
                } else {
                    opponent = diskType.dark; 
                }
                if (board[checkPos.y][checkPos.x] !== opponent) {
                    continue;
                }

                while (true) {
                    
                    checkPos.x += dir.x;
                    checkPos.y += dir.y;
                    if (!isInBoard(checkPos)) {
                        break;
                    }
                    if (board[checkPos.y][checkPos.x] === turn) {
                        canPlace = true;

                        if (reverse) {
                            var reversePos = new Vec2(pos.x, pos.y);
                            
                            while (true) {
                                reversePos.x += dir.x;
                                reversePos.y += dir.y;
                                if (reversePos.x === checkPos.x
                                    && reversePos.y === checkPos.y) {
                                    
                                    break;
                                }
                                board[reversePos.y][reversePos.x] = turn;
                            }
                        }
                    }
                }
                
            }
        }
        return canPlace;
    }
    //石が置けるマスがあるかどうかをチェックする
    function checkCanPlaceAll(){
        for (let i = 0; i < boardSize.y; i++){
            for (let j = 0; j < boardSize.x; j++){
                if (checkCanPlace(new Vec2(j, i))) {
                    return true;
                }
            }
        }
        return false;
    }

    init();

    reset();

    // this.onkeydown = onKeyDown;
    
}