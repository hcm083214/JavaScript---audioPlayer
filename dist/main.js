/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/home/carousel.js":
/*!******************************!*\
  !*** ./src/home/carousel.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "carouselRender": () => (/* binding */ carouselRender),
/* harmony export */   "initCarouselEvent": () => (/* binding */ initCarouselEvent)
/* harmony export */ });
/* harmony import */ var _util_util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/util.js */ "./src/util/util.js");


// 切换箭头为静态 HTML 样式，无需根据图片数量动态生成。
const carouselControl = `
<button class="carousel-control carousel-control-left carousel-control-hover">
<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-arrow-left"></use>
</svg>
</button>
<button class="carousel-control carousel-control-right carousel-control-hover">
<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-arrow-right"></use>
</svg>
</button>
`;
//轮播图配置
const carousel = {
    data: [],//轮播图数据
    currentIndex: 0,//轮播图当前切换的画面
    times: 2000,//轮播图多少时间切换画面
    animationTimes: 0.5,//轮播图动画持续时间，单位s
    autoCycleTimer: new Set(),//如果在切换动画，无法进行切换画面
}

function carouselRender(data) {
    //初始化轮播图
    let carouselItem = '', carouselIndicatorsLi = '';
    const wrapper = document.querySelector('.carousel-wrapper');
    let { width = 0 } = wrapper.getBoundingClientRect();//得到图片的宽度
    //动态生成轮播图
    data.forEach((item, index) => {
        //指示器激活选中判断
        let isActive = (carousel.currentIndex == index) ? 'active' : '';
        //动态生成轮播图图片，并给每一张图片加上偏移量和动画效果
        carouselItem += `
            <div class="carousel-item ${'#' + index}" style='transform:translateX(${width * (index - 1)}px);transition-duration:${carousel.animationTimes}s'>
                <img src="${item.pic}" alt="">
            </div>
            `;
        //动态生成轮播图指示器
        carouselIndicatorsLi += `
                <li data-slide-to="${index}" class="carousel-indicators-li ${(isActive)}"></li>
            `
    });
    // 通过模板字符串，按照 home.html 中的 html 结构进行排布
    const carouselContainer = `
        <div class="carousel-container" style="transition:transform ${carousel.animationTimes}s ">
            ${carouselControl} 
            <div class="carousel-content">   
                ${carouselItem}
            </div>
        </div>
        `;
    const carouselIndicators = `
        <ul class="carousel-indicators d-flex">
            ${carouselIndicatorsLi}
        </ul>
        `;
    // 将得到的字符串通过 innerHTML 插入到轮播图盒子
    wrapper.innerHTML = carouselContainer + carouselIndicators;
    // 通过定时器开启自动轮播,每过一段时间调用 getNext 方法
    let timer = setInterval(getNext, carousel.times);
    carousel.autoCycleTimer.add(timer);
};

function getPrev() {
    // 获取到轮播图每一项的图片容器
    const carouselItems = document.getElementsByClassName('carousel-item');
    let length = carouselItems.length;
    // 当后退到第一张时，重置为总长度，防止index变为负数导致bug
    carousel.currentIndex == 0 && (carousel.currentIndex = length);
    // 每调用一次 getPrev，序号-1
    let index = carousel.currentIndex = --carousel.currentIndex % length;
    // 将类数组转变为数组
    let newArr = Array.from(carouselItems);
    // 计算得到轮播图每一项的图片容器的宽度
    let { width = 0 } = getElementRect(carouselItems[0]);
    // 轮播图数组移动
    newArr = [...newArr.slice(index), ...newArr.slice(0, index)];
    newArr.forEach((item, i) => {// 轮播图数组第一项移动到最后一项，其他项顺序不变
        if (i == 0) { 
            item.style.transform = `translateX(${width * (length - 1)}px)`;
            item.style.opacity = 0;
        }
        item.style.transform = `translateX(${width * (i - 1)}px)`;
       item.style.opacity = 1;
    });
    // 指示器移动
    indicatorsRender(index);
}

function getNext() {
    const carouselItems = document.getElementsByClassName('carousel-item');
    let length = carouselItems.length;
    let index = carousel.currentIndex = ++carousel.currentIndex % length;

    let newArr = Array.from(carouselItems);
    let lens = newArr.length;
     let { width = 0 } = getElementRect(carouselItems[0]);
    //当index为0时轮播图数组不做处理，>0时进行数组每一项移动
    index != 0 && (newArr = [...newArr.slice(-index, lens), ...newArr.slice(0, lens - index)]);

    newArr.forEach((item, i) => {
        if (i == 0) {// 因为向右移动，轮播图数组最后一项移动到第一项，其他项顺序不变
            item.style.transform = `translateX(${-width * (length - 1)}px)`;
            item.style.opacity = 0;
        }
        item.style.transform = `translateX(${width * (i - 1)}px)`;
        item.style.opacity = 1;
    });

    indicatorsRender(index)
}

function indicatorsRender(index) {
    // 获取到轮播图每一项的指示器
    const indicators = document.getElementsByClassName('carousel-indicators-li');
    Array.from(indicators).forEach((item, i) => {
        if (index == i) { // 当 index 和指示器下标相同添加active类
            item.setAttribute('class', 'carousel-indicators-li active')
        } else {
            item.setAttribute('class', 'carousel-indicators-li')
        }
    })
}

function getElementRect(ele) {
    try { //需要被执行的语句
        return ele.getBoundingClientRect();
    } catch (error) { //如果在try块里有异常被抛出时执行的语句
        /* 页面退出 ele 为空，清除定时器，防止报错 */
        clearAllTimer();
        return {}
    }
}

function leftHandle() {//左切换箭头事件处理
    //清空定时器暂停轮播
    clearAllTimer()
    //切换到前一张
    getPrev();
    //开启定时器继续轮播，并将定时器加入到定时器保存器中
    let timer = setInterval(getNext, carousel.times);
    carousel.autoCycleTimer.add(timer)
}

function rightHandle() {//右切换箭头事件处理
    clearAllTimer()
    getNext();
    let timer = setInterval(getNext, carousel.times);
    carousel.autoCycleTimer.add(timer)
}

//函数防抖
const leftHandleDebounce = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_0__.debounce)(leftHandle, 500);
const rightHandleDebounce = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_0__.debounce)(rightHandle, 500);

function initCarouselEvent() {
    const leftControl = document.getElementsByClassName('carousel-control-left');
    const rightControl = document.getElementsByClassName('carousel-control-right');
    const carouselContainer = document.querySelector('.carousel-container');
    const indicatorsWrapper = document.querySelector('.carousel-indicators');
    // 左右箭头切换事件
    leftControl[0].addEventListener('click', leftHandleDebounce);
    rightControl[0].addEventListener('click', rightHandleDebounce);
    
    // 移入移出控制轮播播放事件 
    carouselContainer.addEventListener('mouseenter', () => {
        //移入轮播图通过移除定时器达到轮播图暂停的目的
        clearAllTimer()
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        //移出轮播图通过设置定时器达到开启轮播图轮播的目的
        let timer = setInterval(getNext, carousel.times);
        carousel.autoCycleTimer.add(timer)
    });
	//指示器事件处理函数：通过事件委托到父级容器 ul，减少对每个指示器添加事件监听
    indicatorsWrapper.addEventListener('mouseenter', (e) => {
        if (e.target.tagName === 'LI') {
            clearAllTimer()
            // 得到每个指示器的序号
            const index = e.target.getAttribute('data-slide-to');
            // 序号-1，调用getNext会+1，两者相抵消，根据序号指定到对应的图片
            carousel.currentIndex = index - 1;
            getNext();
            let timer = setInterval(getNext, carousel.times);
            carousel.autoCycleTimer.add(timer)
        }
    }, true)
}

function clearAllTimer() {
    for (const i of carousel.autoCycleTimer) {
        clearInterval(i);
        if(carousel.autoCycleTimer>100){
            carousel.autoCycleTimer.clear();
        }
    }
}




/***/ }),

/***/ "./src/home/control.js":
/*!*****************************!*\
  !*** ./src/home/control.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initPlayerControl": () => (/* binding */ initPlayerControl),
/* harmony export */   "initPlayerEvent": () => (/* binding */ initPlayerEvent),
/* harmony export */   "PlayerCoverBackMode": () => (/* binding */ PlayerCoverBackMode),
/* harmony export */   "playerListRender": () => (/* binding */ playerListRender)
/* harmony export */ });
/* harmony import */ var _service_ajax_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../service/ajax.js */ "./src/service/ajax.js");
/* harmony import */ var _util_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/util.js */ "./src/util/util.js");
/* harmony import */ var _util_reactive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/reactive.js */ "./src/util/reactive.js");
/* harmony import */ var _player_player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../player/player.js */ "./src/player/player.js");






const isPlayProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_2__.reactive)({//用来控制播放、暂停
    isPlay: false,
}, playPauseKeyRender)

const musicIdProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_2__.reactive)({
    musicId: 1813926556,
}, initPlayerControl);

const musicModeProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_2__.reactive)({
    musicMode: 0,
}, musicModeRender)

/**
 * @description: 初始化音乐播放器控制栏
 * @param {*} id :音乐的id
 * @return {*}
 */
async function initPlayerControl(reloadAudio = true) {
    let musicId = Number(window.localStorage.getItem('musicId') || 1813926556);
    console.log("🚀 ~ file: control.js ~ line 27 ~ initPlayerControl ~ musicId", musicId)
    //修改播放器底部控制栏对应的href值，以便跳转页面的时候能拿到歌曲id
    PlayerCoverBackMode('player', musicId)
    //加载歌曲
    const musicSrc = await (0,_service_ajax_js__WEBPACK_IMPORTED_MODULE_0__.getAudioSrc)(musicId);
    const musicData = await (0,_service_ajax_js__WEBPACK_IMPORTED_MODULE_0__.getAudioInfo)(musicId);
    if (reloadAudio) {
        const myAudio = document.querySelector('#myAudio');
        myAudio.src = musicSrc;
        isPlayProxy.isPlay = true;
    }

    let songInfo;
    musicData && (songInfo = musicData.songs[0]);
    playerControlRender(songInfo);
    // 初始化播放列表
    playerListRender();
}

function playPauseKeyRender() {
    const myAudio = document.querySelector('#myAudio');
    const playerControl = document.querySelector('.player-control-unit #player-control');
    //控制音乐的播放和暂停
    isPlayProxy.isPlay ? myAudio.play() : myAudio.pause();
    //控制播放和暂停的图标
    isPlayProxy.isPlay ? playerControl.innerHTML = `<use xlink:href="#icon-bofangzhong"></use>`
        : playerControl.innerHTML = `<use xlink:href="#icon-zanting"></use>`;
}

