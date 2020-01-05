var g_completeheadoauth=0;
var suggest_content = "";//存放输入的建议
var jyhf_sm = 0;//建议回复数目
var HN_UI = {};
var yzmTime = null;	// 获取验证码定时器
$(function () {
	
	$('#fixed').show();

	//-------------------------提交建议
	//feedback();
	$(document).on("click","#scrollbar_new .suggest, .scrollbar_new .suggest",function(){
		if(jyhf_sm != 0){
        	data = "reply-suggest";
        	jyhf_sm = 0;
        	$("#tjjy-suggest .tab").eq(1).addClass("selected");
        	$("#tjjy-suggest .tab").eq(0).removeClass("selected");
    	}else{
    		data = "submit-suggest";
    		$("#tjjy-suggest .tab").eq(0).addClass("selected");
        	$("#tjjy-suggest .tab").eq(1).removeClass("selected");
    	}
        switch_cont();
		PopUp(".pop-suggest",1);
	});
	$('#suggestval').focus(function(){
		if($(this).val() == '请输入建议'){
			$(this).val('');
		}
	});

	$('#suggestval').blur(function(){
		if($(this).val() == ''){
			$(this).val('请输入建议');
		}
	});
	//提交建议内容
	$(".pop-suggest textarea").on("focus",function(){
		$(this).css("color","#333333");
	})
	$(".pop-suggest textarea").on("blur",function(){
		if($(this).val() == "请输入建议"){
			$(this).css("color","#cccccc");
		}
	})
		//输入建议
	$(".pop-suggest textarea").on("blur",function(){
		testing_text();
	})
		//给电话号码加得焦类名
	$("#phone-code").on("focus",function(){
		$(this).addClass("phone-code");
	})
	$("#phone-code").on("blur",function(){
		$(this).removeClass("phone-code");
	})
	//点击切换
    $('#tjjy-suggest .tab,.jyhfq .jxtj').on("click",function(){
    	data = $(this).attr("data");
        switch_cont();
    });
    $("#tjjy-suggest .tab").on("click",function(){
    	if(!$(this).hasClass("selected")){
    		$(this).addClass("selected").siblings(".tab").removeClass("selected");
    	}
    })
    $(".jyhfq .jxtj").on("click",function(){
    	$(".pop-suggest .tjjy-bodyHeaderTab a").eq(0).addClass("selected").siblings(".tab").removeClass("selected");
    })

		//点击取消
	$(".pop-suggest .cancel" ).click(function(){
		$("#suggestval").val("");
	    $(this).closest('#mask').fadeOut(300);
	    setTimeout(function(){
	        $('.pop-up-box').hide();
	    },300);
	});
	//-------------------------提交建议

	// ---------------------续订升级弹窗 --------------s

	//每个页面都添加升级弹窗
	function renewUpgradePop() {
		if ($('#mask .mask-bg > .list').length) {
			$('#mask .mask-bg > .list').prepend($('#renewUpgradePop').html());
		}
	}
	renewUpgradePop();
	//弹窗续订升级弹窗
	$('#header').on('click', '.renewUpgrade', function () {
		renewUpgradeHtml(1);
		PopUp(".pop-up-renewUpgrade", 1);
	})

	//第一次关闭
	$(document).on('click', '.pop-up-renewUpgrade .freeuserclose', function () {
		var times = $('.pop-up-renewUpgrade').attr('data-times');
		if (times == 2) {
			$('.pop-up-renewUpgrade').attr('data-times','1');
			PopUpClose();
		} else {
			$('.pop-up-renewUpgrade').hide();
			PopUp(".pop-up-paymentfreeusertip", 1);
		}
	});

	//我想要便宜点的
	$(document).on('click', '.pop-up-paymentfreeusertip .getloastprice', function () {
		$('.pop-up-paymentfreeusertip').hide();
		renewUpgradeHtml(2);
		$('.pop-up-renewUpgrade').attr('data-times','2').show();
	});

	//支付跳转
	$(document).on('click', '.pop-up-renewUpgrade .upgrade-rows a', function () {
		$('.pop-up-renewUpgrade').hide();
		PopUp(".pop-up-paymentConfirm", 1);
	});

	//是否已付款
	$(document).on('click', '.pop-up-paymentConfirm .paysucess', function () {
		HN_UI.ajax('WhiteImg/Index/checkOrder').then(function (res) {
			if (res.status == 800) {
				$('#header').find('.surplus font').text(res.data.end_time_day);
				$('#header').find('.senior, .dqsjxdcz .version').text(res.data.version_desc);
				$('#header').find('.dqsjxdcz .dqtimes').text(res.data.end_time);
				HN_ENDTIME_DAY = res.data.end_time_day;
				HN_VERSION = res.data.version_desc;
				HN_DELINE_TIME = res.data.end_time;
			}
		});
		PopUpClose();
	});

	//暂不付款
	$(document).on('click', '.pop-up-paymentConfirm .closePlay', function () {
		var times = $('.pop-up-renewUpgrade').attr('data-times');
		if (times == 2) {
			PopUpClose();
		} else {
			$('.pop-up-paymentConfirm').hide();
			PopUp(".pop-up-paymentfreeusertip", 1);
		}
	});

	//续订升级弹窗内容
	function renewUpgradeHtml(times) {
		var html = '';

			html += '<div class="upgrade-rows">';
	                   	html += '<div class="row clearfix">';
	                        html += '<div class="tit">续订高级版</div>';

	                        if (times == 2) {
	                        	html += '<a href="https://mms.pinduoduo.com/service-market/order-confirm?skuId=5784&activityId=&prizeId=&detailId=302" target="_blank">';
		                            html += '<div class="block recommend">';
		                                html += '<div class="top">一月</div>';
		                                html += '<div class="cont">';
		                                    html += '<span class="discountprice">20</span>';
		                                    html += '<span class="price">50</span>';
		                                html += '</div>';
		                            html += '</div>';
		                        html += '</a>';
	                        } else  {
	                        	html += '<a href="https://mms.pinduoduo.com/service-market/order-confirm?skuId=5787&activityId=&prizeId=&detailId=302" target="_blank">';
		                            html += '<div class="block recommend">';
		                                html += '<div class="top">一年</div>';
		                                html += '<div class="cont">';
		                                    html += '<span class="discountprice">130</span>';
		                                    html += '<span class="price">600</span>';
		                                html += '</div>';
		                            html += '</div>';
		                        html += '</a>';
		                        html += '<a href="https://mms.pinduoduo.com/service-market/order-confirm?skuId=5786&activityId=&prizeId=&detailId=302" target="_blank">';
		                            html += '<div class="block">';
		                                html += '<div class="top">半年</div>';
		                                html += '<div class="cont">';
		                                    html += '<span class="discountprice">80</span>';
		                                    html += '<span class="price">300</span>';
		                                html += '</div>';
		                            html += '</div>';
		                        html += '</a>';
		                        html += '<a href="https://mms.pinduoduo.com/service-market/order-confirm?skuId=5785&activityId=&prizeId=&detailId=302" target="_blank">';
		                            html += '<div class="block">';
		                                html += '<div class="top">一季</div>';
		                                html += '<div class="cont">';
		                                    html += '<span class="discountprice">50</span>';
		                                    html += '<span class="price">150</span>';
		                                html += '</div>';
		                            html += '</div>';
		                        html += '</a>';
	                        }
		                        
	                    html += '</div>';
	                html += '</div>';

		$('.pop-up-renewUpgrade').find('.pop-body').html(html);
	}

	// ---------------------续订升级弹窗 --------------e


	//---------------------default.js-----------------------

	//新版table 表头带箭头升降序排列切换 晓辰
	$(document).on('click','.NewTableBox thead th .sort',function(){
		$(this).addClass('selected');
		$(this).siblings().removeClass('selected');
		var sl = $(this).find('.jt a.selected');
		var a = $(this).find('.jt a');
		if (sl.length == 0) {
			a.eq(0).addClass('selected');
			a.parents('th').addClass('');
		}else {
			sl.removeClass('selected');
			if (sl.hasClass('up')) {
				a.eq(1).addClass('selected');
			}else {
				a.eq(0).addClass('selected');
			}
		}
	})
	
	//新版 bodyHeaderTab
	$('body').on('click','.bodyHeaderTab .fl > a',function(){
		$(this).siblings().removeClass('selected');
		$(this).addClass('selected');
	})
	//新版 bodyHeaderTab selected
	$('body').on('click','.bodyHeaderTab .selectBox .pop-content a',function(){
		var selectBox = $(this).closest('.selectBox');
		if (!selectBox.hasClass('val-disable') && !$(this).hasClass('disabled')) {
			var txt=$(this).text();
			var span_w = parseFloat($(this).find('span').width());
			var w1 =  span_w + 6;
			var w2 =  span_w;
			$(this).closest('.selectBox').find('.pop-value').find('font').text(txt);
			$(this).closest('.pop').hide();
			$(this).addClass('selected').siblings().removeClass('selected');
		} else {
			$(this).closest('.pop').hide();
		}

	})
	$('body').on('mouseenter','.bodyHeaderTab .selectBox',function(){
		$(this).find('.pop').show();
	})
	$('body').on('mouseleave','.bodyHeaderTab .selectBox',function(){
		$(this).find('.pop').hide();
	})

	//待搜索条件的搜索框
	$('body').on('mouseenter', '.both_search .shippong-but.selectBox', function () {
		var w = parseFloat($(this).outerWidth()) + 10 - 1;
		$(this).closest('.both_search').css('padding-left', w);
		$(this).closest('.both_search').css({
			'padding-left': w,
			'border-color': 'transparent',
			'background-color': 'transparent',
			'box-shadow': 'none'
		});
	});
	$('body').on('mouseleave', '.both_search .shippong-but.selectBox', function () {
		$(this).closest('.both_search').attr('style', '');
	});
	
	$(document).on('focus', '.tabSearch input', function () {
		var PL = $(this).closest('.tabSearch').find('.pl_search_new');
		PL.show();
	});

	$(document).on('click', function (e) {
		if ($(e.target).parents('.tabSearch').length == 0) {
			$('.pl_search_new').hide();
		};	
	});

	//返回顶部
	$('#scrollbar_new .go-top').click(function() {
		if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
			var b = $(document).scrollTop();
			$('html').animate({
				scrollTop: '0'
			}, b / 3);
		} else if (navigator.userAgent.indexOf("MSIE") > 0) {
			var b = $(document).scrollTop();
			$('html').animate({
				scrollTop: '0'
			}, b / 3);
		} else {
			var b = $(document).scrollTop();
			$('html').animate({
				scrollTop: '0'
			}, b / 3);
		}

	});
	//展开、收起右侧按钮：
	$('#scrollbar_new .packUp').click(function () {
		$('#toggleBox').slideToggle('slow',function () { 
			$('#scrollbar_new .packUp').toggleClass('open');
			if ($('#scrollbar_new .packUp').hasClass('open')) {
				//存储状态值，判断用户是否在其他页面进行过展开和收起的操作
				sessionStorage.setItem("right", "close");
			} else {
				sessionStorage.setItem("right", "open");
			}
		});

	});
	$('#scrollbar_new .packUp').mouseenter(function () {
		if ($(this).hasClass('open')) {
			$(this).find('.promptBox span').text('展开浮层')
		} else {
			$(this).find('.promptBox span').text('收起浮层')
		}

	});
	// 搜索框 focus
	$('.search input').focus(function(){
		$(this).parent().addClass('focus');
	});
	$('.search input').blur(function(){
		$(this).parent().removeClass('focus');
	});
	//页面textarea、input获取焦点变色 
	$(document).on('focus', '.input-text input, textarea', function () {
		$(this).addClass('text-focus');
	});
	$(document).on('blur', '.input-text input, textarea', function () {
		$(this).removeClass('text-focus');
	});


	//select/inputDate 不可修改input
	$(document).on('focus', '.select input.text, .inputDate input', function () {
		if (!$(this).parent().hasClass('changeText')) {
			$(this).blur();
		};
	});

	//select下拉
	$(document).on('click', '.select .text, .select .arrow', function () {
		if ($(this).parents('.select').hasClass('disable')) {
			return false;
		};

		if ($(this).parents('.select').hasClass('open')) {
			$('.select.open').removeClass('open');
		} else {
			$('.select.open').removeClass('open');
			$(this).parents('.select').addClass('open');
		}

		var option = $(this).siblings('.option');
		if (option.css('display') == 'block') {
			option.hide();
		} else {
			$('.select .option').hide();
			option.show();
		}
		if($(this).parents('.select').find('.scroll').length) {
			if ($(this).parents('.select').find('.scroll').mCustomScrollbar) {
				$(this).parents('.select').find('.scroll').mCustomScrollbar('update');
			};
			$(this).closest('.select').find('.scroll').mCustomScrollbar('scrollTo',$(this).closest('.select').find('.scroll .selected'));
		}else{
			var scroll = $(this).parents('.select').find('.option_item').wrap('<div class="scroll"></div>').parent('.scroll')
			if (scroll.mCustomScrollbar) {
				scroll.mCustomScrollbar({mouseWheel: {preventDefault:true},scrollInertia:0});
				$(this).closest('.select').find('.scroll').mCustomScrollbar('scrollTo',$(this).closest('.select').find('.scroll .selected'));
			};
		}
	});

	//selectHover下拉
	$('body').on('mouseover', '.select.selectHover', function () {
		if ($(this).parents('.select').hasClass('disable')) {
			return false;
		};
		$(this).find('.option').show();
	});
	$('body').on('mouseout', '.select.selectHover', function () {
		$(this).find('.option').hide();
	});
	

	//select-option点击选择
	$(document).on('click', '.select .option span', function () {
		if ($(this).parents('.select').hasClass('check-select')) {
			return false;
		}
		var option = $(this).parents('.option');
		// if (!$(this).hasClass('disable') && !$(this).hasClass('dt')) {
		if (!$(this).hasClass('disable')) {
			$(this).siblings().removeClass('selected');
			$(this).parents('.select').toggleClass('open')
			option.hide();
			var val;
			if ($(this).find('.select-val').length != 0) {
				val = $.trim($(this).find('.select-val').text());
			}else {
				val = $.trim($(this).text())
			}
			option.parents('.select').find('input').prop('value', val);
			if (val.length > 5) {
				option.parents('.select').find('.text').prop('title', val);
			} else {
				option.parents('.select').find('.text').removeAttr('title')
			}
			$(this).addClass('selected');
		}
	});
	//select-option删除选项-阻止冒泡
	$(document).on('click', '.select .option span a.remove', function (e) {
		e.preventDefault();
		e.stopPropagation();
	});
	//select-option选择框选项-阻止冒泡
	$(document).on('click', '.select .option span a.checkbox', function (e) {
		e.preventDefault();
		e.stopPropagation();
		if ($(this).hasClass('disabled')) {
			return
		}
		if (!$(this).hasClass('checkbox-checked')) {
			$(this).parent('span').addClass('selected');
		} else {
			$(this).parent('span').removeClass('selected');
		}
	});
	//点击确认
	$(document).on('click', '.check-select .option .save', function () {
		var arr = []
		console.log($('.option .check_list span').length)
		if ($('.option .check_list span').length < 1) {
			return
		} else {
			$(this).siblings('.check_list').find('span').each(function () {
				if ($(this).find('.checkbox-checked').length) {
					arr.push($(this).find('.span').text().replace('|--',''));
				}
				$(this).parents('.check-select').find('.text').val(arr.join(','))
			})
			$('.select .option').hide();
		}
	})
	//select-box-按钮组
	$(document).on('click', '.select-box a', function () {
		if ($(this).hasClass('disable')) {
			return false;
		}
		$(this).parent().children().removeClass('selected');
		$(this).addClass('selected');
	});

	//搜索
	$(document).on('focus', '.search input', function () {
		var pl_search = $(this).parent().find('.pl-search');
		if (pl_search.length != 0) {
			pl_search.fadeIn(300);
		};
	});

	$(document).on('focus', '.tabSearch input', function () {
		var pl_search = $(this).parent().find('.pl_search_new');
		if (pl_search.length != 0) {
			pl_search.fadeIn(300);
		};
	});

	//tab
	$(document).on('click', '.tabs .tab', function () {
		$(this).siblings().removeClass('select-tab');
		$(this).addClass('select-tab');
	});

	//活动列表tab
	$(document).on('click', '.active-tab a.tab', function () {
		$(this).closest('.active-tab').find('a.tab').removeClass('selected');
		$(this).addClass('selected');
	});

	//多选框
	$(document).on('click', '.checkbox', function () {
		if ($(this).hasClass('disable') || $(this).hasClass('disable-checked')) {
			return false;
		};
		if ($(this).hasClass('checkbox-checked')) {
			$(this).removeClass('checkbox-checked');
			if ($(this).parent().hasClass('selectColor')) {
				$(this).next().removeClass('checkColor');
			};
		} else {
			$(this).addClass('checkbox-checked');
			if ($(this).parent().hasClass('selectColor')) {
				$(this).next().addClass('checkColor');
			};
		}
	})

	//radio
	$(document).on('click', '.radio', function () {
		if ($(this).hasClass('disable') || $(this).hasClass('radio-disable')) {
			return false;
		} else {
			var name = $(this).attr('name');
			$('[name="' + name + '"]').removeClass('radio-selected');
			$(this).addClass('radio-selected');
		} 
	});
	//选择框文字点击
	$(document).on('click', '.prevCheck', function () {
		$(this).prev().click();
	});

	//选择商品-table列表选中
	$(document).on('click', '.item-list td a.checkbox', function () {
		if ($(this).hasClass('checkbox-checked') && !$(this).parents('tr').hasClass('has-joined')) {
			$(this).closest('tr').addClass('item-selected');
		} else {
			$(this).closest('tr').removeClass('item-selected');
		}
	});

	//下拉页码-下拉
	$(document).on('click', '.dropDownPages .page-box',function () {
		var pageList = $(this).parent().find('.page-list');

		if (pageList.is(":hidden")) {
			var size = (pageList.find('.selected').prevAll().length - 4) * 28;
			pageList.show().scrollTop(size);
		} else { 
			pageList.hide();
		}
		if ($(this).find('.page-list').mCustomScrollbar) {
			$(this).find('.page-list').mCustomScrollbar({mouseWheel: {preventDefault:true}});
		};
	})


	//点击其他地方隐藏
	$(document).on('click', function (e) {
		var _this = $(e.target);
		//select-option隐藏
		if ( _this.parents('div.select').length == 0 ) {
			$('.select .option').hide();
		};

		//.pl-search 隐藏
		if ( _this.parents('.search').length == 0) {
			$('.search .pl-search').hide();
		};

		//下拉页码隐藏
		if (_this.parents('.dropDownPages').length == 0 ) {
			$('.page-list').hide();
		};

		if (_this.parents('.select').length == 0) {
			$('.select').removeClass('open')
		}

		//下拉活动名称选择控件
		/*if (_this.closest('.active_name_select').length == 0) {
			$('.active_name_select').removeClass('selected');
		};*/

		if (_this.parents('.searchAppname').length == 0) {
			$('.searchAppname input').removeClass('focus').attr('placeholder', '搜功能')
			$('.searchAppname .search_appnames').hide();
		}
	})

	//块级提示框删除 --start 
	$(document).on('click', '.Infotip.Infotip-block .info-close', function() {
		$(this).parents('.Infotip').remove();
	});
	//搜索框显隐 --s
	$(document).on('focus', '.search input', function () {
		var pl_search = $(this).parent().find('.pl-search');
		if (pl_search.length != 0) {
			pl_search.fadeIn(300);
		};
	});

	$(document).on('keyup', '.search input', function () {
		var textarea = $(this).parents('.search').find('textarea');
		if (textarea.length != 0) {
			textarea.val($(this).val()).removeClass('placeholder').css('color','#666');
		};
	})

	$(document).on('keyup', '.pl-search textarea', function () {
		$(this).parents('.search').find('input').removeClass('placeholder').css('color','#666').val($(this).val());
	});

	$(document).on('keyup', '.tabSearch input', function () {
		var textarea = $(this).parents('.tabSearch').find('textarea');
		if (textarea.length != 0) {
			textarea.val($(this).val()).removeClass('placeholder').css('color','#666');
		};
	})

	$(document).on('keyup', '.pl_search_new textarea', function () {
		$(this).parents('.tabSearch').find('input').removeClass('placeholder').css('color','#666').val($(this).val());
	});

	$(document).on('click', function (e) {
		if ($(e.target).parents('.search').length == 0) {
			$('.pl-search').hide();
		};	
	});
	//搜索框显隐 --s
	
	//12-29 滑动开关
	$(document).on('click', '.slide-button', function () {
		if ($(this).hasClass('open')) {
			$(this).removeClass('open');
			$(this).children('span').html('已关闭');
			$(this).closest('.info-table').prev('.tips').children('.key').removeClass('open');
		} else {
			$(this).addClass('open');
			$(this).children('span').html('已开启');
			$(this).closest('.info-table').prev('.tips').children('.key').addClass('open');
		}
	});

	//商品sku hover显示
	$(document).on('mouseover', 'td span.sku, .word-text .sku', function () {
		$(this).siblings('.yuanjia').show();
	})
	$(document).on('mouseleave', 'td .word-text.cy, .word-text.cy', function () {
		$(this).find('.yuanjia').hide();
	})

	//* 叹号 错误提示 --e */
	$(document).on('mouseover', '.promptIconAfter', function () {
		var promptBox = $(this).find('.promptBox');
		promptBox.css('marginLeft', '-'+ (promptBox.outerWidth()/2 - 8)  +'px');
	});

	//存在可浮顶部的dom
	if ($('.goodTableHeader').length > 0) {
		var _tabHead = {
			head: $('.goodTableHeader'),
			t: $('.goodTableHeader').offset().top,
			h: parseFloat($('.goodTableHeader').outerHeight()) + 10,
			head_p: $('.goodTableHeader').parent(),
		}
	    //滚动条滚动
	    $(window).scroll(function () {
	    	var _this = _tabHead;
	        var t = $(this).scrollTop();
	    	if (t > _this.t) {
				_tabHead.head.addClass('fixed');
				_this.head_p.css('paddingTop',_this.h+'px');
	    	} else {
				_tabHead.head.removeClass('fixed');
				_this.head_p.css('paddingTop','0');
	    	}
	    });
	};

	if ($('.scrollBar-init-y').length && $('.scrollBar-init-y').mCustomScrollbar) {
		$('.scrollBar-init-y').mCustomScrollbar({mouseWheel: {preventDefault:true},scrollbarPosition: 'outside'});
	};

	// header搜索
	$(document).on('focus', '.searchAppname input', function(){
		$(this).addClass('focus').attr('placeholder', '请输入你想搜索的功能')
		if(Trim($('.searchAppname input').val())) {
			$('.searchAppname .search_appnames').show()
		}
	})
	$(document).on('click', '.searchAppname > a', function(){
		var inputval = Trim($('.searchAppname input').val())
		if(inputval) {
			$('.searchAppname input').addClass('focus')
			$('.searchAppname .search_appnames').show()
			$('.searchAppname .appnames_tit').html('搜索“'+inputval+'”结果')
			searchAppname()
		}
	})
	// header回车搜索
    $('.searchAppname input').bind('keyup', function (e) {　　
        if (e.keyCode == "13") {
            $('.searchAppname > a').click();　　
        }
    });
	$(document).on('click', '.header-bg-new .appnames_bot', function () {
		$('#scrollbar_new .suggest').click()
	})

	//页面初始化
	initialization();
});

