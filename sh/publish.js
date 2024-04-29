
const shellJS = require('shelljs');
const ora = require('ora') 

function publish(){
    
    Promise.resolve({})
    .then((context)=>{
        return startBuild().then((target)=>{

            return target;
        })
    })
    .then((content)=>{
        return getCurrentBranch().then((target)=>{
            return target;
        })
    })
    .then((context)=>{
        let branch = context.branch;
        return commitCodeToGit(branch).then((target)=>{

        })
    })
    // .then((context) =>{
    //     return getTagVersion().then((target)=>{
            
    //         return target;
    //     })
    // })
    // .then((context)=>{
    //     let version = context.version;
    //     return startBuildNewTag(version).then((target)=>{
    //         return target;
    //     })
    // })
    // .then((context)=>{
    //     return gotoFrsPlatFrom()
    // })
    .catch(()=>{

    })
}

function gotoFrsPlatFrom(){
    
}

function getCurrentBranch(){
    const spinner = ora('开始获取当前分支...');
    spinner.start(); 
    return new Promise(function(resolve,reject){
        shellJS.exec(`git symbolic-ref --short HEAD`,(err, stout, sterr) => {
            if(err){
                spinner.fail('==============获取当前分支失败==============');
                reject('获取当前分支失败');
            }else{
                
                let array = stout.split("\n");
                //stout: "online\n"
                if(array.length>0){
                    spinner.succeed('==============获取当前分支成功==============');
                    resolve && resolve({branch: array[0]});
                }else{
                    spinner.fail('==============获取当前分支失败==============');
                    reject('获取当前分支失败');
                }
                
            }
        });
    });
}

function commitCodeToGit(branch){
    
    const spinner = ora('开始提交代码...');
    spinner.start();  
    return new Promise(function(resolve,reject){
        
        shellJS.exec(`git pull; git add .; git commit -m "打包脚本";git push -u  origin ${branch};`,(err, stout, sterr) => {
            if(err){
                spinner.fail('==============代码提交失败==============');
            }else{
                spinner.succeed('==============代码提交成功==============');
                resolve && resolve();
            }
        });
    });
}

function startBuildNewTag(version){
    const spinner = ora('开始打tag分支...');
    spinner.start();
    return new Promise(function(resolve,reject){
        shellJS.exec(`git tag -a ${version} -m "文档上线"; git push origin ${version}`,(err, stout, sterr) => {
            if(err){
                spinner.fail('==============打tag分支失败==============');
                reject('打出tag包失败');
            }else{
                spinner.succeed('==============打tag分支成功==============');
                resolve && resolve();
            }
        });
    });
}

function startBuild(){
    const spinner = ora('开始打包...')
    spinner.start()
    return new Promise(function(resolve,reject){
        shellJS.exec(`npm run docs:build`,(err, stout, sterr) => {
            if(err){
                spinner.fail('==============打包失败==============')
                reject('打包失败');
            }else{
                spinner.succeed('==============打包成功==============');
                resolve && resolve();
            }
        });
    });
}

function getTagVersion(){
    const spinner = ora('开始获取git tag分支最新版本...')
    spinner.start()
    return new Promise(function(resolve,reject){
        shellJS.exec("git describe --tags `git rev-list --tags --max-count=1`", (err, stout, sterr) => {
            if(err){
                spinner.fail('==============获取git tag之分版本失败==============');
                reject('获取tag版本失败');
            }else{
                //例如 publish/1.0.9
                let versions = [];
                let nextVersion = '';
                let array = stout.split("\n");
                let arr_t = stout.split('publish/');
                
                let tag_version = arr_t[arr_t.length-1];
                console.log('tagversion===='+stout);
                let items = tag_version.split('.');
                versions.push(items[0]);
                versions.push(items[1]);
                versions.push(Number(items[2])+1);
                nextVersion = versions.join('.');
                console.log('======version====='+nextVersion);
                spinner.succeed('==============获取git tag分支版本成功==============');
                resolve && resolve({version: 'publish/'+nextVersion})
            }
        });
    });
}
publish();
// getTagVersion();
// startBuild();
// getCurrentBranch();