function initPlayerEvent() {
    // 控制播放及暂停
    const playerControl = document.querySelector('.player-control-unit #player-control');
    playerControl.addEventListener('click', () => {
        isPlayProxy.isPlay = !isPlayProxy.isPlay;
    })

    // 播放进度更新
    const myAudio = document.querySelector('#myAudio');
    const percent = setProcess('#volume-bar', 'percentMode', 0.5);
    myAudio.volume = percent;
    myAudio.addEventListener('timeupdate', (e) => {

        const currentTime = e.target.currentTime;
        const totalTime = e.target.duration;
        setProcess('#progress-bar', 'percentMode', currentTime / totalTime);
        document.querySelector('.song-progress .current-time').innerText = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_1__.formatSongTime)(currentTime * 1000);

        // const currentTime = e.target.currentTime;
        // const totalTime = e.target.duration;
        // const percent = currentTime / totalTime;
        // const { width } = document.querySelector('#progress-bar').getBoundingClientRect()
        // document.querySelector('.song-progress .current-time').innerText = formatSongTime(currentTime * 1000);
        // document.querySelector('#progress-bar .progress-bar').style.width = `${(percent * 100).toFixed(2)}%`;
        // document.querySelector('#progress-bar .progress-dot').style.left = `${Math.round(percent * width) - 2}px`
    });
    myAudio.addEventListener('ended', () => {
        isPlayProxy.isPlay = false;
        musicIdProxy.musicId = changeMusicId('next');
        (0,_player_player_js__WEBPACK_IMPORTED_MODULE_3__.changePlayerMusicId)(musicIdProxy.musicId);
    })
    // 进度条控制
    document.querySelector('#progress-bar').addEventListener('click', (e) => {
        const percent = setProcess('#progress-bar', 'positionMode', e.clientX);
        const totalTime = myAudio.duration;
        myAudio.currentTime = percent * totalTime;
        isPlayProxy.isPlay = true;
    });
    document.querySelector('#volume-bar').addEventListener('click', (e) => {
        const percent = setProcess('#volume-bar', 'positionMode', e.clientX);
        myAudio.volume = percent;
        isPlayProxy.isPlay = true;
    });

    //播放模式控制
    document.querySelector('#musicMode').addEventListener('click', (e) => {
        let musicMode = window.localStorage.getItem('musicMode') || 0;
        musicMode = ++musicMode % 3;
        musicModeProxy.musicMode = musicMode
        // if (musicMode == 0) {
        //     e.target.innerHTML = `<use xlink:href="#icon-liebiaoxunhuan"></use>`;
        // } else if (musicMode == 1) {
        //     e.target.innerHTML = `<use xlink:href="#icon-suijibofang"></use>`;
        // } else if (musicMode == 2) {
        //     e.target.innerHTML = `<use xlink:href="#icon-danquxunhuan"></use>`;
        // }
        window.localStorage.setItem('musicMode', musicMode);
    })
    //上一首
    document.querySelector('#player-prev').addEventListener('click', () => {
        musicIdProxy.musicId = changeMusicId('prev');
        (0,_player_player_js__WEBPACK_IMPORTED_MODULE_3__.changePlayerMusicId)(musicIdProxy.musicId);
    })
    //下一首
    document.querySelector('#player-next').addEventListener('click', () => {
        musicIdProxy.musicId = changeMusicId('next');
        (0,_player_player_js__WEBPACK_IMPORTED_MODULE_3__.changePlayerMusicId)(musicIdProxy.musicId);
    })
    let isPlayerListShow = false;
    document.querySelector('#playerList').addEventListener('click', () => {
        const listsEle = document.querySelector('.player-list');
        isPlayerListShow = !isPlayerListShow;
        listsEle.classList.remove('display-none')
        isPlayerListShow && listsEle.classList.add('display-none')
    })
    // 设置播放列表点击修改当前播放音乐
    document.querySelector('.player-list-ul').addEventListener('click', (e) => {
        if (e.target.parentNode.tagName != 'LI') return;
        const musicId = e.target.parentNode.getAttribute('data-id');
        console.log("🚀 ~ file: control.js ~ line 1 ~ document.querySelector ~ e.target.getAttribute('data-id')", musicId)

        window.localStorage.setItem('musicId', musicId);
        musicIdProxy.musicId = musicId;
        (0,_player_player_js__WEBPACK_IMPORTED_MODULE_3__.changePlayerMusicId)(musicIdProxy.musicId);
    }, true)
}

function musicModeRender() {
    const mode = window.localStorage.getItem('musicMode') || 0;
    const musicModeStr = mode == 0 ? '<use xlink:href="#icon-liebiaoxunhuan"></use>' :
        mode == 1 ? '<use xlink:href="#icon-suijibofang"></use>' : '<use xlink:href="#icon-danquxunhuan"></use>'
    document.querySelector('#musicMode').innerHTML = musicModeStr;
}

function playerControlRender(songInfo) {
    //修改播放器控制栏的视图
    document.querySelector('.songname').innerText = songInfo.name;
    document.querySelector('.singer').innerText = songInfo.ar[0].name;
    document.querySelector('.total-time').innerText = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_1__.formatSongTime)(songInfo.dt);
    Array.from(document.querySelectorAll('.player-control-songinfo .img')).forEach(item => {
        item.innerHTML = `<img src=${songInfo.al.picUrl} alt='' >`;
    })
    document.querySelector('.player-control-unit #player-control').innerHTML = `
    <use xlink:href="#icon-bofangzhong"></use>
    `;
    musicModeRender();
}
/**
 * @description: 通过改变 musicId 达到播放模式控制的目的
 * @param {*} control：播放模式 mode ==0 --> 顺序播放；mode ==1 --> 随机播放；mode ==2 --> 单曲循环；
 * @return {*}
 */
function changeMusicId(control = 'next') {
    let musicId = window.localStorage.getItem('musicId') || 1813926556;
    const mode = window.localStorage.getItem('musicMode') || 0;
    if (mode == 2) return musicId;

    const songList = JSON.parse(window.localStorage.getItem('songList')) || [];
    const songs = songList.length;
    let index = songList.findIndex(item => item.id == musicId);
    console.log("🚀 ~ file: control.js ~ line 119 ~ index ~ index", index)
    if (mode == 1) {
        index = Math.floor(Math.random() * songs);
    } else if (mode == 0 && control == 'next') {
        index = ++index % songs;
    } else if (mode == 0 && control == 'prev') {
        index = --index % songs;
    }
    musicId = songs > 0 ? songList[index].id : musicId;
    window.localStorage.setItem('musicId', musicId)
    return musicId;
}

/**
 * @description: 设置进度条的进度
 * @param {*} eleName
 * @param {*} mode
 * @param {*} eleWidth
 * @return {*}
 */
function setProcess(eleName, mode, eleWidth) {
    const progressBar = document.querySelector(eleName);
    const { left, width } = progressBar.getBoundingClientRect();

    let percent;
    if (mode == 'percentMode') {
        percent = eleWidth;
    } else if (mode == 'positionMode') {
        let distance = eleWidth - left;
        percent = distance / width;
    }

    document.querySelector(`${eleName} .progress-bar`).style.width = `${(percent * 100).toFixed(2)}%`;
    document.querySelector(`${eleName} .progress-dot`).style.left = `${Math.round(percent * width) - 2}px`;
    return percent;
}

/**
 * @description: 点击底部播放栏封面图片，控制页面需要跳转的页面
 * @param {*} page 需要跳转到页面
 * @param {*} id  如果当前页是 recommend，那么 id 为 推荐歌单ID；如果当前页是 player ，那么 id 为 musicId
 * @return {*}
 */
function PlayerCoverBackMode(page, id) {
    if (page == 'player') {
        document.querySelector('#playerCover').setAttribute('href', `#/player/:${id}`);
        document.querySelector('#playerCoverBack').classList.add('display-none');
        document.querySelector('#playerCover').classList.remove('display-none');
    } else if (page == 'recommend') {
        document.querySelector('#playerCoverBack').setAttribute('href', `#/recommendList/:${id}`);
        document.querySelector('#playerCover').classList.add('display-none');
        document.querySelector('#playerCoverBack').classList.remove('display-none');
    }
}

/**
 * @description: 初始化播放列表
 * @param {*}
 * @return {*}
 */
function playerListRender() {
    const playerListUl = document.querySelector('.player-list-ul');
    const playerListArr = JSON.parse(window.localStorage.getItem('songList')) || [];
    const musicId = window.localStorage.getItem('musicId')
    if (!playerListArr.length) {
        playerListUl.innerHTML = `
        <li class="player-list-li d-flex justify-content-start">
            请添加你喜欢的音乐
        </li>
        `;
    } else {
        const tempStr = playerListArr.map(item =>
            `<li class="player-list-li d-flex justify-content-start pointer " data-id='${item.id}'>
            <svg class='icon ${musicId == item.id ? '' : "opacity"}' aria-hidden="true">
                <use xlink:href="#icon-bofangzhong"></use>
            </svg>
            <div class="song-name single-text-omitted">${item.name}</div>
            <div class="singer">${item.ar[0].name}</div>
            <div class="song-time">${(0,_util_util_js__WEBPACK_IMPORTED_MODULE_1__.formatSongTime)(item.dt)}</div>
        </li>`
        ).join('');
        playerListUl.innerHTML = tempStr;
    }
}


/***/ }),

/***/ "./src/home/home.js":
/*!**************************!*\
  !*** ./src/home/home.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "homePage": () => (/* binding */ homePage)
/* harmony export */ });
/* harmony import */ var _service_ajax_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../service/ajax.js */ "./src/service/ajax.js");
/* harmony import */ var _carousel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./carousel.js */ "./src/home/carousel.js");
`document.querySelector('#app').innerHTML = '111';`

// home.js
const homePageTemplate = `
<div class="w">
    <div class="carousel-wrapper">
        <div class="carousel-container ">
            <!-- 切换箭头 -->
            <!-- 轮播图图片需要动态生成 -->
        </div>
        <!-- 指示器 -->
        <ul class="carousel-indicators d-flex">

        </ul>
    </div>
    <div class="recommend-playlist">
        <h3 class="recommend-playlist-header">推荐歌单<svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-arrow-right"></use>
            </svg>
        </h3>
        <ul class="recommend-playlist-container d-flex justify-content-between align-items-start">
            <!-- 推荐歌单需要动态生成 -->
        </ul>
    </div>
</div>
`;




function recommendRender(data) {
    //获得推荐歌单盒子
    const recommendWrapper = document.querySelector('.recommend-playlist-container');
    let template = '';
    let length = data.length;
    data.forEach((item, index) => {
        // 此处相较于实验2 home.html 中有添加一个 a 标签包裹图片和文字，目的是用来完成页面跳转，达到单页面应用的目的
        template += `
            <li data-index=${index} class="recommend-playlist-item d-flex flex-column }" style="width:${98 / length}%">
                <div class="recommend-playlist-cover">
                    <a href='#/recommendList/:${item.creativeId}'>
                        <img src="${item.uiElement.image.imageUrl}"
                            alt="">
                        <svg class="recommend-playlist-icon icon" aria-hidden="true">
                            <use xlink:href="#icon-zanting"></use>
                        </svg>
                    </a>
                </div>
                <div class="recommend-playlist-title multi-text-omitted">
                    ${item.uiElement.mainTitle.title}
                </div>
            </li>
            `
    });
    recommendWrapper.innerHTML = template;
}

