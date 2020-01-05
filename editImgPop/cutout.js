var useDom = {
    popGoods: '.pop-set-baby .goods,.pop-set-baby .main_goods,.pop-set-baby .attribute_goods',
    popGoods_1: '.pop-set-baby .goods',
    popGoods_2: '.pop-set-baby .main_goods',
    popGoods_3: '.pop-set-baby .attribute_goods',
    popAutoScroll: '.pop-set-baby .autoScroll',
    popKeyword: '.pop-set-baby .search input',
    popStatus: '.term1 .option span.selected',
    wait: '.wait',
    nodata: '.newNotFound',
}
var g_datas = []
var g_pic = ""
var g_numiid = ""
var g_uniqid = ""
var interval = null;

$(function () {
    var doc = $(document);

    // ---------- 操作编辑图片弹窗的逻辑 ----------- s

    //编辑图片弹窗初始化
    var editImgObj = editImgPopFun();

    //操作按钮
    $('.popEdit').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            switch ($(this).attr('data-type')) {
                //编辑-按钮
                case 'setedit':
                    $('.pop-picedit .tab').eq(0).click();
                break;
                //更换背景-按钮
                case 'setbg':
                    $('.pop-picedit .tab').eq(1).click();
                break;
            }
            PopUp(".pop-picedit", 1);
            //初始化编辑对象
            editImgObj.initSetting($('.drawBan1 img').attr('src'),$('.drawBan2 img').attr('src'));
        }
    });

    //下载图片
    $('.pop-picedit .save').on('click', function () {
        editImgObj.downloadImg();
    });

    // ---------- 操作编辑图片弹窗的逻辑 ----------- e


    var sceenHeight = document.body.clientHeight - $('#header').outerHeight() - $('.czBanBot').outerHeight() - 80 - 24 - 30
    $(".drawBan").css({ "height": sceenHeight, "width": sceenHeight})

    $(window).resize(function () {
        var sceenHeight = document.body.clientHeight - $('#header').outerHeight() - $('.czBanBot').outerHeight() - 80 - 24 - 30
        $(".drawBan").css({ "height": sceenHeight, "width": sceenHeight })
        if ($('.drawBan img').length) {
            setWidh('.drawBan img')
        }
    })
    

})

// 自适应尺寸
function setWidh(dom) {
    var boxwidth = $(".drawBan").width()
    setTimeout(() => {
        var width = $(dom)[0].naturalWidth
        var height = $(dom)[0].naturalHeight
        if (width >= height) {
            $(dom).css('width', boxwidth)
        } else {
            $(dom).css('height', boxwidth)
        }
    }, 100);
}