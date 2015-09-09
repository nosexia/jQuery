//当事件类型是focus的时候


special = {

	focus: {
			// Fire native event if possible so blur/focus sequence is correct
		trigger: function() {
			if ( this !== safeActiveElement() && this.focus ) {
				this.focus();
				return false;
			}
		},
		delegateType: "focusin"
	},
}
special = jQuery.event.special[ type ] || {};





// If selector defined, determine special event api type, otherwise given type

//当selector有值时，type=special.delegateType = "focusin" ;    当没有选择器时使用focus本身
type = ( selector ? special.delegateType : special.bindType ) || type;

// Update special based on newly reset type

var attaches = 0,
		handler = function( event ) {
			//
			jQuery.event.simulate( "focusin", event.target, jQuery.event.fix( event ), true );
		};

	jQuery.event.special[ "focusin" ] = {
		setup: function() {
			if ( attaches++ === 0 ) {
				//document捕获监听页面中所有的focus事件
				document.addEventListener( "focus", handler, true );
			}
		},
		teardown: function() {
			if ( --attaches === 0 ) {
				document.removeEventListener( "focus", handler, true );
			}
		}
	};
}


special = jQuery.event.special[ type ] || {};







//此时是调用了  document.addEventListener( "focus", handler, true );
//实际上调用了  jQuery.event.simulate( "focusin", event.target, jQuery.event.fix( event ), true );
if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
				if ( elem.addEventListener ) {
					//监听到type时，触发eventHandle函数
					//利用事件冒泡，从下往上执行
					elem.addEventListener( type, eventHandle, false );
				}
			}






//调用   jQuery.event.trigger( e, null, elem );
simulate: function( type, elem, event, bubble ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	var e = jQuery.extend(
		new jQuery.Event(),
		event,
		{
			type: type, 			//type
			isSimulated: true,
			originalEvent: {}
		}
	);
	if ( bubble ) {
		jQuery.event.trigger( e, null, elem );
	} else {
		jQuery.event.dispatch.call( elem, e );
	}
	if ( e.isDefaultPrevented() ) {
		event.preventDefault();
	}
}	







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
			};  
			
			
		}*/
		//cur是直接绑定了event.delegateType ||  event.type 事件的DOM元素
		if ( handle ) {
			//执行所有绑定到cur元素上的event.type事件
			handle.apply( cur, data );
		}
			
		if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
			event.preventDefault();
		}
	}		
