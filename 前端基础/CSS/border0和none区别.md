`border:none;` 与 `border:0;` 的区别体现有两点：

一是理论上的性能差异；

二是浏览器兼容性的差异。

## 1. 性能差异

**【border:0;】**

把 `border` 设为 `0` 像素虽然在页面上看不见，但按`border`默认值理解，浏览器依然对 `border-width/border-color` 进行了渲染，即已经占用了内存值。

**【border:none;】**

把 `border` 设为 `none` 即没有，浏览器解析 `none` 时将不作出渲染动作，即不会消耗内存值。
 
## 2. 兼容性差异

兼容性差异只针对浏览器IE6、IE7与标签 `button、input` 而言，在 `win、win7、vista`  的XP主题下均会出现此情况。
 

**【border:none;】**

当 `border` 为 `none` 时似乎对 `IE6/7` 无效边框依然存在，如下例

**【border:0;】**

当 `border` 为 `0` 时，感觉比 `none` 更有效，所有浏览器都一致把边框隐藏

## 总结

对比 `border:0;` 与 `border:none;` 之间的区别在于有渲染和没渲染，感觉他们和 `display:none;` 与  `visibility:hidden;` 的关系类似，而对于 `border` 属性的渲染性能对比暂时没找测试的方法，虽然认为他们存在渲染性能上的差异但也只能 说是理论上。
 
如何让 `border:none;` 实现全兼容？只需要在同一选择符上添加背景属性即可