function initRecommendEvent() { //动态增加 hover 类
    const recommendWrapper = document.querySelector('.recommend-playlist-container');
    recommendWrapper.addEventListener('mouseenter', (e) => {
        if (e.target.tagName === "LI") {
            e.target.setAttribute('class', 'recommend-playlist-item d-flex flex-column hover')
        }
    }, true)
    recommendWrapper.addEventListener('mouseleave', (e) => {
        if (e.target.tagName === "LI") {
            e.target.setAttribute('class', 'recommend-playlist-item d-flex flex-column ')
        }
    }, true)
}

async function homePage(){
    //首页初始化
    document.querySelector('#app').innerHTML = homePageTemplate;
    const result = await (0,_service_ajax_js__WEBPACK_IMPORTED_MODULE_0__.getBannerList)();
    console.log("🚀 ~ file: home.js ~ line 76 ~ homePage ~ result", result)
    const carouselData = result.data.blocks[0].extInfo.banners;
    //首次渲染轮播图
    (0,_carousel_js__WEBPACK_IMPORTED_MODULE_1__.carouselRender)(carouselData);
    //轮播图事件绑定
    (0,_carousel_js__WEBPACK_IMPORTED_MODULE_1__.initCarouselEvent)();

    const recommendData = [...result.data.blocks[1].creatives];
    // 初始化歌单推荐列表
    recommendRender(recommendData);
    // 初始化页面事件
    initRecommendEvent()
}

/***/ }),

/***/ "./src/player/player.js":
/*!******************************!*\
  !*** ./src/player/player.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playerPage": () => (/* binding */ playerPage),
/* harmony export */   "changePlayerMusicId": () => (/* binding */ changePlayerMusicId)
/* harmony export */ });
/* harmony import */ var _home_control_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../home/control.js */ "./src/home/control.js");
/* harmony import */ var _service_ajax_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../service/ajax.js */ "./src/service/ajax.js");
/* harmony import */ var _util_reactive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/reactive.js */ "./src/util/reactive.js");
/* harmony import */ var _util_util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/util.js */ "./src/util/util.js");






// export async function playerPage({ params: id = '' }) {
//     document.querySelector('#app').innerHTML = 'playerPage加载中';
//     // 更改歌曲是否返回推荐列表详情页还是去播放列表
//     const lastRecommendId = window.localStorage.getItem('lastRecommendId');
//     PlayerCoverBackMode('recommend', lastRecommendId);
// }
const music = {
    data: [],
    lyric: [],
}

const musicDataProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_2__.reactive)({
    musicId: 1813926556,
}, initPlayer)

async function playerPage({ params: id = '' }) {
    document.querySelector('#app').innerHTML = 'playerPage加载中';
    changePlayerMusicId(id)
    // 更改歌曲是否返回推荐列表详情页还是去播放列表
    const lastRecommendId = window.localStorage.getItem('lastRecommendId');
    (0,_home_control_js__WEBPACK_IMPORTED_MODULE_0__.PlayerCoverBackMode)('recommend', lastRecommendId);
}
async function changePlayerMusicId(musicId) {
    const id = musicId;

    const musicData = await (0,_service_ajax_js__WEBPACK_IMPORTED_MODULE_1__.getAudioInfo)(id);
    const musicLyric = await (0,_service_ajax_js__WEBPACK_IMPORTED_MODULE_1__.getAudioLyric)(id);
    music.data = musicData;

    //初始化播放器歌词
    music.lyric = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_3__.formatSongLyric)(musicLyric.lrc.lyric);

    musicDataProxy.musicId = id;
}

/**
 * @description: 初始化播放器播放页面
 * @param {*}
 * @return {*}
 */
async function initPlayer() {
    console.log("🚀 ~ file: player.js ~ line 50 ~ initPlayer ~ musicData.data", music.data)

    let songInfo = music.data.songs[0];
    document.querySelector('#app').innerHTML = `
    <div class="player-background-image">
        <div class="player-content d-flex">
            <div class="player-album-cover d-flex">
                <!-- 歌曲封面 -->
                <div class="ablum">
                    <div class="cover running">
                        <img src="${songInfo.al.picUrl}" alt="">
                    </div>
                </div>
            </div>

            <div class="player-lyric d-flex align-items-start">
                <!-- 歌曲和歌词信息 -->
                <h3 class="song-name">
                ${songInfo.name}
                </h3>
                <div class="song-info">
                    <span class="song-album">专辑：${songInfo.al.name}</span>
                    <span class="singer">歌手：${songInfo.ar[0].name}</span>
                    <span class="song-sour">来源：${songInfo.al.name}</span>
                </div>
                <div class="lyric-wrap">
                ${initLyric(music.lyric)}
                </div>
            </div>
        </div>
    </div>
    `;
    initPlayerEvent();
    imgBlur();
}

/**
 * @description: 添加高斯模糊后的背景图
 * @param {*}
 * @return {*}
 */
function imgBlur() {
    const imgBox = document.querySelector('.player-background-image');
    let imgSrc = music.data.songs[0].al.picUrl;
    (0,_util_util_js__WEBPACK_IMPORTED_MODULE_3__.blur)(imgBox, imgSrc)
}

/**
 * @description: 动态添加歌词
 * @param {*} lyricData
 * @return {*}
 */
function initLyric(lyricData) {
    if (lyricData.length == 0) return '';
    let tempStr = '';
    lyricData.forEach(item => {
        tempStr += `
        <p class="song-lyric-item" data-time='${item.time}'>${Object.keys(item).length > 0 ? item.lyric : ''}</p>
        `
    });
    return tempStr;
}

function initPlayerEvent() {
    const audio = document.querySelector('#myAudio');
    audio.addEventListener('timeupdate', (e) => {
        // 获得音乐播放当前的时间
        const lyricItem = document.querySelectorAll('.song-lyric-item');
        if (!lyricItem.length) return;

        const currentTime = e.target.currentTime;
        let i = 0;
        Array.from(lyricItem).forEach(item => {
            const time = item.getAttribute('data-time');
            if (currentTime > time) i++;
            item.classList.remove('active');
        });
        lyricItem[i - 1].classList.add('active');
        if (i > 5) {
            setScrollTop('lyric-wrap', 'song-lyric-item', i - 1 - 5);
        }
    })
    audio.addEventListener('ended', () => {
        const ablumCover = document.querySelector('.ablum .cover');
        if (!ablumCover) return;
        ablumCover.style.animationPlayState = 'paused';
    })
    audio.addEventListener('pause', () => {
        const ablumCover = document.querySelector('.ablum .cover');
        if (!ablumCover) return;
        ablumCover.style.animationPlayState = 'paused';
    })
    audio.addEventListener('playing', () => {
        const ablumCover = document.querySelector('.ablum .cover');
        if (!ablumCover) return;
        ablumCover.style.animationPlayState = 'running';
    })
}
/**
 * @description: 滚动条自动滑动的距离
 * @param {*} className
 * @param {*} target
 * @param {*} index
 * @return {*}
 */
function setScrollTop(className, target, index) {
    const ele = document.querySelector(`.${className}`);
    if (typeof target == "number") {
        ele.scrollTop = index * target;
    } else if (typeof target == 'string') {
        const { height } = document.querySelector(`.${target}`).getBoundingClientRect();
        ele.scrollTop = index * height;
    } else if (target instanceof HTMLElement) {
        const { height } = target.getBoundingClientRect();
        ele.scrollTop = index * height;
    }
}

/***/ }),

/***/ "./src/recommendList/recommendList.js":
/*!********************************************!*\
  !*** ./src/recommendList/recommendList.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "recommendListPage": () => (/* binding */ recommendListPage)
/* harmony export */ });
/* harmony import */ var _service_ajax_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../service/ajax.js */ "./src/service/ajax.js");
/* harmony import */ var _util_reactive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/reactive.js */ "./src/util/reactive.js");
/* harmony import */ var _home_control_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../home/control.js */ "./src/home/control.js");
/* harmony import */ var _util_util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/util.js */ "./src/util/util.js");




//获得歌单id
// import { getRouterOptions } from "./util.js";

const recommendDetail = {
    playlist: [],
    detail: {},
    listActive: 1813926556
}

// 移动鼠标高亮涉及到的变量
const activeProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_1__.reactive)({
    active: recommendDetail.listActive,//存放音乐的id
}, initList);

// 双击播放音乐涉及到的变量
const isPlayProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_1__.reactive)({
    active: recommendDetail.listActive,//存放音乐的id
    isPlay: false,//歌曲是否在播放
}, initList);

const recommendListPage = async ({ params = '' }) => {
    document.querySelector('#app').innerHTML = `加载中`;
    const result = await (0,_service_ajax_js__WEBPACK_IMPORTED_MODULE_0__.getRecommendList)(params)
    if (result.code == 404) {
        document.querySelector('#app').innerHTML = `未找到资源`;
    } else {
        recommendDetail.detail = result.playlist;
        recommendDetail.playlist = result.playlist.tracks;
        initDescribe();
        initList();
        initEvent();
    }
    const musicId = window.localStorage.getItem('musicId');
    window.localStorage.setItem('lastRecommendId',params);
    (0,_home_control_js__WEBPACK_IMPORTED_MODULE_2__.PlayerCoverBackMode)('player', musicId);
}

function initDescribe() {
    let tagsTemplate = '';
    recommendDetail.detail.tags.forEach((tag, index) => {
        index == recommendDetail.detail.tags.length - 1 ?
            tagsTemplate += `<span class="tag">${tag}  </span>` :
            tagsTemplate += `<span class="tag">${tag} / </span>`
    });
    let time = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_3__.formatCreateTime)(recommendDetail.detail.createTime)
    document.querySelector('#app').innerHTML = `            
<div class="w">
    <div class="recommend-header">
        <a href="#/home">首页</a>/
        <span>推荐歌单页</span>
    </div>
    <div class="recommend-wrapper">
    <!-- 此处为推荐页，内容主要包括两个部分：歌单介绍和歌单列表 -->
        <div class="recommend-describe d-flex justify-content-start">
        <!-- 歌单介绍 -->
            <div class="recommend-describe-left">
                <img src="${recommendDetail.detail.coverImgUrl}" alt="">
            </div>
            <div class="recommend-describe-right d-flex flex-column align-items-start">
                <h4 class="recommend-describe-right-title single-text-omitted">
                    ${recommendDetail.detail.name}
                </h4>
                <div class="recommend-describe-right-creator d-flex">
                    <img class="avatar"
                        src="${recommendDetail.detail.creator.avatarUrl}"
                        alt="">
                    <span class="creator">${recommendDetail.detail.creator.detailDescription}</span>
                    <span class="create-time">${time}</span>
                </div>
                <div class="recommend-describe-right-add d-flex">
                    <span class="btn">播放全部</span><span class="add">+</span>
                </div>
                <div class="recommend-describe-right-info">
                    <div class="info">
                        <span class="label">标签：</span>
                        ${tagsTemplate}
                    </div>
                    <div class="info">
                        <span class="label">歌曲：</span>
                        <span class="label-info">${recommendDetail.detail.trackCount}</span>
                        <span class="label">播放：</span>
                        <span class="label-info">${recommendDetail.detail.playCount}</span>
                    </div>
                    <div class="info single-text-omitted ">
                        <span class="label">简介：</span>
                        <span class="label-info ">${recommendDetail.detail.description}</span>
                    </div>
                </div>
            </div>
        </div>  
        <div class="recommend-list">
            <!-- 歌单列表  -->
            <h4 class="recommend-list-title">
            歌曲列表
            </h4>
            <ul class="recommend-list-songlist-header d-flex justify-content-start">
                <li class="songlist-header-name">歌曲</li>
                <li class="songlist-header-author">歌手</li>
                <li class="songlist-header-album">专辑</li>
                <li class="songlist-header-time">时长</li>
            </ul>
            <ul class="recommend-list-songlist-body">
            </ul>
        </div> 
    </div> 
</div>
`;
}