// 获取用户信息
function getUserInfo() {
	if (localStorage.PDD_userinfo) {
		var info = JSON.parse(localStorage.PDD_userinfo)
		// 缓存一天
		if (Date.now() - info.timestamp > 86400000) {
			localStorage.removeItem('PDD_userinfo')
		} else {
			$('.Uname > font, .Uname .user-name').html(info.mall_name)
			$('.Uname .user-photo img').attr('src', info.logo)
			return false;
		}
	}
	$.ajax({
		url: HN_APP + "Shop/Info/getShopInfo",
		type: "POST",
		dataType: "json",
		data: {},
		success: function (res) {
			if (res.status == 800) {
				$('.Uname > font, .Uname .user-name').html(res.data.mall_name)
				$('.Uname .user-photo img').attr('src', res.data.logo)
				var info_ = {
					logo: res.data.logo,
					mall_name: res.data.mall_name,
					timestamp: Date.now()
				}
				localStorage.setItem('PDD_userinfo', JSON.stringify(info_))
			} else {
				console.log("用户信息获取失败")
			}
		},
		error: function (res) { 
			console.log("用户信息获取失败")
		}
	})
}

// 编辑按钮获取链接
function getCommitId(num_iid) {
	$.ajax({
		url: HN_APP + "/GoodsManage/Index/getCommitId",
		data: { num_iid: num_iid },
		type: 'POST',
		async: false,
		dataType: 'json',
		success: function (res) {
			if (res.status == 800 && res.data) {
				window.open(res.data);
			}
		}
	})
}

