/**
 * Created by wanglinfei on 2017/10/17.
 */
export const serverUrl = 'http://wzytop.top';
export const serverHtmlUrl = 'http://www.wzytop.top';

export const createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

export const createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

export function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n)
}
/*get随机数组*/
export function shuffle(arr) {
    let _arr = arr.slice()
    for (var i = 0; i < _arr.length; i++) {
        let j = getRandom(0, i)
        let Newarr = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = Newarr
    }
    return _arr
}
export function getCastsDes(movie) {
    if(movie.casts){
        return objToStr(movie.casts)+' - '+movie.year
    }else if(movie.star){
        return movie.star.substring(0,80) +' - '+ movie.releaseDate.substring(0,4)
    }else if(movie.videoinfos&&movie.videoinfos[0]){
        return (movie.videoinfos[0].uploader_name? (movie.videoinfos[0].uploader_name+' / '):'')+ movie.videoinfos[0].initialIssueTime
    }else if(movie.role_info&&movie.role_info[0]&&movie.role_info[0].character){
        return ArrToStr(movie.role_info[0].character)+' - '+movie.initialIssueTime.substring(0,4)
    }else{
        return ''
    }
}

export function objToStr(arr) {
    let str=''
    arr.forEach(item => {
        str+='/'+item.name
    })
    return str.substr(1)
}
export function isArray(o){
    return Object.prototype.toString.call(o)=='[object Array]';
}
export function ArrToStr(arr) {
    if(!isArray(arr)){return ''}
    let str=''
    arr.forEach(item => {
        str+='/'+item
    })
    return str.substr(1)
}

export function insetSearch(arr, val, maxLen) {
    const index = arr.findIndex((item) => {
        return item === val
    })

    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

function deleteSearch(arr, methods) {
    const index = arr.findIndex(methods)
    arr.splice(index, 1)
}

export function deleteOneSearch(arr, val) {
    deleteSearch(arr, (item) => {
        return item === val
    })
    return arr
}
