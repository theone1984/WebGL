classloader.setBaseDirectory('js');

classloader.package()

.import('test.someClass')
.import('test.bla')

.execute(function() {
	var sayer = test.someClass();
	sayer.sayHello();
});