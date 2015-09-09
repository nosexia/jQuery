// Populate the class2type map
// 
	class2type = {} ;
//   
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ ["objectBoolean"] ] = "BOOLEAN"
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});