# TrafficFlow

> 基于 [vizceral ](https://github.com/Netflix/vizceral) 封装的微服务可视化组件。

## 安装

`npm i trafficflow`

## 使用

```javascript
import TrafficFlow from 'TrafficFlow'
Vue.use(TrafficFlow)
```

## 属性

### definitions

* type：Object
* description：Object map of definitions.

### filters

- type：Array
- description：Array of filter definitions and current values to filter out nodes and connections.

### match

- type：String
- description： A search string to highlight nodes that match

### modes

- type：Object
- description： Map of modes to mode type, e.g. { detailedNode: 'volume' }

### objectToHighlight

- type：Object
- description：Pass in an object to highlight

### showLabels

- type：Boolean
- description：Whether or not to show labels on the nodes.

### allowDraggingOfNodes

- type：Boolean
- description：Nodes can be repositioned through dragging if and only if this is true.

### styles

- type：Object
- description：Styles to override default properties.

### traffic

- type：Object
- description：The traffic data.

### targetFramerate

- type：Number
- description：Target framerate for rendering engine.

### view

- type：Array
- description：Current view.

## 事件

### connectionHighlighted

连接高亮时触发

### nodeHighlighted

节点高亮时触发

### nodeUpdated

节点更新时触发

### nodeContextSizeChanged

节点上下文发生改变时触发

### matchesFound

每当通过 findNode（） 查询节点时，都会触发 `matchesFound` 事件。

### objectHighlighted

每当对象高亮显示时，都会触发该事件。`object.type` 是 `node` 或 `connection`

### objectHovered

每当鼠标悬停在 "node" 或 "connection" 上时，都会触发该事件。`object.type` 是 `node` 或 `connection`。如果其他"node"或"connection"已处于焦点（由于单击/突出显示事件），则不会触发此事件。

### updateStyles

更新全局样式

### viewChanged

视图发生更改时触发

### viewUpdated

每当当前显示的图形视图更新时，都会触发

## License

Apache 2.0

