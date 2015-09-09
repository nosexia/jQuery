function ( context, elem ) {
	// Set document vars if needed
	// context.ownerDocument为documetn对象
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
}



//参考文章   http://kb.cnblogs.com/page/50343/
function contains(){
	var adown = a.nodeType === 9 ? a.documentElement : a,
		bup = b && b.parentNode;
	return a === bup || !!( bup && bup.nodeType === 1 && (
		adown.contains ?
			adown.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	));

}

