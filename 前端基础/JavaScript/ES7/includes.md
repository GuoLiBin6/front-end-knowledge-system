## Array.prototype.includes()

`includes()` 作用,是查找一个值在不在数组里,若是存在则返回 `true` ,不存在返回 `false`

## 1.基本用法：

```js
['a', 'b', 'c'].includes('a')     // true
['a', 'b', 'c'].includes('d')     // false
```

## 2.接收俩个参数：要搜索的值和搜索的开始索引

```js
['a', 'b', 'c', 'd'].includes('b')         // true
['a', 'b', 'c', 'd'].includes('b', 1)      // true
['a', 'b', 'c', 'd'].includes('b', 2)      // false
```
## 3.与ES6中的indexOf()比较

有些时候是等效的
```js
['a', 'b', 'c'].includes('a')          //true
['a', 'b', 'c'].indexOf('a') > -1      //true

var arr = [1, 2, 3]
var a = 1;
arr.includes(a)   //true
arr.indexOf(a)    //0 
```

在判断 +0 与 -0 时，被认为是相同的。
```js
[1, +0, 3, 4].includes(-0)    //true
[1, +0, 3, 4].indexOf(-0)     //1
```

只能判断简单类型的数据，对于复杂类型的数据，比如对象类型的数组，二维数组，这些，是无法判断的.
```js
var arr = [1, [2, 3], 4]
arr.includes([2, 3])   //false
arr.indexOf([2, 3])    //-1
```

## 优缺点比较

**简便性**
  
`includes()` 返回的是布尔值，能直接判断数组中存不存在这个值，而 `indexOf()` 返回的是索引，这一点上前者更加方便。

**精确性**

两者都是采用 `===` 的操作符来作比较的，不同之处在于：对于 `NaN` 的处理结果不同。

我们知道 `js` 中 `NaN === NaN` 的结果是 `false`,`indexOf()`也是这样处理的，但是`includes()`不是这样的。

```js
let demo = [1, NaN, 2, 3]

demo.indexOf(NaN)        //-1
demo.includes(NaN)       //true
```

## 总结：

由于它对 `NaN` 的处理方式与 `indexOf` 不同，假如你只想知道某个值是否在数组中而并不关心它的索引位置，建议使用 `includes()`。如果你想获取一个值在数组中的位置，那么你只能使用 `indexOf` 方法。