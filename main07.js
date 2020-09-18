/**
 * 
 * 勝敗の表示を出す(一旦完成)
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

    
    var diskNames = ["黒","白"];


    function init() {
        for (var i = 0; i < boardSize.y; i++){
            board[i] = new Array(boardSize.x);
            for ( var j = 0; j < boardSize.x; j++){
                board[i][j] = diskType.none;
            }
        }
        window.onkeydown = onKeyDown;
        
    }
    
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
        
        let span = document.querySelector('span');
        span.innerHTML = diskNames[turn]; 
        div.innerHTML = html;

    };
    
    function takeTurn() {
        if (turn === diskType.dark) {
            turn = diskType.light;
        } else {
            turn = diskType.dark;
        }
    }


    
    let caution = document.getElementById('caution');
    
    function onKeyDown(e) {
        
        
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
                
                if (checkCanPlace(turn,cursorPos,false)) {
                    
                    checkCanPlace(turn,cursorPos,true);

                    board[cursorPos.y][cursorPos.x] = turn;

                    //ゲームが終了であれば
                    if (isGameEnd()) {
                        //両者の石を数えるカウンタを宣言
                        var count = [0, 0];
                        for (let i = 0; i < boardSize.y; i++){
                            for (let j = 0; j < boardSize.x; j++) {
                                //そのマスの石を取得する
                                var disk = board[j][i];
                                //石が置かれていれば
                                if (disk !== diskType.none) {
                                    count[disk]++;//カウントする
                                    
                                }
                            }
                        }
                        let message = count[diskType.dark] + "-" + count[diskType.light] + "<br>";

                        var winner = -1;
                        if (count[diskType.dark] > count[diskType.light]) {
                            winner = diskType.dark;
                        } else if(count[diskType.dark] < count[diskType.light]){
                            winner = diskType.light;
                        }
                        if (winner >= 0) {
                            message += diskNames[winner] + "の勝ち！";
                        } else {
                            message += "引き分けです";
                        }
                        caution.innerHTML = message;
                        break;
                    }
                    
                    takeTurn();
                    if (!checkCanPlaceAll(turn)) {
                        
                        takeTurn();
                    
                        
                        if (!checkCanPlaceAll(turn)) {

                            caution.innerText = "ゲーム終了！！";
                        } else {
                            caution.innerText = "相手はパスしました";
                        }
                    }
                    break;
                } else {
                    
                    caution.innerText = "そこには置けません";
                }
                
                console.log((turn === diskType.dark) ? "黒" : "白" + "のターン");
            default:
                
        }
        draw();
    }
    
    function checkCanPlace(disk, pos, reverse) {
        
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
                if (disk === diskType.dark) { 
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
                    if (board[checkPos.y][checkPos.x] === disk) {
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
                                board[reversePos.y][reversePos.x] = disk;
                            }
                        }
                    }
                }
                
            }
        }
        return canPlace;
    }
    
    function checkCanPlaceAll(disk){
        for (let i = 0; i < boardSize.y; i++){
            for (let j = 0; j < boardSize.x; j++){
                if (checkCanPlace(disk,new Vec2(j, i))) {
                    return true;
                }
            }
        }
        return false;
    }
    //黒も白も置くところがなくなればゲーム終了処理を呼び出す
    function isGameEnd(){
        return !checkCanPlaceAll(diskType.dark)
            && !checkCanPlaceAll(diskType.light);
    }

    init();

    reset();

    // this.onkeydown = onKeyDown;
    
}