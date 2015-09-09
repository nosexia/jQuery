	special: {
		//阻止图片冒泡到window.load
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		//当时focus,或者blur不支持冒泡，除了input之外，focus不支持其他的元素，需要用到delegateType
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
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},



	// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});




// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
// 不支持focusin冒泡的情况  ，通过捕获document的focus事件来触发
// jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}


/**
 * 通过循环的方式
 * 最后生成的是两段代码
 * 通过
 * var attaches = 0,
		handler = function( event ) {
			//
			jQuery.event.simulate( "focusin", event.target, jQuery.event.fix( event ), true );
		};

	jQuery.event.special[ "focusin" ] = {
		setup: function() {
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
	};

 */




