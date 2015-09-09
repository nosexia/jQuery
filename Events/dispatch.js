/**
 * handler的具体处理
 * 
 */
dispatch: function( event ) {

	// Make a writable jQuery.Event from the native event object
	event = jQuery.event.fix( event );			//返回一个兼容的jQuery对象

	var i, j, ret, matched, handleObj,
		handlerQueue = [],
		//arguments->event->原生事件对象event{}
		//arguments类数组转化为数组args  ,拥有数组的方法
		args = core_slice.call( arguments ),   

		//handlers=data_priv.cache["unlock"]["events"]["type"] --->[]
		//handlers.delegateCount=number
		handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
		//special指向需要做转变的特殊事件
		special = jQuery.event.special[ event.type ] || {};				

	// Use the fix-ed jQuery.Event rather than the (read-only) native event
	// 给args数组添加一项  args[0]->指向处理后的jQuery.Event事件实例
	args[0] = event;	
	//给event添加新的属性delegateTarget->elem
	event.delegateTarget = this;

	// Call the preDispatch hook for the mapped type, and let it bail if desired
	if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
		return;
	}

	// Determine handlers
	/**
	 * handlerQueue=[
	 * 		0:{
	 * 			elem:cur      //事件目标元素
	 * 			handlers      //绑定在事件目标元素上的事件对象    handleObj
	 * 		}
	 * ]
	 */
	handlerQueue = jQuery.event.handlers.call( this, event, handlers );

	// Run delegates first; they may want to stop propagation beneath us
	i = 0;
	/**
	 * handlerQueue[i]=matched={
	 * 		ele:ele
	 * 		handlers:events.handlers
	 * }
	 *
	 * events.handlers=[
		 * 	{
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}
	 * ]
	 */
	
	/**
	 * 调用event.stopPropagation阻止事件向上冒泡，可以阻止事件委托的执行
	 * 不执行handlerQueue数组中剩下的对象的handler函数执行
	 */
	while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
		//让event的属性值指向matches.elem----->当前target
		event.currentTarget = matched.elem;

		j = 0;
		/**
		 * matched.handlers中有可能有多个事件对象
		 * 调用stopImmediatePropagation方法，阻止matched.handlers其他的事件对象中的handler函数执行
		 */
		while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

			// Triggered event must either 1) have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
			if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {
				//给event加handleObj属性指向handleObj,
				event.handleObj = handleObj;	
				//给event加data属性指向handleObj.data
				event.data = handleObj.data;
				//真正函数执行的地方	
				ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
						.apply( matched.elem, args );

				if ( ret !== undefined ) {
					if ( (event.result = ret) === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		}
	}

	// Call the postDispatch hook for the mapped type
	if ( special.postDispatch ) {
		special.postDispatch.call( this, event );
	}
	return event.result;
},


//事件对象
//event.handleObj = handleObj
//event.data = handleObj.data
//event.delegateTarget = this;