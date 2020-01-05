require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imgDatas = require('../data/imgData.json');

imgDatas = imgDatas.map(ele=>{
    ele.imgUrl = require('../images/'+ ele.fileName);
    return ele;
});

/**
 * 获取区间内的随机值
 */
function getRangeRandom(low,high) {
    return Math.ceil(Math.random()*(high-low) + low);
}

/**
 * 获取0~30°之间的一个任意正负值
 */
function get30DegRandom() {
    return ((Math.random() > 0.5 ?'': '-') + Math.ceil(Math.random()*30));
}

class Contnav extends React.Component{
    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        this.props.inverse(this.props.index);

        e.preventDefault();
        e.stopPropagation();
    }

    render(){
        var className = 'constro';
        className += this.props.index == this.props.centerIndex ? ' is-center':'';
        className += this.props.arrange.isInverse?' is-invers':'';
        return (
            <span className={className} onClick={this.handleClick}></span>
        );
    }

}

class ImgDOM extends React.Component{
    constructor(props){
        super(props);

    }

    /**
     * 点击事件
     */
    handleClick = (e) =>{
        this.props.inverse(this.props.index);

        e.stopPropagation();
        e.preventDefault();
    }

    render(){

        var styleObj = {};

        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        if (this.props.index == this.props.centerIndex) {
            styleObj.zIndex = 1;
        }

        //如果图片的旋转角度有值且不为0，添加旋转角度
        if (this.props.arrange.rotate) {
            ['MozTransform','msTransform','WebkitTransform','transform'].forEach(ele=>{
                styleObj[ele] = 'rotate('+ this.props.arrange.rotate +'deg)';
            });
        }

        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse':'';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imgUrl} alt={this.props.data.title} onLoad={()=>{this.props.load(this.props.index)}} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

class App extends React.Component {
    constructor(props){

        super(props);

        this.state = {
            imgsArr: [
                // {
                //     pos:{
                //         left: '0',
                //         top: ' 0',
                //     },
                //     totate: 0,   //旋转角度
                //     isInverse: false, //图片正反面
                // }
            ],
            centerIndex: Math.floor(Math.random()*imgDatas.length)
        }

        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: { //水平方向的取值范围
                leftSecx: [0,0],
                rightSecx: [0,0],
                y: [0,0]
            },
            vPosRange: {    //垂直方向的取值范围
                x: [0,0],
                topY: [0,0]
            }
        }

    }

    //组件加载后，给每张图片计算位置
    componentDidMount(){

    }

    onLoad = (_index) => {
        //console.log(_index,this.state.centerIndex,'这是图片信息');
        if (_index == this.state.centerIndex) {
            this.pageXY();
        }
    }

    //计算页面布局位置
    pageXY = () => {
        let stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs['imgFigure'+this.state.centerIndex]),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);

        //中心图片的位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        //计算左侧，右侧区域图片排布的取值范围
        this.Constant.hPosRange.leftSecx[0] = -halfImgW
        this.Constant.hPosRange.leftSecx[1] = halfStageW-halfImgW*3;
        this.Constant.hPosRange.rightSecx[0] = halfStageW+halfImgW;
        this.Constant.hPosRange.rightSecx[1] = stageW-halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上侧区域图片排布的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange();
    }

    /**
     * 重新排布图片布局
     * 居中显示图片的index
     */
    rearrange = () => {
        let centerIndex = this.state.centerIndex;
        //console.log(centerIndex,JSON.parse(JSON.stringify(this.state.imgsArr)),'rearrange----');
        let imgsArrange = this.state.imgsArr,
            Constant = this.Constant,
            CenterPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecx,
            hPosRangeRightSecX = hPosRange.rightSecx,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            
            imgsArrangeTopArr = [],
            topImgNum = Math.ceil(Math.random() * 2),
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrange.splice(centerIndex,1);
            //console.log(imgsArrange.length,'去掉中间');
            //首先居中 centerIndex 图片
            imgsArrangeCenterArr[0].pos = CenterPos;

            //居中的 图片不需要旋转
            imgsArrangeCenterArr[0].rotate = 0;

            //取出要布局上侧的图片信息
            topImgSpliceIndex = Math.ceil(Math.random(imgsArrange.length - topImgNum));
            imgsArrangeTopArr = imgsArrange.splice(topImgSpliceIndex,topImgNum);
            //console.log(topImgNum,'顶部有几张？', imgsArrange.length);

            //布局位于上侧的图片
            imgsArrangeTopArr.forEach((ele,index)=>{
                imgsArrangeTopArr[index] = {
                    pos: {
                        top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                    },
                    rotate: get30DegRandom()
                }
                    
            });

            //布局左右两侧的图片
            for (var i = 0, j = imgsArrange.length, k = j/2; i < j; i++ ) {
                var hPosRangeLORX = null;

                if (i < k ) {
                    hPosRangeLORX  = hPosRangeLeftSecX;
                } else {
                    hPosRangeLORX = hPosRangeRightSecX;
                }
                //console.log(i,'便利');
                imgsArrange[i] = {
                    pos: {
                        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom()
                }

            }

            //console.log(imgsArrange.length,'aaaaaaaa');
            imgsArrangeTopArr.forEach((ele)=>{
                imgsArrange.splice(topImgSpliceIndex,0,ele);
            });
            //console.log(imgsArrange.length,'bbbbbbbbbb');

            imgsArrange.splice(centerIndex,0,imgsArrangeCenterArr[0]);
            //console.log(JSON.parse(JSON.stringify(imgsArrange)),'?imgsArrange');
            //console.log(imgsArrange.length,'ccccccccc');
            this.setState({
                imgsArr: imgsArrange,
                centerIndex: centerIndex
            });
    }

    // center = (index) =>{
    //     this.rearrange();
    // }

    /**
     * 翻转图片
     * index 输入当前执行图标的index
     * return一个闭包函数
     */
    inverse = (index) => {
        //console.log(index,'?');
        if (index != this.state.centerIndex) {
            this.state.centerIndex = index;
            this.pageXY();
        } else {
            let imgsArr = this.state.imgsArr;
            imgsArr[index].isInverse = !imgsArr[index].isInverse;
            this.setState({
                imgsArr: imgsArr
            });
        }

    }


    render() {
        //console.log(this.state.imgsArr,this.state.centerIndex,'render.....');
        let contNavs = [], imgArr = [];
        imgDatas.forEach((ele,i)=>{

            if(!this.state.imgsArr[i]){
                this.state.imgsArr[i] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false
                }
            }
            imgArr.push(<ImgDOM key={i} ref={'imgFigure' + i} index={i} centerIndex={this.state.centerIndex} data={ele} arrange={this.state.imgsArr[i]} inverse={this.inverse} load={this.onLoad} />);
            contNavs.push(<Contnav key={i} index={i} arrange={this.state.imgsArr[i]} centerIndex={this.state.centerIndex} inverse={this.inverse} />);
        });

        return (
            <section ref="stage" className="stage">
                <section className="img-sec">
                   {imgArr}
                </section>
                <nav className="cont-nav">
                    {contNavs}
                </nav>
            </section>
        )
    }
}

App.defaultProps = {};

export default App;