function initList() {
    const listDom = document.getElementsByClassName('recommend-list-songlist-body')[0];
    let listTemplate = ''; let isEvenOrOdd = '';
    recommendDetail.playlist.forEach((item, index) => {
        isEvenOrOdd = index % 2 == 0 ? 'even' : 'odd';
        let isActive = activeProxy.active == item.id ? 'active' : '';
        let isPlay;
        if (item.id == isPlayProxy.active) {
            isPlay = isPlayProxy.isPlay;
        } else {
            isPlay = false;
        }
        listTemplate += `
        <li class="songlist-item pointer ${isEvenOrOdd} ${isActive} d-flex justify-content-start" data-index=${item.id}>
            <div class="songlist-number font-color">
                <span class="index" style=${!isPlay ? 'display:inline-block' : 'display:none'}>${index + 1}</span>
                <svg class="icon" style=${isPlay ? 'display:inline-block' : 'display:none'} aria-hidden="true">
                    <use xlink:href="#icon-bofangzhong"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucang"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiazai"></use>
                </svg>
            </div>
            <div class="songlist-songname">
                ${item.name}
            </div>
            <div class="songlist-artist font-color">
                ${item.ar[0].name}
            </div>
            <div class="songlist-album font-color">
                ${item.al.name}
            </div>
            <div class="songlist-time font-color">
            ${(0,_util_util_js__WEBPACK_IMPORTED_MODULE_3__.formatSongTime)(item.dt)}
            </div>
        </li>
        `;
    })
    listDom.innerHTML = listTemplate;
}

function initEvent() {
    const songListWrap = document.querySelector('.recommend-list-songlist-body');
    songListWrap.addEventListener('mouseenter', (e) => {
        const targetName = e.target.nodeName.toLocaleLowerCase();
        if (targetName == 'li') {
            const id = e.target.getAttribute('data-index');
            //提升性能，防止多次触发
            if (activeProxy.active == id) return;
            activeProxy.active = id;
        }
    }, true);
    songListWrap.addEventListener('dblclick', async (e) => {
        //修改列表的播放图标
        const targetName = e.target.nodeName.toLocaleLowerCase();
        if (targetName == 'li') {
            const id = e.target.getAttribute('data-index');
            isPlayProxy.active = id;
            window.localStorage.setItem('musicId', id);
        } else if (targetName == 'div') {
            const id = e.target.parentNode.getAttribute('data-index');
            isPlayProxy.active = id;
            window.localStorage.setItem('musicId', id);
        }
        isPlayProxy.isPlay = true;
        (0,_home_control_js__WEBPACK_IMPORTED_MODULE_2__.initPlayerControl)();
    }, true);
    /* 点击将歌曲列表添加到播放列表中 */
    const addSongList = document.querySelector('.recommend-describe-right-add');
    addSongList.addEventListener('click', () => {
        const arr = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_3__.songListFilter)(recommendDetail.playlist)
        window.localStorage.setItem('songList', JSON.stringify(arr))
        ;(0,_home_control_js__WEBPACK_IMPORTED_MODULE_2__.playerListRender)();
    })
}






/***/ }),

/***/ "./src/service/ajax.js":
/*!*****************************!*\
  !*** ./src/service/ajax.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ajax),
/* harmony export */   "getBannerList": () => (/* binding */ getBannerList),
/* harmony export */   "getRecommendList": () => (/* binding */ getRecommendList),
/* harmony export */   "getAudioSrc": () => (/* binding */ getAudioSrc),
/* harmony export */   "getAudioInfo": () => (/* binding */ getAudioInfo),
/* harmony export */   "getAudioLyric": () => (/* binding */ getAudioLyric)
/* harmony export */ });
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api.js */ "./src/service/api.js");
// ajax.js
const BASE_URL = 'http://localhost:3000';
const processEnv = "production" || 0;


