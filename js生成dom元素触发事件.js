<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>

</head>
<style type="text/css">
	.div1{width:300px; height:300px;background:#f00;}
	.div2{width:200px;height:200px;background:#ff0;}
	.div3{width:100px;height:100px;background:#f30;}
</style>
<body>
	<div class="div1">
		<div class="div2"></div>
	</div>
</body>
</html>
<script type="text/javascript" src="js/2.0.3.js"></script>
<script type="text/javascript">

	/**
	 * div3是后来通过DOM生成的元素，也能够进行事件绑定
	 * 事件绑定在.div1上面   elem.addEventListener( type, eventHandle, false );
	 * 当点击.div1是， 触发
	 *eventHandle = elemData.handle = function( e ) {
			// Discard the second event of a jQuery.event.trigger() and
			// when an event is called after a page has unloaded
			//执行jQuery.event.dispatch函数 this->elem,arguments-原生事件对象
			//当事件执行的时候执行eventHandle函数，在elemData.handle上面挂载了elem属性，指向elem
			return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
				jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
				undefined;
		};

		会在jQuery.event.handlers.js中返回handlerQueue数组
		1.如果是点击的是.cur !== this时为false 返回handlerQueue为[] ,最终不会调用真正的事件函数
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
		//this指向事件委托元素
		for ( ; cur !== this; cur = cur.parentNode || this ) { 




		2.当点击div2时，事件冒泡触发div1，此时matches[ sel ] = 0，返回值handlerQueue是空数组和上面一样
		if ( matches[ sel ] === undefined ) {
			matches[ sel ] = handleObj.needsContext ?
				jQuery( sel, this ).index( cur ) >= 0 :
				jQuery.find( sel, this, null, [ cur ] ).length;
		}


	 */
	

	$( ".div1" ).on( "click" ,".div3" ,function(){
		console.log( "111" );
	} )
	$( ".div2" ).append( "<div class='div3'></div>" )

</script>