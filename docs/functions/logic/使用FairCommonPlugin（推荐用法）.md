---
title: 使用FairCommonPlugin（推荐用法）
comment: false
order: 2
---

通常在[自定义FairPlugin](./自定义FairPlugin)时，`js` 部分的代码往往只是起到了数据/协议传递的作用，这对不熟悉 `js` 的开发者来说是很不有好的。

这里提供一个不用关注 `js` 代码编写的快速开发 `FairPlugin` 的指南，封装了一些复杂且需重复编写的模板代码，下面就以网络请求为例创建一个插件

### Step1：定义Dart侧的插件具体实现

#### 1. 定义网络请求插件 **FairHttpPlugin**
```dart
import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:fair/fair.dart';

//http插件的具体实现类
mixin FairHttpPlugin implements FairCommonPluginMixin {
  Future<dynamic> http(dynamic map) => request(map, _run);

  Future<Map?> _run(Map requestMap) async {
    final method = requestMap['method'];
    final url = requestMap['url'];
    Response<String>? result;
    switch (method) {
      case 'GET':
        result = await _get(url);
        break;
      case 'POST':
        result = await _post(url);
        break;
      default:
    }
    if (result != null) {
      return {
        'data': result.data == null ? '' : jsonDecode(result.data!),
        'statusCode': result.statusCode,
      };
    }
    return null;
  }

  static Future<Response<String>> _post(String path,
      {Map<String, String>? queryParameters}) async {
    var resp =
        await _getDio().post<String>(path, queryParameters: queryParameters);
    return Future.value(resp);
  }

  static Future<Response<String>> _get(String path,
      {Map<String, String>? queryParameters}) async {
    var resp =
        await _getDio().get<String>(path, queryParameters: queryParameters);
    return Future.value(resp);
  }

  static Dio? _dio;

  static Dio _getDio() {
    _dio ??= Dio();
    return _dio!;
  }
}
```
`FairHttpPlugin` 是一个 `mixin` 类，继承自 `FairCommonPluginMixin`，从传递的数据 `requestMap` 中解析 `method` 类型和请求 `url` ，使用 `dio` 进行网络请求，后将状态码与数据以 `map` 的形式返回即可

#### 2. 定义 **FairCommonPlugin**
```dart
import 'package:example/fair_widget/plugin/fair_http_plugin.dart';
import 'package:fair/fair.dart';

/// 跟 js 交互的方法类
class FairCommonPlugin extends IFairPlugin with FairHttpPlugin //Http请求plugin
{
  factory FairCommonPlugin() => _fairCommonPlugin;

  FairCommonPlugin._();

  static final FairCommonPlugin _fairCommonPlugin = FairCommonPlugin._();

  @override
  Map<String, Function> getRegisterMethods() {
    return <String, Function>{
      'http': http,
    };
  }
}
```
`FairCommonPlugin` 是我们调用插件的一个通用入口，继承自 `IFairPlugin`，混入 `FairHttpPlugin` 后在 `getRegisterMethods` 方法中注册 `http` 方法。

后续在扩展新的插件时也是先混入具体实现类后，在 `getRegisterMethods` 中注册即可，注意此处的 `key` 需要与函数名相同

#### 3. 在main函数中注册
```dart
//注册FairCommonPlugin
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  FairApp.runApplication(
      ...
      plugins: {
        'FairCommonPlugin': FairCommonPlugin(),
      },
}
```

至此插件的具体实现其实就已经完成了，下面还需要做一些插件的注册与模板 `js` 代码编写

### Step2：声明 js 插件并注册

#### 1.在assets目录下（或任意子目录）中创建 fair_common_plugin.js
```javascript
//js插件实现
let FairCommonPlugin = function () {
    return {
        http: function (resp) {
             fairCommonPluginRequest(resp, 'http');
        },
    }
}
```
注意在 `pubspec.yaml` 中注册使用的目录，这里以在 `assets/plugin` 中创建 `fair_common_plugin.js` 为例
```yaml
flutter:
  assets:
    - assets/
    - assets/plugin/
```
#### 2.在 assets 目录中创建 fair_basic_config.json ，注册 js 插件
```json
{
  "plugin": {
    "fair_common_plugin": "assets/plugin/fair_common_plugin.js"
  }
}
```

### Step3：使用FairCommonPlugin

我们使用编写好的插件调用一个 `http` `GET` 请求

```dart
@FairPatch()
class FairPluginWidget extends StatefulWidget {
  const FairPluginWidget({Key? key}) : super(key: key);

  @override
  State<FairPluginWidget> createState() => _FairPluginWidgetState();
}

class _FairPluginWidgetState extends State<FairPluginWidget> {

...

  commonHttp() {
    FairCommonPlugin().http({
      'method': 'GET',
      'url':
          'https://wos2.58cdn.com.cn/DeFazYxWvDti/frsupload/3b8ae7a4e0884b4d75b8094f6c83cd8c_list_page_data.json',
      'callback': (dynamic result) {
        if (result != null) {
          var statusCode = result['statusCode'];
          if (statusCode == 200) {
            var list = result['data']['data'];
            list.forEach((item) {
              var icon = item['icon'];
              print('icon = $icon');
            });
          }
        }
      }
    });
  }

}
```
在按钮的点击事件中调用 `commonHttp` 函数，在 `commonHttp` 函数中调用我们定义的插件方法，根据协议字段传入 `method`、`url`，`callback` 是内置的回调字段，通过其就可以获取到数据返回结果