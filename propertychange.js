<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>

<input type="text" value="监听表单" >

	<div class="div1" style="width:100px;height: 100px;background: #f00 "></div>

<script type="text/javascript" src="js/jQuery.1.11.1.js" ></script>
<script type="text/javascript">

$( "input" ).on( "propertychange" , function( e ){
	console.log( e.propertyName )
} )



//input的属性和值改变都会触发input的propertychange事件
$( ".div1" ).on( "click" , function(){
	$( "input" ).attr( "extra" , "nose" );	
	$( "input" ).val( "ccc" );
} )

//e.originalEvent.propertyName需要监听的




</script>




</body>
</html>