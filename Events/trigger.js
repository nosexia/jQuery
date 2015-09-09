/**
 * trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
 */


/**
 * trigger的用法，可以自定义事件的实现
 * 用trigger实现的自定义方法，向上冒泡的，
 * 自定义实现的具体方法是    handle.apply( cur, data );    此时的cur指向事件目标元素   ，data指向事件对象
 * elem.addEventListener( type, eventHandle, false );	    	
 * 
 * 
 */

//jQuery.event.trigger( e, null, elem );


trigger: function( event, data, elem, onlyHandlers ) {

	var i, cur, tmp, bubbleType, ontype, handle, special,
		eventPath = [ elem || document ],
		type = core_hasOwn.call( event, "type" ) ? event.type : event,
		namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

	/**
	 * cur = tmp = elem =DOM元素，如果找不到DOM元素，那么指向document
	 */
	cur = tmp = elem = elem || document;

	// Don't do events on text and comment nodes
	if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
		return;
	}

	// focus/blur morphs to focusin/out; ensure we're not firing them right now
	// rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
		return;
	}

	if ( type.indexOf(".") >= 0 ) {
		// Namespaced trigger; create a regexp to match event type in handle()
		namespaces = type.split(".");
		type = namespaces.shift();
		namespaces.sort();
	}
	ontype = type.indexOf(":") < 0 && "on" + type;

	// Caller can pass in a jQuery.Event object, Object, or just an event type string
	/**
	 * event版定了三个属性,type,timeStamp,jQuery.expando
	 * event ={
	 * 		type : type
	 * 		timeStamp : jQuery.now()
	 * 		jQuery.expando  :true
	 * }
	 */
	event = event[ jQuery.expando ] ?
		event :
		new jQuery.Event( type, typeof event === "object" && event );

	// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
	event.isTrigger = onlyHandlers ? 2 : 3;
	event.namespace = namespaces.join(".");
	event.namespace_re = event.namespace ?
		new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
		null;

	// Clean up the event in case it is being reused
	event.result = undefined;
	if ( !event.target ) {
		event.target = elem;
	}

	// Clone any incoming data and prepend the event, creating the handler arg list
	data = data == null ?
		[ event ] :
		jQuery.makeArray( data, [ event ] );

	// Allow special events to draw outside the lines
	special = jQuery.event.special[ type ] || {};
	/**
	 * 判断是否是特殊事件，特殊事件对象中是否有trigger属性
	 * 调用special.trigger.apply( elem, data );
	 * safeActiveElement()返回当前获取焦点的元素，只可读，当没有元素获取焦点时，返回body元素
	 * 正常情况下面只有 a标签 , 按钮   表单元素可以获取焦点
	 * 
	 * 	trigger: function() {
			if ( this !== safeActiveElement() && this.focus ) {
				this.focus();
				return false;
			}
		}, 
	 * 
	 */
	if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
		return;
	}

	// Determine event propagation path in advance, per W3C events spec (#9951)
	// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
	// focusin做为特殊事件对象，没有delegateType属性
	// 
	if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

		bubbleType = special.delegateType || type;
		if ( !rfocusMorph.test( bubbleType + type ) ) {
			cur = cur.parentNode;
		}
		for ( ; cur; cur = cur.parentNode ) {
			eventPath.push( cur );
			tmp = cur;
		}

		// Only add window if we got to document (e.g., not plain obj or detached DOM)
		if ( tmp === (elem.ownerDocument || document) ) {
			eventPath.push( tmp.defaultView || tmp.parentWindow || window );
		}
	}

	// Fire handlers on the event path
	/**
	 * 可以自定义事件
	 * 如果事件对象，没有阻止事件冒泡的操作
	 * 那么会一直向上冒泡 ,直到window对象    [ body->html->document->window  ]
	 */
  	
	i = 0;
	while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

		event.type = i > 1 ?
			bubbleType :
			special.bindType || type;

		// jQuery handler
		/**
		 * 
		 */
		handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
		//调用handle函数，然后调用dispath方法中，执行真正的事件函数handleObj.handler 
		/**
		 * eventHandle = elemData.handle = function( e ) {
		// Discard the second event of a jQuery.event.trigger() and
		// when an event is called after a page has unloaded
		//执行jQuery.event.dispatch函数 this->elem,arguments-原生事件对象
		//当事件执行的时候执行eventHandle函数，在elemData.handle上面挂载了elem属性，指向elem
		return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
			jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
			undefined;
		};  */
		//cur为被委托的body对象,
		if ( handle ) {
			handle.apply( cur, data );
		}

		// Native handler
		handle = ontype && cur[ ontype ];
		/**
		 * 阻止默认行为，例如点击选框时，出现选中状态
		 * 
		 */
		if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
			event.preventDefault();
		}
	}
	event.type = type;

	// If nobody prevented the default action, do it now
	/**
	 * // For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
	 */
	
	if ( !onlyHandlers && !event.isDefaultPrevented() ) {

		if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
			jQuery.acceptData( elem ) ) {

			// Call a native DOM method on the target with the same name name as the event.
			// Don't do default actions on window, that's where global variables be (#6170)
			if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

				// Don't re-trigger an onFOO event when we call its FOO() method
				tmp = elem[ ontype ];

				if ( tmp ) {
					elem[ ontype ] = null;
				}

				// Prevent re-triggering of the same event, since we already bubbled it above
				jQuery.event.triggered = type;
				elem[ type ]();
				jQuery.event.triggered = undefined;

				if ( tmp ) {
					elem[ ontype ] = tmp;
				}
			}
		}
	}

	return event.result;
},
