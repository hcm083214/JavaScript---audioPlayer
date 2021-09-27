# 简介

本实验采用原生 JavaScript 搭建类似网易云的音乐播放器。应用到的技术包括 ES6 新增的语法糖如解构赋值、箭头函数、展开运算符模板字符串 ，异步处理Promise，ES6模块化，异步网络请求Ajax，单页面应用思想，数据响应式思想。通过上述技术最终完成页面切换，轮播图，音乐播放器等功能。

# 效果展示

播放器首页（轮播图）

![首页效果](https://doc.shiyanlou.com/courses/3871/1621685/c9420d0d763ebf208538c44293165631-0/wm)

推荐列表详情页

![推荐详情页](https://doc.shiyanlou.com/courses/3871/1621685/0f84ccfdad3bff86861d14d34a3957b5-0/wm)

播放器页面效果

![播放器页面](https://doc.shiyanlou.com/courses/3871/1621685/c6f3910759ef41243124f1ac62b2ddb2-0/wm)

# 后端接口

本实验选择项目  [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi/)  来完成后端接口的部署。

**环境要求**：需要 NodeJS 8.12+ 环境（需要提前安装 [nodejs](http://nodejs.cn/)  和 git ，并配置环境变量，这部分可自行百度）

```js
git 安装包下载地址
链接：https://pan.baidu.com/s/1ifL9rQ5Umd24m7bIMMGeGg 
提取码：nldp
```

安装完毕后运行如下指令，得到版本号后则证明 git 和 node.js 安装成功。

```shell
node -v

git --version
```

![image-20210927001259669](https://doc.shiyanlou.com/courses/3871/1621685/a2ecf80bc3b0a628df9f17d17ba55d49-0/wm)

**开源项目和依赖包下载**：

在本地磁盘下新建一个文件夹，右击鼠标右键，选中 `Git Bash Here`。

![image-20210927002535785](https://doc.shiyanlou.com/courses/3871/1621685/814ced965a92038ef50257597ee4614f-0/wm)

接下来输入如下指令：

```shell
$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git 

$ npm install
```

或者

```shell
$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git

$ npm install
```

**运行**

```shell
$ node app.js
```

服务器启动默认端口为 3000,若不想使用 3000 端口,可使用以下命令: Mac/Linux

```shell
$ PORT=4000 node app.js
```

windows 下使用 git-bash 或者 cmder 等终端执行以下命令:

```shell
$ set PORT=4000 && node app.js
```

按照如下操作即可启动后端接口，提示 “`server running @ http://localhost:3000`” ，在浏览器输入 `http://localhost:3000` 会得到如下页面则表示启动成功

![04-3](https://doc.shiyanlou.com/courses/3871/1621685/79abf28a46b78fa8c642b315803251ba-0/wm)

![04-4](https://doc.shiyanlou.com/courses/3871/1621685/c95117a78d83836ff426656bdf95ded5-0/wm)

