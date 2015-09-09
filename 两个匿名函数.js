// Run tests that need a body at doc ready
jQuery(function() {
	var container, marginDiv,
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
		body = document.getElementsByTagName("body")[ 0 ];

	if ( !body ) {
		// Return for frameset docs that don't have a body
		return;
	}

	container = document.createElement("div");
	container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

	// Check box-sizing and margin behavior.
	body.appendChild( container ).appendChild( div );
	div.innerHTML = "";
	// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
	div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

	// Workaround failing boxSizing test due to offsetWidth returning wrong value
	// with some non-1 values of body zoom, ticket #13543
	jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
		support.boxSizing = div.offsetWidth === 4;
	});

	// Use window.getComputedStyle because jsdom on node.js will break without it.
	if ( window.getComputedStyle ) {
		support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
		support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

		// Support: Android 2.3
		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. (#3333)
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		marginDiv = div.appendChild( document.createElement("div") );
		marginDiv.style.cssText = div.style.cssText = divReset;
		marginDiv.style.marginRight = marginDiv.style.width = "0";
		div.style.width = "1px";

		support.reliableMarginRight =
			!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
	}

	body.removeChild( container );
});