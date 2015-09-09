jQuery.fn.extend({
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	}
})

pushStack: function( elems ) {

	// Build a new jQuery matched element set
	// ret = 
	var ret = jQuery.merge( this.constructor(), elems );

	// Add the old object onto the stack (as a reference)
	ret.prevObject = this;
	ret.context = this.context;

	// Return the newly-formed element set
	return ret;
},

$( "div" ).filter( ".div1" );