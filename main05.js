/**
 * 
 * ネストを浅くする為、処理を関数にして取り出す
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

    //キーが押された時に呼ばれる関数
    function onKeyDown(e) {
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
    
    function checkCanPlace(reverse) {
        var canPlace = false;
    
        
        if (board[cursorPosition.y][cursorPosition.x] !== diskType.none) {
            return false;
        }
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                
                let dir = new Vec2(j, i);

                if (dir.x === 0 && dir.y === 0) {
                    continue;
                }
                var checkPosition = new Vec2(
                    cursorPosition.x + dir.x,
                    cursorPosition.y + dir.y
                );
                function isInBoard(v) {
                    return (v.x >= 0
                        && v.x < boardSize.x
                        && v.y >= 0
                        && v.y < boardSize.y)
                }
                if (!isInBoard(checkPosition)) {
                    continue;
                }
                let opponent;
                if (turn === diskType.dark) { 
                    opponent = diskType.light; 
                } else {
                    opponent = diskType.dark; 
                }
                if (board[checkPosition.y][checkPosition.x] !== opponent) {
                    continue;
                }

                while (true) {
                    
                    checkPosition.x += dir.x;
                    checkPosition.y += dir.y;
                    if (!isInBoard(checkPosition)) {
                        break;
                    }
                    if (board[checkPosition.y][checkPosition.x] === turn) {
                        canPlace = true;

                        if (reverse) {
                            var reversePosition = new Vec2(cursorPosition.x, cursorPosition.y);
                            
                            while (true) {
                                reversePosition.x += dir.x;
                                reversePosition.y += dir.y;
                                if (reversePosition.x === checkPosition.x
                                    && reversePosition.y === checkPosition.y) {
                                    
                                    break;
                                }
                                board[reversePosition.y][reversePosition.x] = turn;
                            }
                        }
                    }
                }
                
            }
        }
        return canPlace;
    }


    board[3][3] = diskType.light;
    board[3][4] = diskType.dark;
    board[4][3] = diskType.dark;
    board[4][4] = diskType.light;

    draw();

    this.onkeydown = onKeyDown;
    
}