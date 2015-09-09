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
	types = ( types || "" ).match( core_rnotwhite ) || [""];		//types[0] = ["click"]
	t = types.length;												//t = 1
	while ( t-- ) {
		//rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;           第一组是以非"."的字符一个或者多个，第二组是以.开头开头匹配除了\n之外的任意字符
		tmp = rtypenamespace.exec( types[t] ) || [];		 //tmp = ["click"]
		type = origType = tmp[1];							 //type = origType = "click";
		namespaces = ( tmp[2] || "" ).split( "." ).sort();   //namespaces = [];		

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
		origCount = j = handlers.length;		//handlers是一个包含handleObj对象的数组
		while ( j-- ) {
			handleObj = handlers[ j ];

			//解绑的origType === handleObj.origType
			if ( ( mappedTypes || origType === handleObj.origType ) &&			//没有命名空间的情况

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
		// handlers数组不再包含handleObj对象
		if ( origCount && !handlers.length ) {
			if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
				//删除"事件函数"
				jQuery.removeEvent( elem, type, elemData.handle );
			}

			delete events[ type ];			//events[ "type" ] 数据删除
		}
	}

	// Remove the expando if it's no longer used
	// 对象上面没有绑定任何事件
	if ( jQuery.isEmptyObject( events ) ) {
		//删除回调函数eleData.handle
		delete elemData.handle;		

		data_priv.remove( elem, "events" );			//删除事件对象

	}
},




jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};




while ( j-- ) {
               handleObj = handlers[ j ];

               //解绑的origType === handleObj.origType
               if ( ( mappedTypes || origType === handleObj.origType ) &&               //没有命名空间的情况

                    //有handler的情况  handler.guid ===  handleObj.guid
                    ( !handler || handler.guid === handleObj.guid ) &&                

                    //有命名空间的存在  ，需要正则验证
                    ( !tmp || tmp.test( handleObj.namespace ) ) &&

                    //有事件委托  事件委托事件 === handleObj.selector  
                    ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                    handlers.splice( j, 1 );    //handlers.splice( j , 1 )

                    if ( handleObj.selector ) {
                         handlers.delegateCount--;
                    }
                    if ( special.remove ) {
                         special.remove.call( elem, handleObj );
                    }
               }
          }
handlers.splice( j, 1 );    //handlers.splice( j , 1 )
handlers.splice对handleObj对象进行操作，
再次调用elemData.handle函数时，此时elemData.events[ type ]中的对象减少

handlers 和 elemData.events[ type ]指向同一个数组,






