#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m '添加新内容'

 
git push -f git@github.com:hc2088/vuepress-root.git master:main

cd -
