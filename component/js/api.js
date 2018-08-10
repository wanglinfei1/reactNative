/**
 * Created by wanglinfei on 2017/10/18.
 */
import HTTPUtil from './HTTPUitl'
import fetchJsonp from 'fetch-jsonp'
import {serverUrl} from './fn'
const moviesUrl='https://api.douban.com/v2/movie/top250';
const USBOX_URL=1?'http://search.video.iqiyi.com/o?mode=11&ctgName=%E7%94%B5%E5%BD%B1&type=list&if=html5&pos=1&site=iqiyi&qyid=rkqpx4zegbhj7ms8hyedjjp2&access_play_control_platform=15&pu=1496736068&u=rkqpx4zegbhj7ms8hyedjjp2':'https://api.douban.com/v2/movie/us_box';
const movieDetail_URL= 'https://api.douban.com/v2/movie/subject/'
const search_URL='http://search.video.iqiyi.com/o?if=html5&limit=20&category=&timeLength=0&start=1&threeCategory=&u=rkqpx4zegbhj7ms8hyedjjp2&qyid=rkqpx4zegbhj7ms8hyedjjp2&pu=1496736068&video_allow_3rd=1&intent_result_number=10&intent_category_type=1&vfrm=2-3-0-1'
const search_URL2='http://api.douban.com/v2/movie/search'
const Recommend_URL = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
const HotKey_URL = serverUrl+'/api/getCommonApi'
export function getMovies(params) {
    return new Promise((resolve,reject) => {
        HTTPUtil.get(moviesUrl,params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getMovieDetail(movieId) {
    return new Promise((resolve,reject) => {
        HTTPUtil.get(movieDetail_URL+movieId)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getUSBox(params) {
    return new Promise((resolve,reject) => {
        HTTPUtil.get(USBOX_URL,params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getSearch(params,type) {
    var url = type?search_URL2:search_URL
    return new Promise((resolve,reject) => {
        HTTPUtil.get(url,params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
export function getiqyHotKey(data) {
    return new Promise((resolve,reject) => {
        HTTPUtil.get('http://search.video.iqiyi.com/m?if=hotQuery').then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    });
}
export function getqqHotKey(data) {
    var params = {
        url:'http://data.video.qq.com/fcgi-bin/dataout',
        urlData:'auto_id=938$otype=json$callback=jsonpHotKey'
    }
    console.log(params)
    return new Promise((resolve,reject) => {
        HTTPUtil.get(HotKey_URL,params).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    });
}
export function getRecommend() {
    var params = {
        toplist: {
            module: 'music.web_toplist_svr',
            method: 'get_toplist_index',
            param: {}
        },
        focus: {
            module: 'QQMusic.MusichallServer',
            method: 'GetFocus',
            param: {}
        }
    }
    const data = Object.assign({}, {
        g_tk: 1714213237,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: JSON.stringify(params)
    })
    return new Promise((resolve,reject) => {
        HTTPUtil.get(Recommend_URL,data)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}