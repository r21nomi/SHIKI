(function(e){function t(t){for(var n,o,s=t[0],c=t[1],u=t[2],l=0,m=[];l<s.length;l++)o=s[l],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&m.push(i[o][0]),i[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);h&&h(t);while(m.length)m.shift()();return a.push.apply(a,u||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,s=1;s<r.length;s++){var c=r[s];0!==i[c]&&(n=!1)}n&&(a.splice(t--,1),e=o(o.s=r[0]))}return e}var n={},i={app:0},a=[];function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=n,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var h=c;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},2494:function(e,t,r){"use strict";r("2d32")},"2d32":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app",attrs:{id:"app"}},[e.useStaticImages?r("Images",{attrs:{items:e.items}}):r("GLSLCanvasContainer",{attrs:{images:e.items}})],1)},a=[],o=(r("99af"),r("d81d"),r("9911"),r("2909")),s=(r("96cf"),r("1da1")),c=r("bc3a"),u=r.n(c),h=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"images"},[r("div",{staticClass:"imageItem",style:{backgroundImage:"url("+e.items[e.oldIndex]+")"}}),r("div",{ref:"foregroundImage",staticClass:"imageItem foregroundImage",class:{anim:e.isAnimate},style:{backgroundImage:"url("+e.items[e.index]+")"}})])},l=[],m={name:"Images",props:{items:Array},data:function(){return{index:0,oldIndex:0,isAnimate:!1}},mounted:function(){var e=this;setTimeout((function(){e.isAnimate=!0,e.changeImage()}),1e3),this.$refs.foregroundImage.addEventListener("transitionend",(function(){e.oldIndex=e.index,e.isAnimate=!1,e.changeImage(),setTimeout((function(){e.isAnimate=!0}),500)}))},methods:{changeImage:function(){this.index++,this.index>=this.items.length&&(this.index=0)}}},f=m,d=(r("2494"),r("2877")),g=Object(d["a"])(f,h,l,!1,null,"4f977490",null),v=g.exports,T=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{ref:"glslCanvasContainer",staticClass:"glslCanvasContainer"},[r("GLSLCanvas",{attrs:{size:e.canvasSize,"vertex-shader":e.vertexShader,"fragment-shader":e.fragmentShader,"active-external-resources":e.currentImage,quality:2}})],1)},x=[],E=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("canvas",{ref:"canvas",staticClass:"glslCanvas",attrs:{width:e.canvasWidth,height:e.canvasHeight}})},R=[],p=(r("a9e3"),r("d3b7"),r("ac1f"),r("cfc3"),r("5cc6"),r("9a8c"),r("a975"),r("735e"),r("c1ac"),r("d139"),r("3a7b"),r("d5d6"),r("82f8"),r("e91f"),r("60bd"),r("5f96"),r("3280"),r("3fcc"),r("ca91"),r("25a1"),r("cd26"),r("3c5d"),r("2954"),r("649e"),r("219c"),r("170b"),r("b39a"),r("72f7"),/^ERROR: \d+:(\d+):\s(.*)$/gm),b={name:"GLSLCanvas",components:{},props:{size:{type:Object,required:!0},vertexShader:{type:String,required:!0},fragmentShader:{type:String,required:!0},quality:{type:Number,default:1},activeExternalResources:{type:String,default:""}},data:function(){return{gl:null,startTime:0,animationTimer:0,mouse:{x:0,y:0},currentVertexShader:null,currentFragmentShader:null,currentProgram:null,frontTarget:null,backTarget:null,activeTextures:[],texturePromises:{},screenProgram:null,screenPositionAttributeLocation:0,v:"attribute vec3 position;\n        void main(){\n            gl_Position = vec4(position, 1.0);\n        }",f:"precision mediump float;\n        uniform vec2 resolution;\n        uniform sampler2D texture;\n        void main(){\n            vec2 uv = gl_FragCoord.xy / resolution.xy;\n            gl_FragColor = texture2D(texture, uv);\n        }"}},methods:{initGLSLCanvas:function(){this.gl=null,this.currentVertexShader=null,this.currentFragmentShader=null,this.currentProgram=null,this.startTime=Date.now();var e=this.getGL();this.initGL(e),this.compileScreenProgram(e),this.createRenderTargets(e)},initGL:function(e){e.getExtension("OES_standard_derivatives")||console.log("OES_standard_derivatives is not supported.")},getGL:function(){return this.gl||(this.gl=this.canvas.getContext("experimental-webgl",{preserveDrawingBuffer:!0})),this.gl},animate:function(){this.animationTimer=requestAnimationFrame(this.animate),this.gl&&this.updateCanvas(this.gl,!1,{width:this.canvasWidth,height:this.canvasHeight})},stopAnimate:function(){this.animationTimer&&cancelAnimationFrame(this.animationTimer)},updateCanvas:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2?arguments[2]:void 0;if(!this.currentProgram||t){var n=this.vertexShader,i=this.fragmentShader,a=this.createShader(e,e.VERTEX_SHADER,n),o=this.createShader(e,e.FRAGMENT_SHADER,i);a&&o&&(this.currentVertexShader=a,this.currentFragmentShader=o),this.currentVertexShader&&this.currentFragmentShader&&(this.currentProgram=this.createProgram(e,this.currentVertexShader,this.currentFragmentShader)),this.activeExternalResources&&this.updateTextures(e),console.log("Program was created.")}if(this.frontTarget&&this.backTarget)if(this.currentProgram&&this.screenProgram){e.useProgram(this.currentProgram),e.viewport(0,0,r.width,r.height),e.enable(e.CULL_FACE),e.enable(e.DEPTH_TEST);var s=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],c=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,c),e.bufferData(e.ARRAY_BUFFER,new Float32Array(s),e.STATIC_DRAW);var u=e.getAttribLocation(this.currentProgram,"position");e.enableVertexAttribArray(u);var h=2,l=e.FLOAT,m=!1,f=0,d=0;e.vertexAttribPointer(u,h,l,m,f,d);var g=e.getUniformLocation(this.currentProgram,"resolution");e.uniform2f(g,r.width,r.height);var v=e.getUniformLocation(this.currentProgram,"time"),T=(Date.now()-this.startTime)/1e3;e.uniform1f(v,T);var x=e.getUniformLocation(this.currentProgram,"mouse");e.uniform2f(x,this.mouse.x,this.mouse.y);var E=e.getUniformLocation(this.currentProgram,"backbuffer");e.uniform1i(E,0),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.backTarget.texture);for(var R=0;R<this.activeTextures.length;R++){var p="channel".concat(R),b=e.getUniformLocation(this.currentProgram,p),_="channelSize".concat(R),S=e.getUniformLocation(this.currentProgram,_),A=void 0===this.activeTextures[R].size?{width:1,height:1}:this.activeTextures[R].size;e.uniform2f(S,A.width,A.height),e.uniform1i(b,1+R),e.activeTexture(e.TEXTURE1+R),e.bindTexture(e.TEXTURE_2D,this.activeTextures[R].texture)}e.bindFramebuffer(e.FRAMEBUFFER,this.frontTarget.framebuffer),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,s.length/2),e.useProgram(this.screenProgram);var P=e.getUniformLocation(this.screenProgram,"resolution");e.uniform2f(P,r.width,r.height);var y=e.getUniformLocation(this.screenProgram,"texture");e.uniform1i(y,1),e.bindBuffer(e.ARRAY_BUFFER,c),e.vertexAttribPointer(this.screenPositionAttributeLocation,2,e.FLOAT,!1,0,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.frontTarget.texture),e.bindFramebuffer(e.FRAMEBUFFER,null),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,s.length/2);var L=this.frontTarget;this.frontTarget=this.backTarget,this.backTarget=L,console.log("updateCanvas")}else console.log("Program should not be null.")},createShader:function(e,t,r){var n=e.createShader(t);if(!n)return console.log("error: WebGLShader is null."),null;e.shaderSource(n,r),e.compileShader(n);var i=e.getShaderParameter(n,e.COMPILE_STATUS);if(!i){console.log(e.getShaderInfoLog(n));var a,o=e.getShaderInfoLog(n),s=[];if(o)while(a=p.exec(o))s.push({errorLine:parseInt(a[1],10)-1,type:4,message:a[2]});return t===e.FRAGMENT_SHADER&&this.$emit("onErrorLineUpdated",s),e.deleteShader(n),null}return this.hasError&&t===e.FRAGMENT_SHADER&&this.$emit("onErrorLineUpdated",[]),n},updateTextures:function(e){this.texturePromises={},this.loadTextures(e,this.activeExternalResources)},loadTextures:function(e,t){this.activeTextures=[],t?this.loadTexture(e,t,0):this.loadBlankTexture(e,0)},loadBlankTexture:function(e,t){if(e){var r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);var n=0,i=e.RGBA,a=1,o=1,s=0,c=e.RGBA,u=e.UNSIGNED_BYTE,h=new Uint8Array([0,0,55,255]),l={width:1,height:1};e.texImage2D(e.TEXTURE_2D,n,i,a,o,s,c,u,h),r&&(this.activeTextures[t]={texture:r,size:l})}},loadTexture:function(e,t,r){var n=this;if(e){var i=t;console.log("loading texture",i);var a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);var o=0,s=e.RGBA,c=1,u=1,h=0,l=e.RGBA,m=e.UNSIGNED_BYTE,f=new Uint8Array([0,0,55,255]);e.texImage2D(e.TEXTURE_2D,o,s,c,u,h,l,m,f);var d=new Image;d.crossOrigin="Anonymous",d.src=i;var g={width:1,height:1};a&&(this.activeTextures[r]={texture:a,size:g}),this.texturePromises["key_".concat(r)]=new Promise((function(t,i){d.onload=function(){e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,o,s,l,m,d),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),n.activeTextures[r].size={width:d.width,height:d.height},t(r)},d.onerror=function(e){i(e)}})),e.bindTexture(e.TEXTURE_2D,null)}},createProgram:function(e,t,r){var n=e.createProgram();if(!n)return console.log("WebGLProgram is null."),null;e.attachShader(n,t),e.attachShader(n,r),e.linkProgram(n);var i=e.getProgramParameter(n,e.LINK_STATUS);return i?n:(console.log(e.getProgramInfoLog(n)),e.deleteProgram(n),null)},createFramebufferTarget:function(e,t,r){var n={framebuffer:e.createFramebuffer(),renderbuffer:e.createRenderbuffer(),texture:e.createTexture()};return e.bindTexture(e.TEXTURE_2D,n.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,r,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,n.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n.texture,0),e.bindRenderbuffer(e.RENDERBUFFER,n.renderbuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,n.renderbuffer),e.bindTexture(e.TEXTURE_2D,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),n},createRenderTargets:function(e){this.frontTarget=this.createFramebufferTarget(e,this.canvasWidth,this.canvasHeight),this.backTarget=this.createFramebufferTarget(e,this.canvasWidth,this.canvasHeight)},compileScreenProgram:function(e){var t=e.createProgram(),r=this.createShader(e,e.VERTEX_SHADER,this.v),n=this.createShader(e,e.FRAGMENT_SHADER,this.f);if(t&&r&&n){if(e.attachShader(t,r),e.attachShader(t,n),e.deleteShader(r),e.deleteShader(n),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))return void console.log("VALIDATE_STATUS: "+e.getProgramParameter(t,e.VALIDATE_STATUS),"ERROR: "+e.getError());this.screenProgram=t,e.useProgram(this.screenProgram),this.screenPositionAttributeLocation=e.getAttribLocation(this.screenProgram,"position"),e.enableVertexAttribArray(this.screenPositionAttributeLocation)}},onMousemove:function(e){if(this.canvas){var t=this.canvas.getBoundingClientRect(),r=document.documentElement;if(r){var n=t.top+r.scrollLeft,i=t.top+r.scrollTop;this.mouse.x=(e.pageX-n)/this.size.width,this.mouse.y=1-(e.pageY-i)/this.size.height}}},onWebglcontextlost:function(e){console.log("onWebglcontextlost"),e.preventDefault(),this.stopAnimate()},onWebglcontextrestored:function(){console.log("onWebglcontextrestored"),this.initGLSLCanvas(),this.animate()}},computed:{canvas:function(){return this.$refs.canvas},canvasWidth:function(){return this.size.width/this.quality},canvasHeight:function(){return this.size.height/this.quality}},watch:{vertexShader:function(){this.currentProgram=null},fragmentShader:function(){this.currentProgram=null},activeExternalResources:function(){this.currentProgram=null},size:function(){this.createRenderTargets(this.getGL())},quality:function(){this.createRenderTargets(this.getGL())}},mounted:function(){this.initGLSLCanvas(),window.addEventListener("mousemove",this.onMousemove),this.canvas.addEventListener("webglcontextlost",this.onWebglcontextlost,!1),this.canvas.addEventListener("webglcontextrestored",this.onWebglcontextrestored,!1),this.animate()},beforeDestroy:function(){window.removeEventListener("mousemove",this.onMousemove),this.stopAnimate()}},_=b,S=Object(d["a"])(_,E,R,!1,null,null,null),A=S.exports,P="attribute vec4 position;\nvoid main() {\n    gl_Position = position;\n}",y="precision highp float;\n\nuniform vec2 resolution;\nuniform float time;\nuniform vec2 mouse;\nuniform sampler2D backbuffer;\nuniform sampler2D channel0;\nuniform vec2 channelSize0;\n\n#define PI 3.14159265\n\nvec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }\n\nfloat snoise(vec2 v){\n  const vec4 C = vec4(0.211324865405187, 0.366025403784439,\n           -0.577350269189626, 0.024390243902439);\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n  vec2 i1;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod(i, 289.0);\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n  + i.x + vec3(0.0, i1.x, 1.0 ));\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),\n    dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\nvoid main(void) {\n    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);\n    float f = fract(length(uv * 2.1 * fract(time * 0.1)*0.01));\n\n    float l = 1.0 * (length(uv) - time * 0.1);\n\n    uv = gl_FragCoord.xy / resolution.xy;\n\n    vec2 ratio = vec2(\n      min((resolution.x / resolution.y) / (channelSize0.x / channelSize0.y), 1.0),\n      min((resolution.y / resolution.x) / (channelSize0.y / channelSize0.x), 1.0)\n    );\n\n    uv = vec2(\n      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,\n      uv.y * ratio.y + (1.0 - ratio.y) * 0.5\n    );\n\n    uv = mix(uv, uv * sin(l / 0.2 * PI), 0.005);\n\n    vec3 color = texture2D(channel0, uv).xyz;\n    color.b = 1.0;\n\n    gl_FragColor = vec4(color, 1.0);\n}",L={name:"GLSLCanvasContainer",components:{GLSLCanvas:A},props:{images:Array},data:function(){return{index:0,canvasWidth:0,canvasHeight:0}},mounted:function(){var e=this;window.addEventListener("resize",this.onWindowResized),this.onWindowResized(),setInterval((function(){e.index++,e.index>=e.images.length&&(e.index=0)}),5e3)},beforeDestroy:function(){window.removeEventListener("resize",this.onWindowResized)},computed:{currentImage:function(){return 0===this.images.length?"":this.images[this.index]},canvasSize:function(){return{width:this.canvasWidth,height:this.canvasHeight}},vertexShader:function(){return P},fragmentShader:function(){return y}},methods:{onWindowResized:function(){this.canvasWidth=this.$refs.glslCanvasContainer.clientWidth,this.canvasHeight=this.$refs.glslCanvasContainer.clientHeight}}},F=L,U=(r("ce28"),Object(d["a"])(F,T,x,!1,null,"4868da64",null)),w=U.exports,C=1,D={name:"App",components:{GLSLCanvasContainer:w,Images:v},data:function(){return{useStaticImages:!0,items:[],fetchCount:0,searchCondition:{blue:{query:"calm sky",color:"blue",lr:"lang_ja"},yellow:{query:"daytime sun",color:"orange",lr:"lang_ja"},green:{query:"森林",color:"green",lr:"lang_ja"}}}},mounted:function(){this.startFetchItems()},methods:{startFetchItems:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.fetchItems();case 2:e.fetchCount<C&&setTimeout((function(){return e.startFetchItems()}),2e3);case 3:case"end":return t.stop()}}),t)})))()},fetchItems:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var r,n,i,a,s,c,h,l,m,f,d,g;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n="AIzaSyBZOk1NB_dtczBsimXBHCxZxEDCa9RGs-o",i="eb93f1cf850fd7cb8",a=e.searchCondition.blue,s=a.query,c=10,h=e.items.length>0?e.items.length+1:0,l=a.color,m="large",f=a.lr,t.next=11,u.a.get("".concat("https://www.googleapis.com/customsearch/v1","?key=").concat(n,"&cx=").concat(i,"&q=").concat(s,"&searchType=image&num=").concat(c,"&imgDominantColor=").concat(l,"&imgSize=").concat(m,"&imgColorType=color&start=").concat(h,"&lr=").concat(f));case 11:d=t.sent,g=d.data.items.map((function(e){return e.link})),(r=e.items).push.apply(r,Object(o["a"])(g)),e.fetchCount++;case 15:case"end":return t.stop()}}),t)})))()}}},I=D,B=(r("7faf"),Object(d["a"])(I,i,a,!1,null,null,null)),G=B.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(e){return e(G)}}).$mount("#app")},"61fc":function(e,t,r){},"7faf":function(e,t,r){"use strict";r("b8ff")},b8ff:function(e,t,r){},ce28:function(e,t,r){"use strict";r("61fc")}});
//# sourceMappingURL=app.5e66cd66.js.map