## 1. 什么是service worker
	
service worker是浏览器在后台独立于网页运行的、用 JavaScript 编写的脚本， 是一个 worker，也可以理解成一个网络代理服务器。
	
它无法直接和DOM进行通信，但是可以和js主线程进行通信，因此如果需要操作页面节点的话，可以通过 postMessage 来跟想控制的页面进行通信。
	
在兼容性方面，Chrome、Firfox、Opera都已经支持，Microsoft Edge 现在也表示公开支持。而之前 Safari 因为不计划支持被很多开发者吐槽，认为它将会是下一代 IE 。迫于压力下，现 Safari 也暗示未来会进行开发。
	
## 2. 使用前提
	
如果网站要使用 service worker ，传输协议必须为 HTTPS 。因为 service worker 中会涉及到请求拦截，所以必须使用 HTTPS 协议来保证安全。 另外，如果需要本地调试 service worker 的话， localhost 是被支持的。
	
## 3. service worker 能做什么
	
	离线缓存
	消息推送
	事件同步
	定时同步
	请求拦截
	地理围栏
	
## 4. 生命周期
	
一个 Service Worker 可能处于以下 6 个状态之一：已解析（parsed），正在安装（installing），已安装（installed），正在激活（activating），已激活（activated）以及冗余（redundant）
	
### 已解析（Parsed）

当我们第一次尝试注册一个 Service Worker 的时候，用户代理（浏览器）解析脚本并获取入口点。如果解析成功（并且其他比如 HTTPS 的条件满足），我们就可以访问 Service Worker 的 registration 对象。它包含这个 Service Worker 的状态信息以及它的作用域。
```js
/* In main.js */
if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register('./sw.js')
    .then(function(registration) {
        console.log("Service Worker Registered", registration);
    })
    .catch(function(err) {
        console.log("Service Worker Failed to Register", err);
    })
}
```

Service Worker 的成功注册并不代表它已经被安装或者是被激活，只是脚本被成功解析而已，它与当前文档同源，并且是 HTTPS 协议。一旦解析完成，Service Worker 就开始进入下一个状态。

### 正在安装（Installing）

一旦 Service Worker 脚本已经被解析，用户代理（浏览器）就准备安装它，它开始进入正在安装的状态。在 Service Worker 的 registration 对象中，我们能够通过检查 installing 属性来知道它是否处于正在安装的状态。

```js
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    if (registration.installing) {
        // Service Worker is Installing
    }
})
```

在正在安装的状态中，Service Worker 脚本可以处理 install 事件，在一个典型的 install 事件中，我们通常会为文档缓存一些静态文件。

```js
/* In sw.js */
self.addEventListener('install', function(event) {  
  event.waitUntil(
    caches.open(currentCacheName).then(function(cache) {
      return cache.addAll(arrayOfFilesToCache);
    })
  );
});
```

如果在事件对象中有一个 event.waitUntil() 方法，接受一个 Promise 参数，在这个 Promise 对象没有被 resolved 之前，install 事件都不会成功。如果 Promise 被 rejected 了，那么 install 事件失败，Service Worker 变成冗余态（redundant）。
```js
/* In sw.js */
self.addEventListener('install', function(event) {  
  event.waitUntil(
   return Promise.reject(); // Failure
  );
});
```
	
### 已安装（Installed / Waiting）

	如果安装成功，Service Worker 的状态变为已安装（installed），也被称为等待中（waiting）。处于这个状态代表它是一个合法的，但并未被激活的 worker。它还没有控制文档，或者应该说是它正准备从当前 worker 那里接管文档。

	在 Service Worker 的 registration 对象中，我们可以通过 waiting 属性来判断它是否处于该状态。

```js
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    if (registration.waiting) {
        // Service Worker is Waiting
    }
})
```

这是一个很好的时机去通知应用的用户更新一个新的版本，或者为他们自动更新。

### 正在激活（Activating）

在如下几个场景下，一个处于 waiting 状态的 Service Worker 会被触发，成为 activating 状态：

	- 当前没有激活的 worker
	- 如果在 Service Worker 的脚本中 self.skipWaiting() 被调用
	- 如果用户访问其他页面并释放了之前激活的 worker
	- 在一个特定的时间过去后，之前一个激活的 worker 被释放
  
	处于正在激活（activating）状态下，我们可以在 Service Worker 脚本中处理 activate 事件。在一个典型的 activate 事件中，我们可以清除缓存中的文件。
```js
/* In sw.js */
self.addEventListener('activate', function(event) {  
  event.waitUntil(
    // Get all the cache names
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // Get all the items that are stored under a different cache name than the current one
        cacheNames.filter(function(cacheName) {
          return cacheName != currentCacheName;
        }).map(function(cacheName) {
          // Delete the items
          return caches.delete(cacheName);
        })
      ); // end Promise.all()
    }) // end caches.keys()
  ); // end event.waitUntil()
});
```

和 install 事件类似，有一个 event.waitUntil() 方法，在传入的 Promise 没有 resolved 之前，激活都不会成功。如果 Promise 被 rejected 了，那么 activate 事件将失败，Service Worker 变成冗余状态。

### 已激活（Activated）

如果激活成功了，Service Worker 变为激活（active）状态。如果处于此状态，那么它就是一个完成控制着文档的激活了的 worker。我们可以通过 active 属性来检查它是否处于此状态。
```js
	/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    if (registration.active) {
        // Service Worker is Active
    }
})
```
	
    当一个 Service Worker 被激活了，它就可以处理一些有用的时间了：fetch 以及 message。
```js
	/* In sw.js */
	self.addEventListener('fetch', function(event) {  
  // Do stuff with fetch events
});
	self.addEventListener('message', function(event) {  
  // Do stuff with postMessages received from document
});
```
	
	
### 冗余（Redundant）

一个 Service Worker 变成冗余状态可以有如下几个原因：

	- 处于 installing 状态时安装失败
	- 处于 activating 状态时激活失败
	- 一个新的 Service Worker 代替了它成为了激活的 Service Worker
	- 
如果 Service Worker 是由于前两个原因变成冗余状态的，我们可以在开发者工具中看到它们。

如果之前有一个激活的 Service Worker，那么它将继续控制着文档。
