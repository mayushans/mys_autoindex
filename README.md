# MYS AUTOINDEX
Nginx autoindex 的前端，用于美化显示 autoindex 页面。
+ 目录显示
+ README.md 文件显示

## 使用方法
### 1.设置 Nginx
```
location / {
    # 设置目录
    root /var/download;
    # 开启 autoindex
    autoindex on;
    # 设置 autoindex 返回信息为 json
    autoindex_format "json";
}
```
### 2.克隆当前项目
在本地克隆当前项目
```bash
git clone https://github.com/mayushans/mys_autoindex.git
```
### 3.安装依赖
```bash
cd mys_autoindex
npm install
```
### 4.编译项目
```bash
npm run build
```
### 5.部署
将 __dist__ 目录中的文件部署到前端目录即可。
### 6.修改配置信息
修改网站根目录 __config.json__ 文件  
__site_name__ 为网站标题显示  
__api__ 为 autoindex 服务的地址，务必以“__/__”结尾  
```json
{
    "site_name": "MYS DOWNLOAD",
    "base_url": "/file/",
}
```