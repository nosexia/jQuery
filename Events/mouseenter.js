 <script type="text/javascript">
/*$( ".div1" ).mouseover(function(){
     console.log( "111" );
})

$( ".div1" ).mouseout(function(){
     console.log( "222" );
})
*/

//mouseovers事件是具有冒泡
//


//进入到".div2"元素，触发".div2"的mouseenter事件，不会冒泡触发".div1"的mouseenter
$( ".div1" ).mouseenter( function(){
     console.log( "111" );
} )

//mouseleave的特点
//当进入到元素的子集元素".div2"时，不触发".div1"的mouseleave事件
$( ".div1" ).mouseleave( function(){
     console.log( "222" );
} )

$( ".div2" ).mouseenter( function(){
     console.log( "333" );  
} )


//mouseenter是mouseover的特殊情况
//mouseleave是mouseout的特殊情况

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


/**
 * jQuery.contains方法
 * jQuery.contains( chldren , parent )  //返回true
 *
 */



special = {
		delegateType: "mouseover",
		bindType: "mouseover",

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			// 
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
special = jQuery.event.special[ type ] || {};



// If selector defined, determine special event api type, otherwise given type

//当selector有值时，type=special.delegateType



//type = "mouseover"
type = ( selector ? special.delegateType : special.bindType ) || type;

// Update special based on newly reset type
//此时的special = {}
special = jQuery.event.special[ type ] || {};



//speical.setup.call用来触发 
if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	if ( elem.addEventListener ) {
		//监听到type时，触发eventHandle函数
		//利用事件冒泡，
		elem.addEventListener( "mouseover", eventHandle, false );
	}
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







/****dispatch.js****/
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
			//执行jQuery.event.special[ "mouseenter" ]	
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



//最后执行
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

