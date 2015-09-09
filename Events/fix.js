/**
 * 处理Event对象的兼容性
 */

fix: function( event ) {
	//发现这句代码没有起他想要的功能
	if ( event[ jQuery.expando ] ) {
		return event;
	}

	// Create a writable copy of the event object and normalize some properties
	/**
	 * jQuery.event.fixHooks的默认值是{}，初始化fixHook为undefined,
	 * 
	 */
	var i, prop, copy,
		type = event.type,
		originalEvent = event,
		fixHook = this.fixHooks[ type ];			

	/**
	 * 重新给jQuery.event.fixHooks和fixHook赋值
	 * var  rmouseEvent = /^(?:mouse|contextmenu)|click/,  		正则匹配所有的鼠标事件，能够匹配到mouse  |  contextmenu  | click 
	 * 只是为了匹配以mouse,或者contextmenu字符开头
	 * var  rkeyEvent = /^key/,
	 */


	 /**
	  * jQuery.event={
	  * 	mouseHooks:{
	  * 		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
	  * 	},
	  *
	  *     keyHooks: {
	  *     	props: "char charCode key keyCode".split(" "),
	  *     }
	  * 	
	  * }
	  *fixHook-->jQuery.event.mouseHooks
	  *
	  * this.fixHooks['click']-->fixHook,指向jQuery.event.mouseHooks对象
	  * this.fixHooks['keyup']-->fixHook,指向jQuery.event.keyHooks对象
	  * 都不匹配指向空对象
	  * 
	  */
	if ( !fixHook ) {
		this.fixHooks[ type ] = fixHook =
			rmouseEvent.test( type ) ? this.mouseHooks :
			rkeyEvent.test( type ) ? this.keyHooks :
			{};
	}

	/**
	 * jQuery.event={
	 * 		// Includes some event props shared by KeyEvent and MouseEvent
	 *		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),   //原生event属性
	 * }
	 * fixHook.props有值，给jQuery的鼠标event添加指定的属性jQuery.event.mouseHooks.props->"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
	 * fixHook.props有值，给jQuery的键盘event添加指定的属性jQuery.event.keyHooks.props->"char charCode key keyCode".split(" "),
	 * originalEvent.target-->elem
	 */

	copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

	//实例化jQuery.Event
	event = new jQuery.Event( originalEvent );

	//jQuery的event对象，共享元素event属性
	i = copy.length;
	while ( i-- ) {
		prop = copy[ i ];
		event[ prop ] = originalEvent[ prop ];
	}

	// Support: Cordova 2.5 (WebKit) (#13255)
	// All events should have a target; Cordova deviceready doesn't
	if ( !event.target ) {
		event.target = document;
	}

	// Support: Safari 6.0+, Chrome < 28
	// Target should not be a text node (#504, #13143)
	if ( event.target.nodeType === 3 ) {
		event.target = event.target.parentNode;
	}

	return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
},