# Widget.ts
为个人前端开发而生的代码库。
> 请使用 webpack / Vite / Parcel 等打包工具编译此库

## 目录
- [提示](#提示)
- [使用](#使用)
- [安装](#安装)

## 提示
- 此库完全使用 TypeScript 进行编写，且不提供 JavaScript 的源文件。
- 适合 ES6 以上的网页开发环境。

## 使用
### 安装
```npm i widget.ts```

### 调用
方法一：
```ts
import { $w } from 'widget.ts';

const app = $w('div');

app.content([
    $w('h1').content('Hello World')
])

document.body.append(app.nodeElement);
```

方法二：
```ts
import { DivWidget, TextWidget } from 'widget.ts';

const app = new ParentWidget({
    tagname: 'app',
    content: [
        new TextWidget('h1', {
            content: 'Hello World'
        })
    ]
})

document.body.append(app.nodeElement);
```