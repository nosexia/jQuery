/**
 * on方法上面调用add
 * return this.each( function() {
		jQuery.event.add( this, types, fn, data, selector );			->this指向DOM对象
	});
 */

/**add函数分析**/
/**1.elemData = data_priv.get( elem );
 * 创建或获取data_priv.get( elem )=data_prev.cache[unlock]对象
 *
 *
 *  if ( !handler.guid ) {
		handler.guid = jQuery.guid++;
	}
	给事件处理函数添加唯一的id号


	if ( !(events = elemData.events) ) {
		events = elemData.events = {};
	}
	给data_priv.cache[unlock]设置events属性，默认值是空对象




	if ( !(eventHandle = elemData.handle) ) {
		eventHandle = elemData.handle = function( e ) {
			// Discard the second event of a jQuery.event.trigger() and
			// when an event is called after a page has unloaded
			return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
				jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
				undefined;
		};
		// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
		eventHandle.elem = elem;
	}
	给data_priv.cache["unlock"]设置handle属性，默认是值function(e){}

 */

add: function( elem, types, handler, data, selector ) {

	var handleObjIn, eventHandle, tmp,
		events, t, handleObj,
		special, handlers, type, namespaces, origType,
		//elemDate=data_priv.get(ele)=data_priv.cache[unlock]={}		-->指向创建的新对象
		//后面所有挂载到elemData对象下面的变量，被初始化指定elemData下面的对象之后，不再进行初始化操作
		elemData = data_priv.get( elem );

	// Don't attach events to noData or text/comment nodes (but allow plain objects)
	if ( !elemData ) {
		return;
	}

	// Caller can pass in an object of custom data in lieu of the handler
	// 可以调用一个事件对象替换handler(in lieu of 替换)
	if ( handler.handler ) {
		handleObjIn = handler;
		handler = handleObjIn.handler;
		selector = handleObjIn.selector;
	}

	// Make sure that the handler has a unique ID, used to find/remove it later
	if ( !handler.guid ) {
		handler.guid = jQuery.guid++;
	}

	// Init the element's event structure and main handler, if this is the first
	if ( !(events = elemData.events) ) {
		events = elemData.events = {};
	}
	if ( !(eventHandle = elemData.handle) ) {
		eventHandle = elemData.handle = function( e ) {
			// Discard the second event of a jQuery.event.trigger() and
			// when an event is called after a page has unloaded
			//执行jQuery.event.dispatch函数 this->elem,arguments-原生事件对象
			//当事件执行的时候执行eventHandle函数，在elemData.handle上面挂载了elem属性，指向elem
			return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
				jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
				undefined;
		};
		// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
		eventHandle.elem = elem;
	}

	// Handle multiple events separated by a space
	/**
	 * 操作types值
	 * type = origType = tmp[1];   --->对应的事件类型
	 * namespaces = ( tmp[2] || "" ).split( "." ).sort();		->获取事件的命令空间数组
	 *
	 */
	types = ( types || "" ).match( core_rnotwhite ) || [""];
	t = types.length;
	while ( t-- ) {
		//rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;           第一组是以非"."的字符一个或者多个，第二组是以.开头开头匹配除了\n之外的任意字符
		tmp = rtypenamespace.exec( types[t] ) || [];
		type = origType = tmp[1];
		namespaces = ( tmp[2] || "" ).split( "." ).sort();

		// There *must* be a type, no attaching namespace-only handlers
		if ( !type ) {
			continue;
		}

		// If event changes its type, use the special event handlers for the changed type
		/**
		 * 特殊事件的处理，当是特殊事件时，获取一个返回后的事件对象
		 */
		special = jQuery.event.special[ type ] || {};

		// If selector defined, determine special event api type, otherwise given type

		//当selector有值时，type=special.delegateType

		type = ( selector ? special.delegateType : special.bindType ) || type;

		// Update special based on newly reset type
		special = jQuery.event.special[ type ] || {};

		// handleObj is passed to all event handlers
		/**
		 * handleObj={
		 * 		type:type
		 * 		origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
		 * }
		 */
		handleObj = jQuery.extend({
			type: type,
			origType: origType,
			data: data,
			handler: handler,
			guid: handler.guid,
			selector: selector,
			needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
			namespace: namespaces.join(".")
		}, handleObjIn );

		// Init the event handler queue if we're the first
		/**
		 * {events:{
		 * 		"click":[
		 *
		 * 			],
		 * 		"delegateCount":0
		 * 	}}
		 * 		handlers=events["click"]=[];
		 * 		handers指向events['click']数组，数组还拥有delegateCount属性
		 * 		elemData.events
		 *
		 *
		 */
		if ( !(handlers = events[ type ]) ) {
			handlers = events[ type ] = [];
			handlers.delegateCount = 0;

			// Only use addEventListener if the special events handler returns false
			/**
			 * 当type为blur事件时，
			 * special ={
			 * 		setup: function() {
						if ( attaches++ === 0 ) {
							//document上选择事件捕获来监听focus事件，  触发handler函数
							document.addEventListener( "focus", handler, true );
						}
					},
					teardown: function() {
						if ( --attaches === 0 ) {
							document.removeEventListener( "focus", handler, true );
						}
					}
			 * }
			 */


			//speical.setup.call用来触发
			if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
				if ( elem.addEventListener ) {
					//监听到type时，触发eventHandle函数
					//利用事件冒泡，从下往上执行
					elem.addEventListener( type, eventHandle, false );
				}
			}
		}

		if ( special.add ) {
			special.add.call( elem, handleObj );

			if ( !handleObj.handler.guid ) {
				handleObj.handler.guid = handler.guid;
			}
		}

		// Add to the element's handler list, delegates in front
		/**
		 *
		 * 当selector有值，把handleObj加入data_priv.cache["unlock"].events["type"]数组中的第一项
		 */

		if ( selector ) {
			handlers.splice( handlers.delegateCount++, 0, handleObj );
		} else {
			handlers.push( handleObj );
		}

		// Keep track of which events have ever been used, for event optimization
		jQuery.event.global[ type ] = true;
	}

	// Nullify elem to prevent memory leaks in IE
	elem = null;
}