// 验证手机号格式
function testingFormat (phone) {
	if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){
        return true; 
	} 
	return false;
}



function initialization () {
	//-----.active-tab 右边数字为空时，隐藏font
	var active_tab_font = $('.active-tab .tab font');
	if (active_tab_font.length != 0) {
		$.each(active_tab_font, function () {
			if ($(this).text() == '') {
				$(this).hide();
			};
		});
	};
	
	//下拉框初始化
	selectInit();

	//value提示显隐
	placeholder();

	//公告轮播【公告是ajax技术调】
	//noticeCarousel(5000);

}

//下拉框初始化
function selectInit() {
	$('div.select').each(function() {
		var w,t='';
		w = $(this).width();
		var option = $(this).children('.option');

		if (!option.hasClass('blockOption')) {
			option.css('minWidth', w + 'px');
		};
		w -= 37;
		if ($(this).hasClass('super-small')) {
			w = 28;
		}
		$(this).children('.text').css('width', w - 1 + 'px');
		if (option.find('span').hasClass('selected')) {
			if (option.find('.selected .span').length > 0){
				t = option.find('.selected .span').text();
			}else {
				t = option.find('.selected').text();
			}
		}

		if ( !!t && t !='' ) {
			$(this).children('.text').prop('value', t);
		};

	});	
}

/* 弹窗 */
function PopUp(pclass, tclass) {
	$(function () {
		if (tclass) {
			$(tclass).click(function() {
				$(pclass).show();
				$(pclass).parent('.second-tc').show();
				$(pclass).prev('.second-ceng').show();
				$('#mask').fadeIn(300);
				center();
				bindOnce();
			});
			if (tclass == '1' && $(pclass).length != 0) {
				$(pclass).show();
				$(pclass).parent('.second-tc').show();
				$(pclass).prev('.second-ceng').show();
				$('#mask').show();
				center();
				bindOnce();
				// _RecoHnUserUIOp($(pclass).text());
			}

		}

		function center() {
			var left = (parseInt($(window).width()) - parseInt($(pclass).css('width'))) / 2;
			var top = (parseInt($(window).height()) - parseInt($(pclass).height())) / 2;
			$(pclass).css({
				'top': top + 'px',
				'left': left + 'px'
			});
		}

		function bindOnce () {
			if(!$(pclass).hasClass('pop-second-box')){
				$(pclass).children('.pop-head').children('.close').one('click', function() {
					//当前弹窗 
					var pop = $(this).closest('.pop-up-box');
					if (pop.attr('data-numberOfPop') == 1) { 
						var pre = pop.prev();
						pop.attr('data-numberOfPop','0');
						pop.hide();
						pre.removeClass('pop_upper_layer');
						return;
					} else {
						$('.pop-up-box').removeClass('pop_upper_layer');
					}

					$(this).closest('#mask').fadeOut(300);
					setTimeout(function() {
						$('.pop-up-box').hide();
					}, 300);
					
				});
			}
			else{
				$(pclass).children('.pop-head').children('.close').one('click', function() {
					if (!$(this).hasClass('close2')) {
						$(this).closest('.second-tc').fadeOut(300);
						setTimeout(function() {
							$('.second-tc').hide();
						}, 300);
					}
					
				});
			}

			$(pclass).children('.pop-foot').find('.cancel').one('click', function() {
				$(pclass).children('.pop-head').children('.close').click();
			});
		}
	});
}