function Ajax({ //请求参数配置
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
async function getBannerList() {
    let result;
    if (processEnv === 'demo') {
        result = _api_js__WEBPACK_IMPORTED_MODULE_0__.dataBlocks;
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
async function getRecommendList(musicId) {
    let result;
    if (processEnv === 'demo') {
        result = _api_js__WEBPACK_IMPORTED_MODULE_0__.playlist;
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
async function getAudioSrc(musicId) {
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
async function getAudioInfo(musicId) {
    let result;
    if (processEnv === 'demo') {
        result = _api_js__WEBPACK_IMPORTED_MODULE_0__.songInfo;
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
async function getAudioLyric(musicId) {
    let result;
    if (processEnv === 'demo') {
        result = _api_js__WEBPACK_IMPORTED_MODULE_0__.lyric;
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


/***/ }),

/***/ "./src/service/api.js":
/*!****************************!*\
  !*** ./src/service/api.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dataBlocks": () => (/* binding */ dataBlocks),
/* harmony export */   "songInfo": () => (/* binding */ songInfo),
/* harmony export */   "lyric": () => (/* binding */ lyric),
/* harmony export */   "playlist": () => (/* binding */ playlist)
/* harmony export */ });
const dataBlocks = {
    "code": 200,
    "data": {
        "cursor": null,
        "blocks": [
            {
                "blockCode": "HOMEPAGE_BANNER",
                "showType": "BANNER",
                "extInfo": {
                    "banners": [
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642291310133435",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/BgAMxzEn3gRE0PcCNt31Ww==/109951166936263742.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "blue",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4183966.-923572617.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 0,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 3000,
                            "typeTitle": "独家策划",
                            "url": "https://music.163.com/m/at/61dfd0ac89c61e56634264f4",
                            "encodeId": "0",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642252597036809",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/rPLsYWen-AcGWbSibmCTAg==/109951166934924364.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4158973.-923483342.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 1911928768,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 1,
                            "typeTitle": "新歌首发",
                            "url": null,
                            "encodeId": "1911928768",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642302351375523",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/b1jjId9QtrL9j7wU-5fitw==/109951166936630290.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4159970.940045287.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 1911281371,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 1,
                            "typeTitle": "新歌首发",
                            "url": null,
                            "encodeId": "1911281371",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642257728338741",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/6rjU4UzLyeFZoxqwYZ_rOw==/109951166935299512.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4184972.-923399888.null",
                            "event": null,
                            "alg": null,
                            "song": {
                                "name": "神女劈观·唤情 Devastation and Redemption",
                                "id": 1910911958,
                                "pst": 0,
                                "t": 0,
                                "ar": [
                                    {
                                        "id": 12487174,
                                        "name": "HOYO-MiX",
                                        "tns": [],
                                        "alias": []
                                    }
                                ],
                                "alia": [],
                                "pop": 100,
                                "st": 0,
                                "rt": "",
                                "fee": 0,
                                "v": 7,
                                "crbt": null,
                                "cf": "",
                                "al": {
                                    "id": 138671335,
                                    "name": "「飞彩镌流年」游戏原声EP专辑",
                                    "picUrl": "http://p3.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg",
                                    "tns": [],
                                    "pic_str": "109951166919194723",
                                    "pic": 109951166919194720
                                },
                                "dt": 160940,
                                "h": {
                                    "br": 320000,
                                    "fid": 0,
                                    "size": 6439725,
                                    "vd": -15366
                                },
                                "m": {
                                    "br": 192000,
                                    "fid": 0,
                                    "size": 3863853,
                                    "vd": -12782
                                },
                                "l": {
                                    "br": 128000,
                                    "fid": 0,
                                    "size": 2575917,
                                    "vd": -11054
                                },
                                "a": null,
                                "cd": "01",
                                "no": 1,
                                "rtUrl": null,
                                "ftype": 0,
                                "rtUrls": [],
                                "djId": 0,
                                "copyright": 0,
                                "s_id": 0,
                                "mark": 0,
                                "originCoverType": 0,
                                "originSongSimpleData": null,
                                "single": 0,
                                "noCopyrightRcmd": null,
                                "mst": 9,
                                "cp": 2709549,
                                "mv": 14493007,
                                "rtype": 0,
                                "rurl": null,
                                "publishTime": 1642176000000,
                                "videoInfo": {
                                    "moreThanOne": false,
                                    "video": {
                                        "vid": "14493007",
                                        "type": 0,
                                        "title": "《原神》剧情PV-「神女劈观」",
                                        "playTime": 122321,
                                        "coverUrl": "http://p4.music.126.net/BTXmZt74tsb79LXd6qtm3Q==/109951166921480048.jpg",
                                        "publishTime": 1641916800007,
                                        "artists": null,
                                        "alias": null
                                    }
                                }
                            },
                            "targetId": 1910911958,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 1,
                            "typeTitle": "新歌首发",
                            "url": null,
                            "encodeId": "1910911958",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642257865520854",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/PPTQuS3ukoPDi3dhM_t8xQ==/109951166935298974.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "blue",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4191969.-923574701.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 0,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 3000,
                            "typeTitle": "活动",
                            "url": "https://music.163.com/m/at/61df856e89c61e5663426245",
                            "encodeId": "0",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642257993038578",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/H4EMHwbovsXt61ASqGwbWg==/109951166935317154.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4191970.-923542119.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 138715783,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 10,
                            "typeTitle": "新碟首发",
                            "url": null,
                            "encodeId": "138715783",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642252733241543",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/jJqZHyC0Vy57STXhjJwE4Q==/109951166934931968.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4158974.940037449.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 1911580558,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 1,
                            "typeTitle": "新歌首发",
                            "url": null,
                            "encodeId": "1911580558",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642252870631101",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/P7hHu9Oa3Ssvy0XbyP_ieA==/109951166937827505.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4158975.-923456529.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 138805193,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 10,
                            "typeTitle": "新碟首发",
                            "url": null,
                            "encodeId": "138805193",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642253174697599",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/SRXIHhGpEIiHWVLdrsiotg==/109951166934963325.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "blue",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4202968.-923461266.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 414375809,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 7001,
                            "typeTitle": "直播",
                            "url": null,
                            "encodeId": "414375809",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642258572821469",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/RhhUHgyDjPAWgc_LCSb03A==/109951166935357315.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "red",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4191975.-923456343.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 14492088,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 1004,
                            "typeTitle": "视频",
                            "url": null,
                            "encodeId": "14492088",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        },
                        {
                            "adLocation": null,
                            "monitorImpress": null,
                            "bannerId": "1642258624345494",
                            "extMonitor": null,
                            "pid": null,
                            "pic": "http://p1.music.126.net/Mf6yXLdTF3Wl5gKb6en19A==/109951166935357424.jpg",
                            "program": null,
                            "video": null,
                            "adurlV2": null,
                            "adDispatchJson": null,
                            "dynamicVideoData": null,
                            "monitorType": null,
                            "adid": null,
                            "titleColor": "blue",
                            "requestId": "",
                            "exclusive": false,
                            "scm": "1.music-homepage.homepage_banner_force.banner.4191976.-923370934.null",
                            "event": null,
                            "alg": null,
                            "song": null,
                            "targetId": 0,
                            "showAdTag": true,
                            "adSource": null,
                            "showContext": null,
                            "targetType": 3000,
                            "typeTitle": "活动",
                            "url": "https://music.163.com/m/at/daydayup220112E01",
                            "encodeId": "0",
                            "extMonitorInfo": null,
                            "monitorClick": null,
                            "monitorImpressList": null,
                            "monitorBlackList": null,
                            "monitorClickList": null
                        }
                    ]
                },
                "canClose": false
            },
            {
                "blockCode": "HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                "showType": "HOMEPAGE_SLIDE_PLAYLIST",
                "action": "orpheus://playlistCollection?referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                "actionType": "orpheus",
                "uiElement": {
                    "subTitle": {
                        "title": "推荐歌单"
                    },
                    "button": {
                        "action": "orpheus://playlistCollection?referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "text": "更多",
                        "iconUrl": null
                    },
                    "rcmdShowType": "DEFAULT"
                },
                "creatives": [
                    {
                        "creativeType": "scroll_playlist",
                        "creativeId": "721800702",
                        "action": "orpheus://nm/playlist/flow?source=HOMEPAGE_BLOCK_PLAYLIST_RCMD&bizData=[{\"resourceId\":\"721800702\",\"alg\":\"itembased2\",\"reason\":null},{\"resourceId\":\"2088358594\",\"alg\":\"alg_nsearch_lantag\",\"reason\":null},{\"resourceId\":\"4989545683\",\"alg\":\"bysong_play_rt\",\"reason\":null}]&snap=true&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "uiElement": {
                            "mainTitle": {
                                "title": "marshmello｜棉花糖的精选歌单"
                            },
                            "subTitle": {
                                "title": ""
                            },
                            "image": {
                                "imageUrl": "http://p1.music.126.net/MX0zqLOPfVURiRv0VHPk2A==/109951164099473424.jpg"
                            },
                            "labelTexts": [
                                "欧美",
                                "电子",
                                "运动"
                            ],
                            "rcmdShowType": "DEFAULT"
                        },
                        "resources": [
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "marshmello｜棉花糖的精选歌单"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/MX0zqLOPfVURiRv0VHPk2A==/109951164099473424.jpg"
                                    },
                                    "labelTexts": [
                                        "欧美",
                                        "电子",
                                        "运动"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "721800702",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 522209,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://nm/playlist/flow?source=HOMEPAGE_BLOCK_PLAYLIST_RCMD&bizData=[{\"resourceId\":\"721800702\",\"alg\":\"itembased2\",\"reason\":null},{\"resourceId\":\"2088358594\",\"alg\":\"alg_nsearch_lantag\",\"reason\":null},{\"resourceId\":\"4989545683\",\"alg\":\"bysong_play_rt\",\"reason\":null}]&snap=true&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "itembased2",
                                "logInfo": "{\"deepScore\":\"0.0\",\"cartScore\":\"0.0\",\"src\":\"6812563322\",\"clickScore\":\"0.0\",\"pScore\":\"0.0\",\"srcType\":\"byplaylist\"}"
                            },
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "多热烈的白羊，热烈的抽象。"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/JI4V3ML9d2VqzjrSeKEXBw==/109951164179467737.jpg"
                                    },
                                    "labelTexts": [
                                        "华语",
                                        "民谣",
                                        "夜晚"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "2088358594",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 24567624,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://nm/playlist/flow?source=HOMEPAGE_BLOCK_PLAYLIST_RCMD&bizData=[{\"resourceId\":\"2088358594\",\"alg\":\"alg_nsearch_lantag\",\"reason\":null},{\"resourceId\":\"4989545683\",\"alg\":\"bysong_play_rt\",\"reason\":null},{\"resourceId\":\"721800702\",\"alg\":\"itembased2\",\"reason\":null}]&snap=true&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "alg_nsearch_lantag",
                                "logInfo": "{\"deepScore\":\"0.0\",\"cartScore\":\"0.0\",\"src\":\"-1\",\"clickScore\":\"0.0\",\"pScore\":\"0.0\",\"srcType\":\"bytag\"}"
                            },
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "遗憾吧，努力了这么久什么都没有"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/BT9HK6t6B7C5Ma_XhQfgCw==/109951165852707488.jpg"
                                    },
                                    "labelTexts": [
                                        "华语",
                                        "流行",
                                        "伤感"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "4989545683",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 420876,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://nm/playlist/flow?source=HOMEPAGE_BLOCK_PLAYLIST_RCMD&bizData=[{\"resourceId\":\"4989545683\",\"alg\":\"bysong_play_rt\",\"reason\":null},{\"resourceId\":\"721800702\",\"alg\":\"itembased2\",\"reason\":null},{\"resourceId\":\"2088358594\",\"alg\":\"alg_nsearch_lantag\",\"reason\":null}]&snap=true&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "bysong_play_rt",
                                "logInfo": "{\"deepScore\":\"0.0\",\"cartScore\":\"0.0\",\"src\":\"316670\",\"clickScore\":\"0.0\",\"pScore\":\"0.0\",\"srcType\":\"bysong\"}"
                            }
                        ],
                        "alg": "itembased2",
                        "logInfo": "{\"deepScore\":\"0.0\",\"cartScore\":\"0.0\",\"src\":\"6812563322\",\"clickScore\":\"0.0\",\"pScore\":\"0.0\",\"srcType\":\"byplaylist\"}",
                        "position": 0
                    },
                    {
                        "creativeType": "list",
                        "creativeId": "460264730",
                        "action": "orpheus://playlist/460264730?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "uiElement": {
                            "mainTitle": {
                                "title": "车载嗨曲 开车靠的是感觉，不是眼睛"
                            },
                            "subTitle": {
                                "title": ""
                            },
                            "image": {
                                "imageUrl": "http://p1.music.126.net/FWkhFDyWIcyYfF_O5XSoYw==/18642219650690532.jpg"
                            },
                            "labelTexts": [
                                "舞曲",
                                "电子",
                                "Bossa Nova"
                            ],
                            "rcmdShowType": "DEFAULT"
                        },
                        "resources": [
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "车载嗨曲 开车靠的是感觉，不是眼睛"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/FWkhFDyWIcyYfF_O5XSoYw==/18642219650690532.jpg"
                                    },
                                    "labelTexts": [
                                        "舞曲",
                                        "电子",
                                        "Bossa Nova"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "460264730",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 3056510,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://playlist/460264730?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "bysong_search_rt",
                                "logInfo": "{\"src\":\"18127593\"}"
                            }
                        ],
                        "alg": "bysong_search_rt",
                        "logInfo": "{\"src\":\"18127593\"}",
                        "position": 0
                    },
                    {
                        "creativeType": "list",
                        "creativeId": "6594666794",
                        "action": "orpheus://playlist/6594666794?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "uiElement": {
                            "mainTitle": {
                                "title": "【K-POP】浪漫对唱•用动人的歌声演绎深情"
                            },
                            "subTitle": {
                                "title": ""
                            },
                            "image": {
                                "imageUrl": "http://p1.music.126.net/THy5j05nzal070PRl1ZdsQ==/109951166294690431.jpg"
                            },
                            "labelTexts": [
                                "韩语",
                                "流行",
                                "浪漫"
                            ],
                            "rcmdShowType": "DEFAULT"
                        },
                        "resources": [
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "【K-POP】浪漫对唱•用动人的歌声演绎深情"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/THy5j05nzal070PRl1ZdsQ==/109951166294690431.jpg"
                                    },
                                    "labelTexts": [
                                        "韩语",
                                        "流行",
                                        "浪漫"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "6594666794",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 363819,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://playlist/6594666794?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "bysong_search_rt",
                                "logInfo": "{\"src\":\"1351216800\"}"
                            }
                        ],
                        "alg": "bysong_search_rt",
                        "logInfo": "{\"src\":\"1351216800\"}",
                        "position": 0
                    },
                    {
                        "creativeType": "list",
                        "creativeId": "7224676625",
                        "action": "orpheus://playlist/7224676625?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "uiElement": {
                            "mainTitle": {
                                "title": "「效率加倍」补作业时听的歌·一"
                            },
                            "subTitle": {
                                "title": ""
                            },
                            "image": {
                                "imageUrl": "http://p1.music.126.net/59e8td6tiNCBOSRt135MEQ==/109951166900491622.jpg"
                            },
                            "labelTexts": [
                                "夜晚",
                                "学习",
                                "工作"
                            ],
                            "rcmdShowType": "DEFAULT"
                        },
                        "resources": [
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "「效率加倍」补作业时听的歌·一"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/59e8td6tiNCBOSRt135MEQ==/109951166900491622.jpg"
                                    },
                                    "labelTexts": [
                                        "夜晚",
                                        "学习",
                                        "工作"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "7224676625",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 69823,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://playlist/7224676625?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "bysong_search_rt",
                                "logInfo": "{\"src\":\"479408220\"}"
                            }
                        ],
                        "alg": "bysong_search_rt",
                        "logInfo": "{\"src\":\"479408220\"}",
                        "position": 0
                    },
                    {
                        "creativeType": "list",
                        "creativeId": "877586534",
                        "action": "orpheus://playlist/877586534?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "uiElement": {
                            "mainTitle": {
                                "title": "欧美惊艳歌曲 唤醒沉睡的耳朵"
                            },
                            "subTitle": {
                                "title": ""
                            },
                            "image": {
                                "imageUrl": "http://p1.music.126.net/lG2_lOc_84JJiubXMax2hw==/19112810625771537.jpg"
                            },
                            "labelTexts": [
                                "欧美"
                            ],
                            "rcmdShowType": "DEFAULT"
                        },
                        "resources": [
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "欧美惊艳歌曲 唤醒沉睡的耳朵"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/lG2_lOc_84JJiubXMax2hw==/19112810625771537.jpg"
                                    },
                                    "labelTexts": [
                                        "欧美"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "877586534",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 584773,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://playlist/877586534?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "byplaylist_play_ol",
                                "logInfo": "{\"src\":\"5474516614\"}"
                            }
                        ],
                        "alg": "byplaylist_play_ol",
                        "logInfo": "{\"src\":\"5474516614\"}",
                        "position": 0
                    },
                    {
                        "creativeType": "list",
                        "creativeId": "4860069866",
                        "action": "orpheus://playlist/4860069866?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                        "actionType": "orpheus",
                        "uiElement": {
                            "mainTitle": {
                                "title": "超级治愈英文歌曲，温柔到心里，一秒沦陷"
                            },
                            "subTitle": {
                                "title": ""
                            },
                            "image": {
                                "imageUrl": "http://p1.music.126.net/syudgFoTv67EDagakcH5tw==/109951165003596216.jpg"
                            },
                            "labelTexts": [
                                "治愈",
                                "清新",
                                "浪漫"
                            ],
                            "rcmdShowType": "DEFAULT"
                        },
                        "resources": [
                            {
                                "uiElement": {
                                    "mainTitle": {
                                        "title": "超级治愈英文歌曲，温柔到心里，一秒沦陷"
                                    },
                                    "subTitle": {
                                        "title": ""
                                    },
                                    "image": {
                                        "imageUrl": "http://p1.music.126.net/syudgFoTv67EDagakcH5tw==/109951165003596216.jpg"
                                    },
                                    "labelTexts": [
                                        "治愈",
                                        "清新",
                                        "浪漫"
                                    ],
                                    "rcmdShowType": "DEFAULT"
                                },
                                "resourceType": "list",
                                "resourceId": "4860069866",
                                "resourceUrl": null,
                                "resourceExtInfo": {
                                    "playCount": 8394308,
                                    "highQuality": false,
                                    "specialType": 0
                                },
                                "action": "orpheus://playlist/4860069866?autoplay=0&referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
                                "actionType": "orpheus",
                                "valid": true,
                                "alg": "byplaylist_play_ol",
                                "logInfo": "{\"src\":\"5474516614\"}"
                            }
                        ],
                        "alg": "byplaylist_play_ol",
                        "logInfo": "{\"src\":\"5474516614\"}",
                        "position": 0
                    }
                ],
                "canClose": false
            },
        ],
    },
    "message": ""
}

