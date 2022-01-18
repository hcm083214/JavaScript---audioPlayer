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

import { getBannerList } from '../service/ajax.js';
import { carouselRender, initCarouselEvent } from "./carousel.js";

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

export async function homePage(){
    //首页初始化
    document.querySelector('#app').innerHTML = homePageTemplate;
    const result = await getBannerList()
    const carouselData = result.data.blocks[0].extInfo.banners;;
    //首次渲染轮播图
    carouselRender(carouselData);
    //轮播图事件绑定
    initCarouselEvent();

    const recommendData = [...result.data.blocks[1].creatives];
    // 初始化歌单推荐列表
    recommendRender(recommendData);
    // 初始化页面事件
    initRecommendEvent()
}