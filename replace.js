<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<script type="text/javascript" src="js/2.0.3.js"></script>

	<select>
		<option>1</option>
		<option>2</option>
		<option>3</option>
	</select>

	<script type="text/javascript">
     //replace中的第二个参数是函数的情况
     var reg=/a(bc)(de)/ig;   

     var str="abcdef";

     //参数word整个匹配的字符串
     //$1  子字符串1
     //$2  子字符串2
     str.replace( reg , function( word , $1 , $2 ) {
          console.log( word + "||" + $1 +"||" + $2 );
     } )

     </script>

	<script type="text/javascript">
     //replace，当匹配的子字符有多个时，内部会自动的做循环
     var reg=/\w(\d+)/ig;

     var str="deawe12ewer13";

     str.replace( reg , function( word , key ) {
          //循环两次
          console.log( word );                              //e12       r13
     } )

     </script>

	<script type="text/javascript">
    

   
     var reg=/\w(\d+)/ig;

     var str="deawe12ewer13";

     var a=str.replace( reg , function( word , key ) {
          //返回值，替换的值
          return " nose " ;
     } )

     console.log( a ) ;

    

    
     </script>

</body>
</html>