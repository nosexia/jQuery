define(['jquery'],function($){

	var defaultTmpl = '<div id="ui-dialog-mask"></div><div class="ui-dialog-wrapper">'+
		'<div class="ui-dialog-dialogTitle">'+
		'	<h3></h3>'+
		'	<button class="ui-dialog-closeBtn iconfont" data-ui-dialog-event="close">&#xe605;</button>'+		
		'</div>'+
		'<div class="ui-dialog-dialogBody ui-dialog-hasIcon">'+
		'	<em class="warning"></em>'+
		'	<p class="ui-dialog-messageTitle"></p>'+
		'	<p class="ui-dialog-messageBody"></p>'+
		'</div>'+
		'<div class="ui-dialog-dialogFooter">'+
		'	<button type="submit" class="button button-3 btn01 submitBtn" data-ui-dialog-event="submit">确定</button>'+
		'	<button type="button" class="button button-3 btn05 cancelBtn" data-ui-dialog-event="cancel">取消</button>'+
		'</div>'+
		'</div>';
	
	/*
	var $mask = $('#ui-dialog-mask');
	
	if(!$mask.length){
		$mask = $('<div id="ui-dialog-mask"></div>').appendTo(document.body);
	}*/
	
	var maskCount = 0;

	var Dialog = function(options){
		if(!options){
			options = {};
		}
		this.initData(options).initUi().bindEvents();

	};

	/**
	 * 初始化自身结构化数据
	 * @param  {Object} options 选项对象
	 * @return {Object}         this
	 */
	Dialog.prototype.initData = function(options){
		this.dialogTitle = options.dialogTitle || '提示';
		this.messageTitle = options.messageTitle || '提示';		
		this.messageBody = options.messageBody;
		//显示关闭按钮
		this.showClose = typeof options.showClose !== 'undefined'?options.showClose:true;
		//显示隐藏按钮
		this.showCancel = typeof options.showCancel !== 'undefined'?options.showCancel:true;
		//显示提交按钮
		this.showSubmit = typeof options.showSubmit !== 'undefined'?options.showSubmit:true;
		//带遮罩层
		this.withMask = typeof options.withMask !== 'undefined'?options.withMask:false;
		//提交按钮文本
		this.submitBtnText = options.submitBtnText;
		//取消按钮的文本
		this.cancelBtnText = options.cancelBtnText;
		//但按钮点击时
		this.onBtnClick = options.onBtnClick || $.noop;
		//提示框
		this.icon = typeof options.icon !== 'undefined'?options.icon:'warning';

		// 对话框各元素对应的选择器
		// 用于自定义容器时使用
		//给options.elementMap设置默认值{},为什么要这么玩
		if(!options.elementMap) options.elementMap = {};
		//如果没有设置elementMap，那么默认的this.elementMap为下面的值
		this.elementMap = {
			dialogTitle:options.elementMap.dialogTitle || '.ui-dialog-dialogTitle h3',
			closeBtn:options.elementMap.closeBtn || '.ui-dialog-dialogTitle .ui-dialog-closeBtn',
			messageTitle:options.elementMap.messageTitle || '.ui-dialog-dialogBody .ui-dialog-messageTitle',
			messageBody:options.elementMap.messageBody || '.ui-dialog-dialogBody .ui-dialog-messageBody',
			dialogFoot : options.elementMap.dialogFoot || '.ui-dialog-dialogFooter',
			submitBtn:options.elementMap.submitBtn || '.ui-dialog-dialogFooter button[type=submit]',
			cancelBtn:options.elementMap.cancelBtn || '.ui-dialog-dialogFooter button[type=button]'
		};
		//有没有默认的模版，没有就是默认的模版，默认的$footer,$body ,$icon
		this.$wrapper = options.$wrapper || $(defaultTmpl).appendTo('body');
		this.$footer = this.$wrapper.find('.ui-dialog-dialogFooter');
		this.$body = this.$wrapper.find('.ui-dialog-dialogBody');
		this.$icon = this.$body.find('em');
		//遍历出所有的jQuery对象
		for(var elementName in this.elementMap){
			this['$'+elementName] = this.$wrapper.find(this.elementMap[elementName]);
		}

		// 默认按钮列表
		this.buttons = [this.$submitBtn,this.$cancelBtn,this.$closeBtn];
		// 自定义按钮
		if(options.buttons){
			// 是否保存默认按钮，不保存
			if(typeof options.keepDefault !== 'undefined' && !options.keepDefault){		
				this.$submitBtn.remove();
				this.$cancelBtn.remove();
				this.buttons = options.buttons;	
			}else{
				//保存
				this.buttons = this.buttons.concat(options.buttons);
			}
			//需要判断dialogFooter 2015 nose
			this.$dialogFoot.append( this.buttons );		//新的自定义按钮组加入this.$dialogFoot中
			this.buttons.push( this.$closeBtn );			//把关闭按钮push到this.buttons
		}

        this.onRemove = options.onRemove || $.noop;			//自定义onrRemove时，是否需要自定义

		this._isShow = options.show || true;				//组建是否隐藏
		this._isFocus = false;
		return this;
	};

	//初始化Ui
	Dialog.prototype.initUi = function(){		
		//dialogTitle设置html的值
		this.$dialogTitle.html(this.dialogTitle);
		//messageTitle设置html的值
		this.$messageTitle.html(this.messageTitle);
		//messageBody设置html的值
		this.$messageBody.html(this.messageBody);
		//submitBtn设置html值
		if(this.$submitBtn && this.submitBtnText){
			this.$submitBtn.text(this.submitBtnText);
		}
		//cancelBtn设置html值
		if(this.$cancelBtn && this.cancelBtnText){
			this.$cancelBtn.text(this.cancelBtnText);
		}
		//关闭按钮是否删除
		if(!this.showClose){
			this.$closeBtn.remove();
		}
		//提交按钮是否删除
		if(!this.showSubmit){
			this.$submitBtn.remove();
		}
		//取消按钮是否删除
		if(!this.showCancel){
			this.$cancelBtn.remove();
		}
		//初始化时执行this.show()
		if(this._isShow){
			this.show();
		}
		//有没有this.ico的情况
		if(!this.icon){
			this.$icon.remove();
			this.$body.removeClass('ui-dialog-hasIcon');
			if(this.messageTitle !== '提示' || this.messageBody){
				this.$body.addClass('ui-dialog-noIcon');
			}
		}else{
			this.$icon.remove('warning ok').addClass(this.icon);
		}
		return this;
	};

	Dialog.prototype.bindEvents = function(){
		var dialog = this;
		$.each(this.buttons,function(){
			var $btn = $(this,dialog.$wrapper);		
			var eventName = $btn.data('ui-dialog-event');		//取出eventName值
			$btn.on('click',function(){
				var callbackRet = dialog.onBtnClick(eventName);		//调用dialog的onBtnClick方法，
				if(typeof callbackRet === 'undefined' || callbackRet){		//如果方法的返回值是false,删除dialog
					dialog.remove();
				}
			});
		});
	};


	Dialog.prototype.show = function(){
		this.$wrapper.show();			//显示dialog
		this._isShow = true;			//this.isShow显示
		if(this.withMask){				//如果有遮罩层遮罩层显示
			$mask.show();				
			maskCount++;
		}
	};

	Dialog.prototype.hide = function(){
		this.$wrapper.hide();		   //隐藏dialog		
		this._isShow = false;		   //设置属性isSHow为false			
		if(this.withMask){			   //若有有遮罩，隐藏遮罩	
			maskCount--;
			if(!maskCount){
				$mask.hide();
			}
		}
	};

	Dialog.prototype.remove = function(){		//隐藏this,
		this.hide();
		this.$wrapper.remove();					//删除this.$wrapper
        this.onRemove();						//删除之后触发onRemove函数
	};

	return Dialog;
});


//此组建分为初始化数据 ，初始化结构和，然后进行事件绑定