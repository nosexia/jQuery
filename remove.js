// Detach an event or set of events from an element
// 
// off: function( types, selector, fn ) {
// 				||
// jQuery.event.remove( this, types, fn, selector );
/**
 * 删除事件版定，最终执行   一种是直接绑定的，委托绑定形式的
 * elem.removeEventListener( type, eventHandle, false );
 *
 * jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
 */

remove: function( elem, types, handler, selector, mappedTypes ) {

	var j, origCount, tmp,
		events, t, handleObj,
		special, handlers, type, namespaces, origType,
		elemData = data_priv.hasData( elem ) && data_priv.get( elem );

	if ( !elemData || !(events = elemData.events) ) {
		return;
	}

	// Once for each type.namespace in types; type may be omitted
	types = ( types || "" ).match( core_rnotwhite ) || [""];
	t = types.length;
	while ( t-- ) {
		//rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;           第一组是以非"."的字符一个或者多个，第二组是以.开头开头匹配除了\n之外的任意字符
		tmp = rtypenamespace.exec( types[t] ) || [];
		type = origType = tmp[1];
		namespaces = ( tmp[2] || "" ).split( "." ).sort();

		// Unbind all events (on this namespace, if provided) for the element
		if ( !type ) {
			for ( type in events ) {
				//解绑所有用了这个命名空间的事件
				jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
			}
			continue;
		}

		special = jQuery.event.special[ type ] || {};
		type = ( selector ? special.delegateType : special.bindType ) || type;
		handlers = events[ type ] || [];
		//暂时不清楚这个正则的含义
		//
		//有命名空间的存在
		//有可能是以.开头，以任意字符开头的..click
		//xxx.click
		tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );



		// Remove matching events
		// 循环事件上面的han
		origCount = j = handlers.length;
		while ( j-- ) {
			handleObj = handlers[ j ];

			//解绑的origType === handleObj.origType
			if ( ( mappedTypes || origType === handleObj.origType ) &&

				//有handler的情况  handler.guid ===  handleObj.guid
				( !handler || handler.guid === handleObj.guid ) &&

				//有命名空间的存在  ，需要正则验证
				( !tmp || tmp.test( handleObj.namespace ) ) &&

				//有事件委托  事件委托事件 === handleObj.selector   
				( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
				handlers.splice( j, 1 );

				if ( handleObj.selector ) {
					handlers.delegateCount--;
				}
				if ( special.remove ) {
					special.remove.call( elem, handleObj );
				}
			}
		}

		// Remove generic event handler if we removed something and no more handlers exist
		// (avoids potential for endless recursion during removal of special event handlers)
		//绑定在事件上面的函数全部删除的情况
		if ( origCount && !handlers.length ) {
			if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
				//删除"事件函数"
				jQuery.removeEvent( elem, type, elemData.handle );
			}

			delete events[ type ];
		}
	}

	// Remove the expando if it's no longer used
	// 对象上面没有绑定任何事件
	if ( jQuery.isEmptyObject( events ) ) {
		//删除eleDate中的handle
		delete elemData.handle;

		data_priv.remove( elem, "events" );
	}
},




jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};





