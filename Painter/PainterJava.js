let board = document.querySelector('#board')
let currentColor = '#000000'

let defaultColor = '#1b1b1b'

let InputWidth = document.getElementById('#widthInput')

let fill = document.querySelector('#fill')
let eraser = document.querySelector('#eraser')

let colors = document.querySelectorAll('input[name="color"]')
for (let color of colors) {
    color.addEventListener('change', (e) => {
        currentColor = e.target.value
    })
}

let isFilling = false
let isRemoving = false

fill.addEventListener('change', (e) => {
    isFilling = e.target.checked
})

eraser.addEventListener('change', (e) => {
    isRemoving = e.target.checked
})

let isPainitng = false
let columns = 25
let rows = 25
let size = 30

let pallete = document.querySelector('#pallete')

board.addEventListener('mousedown', () => isPainitng = true)
board.addEventListener('mouseup', () => isPainitng = false)
board.addEventListener('mouseleave', ()  => isPainitng = false)
board.addEventListener('dragstart', (e) => e.preventDefault())

pallete.addEventListener('change', (e) => {
    console.log(e.target.value)
    currentColor = e.target.value
})

function saveToLocalStorage()
{
    const pixels = document.querySelectorAll('.pixel')
    const colors = Array.from(pixels).map(pixel => {
        return pixel.style.backgroundColor || defaultColor
    })
    localStorage.setItem('pixelColors', JSON.stringify(colors))
}

function loadFromLocalStorage(){
    const colorsFromStorage = localStorage.getItem('pixelColors')
    if (colorsFromStorage)
    {
        const colors = JSON.parse(colorsFromStorage)
        const pixels = document.querySelectorAll('.pixel')
        pixels.forEach((pixel, index) => {
            if (colors[index]){
                pixel.style.backgroundColor = colors[index]
            }
        })
    }
}

function generateBoard(_columns, _rows, _size){
    board.style.width = _columns * _size + (_columns - 1) + 'px'
    board.style.height = _rows * _size + (_rows - 1) + 'px'

    board.style.gridTemplateColumns = `repeat(${_columns}, 1fr)`
    board.style.gridTemplateRows = `repeat(${_rows}, 1fr)`

    for (let i = 0; i <= _columns * _rows - 1; i++) {
        let pixel = document.createElement('div')
        pixel.classList.add('pixel')
        pixel.style.width = size + 'px'
        pixel.style.height = size + 'px'
        pixel.setAttribute('data-index', i)
        board.appendChild(pixel)
        pixel.addEventListener('mousedown', function() {
            if (isFilling) {
                if (isRemoving){
                    let index = parseInt(pixel.getAttribute('data-index'))
                    anime({
                        targets: '.pixel',
                        backgroundColor: '#1b1b1b',
                        duritation: 250,
                        easing: 'easeInOutSine',
                        delay: anime.stagger(50, {grid: [_columns, _rows], from: index}),
                        complete: saveToLocalStorage
                    })
                }else{
                let index = parseInt(pixel.getAttribute('data-index'))
                anime({
                    targets: '.pixel',
                    backgroundColor: currentColor,
                    duritation: 250,
                    easing: 'easeInOutSine',
                    delay: anime.stagger(50, {grid: [_columns, _rows], from: index})
                })}
            }
            else{
                if (isRemoving){
                    anime({
                        targets: pixel,
                        backgroundColor: '#1b1b1b',
                        easing: 'easeInOutSine',
                        duration: 200,
                        complete: saveToLocalStorage
                    })
                }else{
                pixel.style.backgroundColor = currentColor}
            }
        })
        pixel.addEventListener('mouseover', function() {
            if (isPainitng){
                if (isRemoving){
                    anime({
                        targets: pixel,
                        backgroundColor: '#1b1b1b',
                        easing: 'easeInOutSine',
                        duration: 200,
                        complete: saveToLocalStorage
                    })
                }else{
                anime({
                    targets: pixel,
                    backgroundColor: currentColor,
                    easing: 'easeInOutSine',
                    duration: 200,
                    complete: saveToLocalStorage
                })}
            }
        })
    }

    loadFromLocalStorage()
}

generateBoard(columns, rows, size)

let save = document.getElementById('save')

function saveImage()
{
    const canvas = document.createElement('canvas')
    const boardRect = board.getBoundingClientRect()
    canvas.width = boardRect.width
    canvas.height = boardRect.height

    const ctx = canvas.getContext('2d')

    const pixels = document.querySelectorAll('.pixel')

    pixels.forEach(pixel => {
        const rect = pixel.getBoundingClientRect()
        const color = pixel.style.backgroundColor || defaultColor

        ctx.fillStyle = color
        ctx.fillRect(
            rect.left - boardRect.left,
            rect.top - boardRect.top,
            rect.width,
            rect.height
        )
    })

    const link = document.createElement('a')
    link.download = 'IllegalMexican.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
}

save.addEventListener('click', saveImage)