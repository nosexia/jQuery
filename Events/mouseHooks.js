/**
 * 给jQuery.Event的实例对象添加pageX,pageY,which属性
 */
keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
},

mouseHooks: {
	props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
	filter: function( event, original ) {
		var eventDoc, doc, body,
			button = original.button;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && original.clientX != null ) {
			eventDoc = event.target.ownerDocument || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
			event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && button !== undefined ) {
			event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
		}

		return event;
	}
},