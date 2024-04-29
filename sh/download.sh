echo ".........................创建文档项目中........................";
read -p "Please input your_project_name:" your_project_name
read -p "Please input your_team:" your_team
echo you input your_project_name="$your_project_name" your_team="$your_team"
echo "$your_project_name";

git clone -b online https://jinmingxiang:jNvXd2tuuXPM1fmzxDy4@igit.58corp.com/house-rn/house-doc-vue.git $your_project_name
cd $your_project_name
rm -rf .git
git init
git remote add origin http://igit.58corp.com/house-rn/$your_project_name.git
git add .

read -p "Please input your_commit:" your_commit
read -p "Please input your_branch:" your_branch
echo "...........................开始提交代码........................."
git commit -m $your_commit
git push -u origin $your_branch
echo "代码推送到远程"
echo "...........................文档初始化中.........................."
yarn install
echo "...........................开始运行文档.........................."
npm run start