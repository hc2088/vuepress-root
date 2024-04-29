---
title: 在Fair 中使用三方库
comment: false
order: 1
---

在Fair 中，如果使用了三方库中的Widget，需要提前内置对应的Widget 的映射关系。映射关系不用开发者手写，只需要使用@FairBinding 注解，FairCompiler 就会自动查找，并生成Widget 的映射关系。

下面介绍下具体使用步骤。

我们以三方库card_swiper 的使用为例进行介绍。card_swiper在布局中的使用如下：

```dart
import 'package:card_swiper/card_swiper.dart';
import 'package:fair/fair.dart';
import 'package:flutter/material.dart';

@FairPatch()
class SwiperTemplate extends StatefulWidget {
  const SwiperTemplate({Key? key}) : super(key: key);

  @override
  State<SwiperTemplate> createState() => _SwiperTemplateState();
}

class _SwiperTemplateState extends State<SwiperTemplate> {
  final List<ItemData> _listData = <ItemData>[];
  
  ......
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Swiper模版'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: requestData,
        child: Icon(Icons.add),
      ),
      body: Sugar.ifEqualBool(isDataEmpty(),
          trueValue: () => Center(
            child: Text(
              '加载中...',
            ),
          ),
          falseValue: () => Container(
            padding: const EdgeInsets.only(
                left: 20, top: 0, right: 20, bottom: 20),
            child: AspectRatio(
              // 配置宽高比
              aspectRatio: 2.5,
              child: Swiper(
                itemBuilder: Sugar.indexedWidgetBuilder(
                        (context, index) => Image.network(
                      getBannerIcon(index),
                      width: 50,
                      height: 50,
                    )),
                // 配置图片数量
                itemCount: dataLength(),
                // 底部分页器
                pagination: null,
                // 左右箭头
                control: null,
                // 无限循环
                loop: true,
                // 自动轮播
                autoplay: true,
              ),
            ),
          )),
    );
  }
}

class ItemData extends Object {
  String picUrl = '';
}

```

页面开发完成后，需要使用@FairBinding 注解，并传入card_swiper 的路径：

```dart
@FairBinding(packages: [
  'package:card_swiper/src/swiper.dart',
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
接下来执行build_runner 命令：

`flutter packages pub run build_runner build --delete-conflicting-outputs`

或者使用FairTemplate 插件 - Fair Build命令执行。

编译完成后，在src 目录下会生成一个generated.fair.dart 文件：

```dart
import 'package:card_swiper/src/swiper.dart';
import 'dart:async';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:card_swiper/card_swiper.dart';
import 'package:card_swiper/src/transformer_page_view/transformer_page_view.dart';

import 'package:flutter/material.dart';
import 'package:fair/fair.dart';
import 'package:fair_version/fair_version.dart';

