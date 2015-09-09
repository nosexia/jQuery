off: function( types, selector, fn ) {
	var handleObj, type;
	if ( types && types.preventDefault && types.handleObj ) {	//此时的这句代码执行了两次，第一次执行types为events对象
		// ( event )  dispatched jQuery.events                  //第两次执行types = "click" ,    selector = ".div2"  , fn ,为真正的回调函数
		handleObj = types.handleObj;
		jQuery( types.delegateTarget ).off(
			handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
			handleObj.selector,
			handleObj.handler
		);
		return this;
	}
	if ( typeof types === "object" ) {
		// ( types-object [, selector] )
		for ( type in types ) {
			this.off( type, selector, types[ type ] );
		}
		return this;
	}
	if ( selector === false || typeof selector === "function" ) {
		// ( types [, fn] )
		fn = selector;
		selector = undefined;
	}
	if ( fn === false ) {
		fn = returnFalse;
	}
	return this.each(function() {
		jQuery.event.remove( this, types, fn, selector );		
	});
},
