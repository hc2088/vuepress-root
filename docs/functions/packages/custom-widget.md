---
title: 在Fair 中使用自定义Widget
comment: false
order: 2
---

在Fair 开发中，如果要使用自定义Widget，需要提前内置该Widget，并且需要借助@FairBinding 注解生成Widget 映射关系。

下面我们来看下具体使用步骤。

假设有一个动态页面：`FairBindingSample`，在FairBindingSample 里引用了一个自定义Widget 叫 `FairBindingWidget`。

```dart
import 'package:example/fair_widget/fairbinding/fair_binding_widget.dart';
import 'package:fair/fair.dart';
import 'package:flutter/material.dart';

@FairPatch()
class FairBindingSample extends StatelessWidget {
  const FairBindingSample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Fair 自定义Widget 演示'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Hello World！',
            ),
            // 引用自定义的 FairBindingWidget
            FairBindingWidget(),
          ],
        ),
      )
    );
  }
}

```

此时，需要使用@FairBinding 注解，并传入FairBindingWidget 的路径：

```dart
@FairBinding(packages: [
  'package:example/fair_widget/fairbinding/fair_binding_widget.dart',
])
void main() {

  WidgetsFlutterBinding.ensureInitialized();

  FairApp.runApplication(
    FairApp(
      child: MyApp(),
      ......
    )
  );
}
```
然后，执行 build_runner 编译命令，用于生成自定义组件FairBindingWidget 的映射关系：

`flutter pub run build_runner build`

编译完成后，会生成一个src 目录，在src 目录下会生成一个generated.fair.dart 文件：

![image.png](https://pic7.58cdn.com.cn/nowater/frs/n_v3e3dfee4285ba4023942618561c4c8a29.png)

打开文件，可以看到 FairBindingWidget 的映射关系：

```dart
class AppGeneratedModule extends GeneratedModule {
  @override
  Map<String, dynamic> components() {
    return {
      'FairBindingWidget': (props) => FairBindingWidget(
        key: props['key'],
      ),
    };
  }
  
  @override
  Map<String, bool> mapping() {
    return const {
      'FairBindingWidget': true,
    };
  }
}
```

然后，需要将生成的AppGeneratedModule 注册到FairApp 中：

```dart
import 'src/generated.fair.dart' as g;

void main() {
  
  WidgetsFlutterBinding.ensureInitialized();
  
  FairApp.runApplication(
    FairApp(
      child: MyApp(),
      // 注册 AppGeneratedModule
      generated: g.AppGeneratedModule(),
    )
  );
}
```
注册完成后，动态页面就可以正常运行了。

![Screenshot_20220531_130950_com.example.example.jpg](https://pic5.58cdn.com.cn/nowater/frs/n_v366820c21542a4cd2bc140e3dcebaf656.example)