class AppGeneratedModule extends GeneratedModule {
  @override
  Map<String, dynamic> components() {
    return {
      'Swiper': (props) => Swiper(
        itemBuilder: props['itemBuilder'],
        indicatorLayout:
        props['indicatorLayout'] ?? PageIndicatorLayout.NONE,
        transformer: props['transformer'],
        itemCount: props['itemCount'],
        autoplay: props['autoplay'] ?? false,
        layout: props['layout'] ?? SwiperLayout.DEFAULT,
        autoplayDelay: props['autoplayDelay'] ?? kDefaultAutoplayDelayMs,
        autoplayDisableOnInteraction:
        props['autoplayDisableOnInteraction'] ?? true,
        duration: props['duration'] ?? kDefaultAutoplayTransactionDuration,
        onIndexChanged: props['onIndexChanged'],
        index: props['index'],
        onTap: props['onTap'],
        control: props['control'],
        loop: props['loop'] ?? true,
        curve: props['curve'] ?? Curves.ease,
        scrollDirection: props['scrollDirection'] ?? Axis.horizontal,
        axisDirection: props['axisDirection'] ?? AxisDirection.left,
        pagination: props['pagination'],
        plugins: as<SwiperPlugin>(props['plugins']),
        physics: props['physics'],
        key: props['key'],
        controller: props['controller'],
        customLayoutOption: props['customLayoutOption'],
        containerHeight: props['containerHeight']?.toDouble(),
        containerWidth: props['containerWidth']?.toDouble(),
        viewportFraction: props['viewportFraction']?.toDouble() ?? 1.0,
        itemHeight: props['itemHeight']?.toDouble(),
        itemWidth: props['itemWidth']?.toDouble(),
        outer: props['outer'] ?? false,
        scale: props['scale']?.toDouble(),
        fade: props['fade']?.toDouble(),
        allowImplicitScrolling: props['allowImplicitScrolling'] ?? false,
      ),
      'Swiper.children': (props) => Swiper.children(
        children: as<Widget>(props['children']) ?? const [],
        autoplay: props['autoplay'] ?? false,
        transformer: props['transformer'],
        autoplayDelay: props['autoplayDelay'] ?? kDefaultAutoplayDelayMs,
        autoplayDisableOnInteraction:
        props['autoplayDisableOnInteraction'] ?? true,
        duration: props['duration'] ?? kDefaultAutoplayTransactionDuration,
        onIndexChanged: props['onIndexChanged'],
        index: props['index'],
        onTap: props['onTap'],
        loop: props['loop'] ?? true,
        curve: props['curve'] ?? Curves.ease,
        scrollDirection: props['scrollDirection'] ?? Axis.horizontal,
        axisDirection: props['axisDirection'] ?? AxisDirection.left,
        pagination: props['pagination'],
        control: props['control'],
        plugins: as<SwiperPlugin>(props['plugins']),
        controller: props['controller'],
        key: props['key'],
        customLayoutOption: props['customLayoutOption'],
        physics: props['physics'],
        containerHeight: props['containerHeight']?.toDouble(),
        containerWidth: props['containerWidth']?.toDouble(),
        viewportFraction: props['viewportFraction']?.toDouble() ?? 1.0,
        itemHeight: props['itemHeight']?.toDouble(),
        itemWidth: props['itemWidth']?.toDouble(),
        outer: props['outer'] ?? false,
        scale: props['scale']?.toDouble() ?? 1.0,
        fade: props['fade']?.toDouble(),
        indicatorLayout:
        props['indicatorLayout'] ?? PageIndicatorLayout.NONE,
        layout: props['layout'] ?? SwiperLayout.DEFAULT,
      ),
      'Swiper.list': (props) => Swiper.list(
        transformer: props['transformer'],
        list: as(props['list']) ?? const [],
        customLayoutOption: props['customLayoutOption'],
        builder: props['builder'],
        autoplay: props['autoplay'] ?? false,
        autoplayDelay: props['autoplayDelay'] ?? kDefaultAutoplayDelayMs,
        reverse: props['reverse'] ?? false,
        autoplayDisableOnInteraction:
        props['autoplayDisableOnInteraction'] ?? true,
        duration: props['duration'] ?? kDefaultAutoplayTransactionDuration,
        onIndexChanged: props['onIndexChanged'],
        index: props['index'],
        onTap: props['onTap'],
        loop: props['loop'] ?? true,
        curve: props['curve'] ?? Curves.ease,
        scrollDirection: props['scrollDirection'] ?? Axis.horizontal,
        axisDirection: props['axisDirection'] ?? AxisDirection.left,
        pagination: props['pagination'],
        control: props['control'],
        plugins: as(props['plugins']),
        controller: props['controller'],
        key: props['key'],
        physics: props['physics'],
        containerHeight: props['containerHeight']?.toDouble(),
        containerWidth: props['containerWidth']?.toDouble(),
        viewportFraction: props['viewportFraction']?.toDouble() ?? 1.0,
        itemHeight: props['itemHeight']?.toDouble(),
        itemWidth: props['itemWidth']?.toDouble(),
        outer: props['outer'] ?? false,
        scale: props['scale']?.toDouble() ?? 1.0,
        fade: props['fade']?.toDouble(),
        indicatorLayout:
        props['indicatorLayout'] ?? PageIndicatorLayout.NONE,
        layout: props['layout'] ?? SwiperLayout.DEFAULT,
      ),
      'SwiperLayout': {
        'DEFAULT': SwiperLayout.DEFAULT,
        'STACK': SwiperLayout.STACK,
        'TINDER': SwiperLayout.TINDER,
        'CUSTOM': SwiperLayout.CUSTOM,
        'values': SwiperLayout.values,
      },
    };
  }

  @override
  Map<String, bool> mapping() {
    return const {
      'Swiper': true,
      'SwiperLayout': false,
    };
  }
}

```
这里生成了card_swiper 中各个构造函数的映射关系。

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

![n_v3be089133a0c0437689aba55e53b0f3af.pic](https://pic6.58cdn.com.cn/nowater/frs/n_v3be089133a0c0437689aba55e53b0f3af.pic)


