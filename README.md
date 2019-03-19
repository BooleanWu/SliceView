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

1. 提取由本地load的文件数据存储在_data变量中的信息，创建xobject，分为三大类：**volume**， **mesh**和**fiber**

```js
// create volume xobject

if (data['volume']['file'].length > 0) {

    // we have a volume
    volume = new X.volume();

    // get the file from _data we load from local
    volume.file = data['volume']['file'].map(function(v) {

        return v.name;

    });

    // get the filedata from _data wo load from local
    volume.filedata = data['volume']['filedata'];
    var colortableParent = volume;

    if (data['labelmap']['file'].length > 0) {

        // we have a label map
        volume.labelmap.file = data['labelmap']['file'].map(function(v) {

            return v.name;

        });
        volume.labelmap.filedata = data['labelmap']['filedata'];
        colortableParent = volume.labelmap;

    }
```



### 8th

1. 开始编写 parse 解析函数, 配置用于渲染的render(以volume 格式为例)

2. ①初始化一个3D render容器，用于渲染解析重建之后生成的三维模型

   ```html
   <div id='3d' class='threeDRenderer'></div>
   ```

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

   ```html
   <div id='sliceAx' class='twoDRenderer'>
   <div id='sliceSag' class='twoDRenderer'>
   <div id='sliceCor' class='twoDRenderer'>
   ```

   ```js
   
   // Z: from top to bottom
   sliceAx = new X.renderer2D();  
   .......
   sliceAx.init();
   // X: from left to right
   sliceSag = new X.renderer2D();
   ......
   // Y: from front to behind
   sliceCor = new X.renderer2D();
   .......
   ```

   ③ 为以上的两种渲染器都添加了 ontouch ，可以触屏控制操作

   

### 9th

1. 先渲染三个维度的二维的图像，并未三个维度添加滑动条，实现操控滑动条完成分层显示切片，分别位于三个维度2D渲染器的子容器下

   ```html
   <div id='blue_slider'></div>
   <div id='red_slider'></div>
   <div id='green_slider'></div>
   ```

2. 在场景左侧添加菜单栏 menu，可以对模型对一些属性上的修改，如曝光度、阈值等(XTK可选属性).在menu面板是用bootstrap- ui添加些必要的按钮以及功能

   ```html
   <li id='volume' class='navigationLi'><div class='menu'>
       ......
   </li>
   <li id='volume' class='navigationLi'><div class='menu'>
       ......
   </li>
   <li id='volume' class='navigationLi'><div class='menu'>
       ......
   </li>
   ```

3. 实现不同格式的文件导入，激活相对应的menu。

   ```js
   // for example 
   jQuery('#fibers .menu').removeClass('menuDisabled');
   jQuery('#fibers .menu').addClass('menuDisabled');
   ```



### 10th

1. 将解析完毕所得的数据根据类型的不同相对应的加入到 3D 场景以及右侧三个维度的 2D render

   ```js
   // add the volume
   ren3d.add(volume);
   ren3d.camera.position = [0,500,0];  //initialization camera 
   ren3d.render();
   // 2D render
   if (_data.volume.file.length > 0) {
   
         // show any volume also in 2d
          sliceAx.add(volume);
          sliceSag.add(volume);
          // don't add it again if webgl is not supported
          if (_webgl_supported){sliceCor.add(volume);}
          sliceAx.render();
          sliceSag.render();
          sliceCor.render();
   }
   ```

2. 将render中渲染的所有的视角图像保存到3D 场景中的相机中，用于视角的切换

   ```js
   var _current_view = Array.apply([], eval(renderer).camera.view);
   
   //the view[] of camera, update the current view
   if ( !arraysEqual(_current_view, RT._old_view) ) {
   
       RT._link.trigger('client-camera-sync', {
           'target' : renderer,
           'value' : _current_view
       });
   
       RT._old_view = _current_view;
   }
   ```

3. 完成解析和数据装载工作之后，进行realtime render，配置渲染器之间，实时相机角度，文件模型的实时图像的对应关系

   ```js
   // 2d render linked to 3d render
   RT.link = function() {
       ......
   }
   // camera realtime view
   RT.pushCamera = function(renderer){
       ......
   }
   // volume realtime change value for target render
   RT.pushVolume = function(target, value){
       ......
   }
   ```



### 11th ~ 12th



1. 建立右侧slide滑动条和二维图像的对应关系，获取volume三个维度的range，并且将每个维度的range赋值给slide的滑动区间属性（**以X轴为列**）

   ```js
   // update 2d slice sliders
   var dim = volume.range;   // the range of three volume.size
   
   // sag == X
   jQuery("#red_slider").slider("option", "disabled", false);
   jQuery("#red_slider").slider("option", "min", 0);
   jQuery("#red_slider").slider("option", "max", dim[0] - 1);
   ......
   ......
   ```

2. 由slider当前的value计算volume的index属性，并在3D render和 2D render中渲染出对应维度的图像模型

   ```js
   volume.indexX = Math.floor(jQuery('#red_slider').slider("option", "value"));
   
   //2D render realtime update
   jQuery("#red_slider").slider("option", "value", volume.indexX);
   // 3D render realtime update
   if (RT.linked) {
       clearTimeout(RT._updater);
       RT._updater = setTimeout(RT.pushVolume.bind(RT, 'opacity', volume.opacity), 150);
   
   }
   ```

   