/**
 * [numberOfPop 多级弹窗]
 * @param  {[type]} str1 [要弹出的弹窗class]
 * @param  {[type]} arr  [下层弹窗的class数组]
 * 调用例：numberOfPop('.pop-up-smyl',['.pop-up-selectHref','.pop-uo-seletImg']);
 */
function numberOfPop(str1,arr) {
	var list = $('#mask .mask-bg > .list');
	$.each(arr, function (item) {
		var dom = $(arr[item]);
		dom.addClass('pop_upper_layer');
		if (dom.find('.pop_upper_layer_cen').length == 0) {
			dom.append('<div class="pop_upper_layer_cen"></div>');
		};
		list.append(dom);
	});
	list.append($(str1));
	$(str1).attr('data-numberOfPop','1');
	PopUp(str1, '1')
}

/* 关闭弹窗 */
function PopUpClose() {
	$('#mask').fadeOut(300);
	setTimeout(function() {
		$('.pop-up-box').hide();
	}, 300);
}

/* 成功失败tip提示 */
function popUpHint(str1, txt, str2, moduleType) {
	PopUp(str1, '1');
	var hint = $(str1).find('.pop-body .hint');
	hint.removeClass('hint-success hint-fail');
	if (txt == undefined) {
		txt = '##';
	}
	var info = txt.split('##');
	var _str = info[0];//展示信息
	var _str1 = info[1] ? info[1] : info[0];//统计需要传递信息
	
	if (str2 == 0)//失败
	{
		//过滤关键词
		_str = OptimizeMsgStr(_str);
	}
	hint.html('<div class="hint-con"><span></span></div>')
	hint.find('span').html(_str);
	if (str2 == 1) {
		hint.addClass('hint-success');
	} else if (str2 == 0) {
		hint.addClass('hint-fail');		
	}
	//_RecoHnUserUIOp(_str);

	//记录弹窗日志
	var _type = str2 == 1 ? '成功' : str2 == 0 ? '失败' : '提示';
	var words = moduleType ? moduleType : '';
	if (_str1 != '') {
		var logObj = {
			content: words + _str1,      // 内容
	        type:_type,
		}
	}
}

/* 弹出浮层提示 */
function iconPopHint(str,n,t) {

	var _type = '';
	var succPop = $('<div class="Infotip Infotip-big"><div class="tip-con"><span>' + str + '</span></div></div>');
	
	if(n==2 || n==0)
	{
		//过滤关键词
		str = OptimizeMsgStr(str);
	}
	
	switch(n) {
		case 0: //警示
			succPop.addClass('Infotip-warning');
			_type = '提示';
		break;
		case 1: //成功
			_type = '成功';
			succPop.addClass('Infotip-success');      
		break;
		case 2: //错误
			_type = '失败';
			succPop.addClass('Infotip-error');      
		break;
	}

	$('body').append(succPop);

	var w = succPop.outerWidth(),
		h = succPop.outerHeight(),
		marL;


	if (!($('#mask').css('display') == 'none') || $('#left > #nav').length == 0) {
		marL = -w / 2 + 'px';
	} else { 
		marL = (-w / 2 + 97) + 'px';
	}	

	succPop.css({
		'position': 'fixed',
		'top': '50%',
		'left': '50%',
		'zIndex': 1000,
		'marginLeft': marL,
		'marginTop': -h / 2 + 'px',
		'opacity': 0,
	});
	var words = t != Number(t) && t !== undefined ? t : '';
	if (t && t == Number(t)) {
		var t = t;
	}else {
		var t = 1500;
	}

	succPop.animate({
		'opacity': 1,
	}, 300, function() {
		setTimeout(function() {
			succPop.animate({
				'opacity': 0,
			}, 300, function() {
				succPop.remove();
			});
		}, t);
	});
}

/* 弹出失败浮层提示 */
function InfoIconPop(str, mokuai) {
	
	var newstr = OptimizeMsgStr(str);
	
	iconPopHint(newstr,0, mokuai);
}
/* 弹出成功浮层提示 */
function succIconPop(str, mokuai) {
	iconPopHint(str,1, mokuai);
}

/* value提示显隐 */
function placeholder() {
	var inputPlaceholder = $('.placeholder');
	$.each(inputPlaceholder, function(item) {
		var intval = $(this).val(),
			intcolor = $(this).css('color');

		$(this).on({
			focus: function() {
				var val = $(this).val();
				if (val == intval) {
					$(this).val('').css('color', '#666');
				};
			},
			blur: function() {
				var val = $(this).val();
				if (val == '') {
					$(this).val(intval).css('color', intcolor);
				};
			}
		});
	})
}

/* 新版-包邮弹窗-选择操作-通用 */
function checkMailArea() {
	var popMailArea = {
		body: $('.pop-up-mailArea .pop-body'),
		save: $('.pop-up-mailArea .pop-foot .save'),
	}

	popMailArea.formList = popMailArea.body.find('.pop-form-list');
	popMailArea.mailArea = popMailArea.body.find('.mailArea');
	popMailArea.checkbox = popMailArea.mailArea.find('.checkbox');
	popMailArea.dtCheckbox = popMailArea.mailArea.find('dt .checkbox');
	popMailArea.ddCheckbox = popMailArea.mailArea.find('dd .checkbox');

	//全选
	popMailArea.formList.find('.b0').click(function() {
		popMailArea.checkbox.addClass('checkbox-checked');
	});

	//清空
	popMailArea.formList.find('.b1').click(function() {
		popMailArea.checkbox.removeClass('checkbox-checked');
	});

	//反选
	popMailArea.formList.find('.b2').click(function() {
		popMailArea.ddCheckbox.click();
	});

	//常用偏远地区
	popMailArea.formList.find('.b3').click(function() {
		popMailArea.mailArea.find('.a1, .a2, .c6, .h1, .h2, .h4, .i1, .i2, .i3, .j1').removeClass('checkbox-checked').click();
	});

	//江浙泸
	popMailArea.formList.find('.b4').click(function() {
		popMailArea.mailArea.find('.d1, .d2, .d4').removeClass('checkbox-checked').click();
	});

	//区域选择
	popMailArea.dtCheckbox.click(function() {
		var ddcheck = $(this).parents('dl').find('dd .checkbox');
		if (!$(this).hasClass('checkbox-checked')) {
			ddcheck.addClass('checkbox-checked');
		} else {
			ddcheck.removeClass('checkbox-checked');
		}
	});

	//城市选择
	popMailArea.ddCheckbox.click(function() {
		var dtCheckbox = $(this).parents('dl').find('dt .checkbox');
		var checkLen = $(this).parents('dd').find('.checkbox').length-1;
		var checkedLen = $(this).parent().siblings().find('.checkbox-checked').length;

		if (checkLen == checkedLen && !$(this).hasClass('checkbox-checked')) {
			dtCheckbox.addClass('checkbox-checked');
		} else {
			dtCheckbox.removeClass('checkbox-checked');
		}
	});
}

/* 包邮弹窗-清空选择 */
function clearMailArea() {
	$('.pop-up-mailArea a.checkbox.checkbox-checked').removeClass('checkbox-checked');
}

/**
 * [公告轮播]
 * @param  {[type]} time [轮播间隔]
 */
 function noticeCarousel(time) {
	var notice = $('.body_notice'); 
	var notice_li_l = notice.find('li').length;

	if (notice.length != 0 && notice_li_l > 1) {
		new Carousel(notice,time,'top');
	};
}

/**
 * [轮播]
 * @param  {[type]} obj    [轮播最外层节点]
 * @param  {[type]} time   [轮播间隔]
 * @param  {[type]} aspect ['top'下到上、'left'右到左]
 */