const songInfo = {
    "songs": [
        {
            "name": "月亮惹的祸",
            "id": 5243631,
            "pst": 0,
            "t": 0,
            "ar": [
                {
                    "id": 6469,
                    "name": "张宇",
                    "tns": [],
                    "alias": []
                }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "600902000005653853",
            "fee": 8,
            "v": 890,
            "crbt": null,
            "cf": "",
            "al": {
                "id": 511419,
                "name": "大人的情歌",
                "picUrl": "https://p1.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
                "tns": [],
                "pic": 0
            },
            "dt": 260773,
            "h": {
                "br": 320000,
                "fid": 0,
                "size": 10433350,
                "vd": -54298
            },
            "m": {
                "br": 192000,
                "fid": 0,
                "size": 6260027,
                "vd": -54298
            },
            "l": {
                "br": 128000,
                "fid": 0,
                "size": 4173366,
                "vd": -54298
            },
            "a": null,
            "cd": "1",
            "no": 9,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mark": 0,
            "originCoverType": 1,
            "originSongSimpleData": null,
            "tagPicList": null,
            "resourceState": true,
            "version": 890,
            "songJumpInfo": null,
            "entertainmentTags": null,
            "single": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 13009,
            "mv": 0,
            "publishTime": 1256832000000
        }
    ],
    "code": 200
}

const lyric = {
    "sgc": false,
    "sfy": false,
    "qfy": false,
    "lrc": {
        "version": 32,
        "lyric": "[00:00.000] 作词 : 十一郎\n[00:01.000] 作曲 : 张宇\n[00:09.740]月亮惹的祸\n[00:15.050]词 十一郎 曲 张宇\n[00:20.770]都是你的错轻易爱上我\n[00:25.270]让我不知不觉满足被爱的虚荣\n[00:29.080]都是你的错你对人的宠\n[00:32.810]是一种诱惑\n[00:36.620]都是你的错在你的眼中\n[00:40.310]总是藏着让人又爱又怜的朦胧\n[00:44.140]都是你的错你的痴情梦\n[00:47.850]像一个魔咒\n[00:51.200]被你爱过还能为谁蠢动\n[00:59.510]我承认都是月亮惹的祸\n[01:03.058]那样的夜色太美你太温柔\n[01:06.560]才会在刹那之间只想和你一起到白头\n[01:14.439]我承认都是誓言惹的祸\n[01:18.009]偏偏似糖如蜜说来最动人\n[01:21.500]再怎么心如钢铁也成绕指柔\n[01:29.119]都是你的错轻易爱上我\n[01:32.780]让我不知不觉满足被爱的虚荣\n[01:36.580]都是你的错你对人的宠\n[01:40.379]是一种诱惑\n[01:44.140]都是你的错在你的眼中\n[01:47.840]总是藏着让人又爱又怜的朦胧\n[01:51.560]都是你的错你的痴情梦\n[01:55.429]像一个魔咒\n[01:58.759]被你爱过还能为谁蠢动\n[02:07.069]我承认都是月亮惹的祸\n[02:10.659]那样的月色太美你太温柔\n[02:14.058]才会在刹那之间只想和你一起到白头\n[02:21.989]我承认都是誓言惹的祸\n[02:25.649]偏偏似糖如蜜说来最动人\n[02:29.429]再怎么心如钢铁也成绕指柔\n[02:37.309]怎样的情生意动\n[02:44.809]会让两个人拿一生当承诺\n[02:53.188]\n[03:09.338]我承认都是誓言惹的祸\n[03:12.688]偏偏似糖如蜜说来最动人\n[03:16.498]再怎么心如钢铁也成绕指柔\n[03:24.129]我承认都是月亮惹的祸\n[03:27.610]那样的月色太美你太温柔\n[03:31.369]才会在刹那之间只想和你一起到白头\n[03:39.169]我承认都是誓言惹的祸\n[03:42.699]偏偏似糖如蜜说来最动人\n[03:46.460]再怎么心如钢铁也成绕指柔\n"
    },
    "klyric": {
        "version": 10,
        "lyric": "\n  "
    },
    "tlyric": {
        "version": 0,
        "lyric": ""
    },
    "code": 200
}

const playlist ={
    "code": 200,
    "playlist": {
        "id": 5146191146,
        "name": "好好去爱这个世界 因为你值得",
        "coverImgId": 109951165177312850,
        "coverImgUrl": "https://p1.music.126.net/OjlAjd43ajVIns8-M98ugA==/109951165177312849.jpg",
        "coverImgId_str": "109951165177312849",
        "adType": 0,
        "userId": 320509339,
        "createTime": 1595904409835,
        "status": 0,
        "opRecommend": false,
        "highQuality": false,
        "newImported": false,
        "updateTime": 1640789841364,
        "trackCount": 48,
        "specialType": 0,
        "privacy": 0,
        "trackUpdateTime": 1642148818792,
        "commentThreadId": "A_PL_0_5146191146",
        "playCount": 29836320,
        "trackNumberUpdateTime": 1640789839434,
        "subscribedCount": 180607,
        "cloudTrackCount": 0,
        "ordered": true,
        "description": "努力工作 努力吃饭 \n努力睡觉 努力玩乐 \n努力生活 努力过好这一生\n\n时间一直往前走\n留下来许多美好与遗憾\n这就是成长吧\n\n其实这个世界偶尔也擅长创造惊喜\n我们会遇到温柔的事物 温柔的人\n对这个世界也不必过于紧张\n毕竟一切都终有归途\n就像行星属于宇宙\n希望我也能找到你\n\n那些看似不起波澜的日复一日\n会在某天让你看到坚持的意义\n祝大家的坚持都会有好的结果",
        "tags": [
            "华语",
            "治愈",
            "流行"
        ],
        "updateFrequency": null,
        "backgroundCoverId": 0,
        "backgroundCoverUrl": null,
        "titleImage": 0,
        "titleImageUrl": null,
        "englishTitle": null,
        "officialPlaylistType": null,
        "subscribed": null,
        "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/GXWLdisZgSlb2hRYEqsG9A==/109951164185001989.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 1010000,
            "birthday": 0,
            "userId": 320509339,
            "userType": 200,
            "nickname": "螚安Vivienne",
            "signature": "可我只心动一个月亮",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164185001980,
            "backgroundImgId": 109951166528053920,
            "backgroundUrl": "http://p1.music.126.net/ZrWDqYbPaasMkMolUn2wog==/109951166528053921.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": [
                "华语",
                "民谣",
                "欧美"
            ],
            "experts": {
                "2": "情感图文达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "authenticationTypes": 1585216,
            "avatarDetail": {
                "userType": 200,
                "identityLevel": 4,
                "identityIconUrl": "https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4761340194/0903/b735/7c7a/0dddcdf78047d397d24125840e54ab5b.png"
            },
            "avatarImgIdStr": "109951164185001989",
            "anchor": true,
            "backgroundImgIdStr": "109951166528053921",
            "avatarImgId_str": "109951164185001989"
        },
        "tracks": [
            {
                "name": "情绪收音机",
                "id": 1906009576,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 34230264,
                        "name": "侯东Holdon",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 100,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 5,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 137924150,
                    "name": "情绪收音机",
                    "picUrl": "http://p4.music.126.net/kH7sOwJTMasIuq_7nWJR4g==/109951166783769952.jpg",
                    "tns": [],
                    "pic_str": "109951166783769952",
                    "pic": 109951166783769950
                },
                "dt": 148000,
                "h": {
                    "br": 320002,
                    "fid": 0,
                    "size": 5922285,
                    "vd": -55549
                },
                "m": {
                    "br": 192002,
                    "fid": 0,
                    "size": 3553389,
                    "vd": -52974
                },
                "l": {
                    "br": 128002,
                    "fid": 0,
                    "size": 2368941,
                    "vd": -51381
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 0,
                "originCoverType": 0,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 0,
                "mv": 0,
                "publishTime": 0
            },
            {
                "name": "Never Say Goodbye",
                "id": 1903078139,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 1057170,
                        "name": "邱琢然",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 95,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 5,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 137423151,
                    "name": "Never Say Goodbye",
                    "picUrl": "http://p3.music.126.net/fv0D8kimWzU3mxXPtaBZCw==/109951166723432506.jpg",
                    "tns": [],
                    "pic_str": "109951166723432506",
                    "pic": 109951166723432510
                },
                "dt": 290519,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 11623489,
                    "vd": -83230
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 6974111,
                    "vd": -80665
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 4649422,
                    "vd": -79149
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 0,
                "originCoverType": 0,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 1416503,
                "mv": 0,
                "publishTime": 0
            },
            {
                "name": "热爱105°C的你",
                "id": 1840459406,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 7122,
                        "name": "阿肆",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 100,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 12,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 126583656,
                    "name": "热爱105°C的你",
                    "picUrl": "http://p4.music.126.net/6Herq6VjqEM2wJYiML3y4A==/109951166098679116.jpg",
                    "tns": [],
                    "pic_str": "109951166098679116",
                    "pic": 109951166098679120
                },
                "dt": 195395,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 7817970,
                    "vd": -50711
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 4690800,
                    "vd": -48102
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 3127214,
                    "vd": -46418
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 1,
                "s_id": 0,
                "mark": 73856,
                "originCoverType": 1,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 743010,
                "mv": 0,
                "publishTime": 1562169600000
            },
            {
                "name": "世界正中",
                "id": 1465290031,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 1007170,
                        "name": "陈粒",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 100,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 4,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 92934965,
                    "name": "世界正中",
                    "picUrl": "http://p3.music.126.net/V1vHVzvQAp8wPLuUbQlVQA==/109951165165590286.jpg",
                    "tns": [],
                    "pic_str": "109951165165590286",
                    "pic": 109951165165590290
                },
                "dt": 236625,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 9467565,
                    "vd": -42043
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 5680557,
                    "vd": -39423
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 3787053,
                    "vd": -37683
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 0,
                "originCoverType": 1,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 1416975,
                "mv": 0,
                "publishTime": 0
            },
            {
                "name": "好想爱这个世界啊",
                "id": 1407358755,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 861777,
                        "name": "华晨宇",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 100,
                "st": 0,
                "rt": "",
                "fee": 4,
                "v": 3,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 83848829,
                    "name": "好想爱这个世界啊",
                    "picUrl": "http://p3.music.126.net/3-y4J1CayZI0k2NkNkTmDw==/109951164525748216.jpg",
                    "tns": [],
                    "pic_str": "109951164525748216",
                    "pic": 109951164525748220
                },
                "dt": 258834,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 10355565,
                    "vd": -45191
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 6213357,
                    "vd": -42618
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 4142253,
                    "vd": -40975
                },
                "a": null,
                "cd": "01",
                "no": 0,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 0,
                "originCoverType": 1,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 636011,
                "mv": 0,
                "publishTime": 0
            },
            {
                "name": "潘金莲",
                "id": 1808157402,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 5781,
                        "name": "薛之谦",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 100,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 5,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 121012393,
                    "name": "天外来物",
                    "picUrl": "http://p3.music.126.net/jOrfzq4tB9ENWQVWLhi3Ag==/109951165591010361.jpg",
                    "tns": [],
                    "pic_str": "109951165591010361",
                    "pic": 109951165591010370
                },
                "dt": 295939,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 11839725,
                    "vd": -66281
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 7103853,
                    "vd": -63830
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 4735917,
                    "vd": -62534
                },
                "a": null,
                "cd": "01",
                "no": 7,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 1,
                "s_id": 0,
                "mark": 8192,
                "originCoverType": 1,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 22036,
                "mv": 0,
                "publishTime": 1609344000000
            },
            {
                "name": "昨晚，潜入离奇星球",
                "id": 1396930668,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 31663286,
                        "name": "姚弛",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 95,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 4,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 82407110,
                    "name": "昨晚，潜入离奇星球",
                    "picUrl": "http://p3.music.126.net/Hz5iqESyCD8lzSIpijKUtA==/109951164427236478.jpg",
                    "tns": [],
                    "pic_str": "109951164427236478",
                    "pic": 109951164427236480
                },
                "dt": 222743,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 8911978,
                    "vd": -57701
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 5347204,
                    "vd": -55104
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 3564817,
                    "vd": -53402
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 8192,
                "originCoverType": 0,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 1416475,
                "mv": 0,
                "publishTime": 0
            },
            {
                "name": "先知",
                "id": 1466033420,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 9548,
                        "name": "田馥甄",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 95,
                "st": 0,
                "rt": "",
                "fee": 1,
                "v": 8,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 95902047,
                    "name": "无人知晓",
                    "picUrl": "http://p4.music.126.net/OjItC1KtO-Jg_lBVqsihkQ==/109951165341263996.jpg",
                    "tns": [],
                    "pic_str": "109951165341263996",
                    "pic": 109951165341264000
                },
                "dt": 301066,
                "h": {
                    "br": 320001,
                    "fid": 0,
                    "size": 12045165,
                    "vd": -59228
                },
                "m": {
                    "br": 192001,
                    "fid": 0,
                    "size": 7227117,
                    "vd": -56672
                },
                "l": {
                    "br": 128001,
                    "fid": 0,
                    "size": 4818093,
                    "vd": -55027
                },
                "a": null,
                "cd": "01",
                "no": 2,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 1,
                "s_id": 0,
                "mark": 8192,
                "originCoverType": 1,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 1416663,
                "mv": 10950220,
                "publishTime": 1595865600000
            },
            {
                "name": "焦给我",
                "id": 1442859532,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 33435854,
                        "name": "要不要买菜",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 95,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 3,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 88427316,
                    "name": "焦给我",
                    "picUrl": "http://p3.music.126.net/8PevaUcMr_Z9sf0kcuV1SA==/109951164932050267.jpg",
                    "tns": [],
                    "pic_str": "109951164932050267",
                    "pic": 109951164932050270
                },
                "dt": 208874,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 8357138,
                    "vd": -56316
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 5014300,
                    "vd": -53700
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 3342881,
                    "vd": -51955
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 0,
                "originCoverType": 0,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 0,
                "mv": 0,
                "publishTime": 0
            },
            {
                "name": "Tomorrow will be fine.",
                "id": 1425676569,
                "pst": 0,
                "t": 0,
                "ar": [
                    {
                        "id": 34406409,
                        "name": "Sodagreen",
                        "tns": [],
                        "alias": []
                    }
                ],
                "alia": [],
                "pop": 100,
                "st": 0,
                "rt": "",
                "fee": 8,
                "v": 10,
                "crbt": null,
                "cf": "",
                "al": {
                    "id": 85955358,
                    "name": "Tomorrow will be fine.",
                    "picUrl": "http://p3.music.126.net/76Hpk_9ot2h2dozv5JbbYA==/109951164737016168.jpg",
                    "tns": [],
                    "pic_str": "109951164737016168",
                    "pic": 109951164737016160
                },
                "dt": 299866,
                "h": {
                    "br": 320000,
                    "fid": 0,
                    "size": 11997562,
                    "vd": -48740
                },
                "m": {
                    "br": 192000,
                    "fid": 0,
                    "size": 7198555,
                    "vd": -46177
                },
                "l": {
                    "br": 128000,
                    "fid": 0,
                    "size": 4799051,
                    "vd": -44649
                },
                "a": null,
                "cd": "01",
                "no": 1,
                "rtUrl": null,
                "ftype": 0,
                "rtUrls": [],
                "djId": 0,
                "copyright": 0,
                "s_id": 0,
                "mark": 8192,
                "originCoverType": 1,
                "originSongSimpleData": null,
                "single": 0,
                "noCopyrightRcmd": null,
                "rtype": 0,
                "rurl": null,
                "mst": 9,
                "cp": 1416693,
                "mv": 10917739,
                "publishTime": 0
            }
        ],
        "videoIds": null,
        "videos": null,
        "trackIds": [
            {
                "id": 1906009576,
                "v": 5,
                "t": 0,
                "at": 1640789839433,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1903078139,
                "v": 5,
                "t": 0,
                "at": 1639715511939,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1840459406,
                "v": 12,
                "t": 0,
                "at": 1640756047192,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1465290031,
                "v": 4,
                "t": 0,
                "at": 1595940666216,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1407358755,
                "v": 3,
                "t": 0,
                "at": 1595904626335,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1808157402,
                "v": 5,
                "t": 0,
                "at": 1609735785808,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1396930668,
                "v": 4,
                "t": 0,
                "at": 1595941468203,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1466033420,
                "v": 8,
                "t": 0,
                "at": 1595934851393,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1442859532,
                "v": 3,
                "t": 0,
                "at": 1595940693817,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1425676569,
                "v": 10,
                "t": 0,
                "at": 1595940759021,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1466643383,
                "v": 10,
                "t": 0,
                "at": 1596031728681,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1464489893,
                "v": 4,
                "t": 0,
                "at": 1595983785995,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1330348068,
                "v": 23,
                "t": 0,
                "at": 1595940733371,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1465341809,
                "v": 3,
                "t": 0,
                "at": 1595904888009,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1441214393,
                "v": 17,
                "t": 0,
                "at": 1595905147288,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1334659052,
                "v": 9,
                "t": 0,
                "at": 1595905171928,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 497572729,
                "v": 33,
                "t": 0,
                "at": 1595941643962,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 502242110,
                "v": 18,
                "t": 0,
                "at": 1595905118955,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1354428575,
                "v": 3,
                "t": 0,
                "at": 1595941105445,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 150565,
                "v": 35,
                "t": 0,
                "at": 1595941568291,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 108138,
                "v": 126,
                "t": 0,
                "at": 1595905128378,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1392761462,
                "v": 23,
                "t": 0,
                "at": 1596011246761,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1453086724,
                "v": 4,
                "t": 0,
                "at": 1595905160381,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1308782980,
                "v": 4,
                "t": 0,
                "at": 1595941116043,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 424474011,
                "v": 21,
                "t": 0,
                "at": 1596159963114,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 82453,
                "v": 17,
                "t": 0,
                "at": 1595941383369,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1462160012,
                "v": 10,
                "t": 0,
                "at": 1595941359504,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 254454,
                "v": 167,
                "t": 0,
                "at": 1595941305892,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1461398976,
                "v": 8,
                "t": 0,
                "at": 1596546705330,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 417859121,
                "v": 18,
                "t": 0,
                "at": 1595941111234,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1385856956,
                "v": 86,
                "t": 0,
                "at": 1595905135688,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1317457805,
                "v": 7,
                "t": 0,
                "at": 1595941004142,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 368878,
                "v": 39,
                "t": 0,
                "at": 1595941324044,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1467185637,
                "v": 7,
                "t": 0,
                "at": 1596294345049,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 327088,
                "v": 3,
                "t": 0,
                "at": 1595941097578,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 430208791,
                "v": 20,
                "t": 0,
                "at": 1595941107896,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1386876006,
                "v": 9,
                "t": 0,
                "at": 1595941122280,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1363948882,
                "v": 19,
                "t": 0,
                "at": 1595941268463,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 472141619,
                "v": 11,
                "t": 0,
                "at": 1595941722407,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1417704283,
                "v": 3,
                "t": 0,
                "at": 1595941065869,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1392161567,
                "v": 3,
                "t": 0,
                "at": 1595941070237,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 454966179,
                "v": 39,
                "t": 0,
                "at": 1595941629638,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1440222199,
                "v": 4,
                "t": 0,
                "at": 1595941011076,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1846419185,
                "v": 4,
                "t": 0,
                "at": 1624519401877,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 417833348,
                "v": 23,
                "t": 0,
                "at": 1595941119109,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1380930961,
                "v": 7,
                "t": 0,
                "at": 1595941100473,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 39443457,
                "v": 10,
                "t": 0,
                "at": 1595941445180,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            },
            {
                "id": 1412644648,
                "v": 4,
                "t": 0,
                "at": 1595941786647,
                "alg": null,
                "uid": 320509339,
                "rcmdReason": ""
            }
        ],
        "shareCount": 1618,
        "commentCount": 1249,
        "remixVideo": null,
        "sharedUsers": null,
        "historySharedUsers": null
    },
}

