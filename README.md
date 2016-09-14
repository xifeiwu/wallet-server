# wallet-server
## Node服务端代码
1. 数据库采用sqlite3，数据库相关代码在module目录下
2. module/db.js中包括数据查询和数据插入的代码
3. 使用sqlitebrowser可以查看module/db.sqlite3中的数据

##代码运行
1. 项目依赖Node模块sqlite3，现在项目后，需要npm install安装依赖包（sqlite3模块C++代码较多，如果编译容易出错，可以尝试4.2版本的node）。
2. 需要创建sqlite3数据库，创建方法：进入module目录，运行sh db.sh init，会在当前目录项创建数据库db.sqlite3。
3. 运行项目可以在主目录下运行指令：node . 或npm run dev
4. 有其它问题随时和我联系