function Carousel(obj,time,aspect) {
	var list = obj.find('.carousel_list');
	var list_li = list.find('li');
	var li_l = list_li.length;
	var number = 0;
	if (li_l <= 1) {
		return;
	};

	var timer;
	var btn = obj.find('.carousel_btn li');
	var btn_l = btn.length;

	if (aspect == 'top') {
		var ul_size = list.height();
		var li_size = list_li.height();
	} else {
		var ul_size = list.width();
		var li_size = list_li.width();
	}
	list.append(list_li.eq(0).clone());

	function autoCarousel(obj,time,li_size,ul_size,aspect) {
		timer = setTimeout(function () {
			number++;

			number >= li_l ? number = 0 : number = number;

			if (btn_l != 0) {
				btn.removeClass('selected').eq(number).addClass('selected');
			};

			if (aspect == 'top') {
				var asp = parseInt(obj.css('top'))-li_size;
				obj.animate({
					'top':asp,
				},'slow', function () {
					if (asp <= -(ul_size)) {
						number = 0;
						obj.css(aspect,0)
					};
				});
			} else {
				var asp = parseInt(obj.css('left'))-li_size;
				obj.animate({
					'left':asp,
				},'slow', function () {
					if (asp <= -(ul_size)) {
						number = 0;
						obj.css(aspect,0)
					};
				});
			}
			
			autoCarousel(list,time,li_size,ul_size,aspect);
		},time);
	}
	autoCarousel(list,time,li_size,ul_size,aspect);

	if (btn_l != 0) {
		
		obj.on({
			'mouseenter' : function () {
				clearTimeout(timer);
			},
			'mouseleave' : function () {
				autoCarousel(list,time,li_size,ul_size,aspect);
			}
		});
		
		btn.each(function (item) {
			$(this).on('mouseover', function () {
				number = item;
				btn.removeClass('selected').eq(item).addClass('selected');
				if (aspect == 'top') {
					list.stop().animate({
						'top': -item*li_size+'px',
					},'slow');
				} else {
					list.stop().animate({
						'left': -item*li_size+'px',
					},'slow');
				}
				
			});
		});
		
	};
}
/*全屏loading函数 -s*/
// 刘孝松
function full_loading(e){
	if(e==1){
		if($('.full-loading').length){
			$('.full-loading').show();
		}else{
			$('body').append('<div class="full-loading" style="display:block"><i></i><div class="bg"></div></div>');
		}
	}
	else if(e==0){
		$('.full-loading').hide();
	}
}
/*全屏loading函数 -e*/
//对提示内容中的英文字符串进行优化处理
function OptimizeMsgStr(str) {
	if (!str) {
		return '';
	}
	var newstr = str;
	
	if(str.indexOf("isv.activity-title-tag-error") > 0)
	{
		newstr = str.replace(/isv.activity-title-tag-error/, "活动标题不符合官方要求-请修改");
	}
	else if(str.indexOf("nvalid session") > 0 || str.indexOf("level:W2 security") > 0 )
	{
		newstr = "授权失效:请点页面右上角授权按钮,授权后再操作.";
	}
	else if(str.indexOf("detail count exceeds max limit") > 0 )
	{
		newstr = "当前活动中宝贝超过最大数量限制,请创建一个新的活动添加宝贝";
	}
	else if(str.indexOf("无对应活动!") > 0 )
	{
		newstr = "活动已经不存在!请删除活动重新创建.";
	}
	else if(str.indexOf("无对应活动!") > 0 )
	{
		newstr = "活动已经不存在!请删除活动重新创建.";
	}
	else if(str.indexOf("isv.detail-not-exist所查记录status=-1,不存在!不允许更新") > 0 )
	{
		newstr = str.replace(/isv.detail-not-exist所查记录status=-1,不存在!不允许更新/, "宝贝已不在此活动中,请从活动中删除该宝贝,再重新加入活动");
	}
	else if (str.indexOf("activity count exceeds max limit.") >= 0)
	{
		newstr = "进行中的活动数量超过最大限制!";
	}
	
	return newstr;
}

//default.js
//打开用浏览器打开
function open_url(url, apiNeed){
	if(HN_FROMSTATE == 'webpc'){
		window.open(url);
	}else{
        apiNeed = apiNeed || false;

        if (apiNeed || HN_APPNAME == 'hnItem') {
            location.href = url;
        } else { // 强制 打开新页面
            QN.application.invoke({
                cmd: 'browserUrl',
                param:{'url':url},
                error: function (msg, cmd, param) {
                    //console.log(msg);
                },
                success: function (rsp, cmd, param) {
                    //console.log(rsp);
                }
            });
        }
    }
}
/** 打开本地页面 */
function open_url_local(url, apiNeed)
{
    // 加上域名个目录
    // url = HN_PROJECT_URL.substring(0, HN_PROJECT_URL.lastIndexOf('/')) + url;
    url = HN_PROJECT_HOST + url;
    open_url(url, apiNeed);
}

//获取用户反馈信息的总数
function feedback(){

	var html = "";

	//火牛WEB  webHuoniu
	var Huoniu = ["促销","商品","评价","打印","售后","会员","素材","工具箱","其它"];
	//宝折促销 hnPlugin
	var Plugin = ["促销","优惠券","会员","素材"];
	//火牛商品  hnItem
	var Item = ["商品管理","自动上架","自动橱窗","店群管理","手机详情","自动补库存","批量修改","主图视频","备份宝贝","复制宝贝","装修素材"];
	//火牛交易  hnTrade
	var Trade = ["交易管理","打印发货","退款管理","自动评价","手工评价","差评拦截","中差评管理","短信营销","会员关怀"];

	if(HN_APPNAME == "webHuoniu"){//火牛web
		for (var i = 0; i < Huoniu.length; i++) {
			html +='<span>'+Huoniu[i]+'</span>'; 
		}
	}else if(HN_APPNAME == "hnPlugin"){//火牛宝折
		for (var i = 0; i < Plugin.length; i++) {
			html +='<span>'+Plugin[i]+'</span>'; 
		}
	}else if(HN_APPNAME == "hnItem"){//火牛商品
		for (var i = 0; i < Item.length; i++) {
			html +='<span>'+Item[i]+'</span>'; 
		}
	}else if(HN_APPNAME == "hnTrade"){//火牛交易
		selectInit();
		for (var i = 0; i < Trade.length; i++) {
			html +='<span>'+Trade[i]+'</span>'; 
		}
	}
	$(".pop-suggest .option").append(html);

	$("#scrollbar_new .suggest i").html('');
	$.ajax({
		url:HN_APP + "Index/Index/app_suggest_message",
		type:"POST",
		dataType:"json",
		data:{},
		success:function(res){
			if(res.status == 800){
				if(parseInt(res.data.count) == 0 || res.data.count == null){
					jyhf_sm = 0;
					$("#scrollbar_new .suggest font").css("display","none");
					$("#scrollbar_new .suggest i").html(res.data.count);
				} else {
					jyhf_sm = res.data.count;
					$("#scrollbar_new .suggest font").css("display","block");
					$("#scrollbar_new .suggest i").html(res.data.count);
				}
				if(res.data.group != '') {
					//底部
					$('.footer-bg .group .test font').html('火牛电商资源圈旺旺群号：'+res.data.group);
					$('.footer-bg .group .test a').attr('href', 'https://alimarket.taobao.com/markets/qnww/wbtx?uid=&tribeid='+res.data.group);

					//右侧
					$('#scrollbar_new .hb.promptHover .topBox span font').html(res.data.group);
					var str = '<img src="https://img.alicdn.com/tps/i4/T1fdykXgtiXXXXXXXX-63-20.gif" onclick="window.open(\'https://alimarket.taobao.com/markets/qnww/wbtx?uid=&amp;tribeid='+res.data.group+'\')">';
					$('#scrollbar_new .hb.promptHover .topBox p img').remove();
					// $('#scrollbar_new .hb.promptHover .topBox p span').after(str);
				}
			} else {
				$("#scrollbar_new .suggest font").css("display","none");
				$("#scrollbar_new .suggest i").html('0');
			}
		},
		error:function(res){
			$("#scrollbar_new .suggest font").css("display","none");
			$("#scrollbar_new .suggest i").html('0');
		}
	})
}

// 切换提交建议弹窗内容
function switch_cont(){
    if(data == 'submit-suggest'){
    	$(".pop-suggest .shippong-but").css("display","none");
    	$("#suggest .tab").eq(0).addClass("selected");
    	$("#suggest .tab").eq(1).removeClass("selected");
    	$('.pop-suggest .tabBlock').eq(0).addClass('selected');
    	$('.pop-suggest .tabBlock').eq(1).removeClass('selected');
    }else{
    	$(".pop-suggest .shippong-but").css("display","block");
    	$("#suggest .tab").eq(0).removeClass("selected");
    	$("#suggest .tab").eq(1).addClass("selected");
    	$('.pop-suggest .tabBlock').eq(0).removeClass('selected');
    	$('.pop-suggest .tabBlock').eq(1).addClass('selected');
    	//get_advise_reply(1);
    	$("#scrollbar_new .suggest font").css("display","none");
		$("#scrollbar_new .suggest i").html(0);
    }	
}

