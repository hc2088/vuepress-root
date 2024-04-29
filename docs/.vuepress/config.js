module.exports = {
    title: '我的博客',
    description: '测试vuepress',
    theme: 'reco',
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    base: '/vuepress-root/',
    themeConfig: {
        nav: [
            { text: "首页", link: "/" },
            {
                text: "我是小胡胡的博客",
                items: [
                    { text: "掘金", link: "https://juejin.cn/user/3051900006055773" },
                    { text: "Github", link: "https://github.com/hc2088/" },
                    { text: "简书", link: "https://www.jianshu.com/u/29f69849848a" },
                ]
            }
        ],
        sidebar: [
            {
                title: "欢迎学习",
                path: "/",
                collapsable: false,
                children: [
                    { title: "博客简介", path: "/" }
                ]
            },
            {
                title: "functions",
                path: "/functions",
                collapsable: false,
                children: [
                    {
                        title: "logic", path: "/functions/logic", children: [
                            {
                                title: "使用FairCommonPlugin（推荐用法）.md",
                                path: "/functions/logic/使用FairCommonPlugin（推荐用法）.md"
                            },
                            {
                                title: "自定义FairPlugin.md",
                                path: "/functions/logic/自定义FairPlugin.md"
                            },
                        ]
                    },
                    {
                        title: "logic", path: "/functions/logic", children: [
                            {
                                title: "使用FairCommonPlugin（推荐用法）.md",
                                path: "/functions/logic/使用FairCommonPlugin（推荐用法）.md"
                            },
                            {
                                title: "自定义FairPlugin.md",
                                path: "/functions/logic/自定义FairPlugin.md"
                            },
                        ]
                    },
                    {
                        title: "packages", path: "/functions/packages", children: [
                            {
                                title: "使用FairCommonPlugin（推荐用法）.md",
                                path: "/functions/packages/custom-widget.md"
                            },
                            {
                                title: "自定义FairPlugin.md",
                                path: "/functions/packages/third-party-package.md"
                            },
                        ]
                    },

                ]
            }
        ],
        themeConfig: {
            subSidebar: 'auto',
        },
    },
    plugins: [
        // ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
        //     width: '300px', // 默认 260px
        //     title: '消息提示',
        //     body: [
        //         {
        //             type: 'title',
        //             content: '添加我是小胡胡好友入前端交流群',
        //             style: 'text-aligin: center;'
        //         },
        //         {
        //             type: 'image',
        //             src: 'https://pic2.58cdn.com.cn/nowater/frs/n_v3a7abd00c12c14561ba6da6b0c34a4ed0.JPG'
        //         }
        //     ],
        //     footer: [
        //         {
        //             type: 'button',
        //             text: '打赏',
        //             link: '/donate'
        //         }
        //     ]
        // }],
        // ["vuepress-plugin-nuggets-style-copy", {
        //     copyText: "复制代码",
        //     tip: {
        //         content: "复制成功"
        //     }
        // }],
        // [
        //     'copyright',
        //     {
        //         authorName: '我是小胡胡', // 选中的文字将无法被复制
        //         minLength: 30, // 如果长度超过  30 个字符
        //     },
        // ],
        // [
        //     '@vuepress-reco/vuepress-plugin-kan-ban-niang',
        //     {
        //         theme: ['blackCat', 'whiteCat', 'haru1', 'haru2', 'haruto', 'koharu', 'izumi', 'shizuku', 'wanko', 'miku', 'z16']
        //     }
        // ]
    ]
}
