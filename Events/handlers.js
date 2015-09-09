/**
 * 存在事件委托时
 * @param  {[type]} event    [description]
 * @param  {[type]} handlers [description]
 * @return {[type]}          [description]
 *
 * handlerQueue = jQuery.event.handlers.call( this, event, handlers );
 */
handlers: function( event, handlers ) {
	var i, matches, sel, handleObj,
		handlerQueue = [],
		delegateCount = handlers.delegateCount,
		cur = event.target;

	// Find delegate handlers
	// Black-hole SVG <use> instance trees (#13180)
	// Avoid non-left-click bubbling in Firefox (#3861)
	/**
	 * 存在事件委托，cur.nodeType表示是cur是DOM元素
	 * 判断event.button当是点击事件的时候， event.button==0   
	 * 
	 */
	if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
		//暂时不清楚，这里为什么要向上冒泡
		for ( ; cur !== this; cur = cur.parentNode || this ) {

			// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
			if ( cur.disabled !== true || event.type !== "click" ) {
				matches = [];
				//循环出cur元素上绑定的handleObj事件对象，分别push到matches中
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];

					// Don't conflict with Object.prototype properties (#13203)
					sel = handleObj.selector + " ";


					if ( matches[ sel ] === undefined ) {
						matches[ sel ] = handleObj.needsContext ?
							jQuery( sel, this ).index( cur ) >= 0 :
							jQuery.find( sel, this, null, [ cur ] ).length;
					}
					//所有cur委托到同一个this上面的的handleObj事件对象，push到matches数组中
					if ( matches[ sel ] ) {
						matches.push( handleObj );
					}
				}
				//把元素和元素上面绑定的事件对象push到handlerQueue对象中
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, handlers: matches });
				}
			}
		}
	}

	// Add the remaining (directly-bound) handlers
	// 事件中绑定的事件，不全是事件委托时
	// delegateCount < handlers.length
	// 把直接绑定的事件push到handlerQueue对象中
	if ( delegateCount < handlers.length ) {
		handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
	}

	return handlerQueue;
},