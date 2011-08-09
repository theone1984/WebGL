classloader.package('test', 'someClass')

.import('test.bla')

.class(function() {
	var hello = "Hello";
	var world = y;
		
	function sayHello() {
		console.log(hello + " " + world);
	}
		
	return {
		'sayHello': sayHello
	}
});