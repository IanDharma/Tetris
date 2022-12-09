document.addEventListener('DOMContentLoaded', () => {
  
    // mempersiapkan board
    const width = 10;
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBTN = document.querySelector('#start-button');
    let timerId;
    let score = 0;

    // menggambar 5 shape dari game tetris
    const lTetromino = [
      [1, width+1, width*2+1, 2],
      [width, width+1, width+2, width*2+2],
      [1, width+1, width*2+1, width*2],
      [width, width*2, width*2+1, width*2+2]
    ]
    
    const zTetromino = [
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1],
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1]
    ]
  
    const tTetromino = [
      [1,width,width+1,width+2],
      [1,width+1,width+2,width*2+1],
      [width,width+1,width+2,width*2+1],
      [1,width,width+1,width*2+1]
    ]
  
    const oTetromino = [
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1]
    ]
  
    const iTetromino = [
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3],
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3]
    ]
    
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    
    // menentukan posisi koordinat pertama tempat shape tetris akan turun dan shape pertama mana dari tetrominoes yang akan dimunculkan oleh sistem
    
    let currentPosition = 4;
    let currentRotation = 0;

    let random_1 = Math.floor(Math.random()*theTetrominoes.length);
    let random_2 = 0;
    let current = theTetrominoes[random_1][currentRotation];
    let kujak;
    let toggle = 0;
    let baka = 0;

    const pilihan_warna = ["red", "yellow", "green", "blue", "purple"];

    // menggambar shape tetris

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = pilihan_warna[random_1];
        })
    }
    
    //menghapus shape tetris
    function remove() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = '';
      })
    }
    
    //timerId = setInterval(moveDown, 1000);
    
    // setiap kali menekan tombol arrow keys, maka shape tetris akan bergerak

    function control(evt) {
        if(evt.keyCode === 37) {
            console.log("kiri")
            moveLeft()
        }
        if(evt.keyCode === 38) {
            console.log("rotate")
            rotate()
        }
        if(evt.keyCode === 39) {
            console.log("kanan")
            moveRight()
        }
        if(evt.keyCode === 40) {
            console.log("bawah")
            moveDown()
        }
    }
    
    document.addEventListener('keyup', control)
    
    function moveDown() {
        if (toggle == 0) {
            random_2 = Math.floor(Math.random()*theTetrominoes.length);
            baka = theTetrominoes[random_2]
            kujak = baka[currentRotation]
            if (lTetromino.includes(kujak)) {
                document.getElementById('penjara-grid').innerHTML = '<img width="40" height="40" src="L.png">';
            } else if (zTetromino.includes(kujak)) {
                document.getElementById('penjara-grid').innerHTML = '<img width="40" height="40" src="z.png">';
            } else if (tTetromino.includes(kujak)) {
                document.getElementById('penjara-grid').innerHTML = '<img width="40" height="40" src="T.png">';
            } else if (oTetromino.includes(kujak)) {
                document.getElementById('penjara-grid').innerHTML = '<img width="40" height="40" src="kotak.png">';
            } else {
                document.getElementById('penjara-grid').innerHTML = '<img width="40" height="40" src="panjang.png">';
            }
            toggle = 2
        }
        remove();
        currentPosition += 10;
        draw();
        freeze();
    }
    
    function freeze() {
      if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random_1 = random_2
        current = theTetrominoes[random_1][currentRotation];
        currentPosition = 4;
        toggle = 0;
        draw()
        addScore()
        gameOver()
      }
    }
    
    // memindahkan shape tetris agar jika digerakin ke kiri, tidak akan menembus tembok. Hal yang sama juga berlaku jika digerakin ke kanan
    
    function moveLeft() {
      remove()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      if(!isAtLeftEdge) currentPosition -=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }
      draw()
    }
    
    // sama kayak di atas, tapi bedanya ini kanan.
    
    function moveRight() {
      remove()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
      if(!isAtRightEdge) currentPosition +=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
      draw()
    }

    function rotate() {
        remove()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random_1][currentRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    
    startBTN.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown, 1000);
      }
    })

    function addScore() {
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(index => squares[index].classList.contains('taken'))) {
          score +=10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }

    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'End'
        clearInterval(timerId)
      }
    }
   
    
})