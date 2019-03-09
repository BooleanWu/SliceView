## Daily System Development Process

### 1ST

1. 构建系统整体框架草图，明确系统原型图
2. 搭建开发环境，安装配置开发所需的前端、后端开发库：JQuery、Bootstrap，以及核心的 WebGL 技术框架
3. 选择合适的开发工具：Sublime Text3；测试浏览器的 WebGL 兼容性，FireFox and Chrome
4. 查阅并对比各种效果之后选定开源的 XTK 作为核心的解析算法用于图像解析



### 2nd

1. 开始编写系统主页：index.html

2. 引入开发所需的各种 css，js 库

3. 构建第一个界面 frontpage， 显示系统的一些简要信息。整个界面上中下三部分：
   ①上面部分显示系统的标题信息简介，以及一些系统的操作指南简介

   ②中间部分显示系统所支持的各种类型的文件信息，系统操作导引：可以通过 Select Files 或者直接 Drop Files 将文件从本地加载至系统当中

   ③底部信息显示一些开发者的信息

   

### 3rd

1. 继续编写 frontpage 部分，头部加入系统操作指南简要信息

2. 引入一个 Bootstrap 模态框用于显示系统演示截图

   ```html
   <a class='btn btn-medium' data-toggle='modal' href='#learnMore'>Learn more &raquo;
   </a><!-- bootstrap 模态框 -->
   
   <!-- Learn more 模态框的详细信息-->
   <div class='modal hide fade' id='learnMore'
        style='display: none; width: 800px; height: 610px; margin-top: -305px; margin-left: -400px;'>
   ······
   </div>
   
   ```

   

3. 编写模态框的 CSS 代码，不禁感叹Bootstrap是真的牛逼！

4. 预留了一些 img 空间，方便之后加入一些效果图。



### 4th

1. 

