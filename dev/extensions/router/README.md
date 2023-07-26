# @widget.ts/Router
简单布局网页 Routing 的工具。

## 解释
本模块有三个类：ViewWidget，PageWidget，Router。

- ViewWidget 负责管理多个 path 所对应的 PageWidget。
- PageWidget 能够包含各种元素，你也能够将另一个 ViewWidget 加入 Page 当中，实现多层级的网页布局。
- Router 负责网址判定，打开网页等基础功能。 

## 使用方式
### 单个 View 实现方式：
```js
const app = $w('app');
const ROOT_PATH = '/';
const root_view = new ViewWidget(ROOT_PATH);
app.insert([
    $w(root_view);
])

root_view.route('/', page => {
    page.insert([
        $w('h1').insert('This is Homepage')
    ])
})

$r.listen(); // 在注册完所有的路径后，必须运行一次此函数
```

### 多个层级的 View 实现方式：
```js
const ROOT_PATH = '/';
const SECOND_PATH = '/second';
const root_view = new ViewWidget(ROOT_PATH);
const second_view = new ViewWidget(SECOND_PATH);
app.insert([
    $w(root_view);
])

root_view.route('/', page => {
    page.insert([
        $w('h1').insert('This is Homepage')
    ])
})

root_view.route('/second', page => {
    page.insert([
        $w('h1').insert('This is a title from root view.'),
        $w(second_view)
    ])
})

// second_view 已经以 '/second' 路径注册，因此 second_view.route() 中所有注册的路径都是以 '/second/...' 作为开端
second_view.route('/', page => {
    page.insert([
        $w('h2').insert('This is a title from second view')
    ])
})

$r.listen();
```

### 打开页面
```js
$r.open('/second')
```