/**
 * 
 * 对委托事件的处理
 * handlerQueue=｛
 * 		0:matches      //包含所有委托对象
 * 		elem:cur      //当前对象
 * ｝
 *
 * matches=[
 * 		handlers[0],handlers[2]
 * ]
 * matches上面带有属性sel返回长度（暂时不清楚啥用）
 *
 *
 * 对直接绑定处理
 * handlerQueue=｛
 * 		1:handlers    //handlers.slice( delegateCount )  去掉所有委托对象和delegateCount属性
 * 		elem:cur      //当前的对象
 * ｝
 *
 * handlers的功能把handlers进行进一步的封装handlerQueue
 *
 *
 * 
 * 
 * 
 *
 * 
 */
handlers: function( event, handlers ) {
	var i, matches, sel, handleObj,
		handlerQueue = [],
		delegateCount = handlers.delegateCount,
		cur = event.target;						//event.target-->当前点击的元素

	// Find delegate handlers
	// Black-hole SVG <use> instance trees (#13180)
	// Avoid non-left-click bubbling in Firefox (#3861)
	// event.button的值为0，那么event.type=='click'
	if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
		//this指向事件委托元素
		for ( ; cur !== this; cur = cur.parentNode || this ) {          //向上冒泡，直到条件cur!==this不成立

			// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
			if ( cur.disabled !== true || event.type !== "click" ) {           //不允许cur元素带有disabled属性为true,并且进行点击事件
				matches = [];
				//handlers指向数组，数组前面的对象都是通过委托绑定的处理对象
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];

					// Don't conflict with Object.prototype properties (#13203)
					sel = handleObj.selector + " ";
					// todo	
					if ( matches[ sel ] === undefined ) {
						matches[ sel ] = handleObj.needsContext ?					//handleObj.needsContext值为false,
							jQuery( sel, this ).index( cur ) >= 0 :
							jQuery.find( sel, this, null, [ cur ] ).length;			//当cur是当前的sel时，返回长度1
					}

					/**
					 * matches=[
					 * 		0：｛
					 * 			handlers[0]
					 * 		｝,
					 * 		1:{
					 * 			handlers[1]	
					 * 		]
					 * ｝
					 *  matches上带有sel属性为1
					 *
					 * handleObj=handlers[0]={
							type: type,
							origType: origType,
							data: data,
							handler: handler,
							guid: handler.guid,
							selector: selector,
							needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
							namespace: namespaces.join(".")
						}
					 * 
					 */

					if ( matches[ sel ] ) {
						matches.push( handleObj );				
					}
				}

				/**
				 * handlerQueue中elem指向了cur,所有的处理函数装在了handlers中
				 * handlerQueue=[
				 * 		0:	{
				 * 			elem:cur,
				 * 			handlers:matches
				 * 		}
				 * 			
				 * ]
				 */
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, handlers: matches });
				}
			}
		}
	}

	// Add the remaining (directly-bound) handlers
	// handlerQueue=｛
	// 		elem:elem
	// 		handlers:events.handlers数组对象中只保留属性数字的项（去掉delegataCount属性），把没有绑定的事件对象加入handlerQueue中


	 /* events.handlers=[
		  	{
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}
	  ]*/

	if ( delegateCount < handlers.length ) {
		handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
        
	}
	//返回handlerQueue数组对象
	return handlerQueue;
},