/***/ }),

/***/ "./src/util/reactive.js":
/*!******************************!*\
  !*** ./src/util/reactive.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reactive": () => (/* binding */ reactive)
/* harmony export */ });
function reactive(obj, effective) {
    return new Proxy(obj, {
        get(obj, key) {
            return Reflect.get(obj, key)
        },
        set(obj, key, value) {
            let set = Reflect.set(obj, key, value)
            effective();
            return set;
        }
    })
}

/***/ }),

/***/ "./src/util/util.js":
/*!**************************!*\
  !*** ./src/util/util.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": () => (/* binding */ debounce),
/* harmony export */   "getRouterOptions": () => (/* binding */ getRouterOptions),
/* harmony export */   "formatCreateTime": () => (/* binding */ formatCreateTime),
/* harmony export */   "formatSongTime": () => (/* binding */ formatSongTime),
/* harmony export */   "songListFilter": () => (/* binding */ songListFilter),
/* harmony export */   "blur": () => (/* binding */ blur),
/* harmony export */   "formatSongLyric": () => (/* binding */ formatSongLyric)
/* harmony export */ });
function debounce(fn, times, isImmediately = true) {
    //防抖函数
    let timer = null;
    let cb;
    if (isImmediately) {
        cb = function (...args) {
            timer && clearTimeout(timer);
            let isDone = !timer;
            timer = setTimeout(() => {
                timer = null
            }, times);
            isDone && fn.apply(this, args)
        }
    } else {
        cb = function (...args) {
            const content = this;
            timer && clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(content, args);
            }, times);
        }
    }
    return cb
}
/**
 * @description: 路由参数提取
 * @param {*} hash
 * @return {*}
 */
 function getRouterOptions(hash) {
	const options = {//路由配置选项
		name: '',
		params: '',
		query: '',
	};
	if (!hash || hash == '#/home') {
		options.name = 'home';
	} else {
		// 提取name params query信息
		//         0   1   2      
		//<a href='#/name/:params?query1=value1?query2=value2'></a>
		try {
			const routerArr = hash.slice(1).split('/');
			options.name = routerArr[1];
			const paramsArr = routerArr[2].split('?');
			options.params = paramsArr[0].slice(1);
			options.query = paramsArr.slice(1);
		} catch (error) {
			options.name = '404'
		}

	}
	return options;
}

