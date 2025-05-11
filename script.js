let input = document.getElementById("text")
let img, file

function binary(txt) {
    const encoder = new TextEncoder()
    let bytes = encoder.encode(txt)
    return Array.from(bytes).map(byte => byte.toString(2).padStart(8, '0')).join('')
}

input.addEventListener("input", () => {
    let encoded = binary(input.value)
    let w = Math.ceil(Math.sqrt(encoded.length))
    img = createImage(w,w)
    img.loadPixels()
    let i = 0
    for(let x=0; x<img.width; x++) {
        for(let y=0; y<img.height; y++) {
            let pixel = parseInt(encoded.split("")[i])
            if(pixel === 0 || pixel === 1) img.set(x,y,pixel*255)
            else img.set(x,y,255/2)
            i++
        }
    }
    img.updatePixels()
    background(200)
    image(img, 0, 0, width, height)
})

function download() {
    if(input.value.length === 0) return
    noSmooth()
    let encoded = binary(input.value)
    let w = Math.ceil(Math.sqrt(encoded.length))
    createCanvas(w, w).parent("canvas")
    image(img, 0, 0, width, height)
    saveCanvas('encrypted', 'png')
    setup()
}

function setup() {
    createCanvas(max(windowWidth/3, 200), max(windowWidth/3, 200)).parent("canvas")
    noSmooth()
    pixelDensity(1)
    background(200)
    noLoop()
    if(!file) file = createFileInput(handleFile).parent("fileouter")
}

function unbinary(binaryStr) {
    let binaryArray = binaryStr.trim().match(/.{1,8}/g)
    let byteArray = Uint8Array.from(binaryArray.map(bin => parseInt(bin, 2)));
    const decoder = new TextDecoder()
    return decoder.decode(byteArray)
}

function handleFile(file) {
    if (file.type === 'image') {
        loadImage(file.data, loadedImage => {
            img = loadedImage
            img.loadPixels()
            redraw()
            image(img, 0, 0, width, height)
            let output = ""
            let i = 0
            for(let x=0; x<img.width; x++) {
                for(let y=0; y<img.height; y++) {
                    let pixel = img.get(x,y)[0]
                    if(pixel === 255 || pixel === 0) output += Math.round(pixel/255)
                    i++
                }
            }
            input.value = unbinary(output)
        })
    }
}