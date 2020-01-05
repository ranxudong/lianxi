/* 
 * @Author: 图片编辑
 * @Author: 冉旭东
 * @Date:   2019-12-18 16:47:45
 * @Last Modified by:   Marte
 * @Last Modified time: 2020-01-05 20:04:36
 */

/**
 * 编辑图片弹窗方法使用:
    1、html页面放入弹窗结构
    <include file="./Public/html/pop-up-cutoutImg.html" />
    2、
    var editImgObj = editImgPopFun(); 初始化下弹窗中的事件，页面中只能调用一次
    //弹出窗编辑图时调用
    editImgObj.initSetting('原图的图片地址','抠出的人像图的图片地址');
    //获取最终图片的base64
    var base64 = editImgObj.getCanBase64();
 */
function editImgPopFun () {
    var doc = $(document);
    var dom = {
        pop: $('.pop-picedit'),         //编辑弹窗
        tab: $('.pop-picedit .tab'),    //选项卡
        tabBlock: $('.pop-picedit .tabBlock'),  //选项卡区域
        editbtn: $('.pop-picedit .editbtn'),    //编辑操作按钮
        prev:  $('.pop-picedit .prev'), //上一步
        next:  $('.pop-picedit .next'), //下一步
        retry:  $('.pop-picedit .retry'), //重做
        narrow:  $('.pop-picedit .narrow'), //缩小
        enlarge:  $('.pop-picedit .enlarge'), //放大
        percent: $('.pop-picedit .percent span'),  //缩放值
        pngpic: $('.pop-picedit .pngpic'),         //画板
        canvas: $('.pop-picedit canvas'),    //画布 【操作内容区】
        canLine: $('.pop-picedit canvas[data-type="Line"]'),    //画笔绘制区域
        canLineBack: $('.pop-picedit canvas[data-type="LineBack"]'),    //画笔绘制区域反选
        canOld: $('.pop-picedit canvas[data-type="Old"]'),    //原图canvas
        canOldBack: $('.pop-picedit canvas[data-type="OldBack"]'),  //原图蒙板
        canBg: $('.pop-picedit canvas[data-type="Bg"]'),    //画笔绘制区域
        canPeople: $('.pop-picedit canvas[data-type="People"]'),    //画笔绘制区域
        mouse: $('.pop-picedit .mouse-btn'),  //橡皮属性按钮
        penlen: $('.pop-picedit .penlen'),  // 画笔大小-进度条
        pencir: $('.pop-picedit .pencir'),  // 画笔大小-进度按钮
        psize: $('.pop-picedit .psize'),    // 画笔大小-数值
        bgList: $('.pop-picedit .bgList'),  //背景设置列表
        picset: $('.pop-picedit .picset .select'),  //图片设置下拉
        mybg: $('.pop-picedit .mybg'),      //画布区域
        picbox: $('.pop-picedit .picbox'),  //画布容器
        boxMain: $('.pop-picedit .boxMain'),  //画布最外层容器
        scaleBtn: $('.pop-picedit .scaleBtn'),  //放大缩小按钮
        fromFile: $('#from-file'),  //获取input file
    }

    //绘图-设置项
    var setting = {}

    //步骤对象合集
    var stepObj = {}

    //编辑图片对象集合
    var editObj = {
        cxtLine: null, //画布对象 --- 背景
        cxtBg: null, //画布对象 --- 擦除轨迹
        cxtMouse: null, //画布对象 --- 鼠标
        bgImg: null,  //背景对象
        //画布初始化
        init: function () {
            var that = this;

            //删除弹窗确定事件
            $('.pop-up-removeImgAlert .pop-foot .save').on('click', function () {
                that.clickLi.remove();
            });

            //选项卡
            dom.tab.on('click', function () {
                var index = $(this).index()
                dom.tabBlock.hide().eq(index).show();
            });

            //文件选择
            dom.fromFile.on('change', function (e) {
                console.log(dom.fromFile[0].files[0],'文件选择',$('#from-file').val());
                //限制3兆
                if (dom.fromFile[0].files[0].size < 3145728) {
                    that.imgBase64(dom.fromFile[0].files[0], that.renderLi);
                } else {
                    iconPopHint('图片大小应在3兆以内',0);
                }
                $(this).val('');
            });

            //图片设置
            dom.picset.on('click', '.option span', function () {
                var type = $(this).attr('data-type');
                if (setting.repeat != type) {
                    setting.repeat = type;
                    that.drawBg();
                }
            });

            //编辑操作按钮
            dom.editbtn.on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    var type = $(this).attr('data-type');
                    console.log(type,'----------------');
                    switch (type) {
                        //上一步
                        case 'prev':
                            stepObj.index--;
                            that.renderEditbtn();
                            that.renderStepCan();
                            break;
                        //下一步
                        case 'next':
                            stepObj.index++;
                            that.renderEditbtn();
                            that.renderStepCan();
                            break;
                        //重做
                        case 'retry':
                            that.initSetting();
                        break;
                    }
                };
            });

            //放大缩小操作
            dom.scaleBtn.on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    var type = $(this).attr('data-type');
                    console.log(type,'----------------');
                    switch (type) {
                        //缩小
                        case 'cut':
                            setting.scale -= 0.25;
                            break;
                        //放大
                        case 'add':
                            setting.scale += 0.25;
                            break;
                    }
                    that.scaleDom();
                };
            });

            //选择背景图
            dom.bgList.on('click', 'li', function () {
                var type = $(this).attr('data-type');
                //添加自定义
                if (type === 'add') {
                    dom.fromFile.click();
                } else {
                    if (!$(this).hasClass('select')) {
                        setting.bgType = type;
                        dom.bgList.find('li').removeClass('select');
                        $(this).addClass('select');
                        if (type === 'img') {
                            setting.bg = $(this).find('img').attr('src');
                        }
                        that.setBg(that.stepPush);
                    }
                }
            });

            //删除自定义背景图
            dom.bgList.on('click', 'li .close', function (e) {
                e.stopPropagation();
                that.clickLi = $(this).closest('li');
                numberOfPop('.pop-up-removeImgAlert',['.pop-picedit']);
            });

            //橡皮属性
            dom.mouse.on('click', function () {
                dom.mouse.removeClass('select');
                $(this).addClass('select');
                switch ($(this).attr('data-type')) {
                    case '擦除':
                        setting.combination = 'source-over';
                        break;
                    case '还原':
                        setting.combination = 'destination-out';
                        break;
                }
            });

            //画板的mousedown
            dom.pngpic.on('mousedown', function (e) {
               that.isDraw = true;
               that.drawLine(true);
            });

            //画板进入事件
            dom.boxMain.on('mouseenter', function (e) {
                if (that.isDraw) {
                    var rectObj = dom.pngpic[0].getBoundingClientRect();
                    setting.arcX = (e.pageX - rectObj.left - doc.scrollLeft()) / setting.scale;
                    setting.arcY = (e.pageY - rectObj.top - doc.scrollTop()) / setting.scale;
                    that.drawLine(true);
                }
            });

            //画板的move事件
            dom.boxMain.on('mousemove', function (e) {
                var rectObj = dom.pngpic[0].getBoundingClientRect();
                // console.log(e.pageX,e.pageY,'初始化 绘图-设置项', rectObj);
                setting.arcX = (e.pageX - rectObj.left - doc.scrollLeft()) / setting.scale;
                setting.arcY = (e.pageY - rectObj.top - doc.scrollTop()) / setting.scale;

                //绘制鼠标块
                that.drawMouse();

                //按下鼠标时-绘制擦除路径
                if (that.isDraw) {
                    that.drawLine();
                }
            });

            //画笔大小-进度按钮
            dom.pencir.on('mousedown', function (e) {
                that.isMoveMouse = true;
            });
            
            //doc的move事件
            doc.on('mousemove', function (e) {
                var rectObj = dom.penlen[0].getBoundingClientRect();
                //是否可以移动画笔的粗细
                if (that.isMoveMouse) {
                    var x = e.pageX - rectObj.left;
                    if (x<=1) {
                        x = 1
                    } else if (x >= 100) {
                        x = 100;
                    }
                    setting.arcR = Math.ceil(x/2); 
                    that.drawMouse();
                    that.setPenlen();
                }
            });

            //画板的mouseup
            doc.on('mouseup', function (e) {
                //记一次步骤
                if (that.isDraw) {
                    that.stepPush();
                }

                that.isDraw = false;
                that.isMoveMouse = false;
            });
        },
        //初始化 绘图-设置项
        initSetting: function (oldImg,newImg) {
            var that = this;
            that.PeopleImg = null;

            if (!oldImg || !newImg) {
                //2张实例图：
                // https://newhnproduct.oss-cn-zhangjiakou.aliyuncs.com/pinduoduo/catout/284973292/157717945289665800_img.jpg 【原图】
                // https://newhnproduct.oss-cn-zhangjiakou.aliyuncs.com/pinduoduo/catout/284973292/157717945289665800_trans.png 【人像】
               var oldImg = setting.peopleOld;
               var newImg = setting.people;
            }

            //初始设置
            setting = {
                boxW: dom.picbox.width(),  //画布显示窗口宽度
                canWH: 0,   //画布真实宽高【宽高相等】
                canW: 400, //画布宽度
                canH: 400, //画布高度
                scale: 1, //画布缩放大小
                arcX: 100, //画笔  x
                arcY: 100, //画笔 y
                arcR: 25,   //画笔 半径
                fillStyle: '#4276F2', //画笔填充色
                peopleOld: oldImg, //原图
                people: newImg, //人像图
                peopleW: 0, //背景宽
                peopleH: 0, //背景高
                bgType: 'opacity',  //背景的类型 【opacity 透明 ffffff 白色 img 图片】
                bg: '',  //背景图
                repeat: 'center', //背景自适应居中
                bgW: 0, //背景宽
                bgH: 0, //背景高
                combination: 'source-over',    //绘图组合方式
            }

            //初始步骤
            stepObj = {
                index: -1,
                arr: [], 
            }

            that.initDom();
            that.setPenlen();
            that.setPeople(that.stepPush);
        },
        //设置人像
        setPeople: function (callback) {
            var that = this;
            that.PeopleImg = new Image();
            // that.PeopleImg.setAttribute("crossOrigin",'Anonymous');
            that.PeopleImg.src = setting.people;
                console.log(that,'1111111111111111111');
            that.PeopleImg.onload = function () {
                console.log(that,'2222222222222222222222');
                setting.canW = setting.peopleH = that.PeopleImg.height;
                setting.canH = setting.peopleW = that.PeopleImg.width;

                var n1 = setting.peopleH - setting.boxW, 
                    n2 = setting.peopleW - setting.boxW;
                //是否要缩放
                if (n1 > 0 || n2 > 0) {
                    //高 大于 宽
                    if (n1 > n2) {
                        setting.canWH = setting.peopleH;
                        setting.scale = setting.boxW / setting.peopleH;
                    } else {
                        setting.canWH = setting.peopleW;
                        setting.scale = setting.boxW / setting.peopleW;
                    }
                }

                setting.scale = parseFloat(setting.scale.toFixed(2));

                that.initCanvas();

                if (callback) {
                    callback();
                }
            }
        },
        //初始dom
        initDom: function () {
            dom.editbtn.addClass('disabled');
            dom.mouse.removeClass('select').eq(0).addClass('select');
            dom.bgList.find('li').removeClass('select').eq(0).addClass('select');
        },
        //放大缩小dom
        scaleDom: function () {
            var scaleW = parseInt(setting.canW * setting.scale);

            dom.boxMain.css({
                height: scaleW < setting.boxW ? setting.boxW : scaleW,
            });

            dom.mybg.css({
                width: setting.canW,
                height: setting.canW,
                transform: 'scale('+ setting.scale +')',
                marginLeft: setting.canW > setting.boxW ? (scaleW < setting.boxW ? -scaleW / 2 : -(setting.canW - scaleW) / 2) : 'auto',
            });

            dom.percent.text(parseInt(setting.scale * 100));

            if (setting.scale <= 0.25) {
                dom.scaleBtn.eq(0).addClass('disabled');
            } else {
                dom.scaleBtn.eq(0).removeClass('disabled');
            }

            if (setting.scale >= 4) {
                dom.scaleBtn.eq(1).addClass('disabled');
            } else {
                dom.scaleBtn.eq(1).removeClass('disabled');
            }
        },
        //初始化画布对象
        initCanvas: function () {
            var that = this;
            $.each(dom.canvas, function(item, ele) {
                if (!that['cxt' + $(this).attr('data-type')]) {
                    that['cxt' + $(this).attr('data-type')] = ele.getContext("2d");
                }
                ele.width = setting.canW;
                ele.height = setting.canH;
            });
            that.scaleDom();
            that.drawMouse();
            that.drawPeople();
        },
        //设置背景
        setBg: function (callback) {
            var that = this;
            if (setting.bgType === 'img') {
                that.bgImg = new Image();
                that.bgImg.setAttribute("crossOrigin",'Anonymous');
                that.bgImg.src = setting.bg;
                that.bgImg.onload = function () {
                    setting.bgW = that.bgImg.width;
                    setting.bgH = that.bgImg.height;
                    that.drawBg();
                    if (callback) {
                        callback();
                    }
                }
            } else {
                that.drawBg();
            }      
        },        
        //绘制背景
        drawBg: function () {
            var cxt = this.cxtBg;
            //清除画布
            cxt.clearRect(0,0,setting.canW,setting.canH);
            cxt.globalCompositeOperation = 'source-over';
            cxt.save();
            switch (setting.bgType) {
                case 'ffffff':
                    cxt.fillStyle = '#ffffff';
                    cxt.fillRect( 0, 0, setting.canW, setting.canH);
                    break;
                case 'img':
                    switch (setting.repeat) {
                        //自适应居中
                        case 'center':
                            var pat = cxt.createPattern(this.bgImg, 'no-repeat');
                            var scale = 1;
                            var n1 = setting.bgH - setting.canW, 
                                n2 = setting.bgW - setting.canW;

                            //是否要缩放
                            if (n1 > 0 || n2 > 0) {
                                //高 大于 宽
                                if (n1 > n2) {
                                    scale = setting.canW / setting.bgH;
                                } else {
                                    scale = setting.canW / setting.bgW;
                                }
                            }
                            cxt.scale(scale, scale);
                            cxt.translate((setting.canW/2 - setting.bgW*scale / 2) / scale, (setting.canH/2 - setting.bgH*scale / 2) / scale);
                            cxt.rect( 0, 0, setting.bgW, setting.bgH);
                            cxt.fillStyle = pat;
                            cxt.fill();
                            break;
                        //平铺、水平平铺、垂直平铺
                        case 'repeat':
                        case 'repeat-x':
                        case 'repeat-y':
                            var pat = cxt.createPattern(this.bgImg, setting.repeat);
                            cxt.rect( 0, 0, setting.canW, setting.canH);
                            cxt.fillStyle = pat;
                            cxt.fill();
                            break;
                        //填充背景
                        case 'contain':
                            cxt.drawImage(this.bgImg, 0, 0, setting.canW, setting.canH);
                            break;
                    }
                    break;
            }
            cxt.restore();
            cxt.drawImage(dom.canOld[0], 0, 0);
            cxt.drawImage(dom.canPeople[0], 0, 0);
        },
        //绘制原图蒙板
        drawOldBack: function () {
            var that = this;
            cxt = that.cxtOldBack;
            cxt.clearRect(0,0,setting.canW,setting.canH);
            cxt.globalCompositeOperation = 'source-over';
            cxt.save();
            cxt.fillStyle = "rgba(0,0,0,1)";
            cxt.fillRect(0,0,setting.canW,setting.canH);
            cxt.restore();
            cxt.globalCompositeOperation = 'destination-out';
            cxt.drawImage(dom.canLineBack[0], 0, 0);
        },
        //绘制反选的橡皮擦路径
        drawLineBack: function (moveTo) {
            var cxt = this.cxtLineBack;
            cxt.save();
            cxt.globalCompositeOperation = setting.combination == 'destination-out' ? 'source-over' : 'destination-out';
            cxt.lineJoin = "round";
            cxt.lineCap = "round";
            cxt.lineWidth = setting.arcR * 2;
            if (moveTo) {
                cxt.beginPath();
                cxt.moveTo(setting.arcX,setting.arcY);
            }
            cxt.lineTo(setting.arcX,setting.arcY);
            cxt.stroke();
            cxt.restore();
            if (!moveTo) {
                this.drawOldBack();
            }
        },
        //绘制旧图
        drawOldImg: function () {
            var that = this;
            var cxt = this.cxtOld;
            //清除画布
            cxt.clearRect(0,0,setting.canW,setting.canH);
            cxt.globalCompositeOperation = 'source-over';
            cxt.save();
            cxt.drawImage(this.oldImgObj, 0, 0, setting.canW, setting.canH);
            cxt.restore();
            this.drawLineBack();
            cxt.globalCompositeOperation = 'destination-out';
            cxt.drawImage(dom.canOldBack[0], 0, 0);
            this.setBg();
        },
        //设置原图
        setOldImg: function () {
            var that = this;
            if (!this.oldImgObj) {
                that.oldImgObj = new Image();
                that.oldImgObj.setAttribute("crossOrigin",'Anonymous');
                that.oldImgObj.src = setting.peopleOld;
                that.oldImgObj.onload = function () {
                    that.drawOldImg();
                }
            } else {
                that.drawOldImg();
            }    
        },
        //绘制人像
        drawPeople: function () {
            var cxt = this.cxtPeople;
            //清除画布
            cxt.clearRect(0,0,setting.canW,setting.canH);
            cxt.globalCompositeOperation = 'source-over';
            cxt.save();
            cxt.drawImage(this.PeopleImg, 0, 0, setting.canW, setting.canH);
            cxt.restore();
            cxt.globalCompositeOperation = 'destination-out';
            cxt.drawImage(dom.canLine[0], 0, 0);
            this.setOldImg();
        },
        //绘制橡皮擦路径
        drawLine: function (moveTo) {
            var cxt = this.cxtLine;
            cxt.save();
            cxt.globalCompositeOperation = setting.combination;
            cxt.lineJoin = "round";
            cxt.lineCap = "round";
            cxt.lineWidth = setting.arcR * 2;
            if (moveTo) {
                cxt.beginPath();
                cxt.moveTo(setting.arcX,setting.arcY);
                this.drawLineBack(moveTo);
            }
            cxt.lineTo(setting.arcX,setting.arcY);
            cxt.stroke();
            cxt.restore();
            this.drawPeople();
        },
        //绘制鼠标
        drawMouse: function () {
            var cxt = this.cxtMouse;
            //清除画布
            cxt.clearRect(0,0,setting.canW,setting.canH);
            cxt.save();
            cxt.fillStyle = setting.fillStyle;
            cxt.beginPath();
            cxt.arc(setting.arcX,setting.arcY,setting.arcR,0,Math.PI*2,true);
            cxt.fill();
            cxt.restore();
        },
        //设置画笔大小位置
        setPenlen: function () {
            dom.penlen.css('width',setting.arcR * 2);
            dom.psize.text(setting.arcR + 'px');
        },
        //获取图片base64
        //_s 是files 对象
        imgBase64: function (_s, callback) {
            var that = this;
            var reader = new FileReader();
            var file = _s;
            if (file) {
                //将文件以Data URL形式读入页面  
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var _base64 = reader.result;
                    callback(_base64);
                }
             } 
        },
        //渲染自定义背景
        renderLi: function (base64) {
            var html = '<li data-type="img"><i class="close"></i><img src="'+ base64 +'" alt=""></li>';
            dom.bgList.find('li:last-child').before(html);
        },
        //记步骤
        stepPush: function () {
            var that = editObj;
            var canData = {
               bgType: setting.bgType,
               bg: setting.bg,
            };
            $.each(dom.canvas, function(item, ele) {
                var key = $(this).attr('data-type');
                if (key != 'Mouse') {
                    // canData[key] = dom['can' + key][0].toDataURL();
                    canData[key] = that['cxt' + key].getImageData(0, 0, setting.canW, setting.canH);
                }
            });
            stepObj.arr.push(canData);
            stepObj.index++;
            //步骤增加时，删除因回退的多余步骤
            stepObj.arr.splice(stepObj.index + 1);
            that.renderEditbtn();
        },
        //操作按钮渲染
        renderEditbtn: function () {
            //上一步\重做
            if (stepObj.index > 0) {
                dom.prev.removeClass('disabled');
                dom.retry.removeClass('disabled');
            } else {
                dom.prev.addClass('disabled');
                dom.retry.addClass('disabled');
            }

            //下一步
            if (stepObj.index < (stepObj.arr.length - 1)) {
                dom.next.removeClass('disabled');
            } else {
                dom.next.addClass('disabled');
            }
        },
        //根据步骤绘制canvas
        renderStepCan: function () {
            console.log(stepObj,'根据步骤绘制canvas');
            var that = this;
            var renderObj = stepObj.arr[stepObj.index];
            if (renderObj) {
                for (let key in renderObj) {
                    if (that['cxt' + key]) {
                        that['cxt' + key].putImageData(renderObj[key], 0, 0);
                    } else {
                        setting[key] = renderObj[key];
                    }
                }
            }
        },
        //获取canvas的base64
        getCanBase64: function () {
            return dom.canBg[0].toDataURL();
        },
        //下载最终图片
        downloadImg: function () {
            var imgData = dom.canBg[0].toDataURL();
            var a = document.createElement("a");
            a.href = imgData;
            a.download = new Date().getTime();
            a.click();
        }
    }

    //初始化
    editObj.init();

    return editObj;
}