/**
 * @description: 日期格式化函数 xxxx-xx-xx
 * @param {*} time
 * @return {*}
 */
 function formatCreateTime(time) {
	let now = new Date(time)
	let year = now.getFullYear();
	let month = now.getMonth();
	let day = now.getDay();
	return `${year}-${month}-${day}`
}

/**
 * @description: 歌曲时间格式化函数 00:00
 * @param {*} time
 * @return {*}
 */
function formatSongTime(time) {
	let second = Math.floor(time / 1000 % 60);
	second = second < 10 ? (`0${second}`) : second;
	let minute = Math.floor(time / 1000 / 60);
	minute = minute < 10 ? (`0${minute}`) : minute;
	return `${minute}:${second}`;

}
/**
 * @description: 歌曲列表去除重复
 * @param {*} songList 需要添加的列表
 * @return {*}
 */
 function songListFilter(songList) {
	let songListArr = JSON.parse(window.localStorage.getItem('songList')) || [];
	let addToList = songList.map(item => ({
		id: item.id,
		name: item.name,
		ar: item.ar,
		dt:item.dt,
	}));
	//去重
	songListArr = [...addToList, ...songListArr];
	const tempMap = new Map();
	songListArr.forEach(item => {
		!tempMap.has(item.id) && tempMap.set(item.id, item)
	});
	// 限制数量
	const limitArr = [...tempMap.values()];
	(limitArr.length > 100) && (limitArr = limitArr.slice(limitArr.length - 100))
	return limitArr;
}

/**
 * @description: 高斯模糊函数
 * @param {*} imgData
 * @return {*}
 */
 function gaussBlur(imgData) {
	var pixes = imgData.data;
	var width = imgData.width;
	var height = imgData.height;
	var gaussMatrix = [],
		gaussSum = 0,
		x, y,
		r, g, b, a,
		i, j, k, len;

	var radius = 10;
	var sigma = 5;//标准差σ，σ描述正态分布资料数据分布的离散程度，σ越大，数据分布越分散，σ越小，数据分布越集中

	a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
	b = -1 / (2 * sigma * sigma);
	//生成高斯矩阵
	for (i = 0, x = -radius; x <= radius; x++, i++) {
		g = a * Math.exp(b * x * x);//标准正态分布函数，正态分布记作N(μ,σ2)，其中μ = 0 ，σ2 = 5
		gaussMatrix[i] = g;
		gaussSum += g;

	}
	//归一化, 保证高斯矩阵的值在[0,1]之间
	for (i = 0, len = gaussMatrix.length; i < len; i++) {
		gaussMatrix[i] /= gaussSum;
	}
	//x 方向一维高斯运算
	for (y = 0; y < height; y++) {
		for (x = 0; x < width; x++) {
			r = g = b = a = 0;
			gaussSum = 0;
			for (j = -radius; j <= radius; j++) {
				k = x + j;
				if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
					//r,g,b,a 四个一组
					i = (y * width + k) * 4;
					r += pixes[i] * gaussMatrix[j + radius];
					g += pixes[i + 1] * gaussMatrix[j + radius];
					b += pixes[i + 2] * gaussMatrix[j + radius];
					// a += pixes[i + 3] * gaussMatrix[j];
					gaussSum += gaussMatrix[j + radius];
				}
			}
			i = (y * width + x) * 4;
			// 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
			// console.log(gaussSum)
			pixes[i] = r / gaussSum;
			pixes[i + 1] = g / gaussSum;
			pixes[i + 2] = b / gaussSum;
			// pixes[i + 3] = a ;
		}
	}
	//y 方向一维高斯运算
	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			r = g = b = a = 0;
			gaussSum = 0;
			for (j = -radius; j <= radius; j++) {
				k = y + j;
				if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
					i = (k * width + x) * 4;
					r += pixes[i] * gaussMatrix[j + radius];
					g += pixes[i + 1] * gaussMatrix[j + radius];
					b += pixes[i + 2] * gaussMatrix[j + radius];
					// a += pixes[i + 3] * gaussMatrix[j];
					gaussSum += gaussMatrix[j + radius];
				}
			}
			i = (y * width + x) * 4;
			pixes[i] = r / gaussSum;
			pixes[i + 1] = g / gaussSum;
			pixes[i + 2] = b / gaussSum;
		}
	}
	//end
	return imgData;
}

// const imgBox = document.querySelector('.player-background-image');
// console.log("🚀 ~ file: util.js ~ line 199 ~ imgBox", imgBox)
// const src = " https://tse1-mm.cn.bing.net/th?id=OIP.M2dHJdmuNPhuODWuMLIK_gHaEo&w=170&h=106&c=8&rs=1&qlt=90&dpr=1.25&pid=3.1&rm=2 ";
function blur(ele, src) {
	// const canvas = document.querySelector('#canvas');
	//设置 canvas 画布
	const canvas = document.createElement('canvas');
	canvas.width = 100;
	canvas.height = 100;
	// 获得 canvas 上下文
	const ctx = canvas.getContext('2d');
	//Image()函数将会创建一个新的HTMLImageElement实例。它的功能等价于 document.createElement('img')
	const img = new Image();
	img.src = src;
	// 添加属性crossorigin，增加img元素的跨域支持，设置值为anonymous，表示对此元素的 CORS 请求将不设置凭据标志
	img.setAttribute('crossorigin', 'anonymous');
	//当img元素加载完成时执行
	img.onload = function () {
		const { width, height } = canvas;
		// ctx.drawImage(img,0,0,img.width,img.height,5,5,width,height);

		ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
		let imgData = ctx.getImageData(0, 0, width, height);
		let gaussData = gaussBlur(imgData);
		ctx.putImageData(gaussData, 0, 0);
		//将图片转变为base64的编码格式
		let imgSrc = canvas.toDataURL();
		//设置背景图片
		ele.style.backgroundImage = 'url(' + imgSrc + ')';
	}
}
// blur(imgBox,src)

/**
 * @description: 格式化歌词格式
 * @param {*} lyricStr
 * @return {*}
 */
 function formatSongLyric(lyricStr) {
	if (typeof lyricStr != 'string') return '歌词加载失败';
	const tempArr = lyricStr.split('\n');
	const lyric = tempArr.map((v, i) => {
		let reg = /^\[(\w*:\w*.?\w*)\](.*)/g;
		let lyricObj = {}
		if (reg.test(v)) {
			let timeStr = RegExp.$1;
			let second = timeStr.split(':').reduce((accumulator, curValue) => (60 * Number(accumulator)) + Number(curValue)).toFixed(2)
			lyricObj.time = Number(second);
			lyricObj.lyric = RegExp.$2;
		}
		return lyricObj;
	})
    console.log("🚀 ~ file: util.js ~ line 252 ~ formatSongLyric ~ lyric", lyric)

	return lyric;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hashProxy": () => (/* binding */ hashProxy)
/* harmony export */ });
/* harmony import */ var _util_reactive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/reactive.js */ "./src/util/reactive.js");
/* harmony import */ var _util_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/util.js */ "./src/util/util.js");
/* harmony import */ var _home_control_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home/control.js */ "./src/home/control.js");
/* harmony import */ var _home_home_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home/home.js */ "./src/home/home.js");
/* harmony import */ var _recommendList_recommendList_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./recommendList/recommendList.js */ "./src/recommendList/recommendList.js");
/* harmony import */ var _player_player_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./player/player.js */ "./src/player/player.js");
// window.addEventListener('load', () => {
//     console.log('load')
//     const script = document.createElement('SCRIPT');
//     script.src = './js/home/home.js';
//     script.setAttribute('type','module');
//     document.querySelector('body').appendChild(script);
// })




//数据响应式执行函数
let effective = () => changeComponent();
// 数据响应式处理
const hashProxy = (0,_util_reactive_js__WEBPACK_IMPORTED_MODULE_0__.reactive)({
    hash: ""
}, effective)

;


//路由表
const routers = [
    {
        name: 'home',
        path: '/home',
        component: _home_home_js__WEBPACK_IMPORTED_MODULE_3__.homePage
    },
    {
        name: 'recommendList',
        path: '/recommendList',
        component: _recommendList_recommendList_js__WEBPACK_IMPORTED_MODULE_4__.recommendListPage
    },
    {
        name: 'player',
        path: '/player',
        component: _player_player_js__WEBPACK_IMPORTED_MODULE_5__.playerPage
    },
];
// let hash;

function changeComponent() {
    let options = (0,_util_util_js__WEBPACK_IMPORTED_MODULE_1__.getRouterOptions)(hashProxy.hash);
    const [{ component, name }] = routers.filter(router => router.name == options.name);
    component(options);
    document.querySelector('#header-title').innerHTML = name;
}

// 监听页面 load 和 hashchange 事件，事件触发后对代理对象赋值
window.addEventListener('load', () => {
    hashProxy.hash = window.location.hash;
    // changeComponent()
    initControl()
})

window.addEventListener('hashchange', () => {
    hashProxy.hash = window.location.hash;
    // changeComponent()
})

function initControl() {
    //初始化的时候加载歌曲
    ;(0,_home_control_js__WEBPACK_IMPORTED_MODULE_2__.initPlayerControl)();
    //绑定底部控制栏的事件
    (0,_home_control_js__WEBPACK_IMPORTED_MODULE_2__.initPlayerEvent)();
}
})();

/******/ })()
;
//# sourceMappingURL=main.js.map