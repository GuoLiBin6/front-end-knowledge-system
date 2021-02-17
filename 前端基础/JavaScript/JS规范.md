## 一、AMD规范

RequireJS是一个前端规范化的模块管理库，遵循AMD规范，每个模块定义为一个单独的文件。

AMD适用于浏览器环境，允许同步加载模块，也可以动态加载模块。

### 1. 模块定义

define方法定义模块

定义单独模块
```js
//直接定义模块
define({
    method1: function() {},
    method2: function() {},
});
//将模块定义为对象返回
define(function () {
	return {
	    method1: function() {},
		method2: function() {},
    };
});
```
定义有依赖的模块
```js
define(['./module1', './module2'], function(m1, m2) {

    return {
        method: function() {
            m1.methodA();
			m2.methodB();
        }
    };

});
```

define第一个参数是一个数组，放所依赖的模块，function中的参数依次对应引入的模块，此函数中必须返回一个对象，供其他模块调用。

### 2. 模块调用

require调用模块
```js
require(
    [ "backbone" ], 
    function ( Backbone ) {
        return Backbone.View.extend({ /* ... */ });
    }, 
    function (err) {
		// ...
    }
);
```
第一个参数为数组，放调用模块，第二个函数参数依次对应调用模块，第三个函数为错误处理函数。

## 二、CommonJS规范

服务器端模块的规范，Nde.js运用此规范。

### 1. 定义模块

一个单独的文件就是一个模块。模块有单独的作用域，模块中定义的除global的变量无法被其他模块读取。

### 2. 模块输出

模块只有一个出口，module.exports对象，需要输出的内容放入此对象中。

### 3. 模块调用

加载模块使用require方法。此方法读取一个文件并执行，返回内部的module.exports对象。
```js
 //定义模块 math.js
 var random=Math.random()*10;
 function printRandom(){
     console.log(random)
 }

 function printIntRandom(){
     console.log(Math.floor(random))
 }
 ```
 ```js
 //模块输出
 module.exports={
     printRandom:printRandom,
     printIntRandom:printIntRandom
 }
 ```
 ```js
 //加载模块 math.js
 var math=require('math')
 //就可以调用模块提供的方法
  math.printIntRandom()
  math.printRandom()
  ```
## 三、CMD规范

### 1. 模块定义

define( factory )用做模块定义，factory可以是函数、对象或字符串。

factory为对象或字符串，模块接口就是该对象或字符串。

define({ “foo”: “bar” });
也可以通过字符串定义模板模块。

define(‘this is {{data}}.’);
define为函数时，标识模板的构造方法，执行构造方法可得到模块向外提供的接口。
```js
define( function(require, exports, module) {
    // 模块代码
});
//define(id?,deps?,) 接受两个以上参数id为模块标识
    define( ‘module’, [‘module1’, ‘module2’], function( require, exports, module ){
    // 模块代码
} );
```

### 2. 模块引用

CMD与AMD不同，CMD的require作为factory的第一个参数，依赖引用推荐就近原则，require同步向下执行，需要异步加载模块时用require.async来加载
```js
define(function( require, exports ){
    var a = require(‘./a’);
    a.doSomething();
    
    var b = require('./b');
    b.doSomething();
    
    require.async(‘.c’, function(c){
    c.doSomething();
});
```

### 3. 模块接口返回

可通过模块内部路径机制来返回模块。
```js
define(function( require, exports ){
    exports.foo = ‘bar’; // 向外提供的属性
    exports.do = function(){}; // 向外提供的方法
});
```
可通过return向外提供接口
```js
define(function( require, exports ){
    return{
        foo : ‘bar’, // 向外提供的属性
        do : function(){} // 向外提供的方法
    }
});
```
也可以直接简化为对象字面量
```js
define({
    foo : ‘bar’, // 向外提供的属性
    do : function(){} // 向外提供的方法
});
```
与Node.js中一样需要注意的是
```js
//错误方式
define(function( require, exports ){
    exports = {
        foo : ‘bar’, // 向外提供的属性
        do : function(){} // 向外提供的方法
    }
});
//正确方式
define(function( require, exports, module ){
    module.exports = {
        foo : ‘bar’, // 向外提供的属性
        do : function(){} // 向外提供的方法
    }
});
seajs.use 用来在页面中加载一个或多个模块，加载完成后执行回调。 
seajs.use([‘./a’,’./b’]，function(a , b){
    a.doSomething();
    b.doSomething();
});
```

## 总结

对于依赖的模块，AMD是提前执行，所有依赖一开始全部引用，即依赖前置。

CMD延时执行，使用模块前引入即可，即依赖就近。

AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。
比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供 seajs.use 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹。