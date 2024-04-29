---
title: 自定义FairPlugin
comment: false
order: 1
---

## 简介

`fair` 动态化的原理是通过解析 `StatefulWidget`/`StatelessWidget` 内的 `build` 函数，将返回的 `Widget` 解析成 `DSL`，运行时再将 `DSL` 转换为 `Widget`。

而 `build` 外的其他函数均会由 `fair` 编译器转化为 `js`，从而提供逻辑的动态化的能力，我们以一个简单的计数器加一为例

```dart
Dart：
void _incrementCounter() {
  setState(() {
    _counter++;
  });
}
```

其转化为 `js` 后内容大致如下

```javascript
JS：
_incrementCounter: function _incrementCounter() {
    const __thiz__ = this;
    with (__thiz__) {
        setState('#FairKey#', function dummy() {
            _counter++;
        });
    }
},
```
运行时在 `js` 侧调用 `setState` 实际上调用的是 `fair` 预先在 `js` 环境中内置好的具体实现（其内部会通过FlutterChannel通知到dart侧进行页面刷新）。

而当我们需要调用一些 `Flutter` 或者原生相关的能力时，就需要通过自定义插件（IFairPlugin）来实现。它为 `Fair` 提供了 `js` 跟 `Flutter` 进行交互的能力。

## FairPlugin调用协议

`fair` 为 js 中调用 Flutter 提供了 invokeFlutterCommonChannel 函数，其接收 requestParameter 和返回结果的回调函数

```javascript
let requestParameter = {};
requestParameter['className'] = "FairToast#show";
requestParameter['funcName'] = 'invokePlugin';
requestParameter['pageName'] = '#FairKey#';
requestParameter['args'] = paramsMap;
let map = JSON.stringify(requestParameter);
invokeFlutterCommonChannel(map, (resultStr) => {
...
}
```

具体协议如下

```json
{
    "className":"FairToast#show",
    "funcName":"invokePlugin",
    "pageName":"#FairKey#",
    "args":{

    }
}
```
`className` 是具体调用 `dart` 侧实现的类名与方法，用 # 分割

`funcName` 固定传入 `invokePlugin`

`pageName` 固定传入 `#FairKey#`

`args` 就是自定义的参数信息，可以根据实际情况自行设定

## 使用指南

这里我们以实现一个 `toast` 插件举例，对于 `toast` 功能的具体实现选择了 `fluttertoast` 三方库

### 1. 引入fluttertoast库
```yaml
dependencies:
  fluttertoast: ^8.2.1
```

### 2. dart侧插件实现
此处只展示部分源代码，具体可参考[实现源码](https://github.com/wuba/Fair/blob/main/fair_extension/lib/toast/fair_toast_plugin.dart)

1. 首先定义继承 `IFairPlugin` 的插件类 `FairToast`
2. 在 `_show` 函数中接收从 `js` 侧传递来的参数字典 `map`，按照指定格式解析后将参数转换为 `Fluttertoast` 库使用的配置信息并调用 `Fluttertoast` 的 `showToast`
3. 最后在 `getRegisterMethods` 函数中注册具体的实现函数 `_show`

```dart
class FairToast extends IFairPlugin {
  ///定义FlutterToast的一些入参枚举映射
  static const LENGTH_SHORT = 'LENGTH_SHORT';
  ...

  static final FairToast _fairToast = FairToast._internal();

  FairToast._internal();

  factory FairToast() {
    return _fairToast;
  }

  ///fair中使用的具体实现
  static void _show(dynamic map) async {
    if (map == null) {
      return;
    }
    var req;
    if (map is Map) {
      req = map;
    } else {
      req = jsonDecode(map);
    }
    ///解析js侧传入的数据
    var args = req['args'];
    var msg = args['msg'];
    var toastLength = args['toastLength'];
    var fontSize = args['fontSize'];
    var gravity = args['gravity'];
    var backgroundColor = args['backgroundColor'];
    var textColor = args['textColor'];
    await Fluttertoast.showToast(
      msg: msg.toString(),
      toastLength: _parseFairToastLength(toastLength) ?? Toast.LENGTH_SHORT,
      fontSize: double.tryParse(fontSize.toString()) ?? 16.0,
      gravity: _parseFairToastGravity(gravity) ?? ToastGravity.BOTTOM,
      backgroundColor: backgroundColor != null
          ? Color(int.parse(backgroundColor.toString()))
          : Colors.black,
      textColor: textColor != null
          ? Color(int.parse(textColor.toString()))
          : Colors.white,
    );
  }

  ///ToastLength参数映射
  static Toast? _parseFairToastLength(String? fairToastLength) {
    ...
  }

  ///ToastGravity参数映射
  static ToastGravity? _parseFairToastGravity(String? fairToastGravity) {
    ...
  }

  ///注册对应js的方法
  @override
  Map<String, Function> getRegisterMethods() {
    var functions = <String, Function>{};
    //用户需要注册方法，这个方法与js侧对应
    functions.putIfAbsent('show', () => _show);
    return functions;
  }
}

```

### 3. 在main函数中注册
```dart
//注册FairCommonPlugin
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  FairApp.runApplication(
      ...
      plugins: {
        'FairToast': FairToast(),
      },
}
```

### 4. 编写js插件
在 `assets/plugin` 目录下创建 `fair_toast_plugin.js`，按照 [FairPlugin调用协议](#fairplugin调用协议)组织 `requestParameter`，将插件用到的参数打包进 `args`
```javascript
class FairToast {

    static show(obj) {
        let paramsMap = {};
        if (obj.msg) {
            paramsMap['msg'] = obj.msg;
        }
        if (obj.toastLength) {
            paramsMap['toastLength'] = obj.toastLength;
        }
        if (obj.fontSize) {
            paramsMap['fontSize'] = obj.fontSize;
        }
        if (obj.gravity) {
            paramsMap['gravity'] = obj.gravity;
        }
        if (obj.backgroundColor) {
            paramsMap['backgroundColor'] = obj.backgroundColor;
        }
        if (obj.textColor) {
            paramsMap['textColor'] = obj.textColor;
        }
        let requestParameter = {};
        requestParameter['className'] = "FairToast#show";
        requestParameter['funcName'] = 'invokePlugin';
        requestParameter['args'] = paramsMap;
        requestParameter['pageName'] = '#FairKey#';
        let map = JSON.stringify(requestParameter);
        invokeFlutterCommonChannel(map, (resultStr) => {
        })
    }

}

const Toast = {
    LENGTH_SHORT: "LENGTH_SHORT",
    ...
};

const ToastGravity = {
    TOP: "TOP",
    ...
};

function Color(color){
    return color;
}
```
在 `pubspec.yaml` 中注册使用的目录
```yaml
flutter:
  assets:
    - assets/
    - assets/plugin/
```

### 5.在 assets 目录中创建 fair_basic_config.json ，注册 js 插件
```json
{
  "plugin": {
    "fair_toast_plugin": "assets/plugin/fair_toast_plugin.js"
  }
}
```

### 6.在 Fair 中使用

```dart
import 'package:fair/fair.dart';
import 'package:fair_extension/toast/fair_toast_plugin.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

@FairPatch()
class ToastPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _ToastPageState();
}

class _ToastPageState extends State<ToastPage> {

...

  void shortToast() {
    FairToast.show(
      msg: '这是一个 `Short Toast`',
      toastLength: Toast.LENGTH_SHORT,
    );
  }

  void longToast() {
    FairToast.show(
      msg: '这是一个 `Long Toast`',
      toastLength: Toast.LENGTH_LONG,
    );
  }

  void largeFontSize(){
    FairToast.show(
      msg: '字体变大',
      fontSize: 30.0,
    );
  }

  void topGravity(){
    FairToast.show(
      msg: 'ToastGravity.TOP',
      gravity: ToastGravity.TOP,
    );
  }

  void changeColor(){
    FairToast.show(
      msg: '改变字体和背景颜色',
      backgroundColor: Color(0xff00f0ff),
      textColor: Color(0xffffe80c),
    );
  }

}
```