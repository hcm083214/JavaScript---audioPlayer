// ajax.js
const BASE_URL = 'http://localhost:3000';
const processEnv = process.env || 'development';
import { dataBlocks, songInfo, lyric, playlist } from "./api.js";

export default function Ajax({ //请求参数配置
    method = "GET",  //默认为'get'请求
    url,
    data = {}
}) {
    return new Promise(resolve => { // 返回异步请求
        const xhr = new XMLHttpRequest();
        xhr.open(method, BASE_URL + url)
        xhr.onload = function () {
            resolve(JSON.parse(xhr.response))
        }
        xhr.onerror = function () {
            console.log(xhr)
            if (xhr.status == 0) {

            }
        }
        xhr.send(JSON.stringify(data));
    })
}

/**
 * @description: 获得轮播图信息
 * @param {*}
 * @return {*}
 */
export async function getBannerList() {
    let result;
    if (processEnv === 'demo') {
        result = dataBlocks;
    } else {
        result = Ajax({
            url: `/homepage/block/page`
        })
    }

    return result;
}

/**
 * @description: 获得推荐歌单列表
 * @param {*} musicId
 * @return {*}
 */
export async function getRecommendList(musicId) {
    let result;
    if (processEnv === 'demo') {
        result = playlist;
    } else {
        result = Ajax({
            url: `/playlist/detail?id=${musicId}`
        })
    }
    // const result = Ajax({
    //     url: `/playlist/detail?id=${musicId}`
    // })
    return result;
}

/**
 * @description: 获得音乐的播放地址
 * @param {*} musicId
 * @return {*}
 */
export async function getAudioSrc(musicId) {
    let result = `https://music.163.com/song/media/outer/url?id=${musicId}`;
    // try {
    //     result = Ajax({
    //         url: `/music/url?id=${musicId}`
    //     })
    // } catch (error) {
    //     result = `https://music.163.com/song/media/outer/url?id=${musicId}`
    // }
    return result;
}

/**
 * @description: 获得歌曲信息
 * @param {*} musicId
 * @return {*}
 */
export async function getAudioInfo(musicId) {
    let result;
    if (processEnv === 'demo') {
        result = songInfo;
    } else {
        result = Ajax({
            url: `/song/detail?ids=${musicId}`
        })
    }
    // const result = Ajax({
    //     url: `/song/detail?ids=${musicId}`
    // });
    return result;
}

/**
 * @description: 获得歌曲歌词
 * @param {*} musicId
 * @return {*}
 */
export async function getAudioLyric(musicId) {
    let result;
    if (processEnv === 'demo') {
        result = lyric;
    } else {
        result = Ajax({
            url: `/lyric?id=${musicId}`
        })
    }
    // const result = Ajax({
    //     url: `/lyric?id=${musicId}`
    // })
    return result;
}