3. 实现改变右侧三个维度slide调整，切换层级显示二维图像，3D render中同步完成扫描动作。达到3D 场景当中三个维度的扫描右侧对应显示相应维度的slice 二维图像
   ①在这种状态下，3D render 渲染显示的为右侧 2D render 三个维度二维图像拼接成的一个"伪" 三维模型。
   ②在二维图形通过slide滑动切换图像时，3D render 实时更新单维度的图像显示

   ```js
   // for 2d render linked to 3d render
   RT._updater = 1;
   // update the 3d render view, example red_slieder == X
   var _updateThreeDSag = function() {
   
       if (_data.volume.file.length > 0) {
   
         jQuery('#red_slider').slider("option", "value",volume.indexX);
   
         if (RT.linked) {
   
           clearTimeout(RT._updater);
           RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexX', volume.indexX), 150);
   
         }
       }
     };
   ......
   ......
   sliceAx.onScroll = _updateThreeDAx;  // Z
   sliceSag.onScroll = _updateThreeDSag; // x
   sliceCor.onScroll = _updateThreeDCor; // y
   ```



### 13th

1. 设定UI界面的 threshold 属性（针对已经渲染好的图形进行图像参数上的调整，自定义一个阈值）

   ```js
   // initialization threshold，setting lower to upper
   function thresholdVolume(event, ui) {
   
     if (!volume) {
       return;
     }
     volume.lowerThreshold = ui.values[0];
     volume.upperThreshold = ui.values[1];
     ......
   } 
   ```

2. 设定UI界面的 Windows/Level 属性(类似于透明度)

   ```js
   function windowLevelVolume(event, ui) {
   
     if (!volume) {
       return;
     }
         
     volume.windowLow = ui.values[0];
     volume.windowHigh = ui.values[1];
   
     ......
   }
   ```

3. 传播给前端

   ```JS
   jQuery('#opacity-volume').slider("option", "value", volume.opacity * 100);
   jQuery('#threshold-volume').dragslider("option", "values", [volume.lowerThreshold, volume.upperThreshold]);
   jQuery('#windowlevel-volume').dragslider("option", "values", [volume.windowLow, volume.windowHigh]);
   ```



### 14th

1. 针对 .VTK, .OBJ 等mesh文件模型添加颜色渲染、透明度调整、以及多个模型的同时渲染
   ①透明度调整

   ```js
   jQuery('#opacity-mesh').slider("option", "value", mesh.opacity * 100);
   ```

   ②模型颜色的渲染

   ```js
   var meshColor = ((1 << 24) + (mesh.color[0] * 255 << 16) + (mesh.color[1] * 255 << 8) + mesh.color[2] * 255).toString(16).substr(1);
   jQuery('#meshColor').miniColors("value", meshColor);
   ```

   ③3D 场景当中先渲染一个模型然后调整到最佳的属性，然后再次拖入模型以达到多模型同时渲染



### 15th

1. 定义文件拖入效果块元素

   ```html
   <div id='drop-box-overlay'>
   	<h1>Drop files anywhere...</h1>
   </div>
   ```

2. 实现拖入式文件导入，可以直接将文件直接拖入web界面，实现与从本地导入文件相同的效果
   ①初始化 Drop File 功能定义：

   ```js
   // Drop File init
   function initDnD() {
   
     // Add drag handling to target elements
     document.getElementById("body").addEventListener("dragenter", onDragEnter,
         false);
   
     // Add drag leve and over EventListener
     document.getElementById("drop-box-overlay").addEventListener("dragleave",
         onDragLeave, false);
     document.getElementById("drop-box-overlay").addEventListener("dragover",
         noopHandler, false);
   
     // Add drop handling
     document.getElementById("drop-box-overlay").addEventListener("drop", onDrop,
         false);
   };
   
   ```

   ②onDragEnter 具体实现全局

   ```js
   function onDragEnter(evt) {
   
     jQuery("#drop-box-overlay").fadeIn(125);
     //jQuery("#drop-box-prompt").fadeIn(125);
   };
   ```

   

   ③ onDragLeave 具体实现，通过当前拖动事件所处的windows坐标判定是否触发：

   ```js
   function onDragLeave(evt) {
     if (evt.pageX < 10 || evt.pageY < 10 ||
         jQuery(window).width() - evt.pageX < 10 ||
         jQuery(window).height - evt.pageY < 10) {
       jQuery("#drop-box-overlay").fadeOut(125);
       jQuery("#drop-box-prompt").fadeOut(125);
     }
   };
   ```

   ④ 由于onDragEnter是全局的，所以在实现 dragover 函数需要阻止一些异常的发生：

   ```js
   function noopHandler(evt) {
   
     // 由于drop是针对全局的，该方法将停止事件的传播，阻止它被分派到其他 Document 节点
     evt.stopPropagation();
     
     // 阻止打开链接
     evt.preventDefault();
   };
   ```

   

   

   





























