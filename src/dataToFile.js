function canvasToDataURL(canvas, format, quality){
    return canvas.toDataURL(format||'image/png', quality||1.0);
}
function dataURLToCanvas(dataurl, cb){
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        cb(canvas);
    };
    img.src = dataurl;
    img.setAttribute("crossOrigin",'Anonymous');
}
function dataURLToBlob(dataurl){
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
function imageToBlob(src,img111,name){
    return imageToCanvas(src).then(res=>{
        return dataURLToBlob(canvasToDataURL(res))
    }).then(res=>{
        img111.file(name, res);
        return res;
    })
}
function imageToCanvas(src){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.setAttribute("crossOrigin",'Anonymous');
    img.src = src;
    return new Promise((resolve,reject)=>{
        img.onload = function (){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        };
    })
}
function getStringFromCharCode(dataView, start, length) {
    var str = '';
    var i;
    let len = start + length;
    console.log(typeof start,len)
    for (i = start; i < len; i++) {
      str += String.fromCharCode(dataView.getUint8(i));
    }
    return str;
  }
function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
    var binary = atob(base64);
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }
  function getOrientation(base64) {
    var arrayBuffer = base64ToArrayBuffer(base64)
    var dataView = new DataView(arrayBuffer);
    var length = dataView.byteLength;
    var orientation;
    var exifIDCode;
    var tiffOffset;
    var firstIFDOffset;
    var littleEndian;
    var endianness;
    var app1Start;
    var ifdStart;
    var offset;
    var i;
    var IS_SAFARI_OR_UIWEBVIEW = navigator.userAgent.indexOf("Safari") > -1;
    // Only handle JPEG image (start by 0xFFD8)
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      offset = 2;
      while (offset < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }
        offset++;
      }
    }
    if (app1Start) {
      exifIDCode = app1Start + 4;
      tiffOffset = app1Start + 10;
      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        endianness = dataView.getUint16(tiffOffset);
        littleEndian = endianness === 0x4949;
        if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            
            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
            
            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
      }
    }
    if (ifdStart) {
      length = dataView.getUint16(ifdStart, littleEndian);
      for (let i = 0; i < length; i++) {
          
        offset = ifdStart + i * 12 + 2;
        
        if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);
        //   console.log(IS_SAFARI_OR_UIWEBVIEW)
        //   // Override the orientation with its default value for Safari (#120)
          if (IS_SAFARI_OR_UIWEBVIEW) {
            dataView.setUint16(offset, 1, littleEndian);
          }
          break;
        }
      }
    }
    
    return orientation;
  }
  function urltobase64(url){
    return new Promise((res,rej)=>{
      dataURLToCanvas(url,(canvas)=>{
        res(canvasToDataURL(canvas));
      })
    })
  }
export default {
    imageToBlob: imageToBlob,
    getOrientation: getOrientation,
    urltobase64: urltobase64
}