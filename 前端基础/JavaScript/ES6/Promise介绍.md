## 1. 什么是Promise
	
Promise是ES6提供的一种异步解决方案, 它允许将写法复杂的传统回调函数和监听事件的异步操作, 用同步代码的形式将结果传达出来. 从本意讲, promise表示承诺, 就是承诺一定时间处理异步(也可同步)之后会给你一个结果, 并且这个结果会根据情况有着不同的状态.
	
## 2. 传统回调的弊端
	
```js
	function fn1(value, callback) {
	  setTimeout(() => {
	    let a = 1
	    for(let i = 1; i <= value; i++) {
	      a *= i
	      callback(a)
	    }
	  }, )
	}
	fn1(10000000, function(result) => {
	  console.log(result)
	})
```
	
上面代码是先进行阶乘运算, 计算完后执行 `callback` 回调. 假如为了得到 `10000000` 的的阶乘, 因为运算量大, 不让他阻塞js, 使其在异步中执行, 因此需要同回调来得到结果.
	
但是此时又需要将这个结果在 `fn2` 函数中做一些减法处理
```js
	function fn2(value, callback) {
	  setTimeout(() => {
	    const b = value - 1 - 2 - 3 - 4 - 1000
	    callback(b)
	  }, 100)
	}
	
	fn1(10000000, function(result1) => {
	  fn2(result1, function(result2) => {
	    console.log(result)
	  })
	})
```
	
然后需要在 `fn3` 函数中做一些乘法处理, 在 `fn4` 函数中做一些加法处理...`fn5 fn6 fn7...fn100`........
	
```js
	function fn3(value, callback) {
	  // value = x*x*123...
	  callback(value)
	}
	
	function fn4(value, callback) {
	  // value = x+x+123...
	  callback(value)
	}
	
	fn1(10000000, function(result1) => {
	  fn2(result1, function(result2) => {
	    fn3(result2, function(result3) => {
	      fn4(result3, function(result4) => {
	        ...
	        fn100(result99, function(result100) => {
	          console.log(result)
	        })
	      })
	    })
	  })
	})
```

通过一百次回调得到最终结果...就成了回调地狱, 真实情况虽然没有这么多层级, 但是每一个处理函数的内容也不可能这么简单, 到时候肯定很臃肿不美观, 说不定其中的某个回调的结果在哪里都找不到(`result1, result2, result3`...)…
	
## 3. Promise的出现
	
`Promise` 表示承诺, 它也会像回调函数一样, 承诺一个结果, 但是这个结果会根据 `promise` 的状态通过不同的方式(成功或者失败)传递出来.
	
**回调的弊端:**
	
	• 层层嵌套, 代码书写逻辑与传统顺序有差异, 不利于阅读与维护
	• 其中异步操作顺序变更时, 可能需要大量重新变动
		
**Promise能解决两个问题:**
	
	• 回调地狱, 它能通过函数链式调用方式来执行异步然后处理结果, 使得代码逻辑书写起来像同步
	• 支持并发, 比如说获取多个并发请求的结果

## 4. Promise的状态
	
`Promise` 是一个构造函数, 通过`new Promise`的方式得到一个实例对象, 创建时接受一个执行函数(下面简称 `fn` )作为参数, 这个执行函数也同时也有两个形参`resolve`, `reject`
	
```js
	const promise = new Promise((resolve, reject) => {
	  // ...do something asynchronous
	  // resolve sth or reject sth
	})
```
	
**`promise`本身有三种状态:**

	• pending -> 等待
	• fulfilled -> 执行态
	• rejected -> 拒绝态
		
`Promise` 是一个构造函数, 他需要通过 `new` 实例化来使用, 实例化的同时 `Promise` 内部的状态为初始的 `pending`
	
`fn` 表示传入一个回调函数, 它会被` Promise` 内部传入两个参数 `resolve` , `reject`
当fn内部的代码执行 `resolve` 或者 `reject` 时, 它的内部的状态都会变化

**与 resolve reject 对应的状态为**

	resolve -> fulfilled
	reject  -> rejected
	
**一旦`promise`被`resolve`或`reject`，就不能再迁移到其他任何状态。** 
	