// 限制建议输入特殊字符
function testing_text() {
	var text_content = $("#suggestval").val();	
	var text_length = $("#suggestval").val().length;
	if(text_length < 2000){
		text_content = text_content.replace(/[\\`,\\~,\\!,\\@,\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\/,\\?,\\|,\\:,\\<,\\>,\\{,\\},\\(,\\),\\',\\;,\"]/g,'');
	}else{
		text_content = text_content.substring(0,2000);
	}
	suggest_content = text_content;
	$("#suggestval").val(text_content);
}

//提交建议到后台
function postsuggest(){
	var proposal = $('#suggestval').val();//建议内容
	if(proposal == '请输入建议' || proposal == ''){
		iconPopHint('内容不能为空!', 2);
		return false;
	}
	var the_type = $(".choice .text").val();//类型
	if($(".choice .text").val() == "选择类型"){
		the_type = "";
	}
	var contact_way = $("#phone-code").val();//联系方式
	if($("#phone-code").val() == "" || $("#phone-code").val() == "请输入联系方式"){
		contact_way = "";
	}
	var data = {
		'menus' : the_type,
		'question' : proposal,
		'contact' : contact_way,
	}
	$.ajax({
		type:'POST',
		url:HN_APP + "Index/Index/app_suggest_save",
		data:data,
		success:function(res){
			$('.pop-suggest .pop-head .close').click();
			if(res.status == 800){
				iconPopHint('提交成功', 1);
				$('#suggestval').val("");
				$("#phone-code").val("");
				suggest_content = "";
			} else {
				iconPopHint(res.info, 0);
				$('#suggestval').val(suggest_content);
			}
		},
		error:function(res){
			iconPopHint('提交失败', 0);
		}
	});
}

// 获取建议回复
function get_advise_reply(npage){
	$.ajax({
		type:"POST",		
		url:HN_APP + "Index/Index/app_suggest_list",
		data:{page : npage},
		success:function(res){
			if(res.status == 800){
				var allpage = res.data.page;
				make_page_list_new(npage, allpage, 'get_advise_reply', 'PageShowBox');//页码				
				advise_mosaic(res.data);
			} else {
				var msj = '<div class="newNotFound newNotFound-6 list-null"><div class="inline-block clearfix"><div class="img"></div><div class="txt">没有相关数据</div></div></div>';
				$(".pop-suggest .jyhfq .form-list-1").html(msj);
			}
		},
		error:function(res){
			iconPopHint('获取失败', 0);
		}
	})
}

// 建议回复拼接
function advise_mosaic(list){
	var advise_list = list.rows;
	var html = '';
	$(".form-list-1").html();
	for(var i = 0; i < advise_list.length; i++){
		html +='<li class="row situation">'+
                    '<div class="jy clearfix"><span>建议</span><p>'+advise_list[i].question+'</p></div>'+
                    '<span class="jy-time">'+advise_list[i].q_time+'</span>'+
                    '<div class="hf clearfix"><span>回复</span><p>'+advise_list[i].answers+'</p></div>';
                    if(advise_list[i].status == "已采纳"){
                    	html += '<img src= "'+HN_PRODUCT_OSS+'/Public/image/yjycn.png" class="cn-img"/>';
                    }
        html += '</li>';
	}
	$(".form-list-1").html(html);
	$('.pop-suggest .form-list-1').mCustomScrollbar({
		scrollInertia: 0,
		mouseWheel : {preventDefault : true}
	})
}

// 提示信息固定大小
function showmsg(info) {
	iconPopHint(info, 0);
}

// 计算两个时间差
function getdifftime(stime, btime) {
	var regEx = new RegExp("\\-", "gi");
	var a = stime.replace(regEx, "/");
	var b = btime.replace(regEx, "/");
	a = a.toString();
	b = b.toString();
	var starttime = new Date(a);
	var starttimes = starttime.getTime();
	var lktime = new Date(b);
	var lktimes = lktime.getTime();
	var date3;
	if (lktimes > starttimes) {
		date3 = lktimes - starttimes;
	} else {
		date3 = starttimes - lktimes;
	}
	var days = Math.floor(date3 / (24 * 3600 * 1000));
	var leave1 = date3 % (24 * 3600 * 1000);
	var hours = Math.floor(leave1 / (3600 * 1000));
	var leave2 = leave1 % (3600 * 1000);
	var minutes = Math.floor(leave2 / (60 * 1000));
	var timarr = [];
	timarr['days'] = days;
	timarr['hours'] = hours;
	timarr['minutes'] = minutes;
	return timarr;
}
// 判断时间大小函数 return true
function compareTime(startDate, endDate) {
	if (startDate.length > 0 && endDate.length > 0) {
		var regEx = new RegExp("\\-", "gi");
		startDate = startDate.replace(regEx, "/");
		endDate = endDate.replace(regEx, "/");
		startDate = startDate.toString();
		endDate = endDate.toString();
		var starttime = new Date(startDate);
		var starttimes = starttime.getTime();
		var lktime = new Date(endDate);
		var lktimes = lktime.getTime();
		var date3 = lktimes - starttimes;
		if (date3 <= 0) {// 开始时间大于结束时间
			return '开始时间不能大于结束时间';
		} else {
			return true;
		}
	} else {
		return '时间不合法';
	}
}
// 给xxxx-xx-xx xx:xx:xx 获取年、月、日  少部分文件使用了
function getymd(time) {
	var regEx = new RegExp("\\-", "gi");
	var m = time.replace(regEx, "/");
	m = m.toString();
	// alert(m);
	var lktime = new Date(m);
	var year = lktime.getFullYear();
	// alert(year);
	var days = lktime.getDate();
	if (days < 10) {
		days = "0" + days;
	}
	var month = lktime.getMonth() + 1;
	var hour = lktime.getHours();
	var min = lktime.getMinutes();
	var second = lktime.getSeconds();
	var timearr = [];
	timearr['days'] = days;
	timearr['month'] = month;
	timearr['year'] = year;
	timearr['hour'] = hour;
	timearr['min'] = min;
	timearr['second'] = second;
	return timearr;
}

/*
 * 生成页码 1， pagenum 当前页数 1 2， pagecount 总页数 10 3， funcname 点击页码需要调用的方法名(callback)
 * SendPageTaguserLsit; 4, showid 页码列表显示控件id 5， parges 其他参数 格式 'a,b'
 */
function make_page_list(pagenum, pagecount, funcname, showid, parges) {
    pagenum =parseInt(pagenum);
    pagecount =parseInt(pagecount);
	if (pagecount == 1) {
		$('#' + showid).html(" ").show();
		return;
	}

	if (parges == undefined) {
		parges = '';
	} else {
		parges = ',' + parges;
	}
	var pagestr = '<div class="for-align">';

	if (pagenum > 1) {
		if(parges == ''){
			// pagestr += '<a class="home" href="javascript:' + funcname + '(1);">首页</a>';
			pagestr += '<a class="prev" href="javascript:' + funcname + '('+ (pagenum - 1) +');"></a>';
		}else{
			pagestr += '<a class="home" href="javascript:' + funcname + '(1'
					+ parges + ');">首页</a>';
			pagestr += '<a class="prev" href="javascript:' + funcname + '('
					+ (pagenum - 1) + parges + ');"></a>';
		}

	}


	var diff = 3;//前后分别默认显示几个
	var beginidx = 1;//默认开始页
	var endidx = diff*2+beginidx;//默认结束

	beginidx = pagenum-diff;
	beginidx  = beginidx < 1 ? 1 : beginidx;
	endidx = pagenum+diff;
	
	if(pagenum <= diff)	endidx += (diff+1)-pagenum;//补后面
	
	if(endidx > pagecount){//补前面
		beginidx -= endidx - pagecount;
		beginidx = beginidx < 1 ? 1 : beginidx;
		endidx = pagecount;
	}

	if (beginidx > 1)
		pagestr += '<a class="dot"></a>';

	for ( var i = beginidx; i <= endidx; i++) {
		var cls = " class= 'page' ";
		if (i == pagenum) {
			cls = "class= 'page active-page' ";
		}
		pagestr += '<a ' + cls + ' href="javascript:' + funcname + '(' + i
				+ parges + ');">' + i + '</a>';
	}

	if (endidx < pagecount)
		pagestr += '<a class="dot"></a>';

	if (pagenum < pagecount) {
		pagestr += '<a class="next" href="javascript:' + funcname + '('
				+ (pagenum + 1) + parges + ');"></a>';
	}

	if (pagecount > 0) {
		pagestr += "<span>到</span><input type='text' class='jumppage_now' value='' /><span>页</span><a class='ok' href='javascript:void(0)'>跳转</a>";
		pagestr += '<span class="sum" style="">共<font>' + pagecount
				+ '</font>页</span>';
	}

	pagestr += '</div>';

	$('#' + showid).html(pagestr).show();

	$('.ok').unbind('click').bind('click', function() {
		var jumppagenow = $(this).siblings('input.jumppage_now').val();
		if($.trim(jumppagenow) == ''){
			InfoIconPop('要跳转的页码不能为空', 0);
			return false;
		}
        jumppagenow = parseFloat(jumppagenow);

        if( isNaN(jumppagenow) || jumppagenow <= 0){
            InfoIconPop('请输入正确的跳转页码', 0);
            return false;
        }

        if(jumppagenow != parseInt(jumppagenow)){
            InfoIconPop('跳转页码只能为整数', 0);
            return false;
        }

		if (jumppagenow > pagecount) {
			eval(funcname + '(' + pagecount + parges+')');
		} else {
			eval(funcname + '(' + jumppagenow + parges+')');
		}
	});
}

/*
	1， pagenum 当前页数 1
	2，	pagecount 总页数 10
	3， funcname 需要调用的方法名 SendPageTaguserLsit;
	4,  showid 页码列表显示控件id
	5， parges 其他参数 格式 'a,b'
*/
function make_page_list_new(pagenum,pagecount,funcname,showid,parges){
	pagenum =parseInt(pagenum);
    pagecount =parseInt(pagecount);
    if(pagecount < 1){
    	$('#'+showid).html('').hide();
    }else{
    	$('#'+showid).show();
    }
	if (parges == undefined) { parges = ''; }else {parges = ','+ parges; }
	var pagestr = "",spa,size;
	if(pagenum > 1){
		pagestr += '<a class="prev" href="javascript:'+funcname+'('+(pagenum-1)+parges+')">&lt;</a>';
	}else{
		pagestr += '<a class="prev" href="javascript:void(0)">&lt;</a>';
	}

	pagestr +='<div class="page-box">';
	pagestr +='<div class="this-page"><span>第<font>'+pagenum+'</font>页</span></div>';
	pagestr +='<div class="page-list">';
	for(spa = 1;spa<=pagecount;spa++){
		if(spa != pagenum){
			pagestr +='<span onclick="'+funcname+'('+spa+')">第<font>'+spa+'</font>页</span>';
		}else{
			pagestr +='<span class="selected" onclick="'+funcname+'('+pagenum+')">第<font>'+spa+'</font>页</span>';
		}
	}
	pagestr +='</div>';
	pagestr +='</div>';

	if(pagenum < pagecount){
		pagestr += '<a class="next" href="javascript:'+funcname+'('+(pagenum+1)+parges+')">&gt;</a>';
	}else{
		pagestr += '<a class="next" href="javascript:void(0)">&gt;</a>';
	}

	$('#'+showid).html(pagestr);
}

/*
1， pagenum 当前页数 1
2，	pagecount 总页数 10
3， funcname 需要调用的方法名 SendPageTaguserLsit;
4,  showid 页码列表显示控件id
5， parges 其他参数 格式 'a,b'
*/
function make_page_list_small(pagenum,pagecount,funcname,showid,parges){
	pagenum =parseInt(pagenum);
    pagecount =parseInt(pagecount);
    if(pagecount < 1){
    	$('#'+showid).html('');
    	return ;
    }else{
    	$('#'+showid).show();
    }
	if (parges == undefined) { parges = ''; }else {parges = ','+ parges; }
	var pagestr = "",spa,size;
	pagestr += '<div class="PageShowBox">';
	if(pagenum > 1){
		pagestr += '<a class="fy_left" href="javascript:'+funcname+'('+(pagenum-1)+parges+')"></a>'
	}else{
		pagestr += '<a class="fy_left disabled" href="javascript:void(0)"></a>'
	}
	pagestr += '<span class="ShowInfo"><font class="red">'+pagenum+'</font>/'+pagecount+'<font></font></span>';
	if(pagenum < pagecount){
		pagestr += '<a class="fy_right" href="javascript:'+funcname+'('+(pagenum+1)+parges+')"></a>';
	}else{
		pagestr += '<a class="fy_right disabled" href="javascript:void(0)"></a>';
	}
	pagestr +='</div>';
	pagestr +=' <div class="pop"><div class="pop-content">';
	for(spa = 1;spa<=pagecount;spa++){
		if(spa != pagenum){
			pagestr +='<a onclick="'+funcname+'('+spa+')">第<font>'+spa+'</font>页</a>';
		}else{
			pagestr +='<a class="selected" onclick="'+funcname+'('+pagenum+')">第<font>'+spa+'</font>页</a>';
		}
	}
	pagestr +='</div>';
	pagestr +='</div>';

	$('#'+showid).html(pagestr);
}

/*
 * 检测打折活动标题是否包含关键字
 * param 标题名字 ，return 包含关键字 or null
 */
function btcheck(str){
	var reg = /(双十一|双十二|满就送|满就减|限时打折|最低包邮价|新年抄底价|最低价包邮|限时折扣|聚划算|vip|淘金|淘币|金币|日你|分享价|垃圾桶|淘宝|天天特价|&|＆|\.|\~|\∧|\、|\！|\!|\/|\。|\，|\+|\,|\%|\-|\Ⅰ|\:|\：)/i;
	if(str.match(reg) != null){
		var res = [];
		 res = String(str.match(reg)).split(',');
		 return res[0];
	}else{
		return null;
	}
}

//调试  wanghonggang
function consoleval(testvalue){
	console.log(testvalue);
}

//去除字符串左侧的空格  Li dengliang
function LTrim(str){
	if (Object.prototype.toString.call(str) === '[object String]') {
		var i;
		for(i=0;i<str.length;i++){
			if(str.charAt(i)!=""&&str.charAt(i)!=" ")break;
		}
		str=str.substring(i,str.length);
	}
	return str;
}

//去除字符串右侧的空格  Li dengliang
function RTrim(str){
	if (Object.prototype.toString.call(str) === '[object String]') {
		var i;
		for(i=str.length-1;i>=0;i--){
			if(str.charAt(i)!=""&&str.charAt(i)!=" ")break;
		}
		str=str.substring(0,i+1);
	};
	return str;
}

//去除字符串两侧的空格  Li dengliang
function Trim(str){
	return LTrim(RTrim(str));
}
//过滤字符串中的script脚本
function stripscript(str){
	if(str == undefined){
		return '';
	}
	str = str+'';
	if(str.length <= 0){
    	return '';
	}
	
	// str = str.toLowerCase();
	if(str.indexOf('<script') >= 0 ){
		str =  str.replace(/<script.*?>.*?<\/script>/ig,'');
    	str =  str.replace(/<script.*?>/ig,'');
	}

	if(str.indexOf('</script>') >= 0){
		str = str.replace(/<\/script>/ig,'');
	}
	return str;
}
//将字符串中的空格，‘，,’替换成 应为逗号
function repalceComma(str){
	if(str == undefined){
		return '';
	}else {
		return $.trim(str).replace(/[，,\s\r\n]/g, ',');
	}
	
}

/**
 * 创建成功提示跳转倒计时
 * 跳转地址 url
 * @author dagang
 */
function CountDown(url){
	$(function(){
		var time=$('.attention-success .jump font').text();
		setTimeout(function(){
			if(time>0){
				time-=1;
				$('.attention-success .jump font').text(time);
				CountDown(url);
			}
			else{
				window.location.href=url;
			}
		},1000);
	});
}

/**
 * 按钮触发的等待动画(开启进度条)
 * 等待进度条的按钮class  buttonclass
 * @author dagang
 */
function ButtonWaitOn(buttonclass){
	$(function(){
		if($(buttonclass).children().children('img').length==0){
			var pic;
			var dom=$(buttonclass).children().html();
			var w=$(buttonclass).children().css('width');
			var h=$(buttonclass).css('height');
			var p=$(buttonclass).children().css('padding-right');
				$(buttonclass).children().css({'width':w,'height':h});
			var top=parseInt(h)/2-9;
			if($(buttonclass).hasClass('button-m-blue')||$(buttonclass).hasClass('button-l-blue')){
				pic='wait4.gif';
			}
			else if($(buttonclass).hasClass('button-m-red')||$(buttonclass).hasClass('button-l-red')){
				pic='wait5.gif';
			}
			else{
				pic='wait6.gif';
			}
			if($(buttonclass).hasClass('button-m')){
				$(buttonclass).attr('name',dom);
				var right=(parseInt(w)-18)/2+parseInt(p);
				dom='<img src="'+HN_PRODUCT_OSS+'/public/Public/image/'+pic+'" style="width:18px;height:18px;position:absolute;z-index:999;right:'+right+'px;top:'+top+'px"/>';
			}
			else if($(buttonclass).hasClass('button-l')){
				dom+='<img src="'+HN_PRODUCT_OSS+'/public/Public/image/'+pic+'" style="width:18px;height:18px;position:absolute;z-index:999;right:'+top+'px;top:'+top+'px"/>';
			}
			//console.log(dom);
			$(buttonclass).children().html(dom);
		}
	});
}
//取消进度条
function ButtonWaitOff(){
	$(function(){
		$('.button-m font img,.button-l font img').each(function(){
			if($(this).parent().parent().hasClass('button-m')){
				var dom=$(this).parent().parent().attr('name');
				$(this).parent().parent().attr('name',null);
				$(this).parent().html(dom);
			}
			else if($(this).parent().parent().hasClass('button-l')){
				$(this).remove();
			}
		});
	});
}
//记录UI上的交互操作
function _RecoHnUIOp(funcname,pagename,reason)
{
}
//全屏遮罩————lxs
function full_loading(e){
	if(e==1){
		if($('.full-loading').length){
			$('.full-loading').show();
		}else{
			$('body').append('<div class="full-loading" style="display:block"><i></i><div class="bg"></div></div>');
		}
	}
	else if(e==0){
		$('.full-loading').hide();
	}
}

function get_common_notice() {
    var now_url = location.href.substring(location.href.indexOf('=') + 1,location.href.indexOf('tid'));

	$.ajax({
		type:'POST',
        data:{nowUrl : now_url},
		url:HN_APP+"/Index/Index/get_common_notice/tid/"+HN_USERTID,
		success:function(res){
			if(res.status == 800){
				var html = '';
				html = '<div class="Infotip Infotip-block Infotip-warning">'
					 +		'<div class="tip-con">'+res.data[0].words.content+'</div>'
					 +	'</div>';
                // html += '<div class="cont">';
                // html += '<ul class="carousel_list">';
                // html += res.data[0].words.content;
                // html += '</ul>';
                // html += '</div>';
                $('.body_notice').html(html);
                $('.body_notice').show();
			} else {
				//不处理
				$('.body_notice').hide();
			}		
		}
	});
}
/**
 * [判断img是否加载完毕，然后执行回调]
 * @param  {Function} callback [回调方法]
 */
function isImgLoad(callback,img) {
	var t_img; // 定时器
	var isLoad = true; // 控制变量

	var isload = function () {

		$.each(img, function (item) {
			//当图片没加载时，高度=0
			if ($(this).height() == 0) {

				isLoad = false;
				//console.log(img);
				return false;
			};

		});

		if (isLoad) {

			// 清除定时器
			clearTimeout(t_img);
			//回调
			callback();
		} else {
			isLoad = true;
			t_img = setTimeout(function () {
				//递归
				isload();
			},100);
		}
	}
	isload();
}

/**
 * 手机号验证 只验证数字，长度20
 * @param mobile 手机号
 */
function verifyMobile(mobile) {
	var reg = /^[0-9]*$/;
	if(!reg.test(mobile)) {
		return '手机号只能是数字';
	}
	if(mobile.length > 20) {
		return '手机号不能超过20位';
	}
	return '';
}

// 版本切换
function goVersion(version, mutex_id, href) {
	$.ajax({
        type : "POST",
        url : HN_APP + "/Index/Index/updatePrintVersion",
        data : {version : version, mutex_id : mutex_id},
        sync : false,
        dataType : "json",
        success:function(res){
        	window.location.href = HN_APP + '/' + href + '/tid/' + HN_USERTID;
        },error:function(res){
        	window.location.href = HN_APP + '/' + href + '/tid/' + HN_USERTID;
        }
    });
}

// Header搜索
function searchAppname() {
	$('.searchAppname .appnames_childs').html('<div class="wait"></div>')
	HN_UI.ajax('Index/Index/', {phone: $('.NewHeader .searchAppname input').val()})
	.then(function (res) {
		if (res.status === 800) {
			var html = '<div class="app_childs_tit">'
			var html_ = '<div class="app_childs_cont">'
			$.each(res.data, function(k,v){
				html += '<a href="'+HN_APP+v.url+HN_USERTID+'">'+v.name+'</a>'
				html_ += '<a href="'+HN_APP+v.url+HN_USERTID+'"><div class="name">'+v.name+'</div><div class="cont">'+v.cont+'</div></a>'
			})
			$('.searchAppname .wait').remove()
			$('.searchAppname .appnames_childs').html(html+'</div>'+html_+'</div>')
		} else {
			iconPopHint(res.loginfo, 0);
		}
	})
}


(function(win){
// --- 工具方法 -s ----//

/**
 * 公共的ajax方法
 * method 接口名
 * sendObj 参数
 * _option 请求类型扩展
 */
HN_UI.ajax = function (method,sendObj,_option1) {
    var method = method || '';
    var sendObj = sendObj || {};
    var _option1 = _option1 || {};
    var _option = {
        url: HN_APP+'/'+method+'/tid/'+HN_USERTID,
        type: 'POST',
        dataType: 'json',
        data: sendObj,
    }
    $.extend(_option,_option1);
    return $.ajax(_option).then(function(res){
        if (res.status === 700) {
        	//授权
        	//暂时不加逻辑
        } if (res.status === 900) {
        	//超级版限制
        	versionSuper(res);
        }
        return res;
    }, function (err) {
    	return err;
    });
}

/**
 * [addZero 补0]
 * @param  {[string | number]} a [ . # tagName]
 * @return {string}         返回一个补0后的string
 */
HN_UI.addZero = function (a) {
    a = parseFloat(a);
    return a<10?'0'+a:a;
}

/**
 * [setNdayDate 获取n天后日期(转格式后的)]
 * @param {[type]} num [天数]
 */
HN_UI.setNdayDate = function (num) {
    var _this = this;
    var d = new Date();
    var year = d.getFullYear();
    var month = _this.addZero(d.getMonth() + 1);
    var day = _this.addZero(d.getDate());
    var hour = _this.addZero(d.getHours());
    var min = _this.addZero(d.getMinutes());
    var sec = _this.addZero(d.getSeconds());

    //今天    
    var new_day = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    var old_day = new_day;
    if ( num != 0 ) {
        //num天后
        d.setDate(parseFloat(day) + parseFloat(num));
        var old_year = d.getFullYear();
        var old_month = _this.addZero(d.getMonth() + 1);
        old_day = _this.addZero(d.getDate());
        var old_hour = _this.addZero(d.getHours());
        var old_min = _this.addZero(d.getMinutes());
        var old_sec = _this.addZero(d.getSeconds());

        old_day = old_year + '-' + old_month + '-' + old_day + ' ' + old_hour + ':' + old_min + ':' + old_sec;
    }
    return {
        new_day: new_day,
        new_day_str:Date.parse(new_day.replace(/-/g, "/")),
        old_day: old_day,
        old_day_str:Date.parse(old_day.replace(/-/g, "/")),
    }
}

/**
 * [计算出时间差]
 * @param  {[type]} str1 [2010-10-20 15:00:00]
 * @param  {[type]} str2 [2011-10-20 15:00:00]
 */
HN_UI.timeDifference = function (str1,str2) {
    var date1 = Date.parse(str1.replace(/-/g, "/"));  //开始时间
    var date2 = Date.parse(str2.replace(/-/g, "/"));    //结束时间
    var date3 = date2-date1;  //时间差的毫秒数
     
    //计算出相差天数
    var days = Math.floor(date3/(24*3600*1000));
    //计算天数后剩余的毫秒数
    var leave1 = date3%(24*3600*1000);    
    //计算出小时数
    var hours = Math.floor(leave1/(3600*1000));
    //计算小时数后剩余的毫秒数
    var leave2=leave1%(3600*1000);        
    //计算相差分钟数
    var minutes=Math.floor(leave2/(60*1000));
    //计算分钟数后剩余的毫秒数
    var leave3=leave2%(60*1000);      
    //计算相差秒数
    var seconds=Math.round(leave3/1000);

    return {
        _date3: date3,
        _days: days,
        _hours: hours,
        _minutes: minutes,
        _seconds: seconds,
    } 
}

/**
 * 淘宝封功能
 * @param {[type]} _str [description]
 */
HN_UI.TBsealmModule = function (_str) {
    var _sTime,_eTime;

    switch (_str) {
        case 'kuCun':
            _sTime = HN_UI.timeDifference('2018-12-11 23:25:00',HN_UI.setNdayDate(0).new_day)._date3;
            _eTime = HN_UI.timeDifference('2018-12-12 01:02:00',HN_UI.setNdayDate(0).new_day)._date3;

            if (_sTime > 0 && _eTime < 0) {
                iconPopHint('淘宝为保障系统稳定，12月11日 23:30-12月12日 1:00 将限制部分编辑商品功能',0,3000);
                return true;
            }
            break;
        case 'yfmb':
            _sTime = HN_UI.timeDifference('2018-12-11 15:58:00',HN_UI.setNdayDate(0).new_day)._date3;
            _eTime = HN_UI.timeDifference('2018-12-13 00:02:00',HN_UI.setNdayDate(0).new_day)._date3;

            if (_sTime > 0 && _eTime < 0) {
                iconPopHint('淘宝为保障系统稳定，12月11日 16:00-12月13日 00:00 将限制运费模板功能',0,3000);
                return true;
            }
            break;
    }
    
    return false;
}

/**
 * 动态生成一个图片空间弹窗
 */
HN_UI.imgSpacePop = function (_str) {
    var _html = '<div class="pop-up-box pop-up-imgSpacePop">'
               +     '<div class="pop-head">'
               +         '<span>火牛提示</span>'
               +         '<a class="close"></a>'
               +     '</div>'
               +     '<div class="pop-body">'
               +         '<div class="hint"><div class="hint-con"><span></span></div></div>'
               +     '</div>'
               +     '<div class="pop-foot button-list">'
               +         '<div class="for-align">'
               +             '<a class="button-m cancel"><font>取消</font></a>'
               +             '<a class="button-m button-m-blue cancel save"><font>打开图片空间</font></a>'
               +         '</div>'
               +     '</div>'
               + '</div>';
    if (!$('#mask .pop-up-imgSpacePop').length) {
        $('#mask .mask-bg > .list').prepend(_html);
        $('.pop-up-imgSpacePop .pop-foot .save').on('click', function () {window.open('https://sucai.wangpu.taobao.com/#/manage/pic?_k=tzgxt1')});
    };
    var popArr = [];
    $.each($('.pop-up-box'), function(item, ele) {
        if ($(this).css('display') == 'block') {
            var c_arr = $(this).attr('class').split(' ');
            $.each(c_arr, function(item2,ele2) {
                if (ele2.length&&ele2!='pop-up-box') {popArr.push(ele2)};
            });
        };
    });
    if (popArr.length) {
        $('.pop-up-imgSpacePop .pop-body .hint').addClass('hint-fail').find('span').html(_str)
        popArr[0] = '.' + popArr[0];
        numberOfPop('.pop-up-imgSpacePop',popArr.join(' .').split(' '));
    } else {
        popUpHint('.pop-up-imgSpacePop',_str,0);
    }
};

/**
 * 提取搜索url里面的商品id
 * @param  {[type]} keywords [description]
 * @return {[type]}          [description]
 */
HN_UI.getUrlgoodId = function(keywords) {
    var keywordsArr = keywords.split(',');
    var tmp = [];
    for(var i = 0; i < keywordsArr.length; i++) {
        if (keywordsArr[i].indexOf('http') > -1 || keywordsArr[i].indexOf('item.htm?') > -1) {
            var regEx = "id=(\\d+)";
            var num_iid = keywordsArr[i].match(regEx);
            if (num_iid && num_iid[1]) {
                tmp.push(num_iid[1]);
            } else {
                tmp.push(keywordsArr[i]);
            }
        } else {
            tmp.push(keywordsArr[i]);
        }
    }
    return tmp.join(',');
}

/**
 * 验证类型
 */
HN_UI.createIS = function (type) {
    return function (params){
        if (Object.prototype.toString.call(params) === "[object "+ type +"]") {
            if (type == 'Number' && isNaN(params)) {
                return false;
            } else {
                return true;
            }
        }else {
            return false;
        }
    }
}

/**
 * 是否为函数方法
 */
HN_UI.isFunction = HN_UI.createIS('Function');

/**
 * 是否为对象
 */
HN_UI.isObject = HN_UI.createIS('Object');

/**
 * 是否为数组
 */
HN_UI.isArray = HN_UI.createIS('Array');

/**
 * 是否为字符串
 */
HN_UI.isString = HN_UI.createIS('String');

/**
 * 是否为数字
 */
HN_UI.isNumber = HN_UI.createIS('Number');

/**
 * 是否为布尔值
 */
HN_UI.isBoolean = HN_UI.createIS('Boolean');

//引导升级弹窗
HN_UI.versionPop = function () {
	$('#mask .pop-up-box').hide();
    PopUp(".pop-up-upgrade170830", 1);
}

// --- 工具方法 -e ----//

})(window)