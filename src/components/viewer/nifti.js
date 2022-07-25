import nifti from "nifti-reader-js";


// decompress .nii.gz
const getRawNifti = data => nifti.isCompressed(data) ? nifti.decompress(data) : data

// return header and image context
const getniftiContext = data => {
    const header = nifti.readHeader(data)
    const context = nifti.readImage(header, data)
    return { header, context }
}

export const readNifti = async (file) => {
    let data = await file.arrayBuffer()
    data = getRawNifti(data)
    return nifti.isNIFTI(data) ? getniftiContext(data) : {}
}

export const getNifiDepth = (header) => {
    return header.dims[3]
}

function normalize(arr, max) {
    // find the max value
    var m = 0;
    for (var x = 0; x < arr.length; x++) m = Math.max(m, arr[x]);
    // find the ratio
    var r = max / m;
    // normalize the array
    for (var x = 0; x < arr.length; x++) arr[x] = arr[x] * r;
    return arr;
}


// draw nifti data in <canvas />
export function drawCanvas(canvas, slice, header, image) {
    let cols = header.dims[1];
    let rows = header.dims[2];

    // set canvas dimensions to nifti slice dimensions
    canvas.width = cols;
    canvas.height = rows;

    // make canvas image data
    let ctx = canvas.getContext("2d");
    let canvasImageData = ctx.createImageData(canvas.width, canvas.height);

    let data
    switch (header.datatypeCode) {
        case nifti.NIFTI1.TYPE_UINT8:
            data = new Uint8Array(image)
            break

        case nifti.NIFTI1.TYPE_INT16:
            data = new Int16Array(image)
            break

        case nifti.NIFTI1.TYPE_INT32:
            data = new Int32Array(image)
            break

        case nifti.NIFTI1.TYPE_FLOAT64:
            data = new Float64Array(image)
            break

        case nifti.NIFTI1.TYPE_INT8:
            data = new Int8Array(image)
            break

        case nifti.NIFTI1.TYPE_UINT16:
            data = new Uint16Array(image)
            break

        case nifti.NIFTI1.TYPE_UINT32:
            data = new Uint32Array(image)
            break

        default:
            throw Error("nifti pixel values ill formatted")
    }

    // normalize all pixel values between 0-255
    data = normalize(data, 255)

    // offset to specified slice
    var sliceSize = cols * rows;
    var sliceOffset = sliceSize * slice;

    for (var row = 0; row < rows; row++) {
        var rowOffset = row * cols;

        for (var col = 0; col < cols; col++) {
            var offset = sliceOffset + rowOffset + col;
            var value = data[offset];

            /* 
               Assumes data is 8-bit, otherwise you would need to first convert 
               to 0-255 range based on datatype range, data range (iterate through
               data to find), or display range (cal_min/max).
               
               Other things to take into consideration:
                 - data scale: scl_slope and scl_inter, apply to raw value before 
                   applying display range
                 - orientation: displays in raw orientation, see nifti orientation 
                   info for how to orient data
                 - assumes voxel shape (pixDims) is isometric, if not, you'll need 
                   to apply transform to the canvas
                 - byte order: see littleEndian flag
            */
            canvasImageData.data[(rowOffset + col) * 4] = value & 0xFF;
            canvasImageData.data[(rowOffset + col) * 4 + 1] = value & 0xFF;
            canvasImageData.data[(rowOffset + col) * 4 + 2] = value & 0xFF;
            canvasImageData.data[(rowOffset + col) * 4 + 3] = 0xFF;
        }
    }

    ctx.putImageData(canvasImageData, 0, 0);
}

// draw nifti data in <canvas />
export function drawSegmentation(canvas, slice, header, image) {
    let cols = header.dims[1];
    let rows = header.dims[2];

    // set canvas dimensions to nifti slice dimensions
    canvas.width = cols;
    canvas.height = rows;

    // make canvas image data
    let ctx = canvas.getContext("2d");
    let canvasImageData = ctx.createImageData(canvas.width, canvas.height);

    let data
    switch (header.datatypeCode) {
        case nifti.NIFTI1.TYPE_UINT8:
            data = new Uint8Array(image)
            break

        case nifti.NIFTI1.TYPE_INT16:
            data = new Int16Array(image)
            break

        case nifti.NIFTI1.TYPE_INT32:
            data = new Int32Array(image)
            break

        case nifti.NIFTI1.TYPE_FLOAT64:
            data = new Float64Array(image)
            break

        case nifti.NIFTI1.TYPE_INT8:
            data = new Int8Array(image)
            break

        case nifti.NIFTI1.TYPE_UINT16:
            data = new Uint16Array(image)
            break

        case nifti.NIFTI1.TYPE_UINT32:
            data = new Uint32Array(image)
            break

        default:
            throw Error("nifti pixel values ill formatted")
    }

    // offset to specified slice
    var sliceSize = cols * rows;
    var sliceOffset = sliceSize * slice;
    var set = new Set()

    for (var row = 0; row < rows; row++) {
        var rowOffset = row * cols;

        for (var col = 0; col < cols; col++) {
            var offset = sliceOffset + rowOffset + col;
            var value = data[offset];

            /* 
               Assumes data is 8-bit, otherwise you would need to first convert 
               to 0-255 range based on datatype range, data range (iterate through
               data to find), or display range (cal_min/max).
               
               Other things to take into consideration:
                 - data scale: scl_slope and scl_inter, apply to raw value before 
                   applying display range
                 - orientation: displays in raw orientation, see nifti orientation 
                   info for how to orient data
                 - assumes voxel shape (pixDims) is isometric, if not, you'll need 
                   to apply transform to the canvas
                 - byte order: see littleEndian flag
            */
           set.add(value)
            if (value == 1)
            {   
                canvasImageData.data[(rowOffset + col) * 4] = 0;
                canvasImageData.data[(rowOffset + col) * 4 + 1] = 0;
                canvasImageData.data[(rowOffset + col) * 4 + 2] = 255;
            }
            else if (value == 2)
            {
                canvasImageData.data[(rowOffset + col) * 4] = 165;
                canvasImageData.data[(rowOffset + col) * 4 + 1] = 42;
                canvasImageData.data[(rowOffset + col) * 4 + 2] = 42;
            }
            else if (value == 3)
            {
                canvasImageData.data[(rowOffset + col) * 4] = 0;
                canvasImageData.data[(rowOffset + col) * 4 + 1] = 255;
                canvasImageData.data[(rowOffset + col) * 4 + 2] = 0;
            }

            canvasImageData.data[(rowOffset + col) * 4 + 3] = value > 0 ? 120 : 0;
        }
    }

    ctx.putImageData(canvasImageData, 0, 0);
    console.log("set", set)
}