## 5. Promise使用
	
`then`方法注册当`resolve(成功)`/`reject(失败)`时的回调函数
	
```js
	const promise = new Promise((resolve, reject) => {
	  // ...do something asynchronous
	  // resolve sth or reject sth
	})
	
	promise.then(fulfilled, rejected)
	// fulfilled 是promise执行当resolve 成功时的回调
	// rejected  是promise执行当reject 失败时的回调
```
	
`resolve(成功)` `fulfilled`会被调用
	
当 `fn` 内部执行 `resolve` 方法时(此时的`Promise`内部状态为 `resolved`), 可以传入一个参数 `value`, 便会执行 `then` 中的 `fulfilled` 回调, 并把 `value` 作为参数值传入
	
```js
	const promise = new Promise((resolve, reject) => {
	  let value = 1 + 1
	  resolve(value)
	}).then(function(res) {
	  console.log(res) // --> 2 , 这里的 res 就是resolve传入的 value
	})
```

`reject(失败)` `rejected`会被调用
	
```js
	const promise = new Promise((resolve, reject) => {
	  let value = 1 + 1
	  reject(value)
	})
	.then(function(res) {
	  console.log(res) // fulfilled 不会被调用
	}, function(err) {
	  console.log(err) // 2
	})
```
	
上面代码中, `fn` 代码 执行了 `reject`, 此时的 `Promise` 内部状态为 `rejected`. 因此就会只执行 `then` 中的第二个执行回调(`rejected`), 同样 `reject` 接受一个 `value` 参数 传给 下一个 `then` 中的 `rejected` 执行后续错误的回调
	
### `promise.catch` 捕获错误
	
链式调用写法中可以捕获前面的 `then` 中 `resolved` 回调发生的异常，上一级发生的异常，会先传递给下一级的 `rejected` 函数，若没有传入 `rejected` 函数，则传递给 `catch` 进行处理
	
```js
	promise.catch(rejected)
	// 相当于
	promise.then(null, rejected)
	// 注意: rejected 不能捕获当前 同一层级fulfilled 中的异常
	
	promise.then(fulfilled, rejected) 
	// 可以写成：
	promise.then(fulfilled)
	       .catch(rejected)  
``` 
	
### 当 `fullfill` 中发生错误时:
	
```js
	const promise = new Promise((res, rej) => {
	  res(1)
	})
	.then(res => {
	  let a = 1
	  return res + a.b.c
	})
	.then(res => {
	  return res + 1
	}, err => {
	  // 会捕获上一级的错误
	  console.log(err) // Cannot read property 'c' of undefined
	})
```
	
```js
	const promise = new Promise((res, rej) => {
	  res(1)
	}).then(res => {
	  let a = 1
	  return res + a.b.c
	}).then(res => {
	  return res + 1
	}).then(res=> {
	  console.log(res)
	}).catch(err => {
	  // 上面任何一级发生错误 最终都会转入catch
	  console.log(err) // TypeError: Cannot read property 'c' of undefined
	})
	
	const promise = new Promise((res, rej) => {
	  res(1)
	})
	  .then(res => {
	    let a = 1
	    return res + a.b.c
	  })
	  .then(res => {
	    return res + 1
	  }, err => { // 这里会被先捕获
	    console.log(err) // TypeError: Cannot read property 'c' of undefined
	  })
	  .then(res=> {
	    console.log(res)
	  }).catch(err => {
	  // 已经被上面的 rejected 回调捕获 就不会执行 catch 了
	  console.log(err) 
	  })
```
	
需要注意的是，当 `then` 执行的 `rejected` 回调传入的参数，会被下一级的 `resolved` 执行回调接受，而不是 `rejected`
	
```js
	const promise = new Promise((res, rej) => {
	  res(1)
	})
	  .then(res => {
	    let a = 1
	    return res + a.b.c
	  })
	  .then(res => {
	    return res + 1
	  }, err => {
	    console.log(err) // 这里捕获到错误后, 返回的值 仍然是会被 下一级 then 中的 resolved 执行回调 接收
	    return 'dz'
	  })
	  .then(res=> {
	    console.log(res) // dz
	  }, err => {
	    console.log(err)
	  })
```
