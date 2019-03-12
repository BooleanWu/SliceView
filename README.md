## Daily System Development Process

### 1st

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

1. 编写 frontpage 中间部分，以图片的方式简单介绍系统支持的各种格式的文件模型

2. 实现可以从本地选择文件，再次感叹Bootstrap的布局，真的牛批！

   ```html
   <input id='filebutton' type='file' multiple onchange='selectfiles(this.files)' style='display: none;'>
   </input>
   <a class='btn btn-inverse btn-large' style='vertical-align: super;' onclick='javascript:document.getElementById("filebutton").click();'>Selectfiles</a>
   ```

3. 编写frontpage 底部部分，附带简单的作者信息

4. index.html 告一段落总结：
   ①头部添加了模态框窗口介绍系统的操作规范
   ②中间部分为主要操作区，用于选择本地文件
   ③底部信息简单介绍作者信息



### 5th

1. 开始编写可视化平台界面，viewer.html，最终放弃

2. 考虑到有文件导入过程，夸界面数据传输比较麻烦，所以决定吧viewer界面也写在了index.html中。

3. 实现选择本地文件后，frontpage界面切换至viewer界面
   ①选择文件：

   ```html
   <input id='filebutton' type='file' multiple onchange='selectfiles(this.files)' style='display: none;'>
   ```

   ②selectfiles函数：

   ```js
   function selectfiles(files) {
   
     // now switch to the viewer
     switchToViewer();
   
     // .. and start the file reading
     read(files);
   
   };
   ```

   ③switchToViewer函数：

   ```js
   // show viewerBody and hide frontpage
   function switchToViewer() {
   
     jQuery('#body').addClass('viewerBody');
     jQuery('#frontpage').hide();
     jQuery('#viewer').show();
   
   };
   ```

4. jQuery是真的牛逼。



### 6th

1. 继续完善viewer界面的后端数据传输

2. 创建文件类型知识库，枚举所有类型的文件扩展名，用于判定传入的文件类型

   ```js
   function createData() {
   
     // create database to contrast type
     
     // volume (.nrrd,.mgz,.mgh)
     // labelmap (.nrrd,.mgz,.mgh)
     // colortable (.txt,.lut)
     // mesh (.stl,.vtk,.fsm,.smoothwm,.inflated,.sphere,.pial,.orig)
     // scalars (.crv)
     // fibers (.trk)
   
     // includes the file object, file data and valid extensions for each object
     _data = {
      'volume': {
        'file': [],
        'filedata': [],
        'extensions': ['NRRD', 'MGZ', 'MGH', 'NII', 'GZ', 'DCM', 'DICOM']
      },
      'mesh': {
        'file': [],
        'filedata': [],
        'extensions': ['STL', 'VTK', 'FSM', 'SMOOTHWM', 'INFLATED', 'SPHERE',
                       'PIAL', 'ORIG', 'OBJ']
      },
      .......
     }
   ```

3. 读入 fontpage 传入的本地文件，记录文件的类型，文件个数等信息。因为可能存在多文件的关联关系，所以把这些文件右关联至文件的filedata数据当中

4. 数据传输完毕，奖最终的数据拿给parse函数，生成 xobject ，方便之后通过XTK开源库进行模型重建



### 7th

1. 开始编写 parse 解析函数
   ①初始化一个3D render容器，用于渲染解析重建之后生成的三维模型

   ```js
   if (ren3d) {
       // do this only once, if already exist render
       return;
     }
   try {
   
       // create the XTK renderers
       ren3d = new X.renderer3D();
       ren3d.container = '3d';
       ren3d.init();
   
       // add ontouch function
       ren3d.interactor.onTouchStart = ren3d.interactor.onMouseDown = onTouchStart3D;
       ren3d.interactor.onTouchEnd = ren3d.interactor.onMouseUp = onTouchEnd3D;
       
       ren3d.interactor.onMouseWheel = function(e) {
   
         if (RT.linked) {
   		// set up camera RT = REALTIME RENDER
           clearTimeout(RT._updater);
           RT._updater = setTimeout(RT.pushCamera.bind(this, 'ren3d'), 150);
   
         }
       };
     }
   ```

   ②初始化3个2D render容器，用于渲染解析重建后的二维模型

   ```js
   // X: from top to bottom
   sliceAx = new X.renderer2D();  
   .......
   sliceAx.init();
   // Y: from left to right
   sliceSag = new X.renderer2D();
   ......
   // Z: from front to behind
   sliceCor = new X.renderer2D();
   .......
   
   ```

   

   

   

   



