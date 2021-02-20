<template>
  <canvas
    ref="canvas"
    class="glslCanvas"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<script>

const GLSL_ERROR_PATTERN = /^ERROR: \d+:(\d+):\s(.*)$/gm;

export default {
  name: 'GLSLCanvas',
  components: {},
  props: {
    size: {
      type: Object,
      required: true
    },
    vertexShader: {
      type: String,
      required:true
    },
    fragmentShader: {
      type: String,
      required:true
    },
    quality: {
      type: Number,
      default:1
    },
    activeExternalResources: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      gl:  null,
      startTime: 0,
      animationTimer: 0,
      mouse: {
        x: 0,
        y: 0
      },
      currentVertexShader: null,
      currentFragmentShader: null,
      currentProgram: null,
      frontTarget: null,
      backTarget: null,
      activeTextures: [],
      texturePromises: {},
      screenProgram: null,
      screenPositionAttributeLocation: 0,

      v: `attribute vec3 position;
        void main(){
            gl_Position = vec4(position, 1.0);
        }`,

      f: `precision mediump float;
        uniform vec2 resolution;
        uniform sampler2D texture;
        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            gl_FragColor = texture2D(texture, uv);
        }`
    }
  },
  methods: {
    initGLSLCanvas() {
      this.gl = null;
      this.currentVertexShader = null;
      this.currentFragmentShader = null;
      this.currentProgram = null;
      this.startTime = Date.now();

      const gl = this.getGL();

      this.initGL(gl);
      this.compileScreenProgram(gl);
      this.createRenderTargets(gl);
    },
    initGL(gl) {
      if (!gl.getExtension("OES_standard_derivatives")) {
        console.log("OES_standard_derivatives is not supported.");
      }
    },
    getGL() {
      if (!this.gl) {
        this.gl = this.canvas.getContext("experimental-webgl", {
          preserveDrawingBuffer: true
        })
      }
      return this.gl
    },
    animate() {
      this.animationTimer = requestAnimationFrame(this.animate);

      if (this.gl) {
        this.updateCanvas(this.gl, false, {
          width: this.canvasWidth,
          height: this.canvasHeight
        });
      }
    },
    stopAnimate() {
      if (this.animationTimer) {
        cancelAnimationFrame(this.animationTimer);
      }
    },
    updateCanvas(gl, forceCreateProgram = false, canvasSize) {
      if (!this.currentProgram || forceCreateProgram) {
        const vertexShaderSource = this.vertexShader;
        const fragmentShaderSource = this.fragmentShader;
        const vertexShader = this.createShader(
          gl,
          gl.VERTEX_SHADER,
          vertexShaderSource
        );
        const fragmentShader = this.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentShaderSource
        );

        if (!vertexShader || !fragmentShader) {
          // Could not compile program but never return here not to stop current shader.
        } else {
          this.currentVertexShader = vertexShader;
          this.currentFragmentShader = fragmentShader;
        }
        if (this.currentVertexShader && this.currentFragmentShader) {
          this.currentProgram = this.createProgram(
            gl,
            this.currentVertexShader,
            this.currentFragmentShader
          );
        }
        if (this.activeExternalResources) {
          this.updateTextures(gl);
        }

        console.log("Program was created.");
      }

      if (!this.frontTarget || !this.backTarget) {
        return;
      }
      if (!this.currentProgram || !this.screenProgram) {
        console.log("Program should not be null.");
        return;
      }

      gl.useProgram(this.currentProgram);

      gl.viewport(0, 0, canvasSize.width, canvasSize.height);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      const positions = [
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0
      ];

      // position
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
      );

      const positionAttributeLocation = gl.getAttribLocation(
        this.currentProgram,
        "position"
      );
      gl.enableVertexAttribArray(positionAttributeLocation);

      const size = 2; // xy
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // resolution
      const resolutionLocation = gl.getUniformLocation(
        this.currentProgram,
        "resolution"
      );
      gl.uniform2f(resolutionLocation, canvasSize.width, canvasSize.height);

      // time
      const timeLocation = gl.getUniformLocation(this.currentProgram, "time");
      const time = (Date.now() - this.startTime) / 1000;
      gl.uniform1f(timeLocation, time);

      // mouse
      const mouseLocation = gl.getUniformLocation(
        this.currentProgram,
        "mouse"
      );
      gl.uniform2f(mouseLocation, this.mouse.x, this.mouse.y);

      // backbuffer
      const backbufferLocation = gl.getUniformLocation(
        this.currentProgram,
        "backbuffer"
      );

      gl.uniform1i(backbufferLocation, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.backTarget.texture);

      // textures
      for (let i = 0; i < this.activeTextures.length; i++) {
        const uniformName = `channel${i}`;
        const textureLocation = gl.getUniformLocation(
          this.currentProgram,
          uniformName
        );

        const uniformSizeName = `channelSize${i}`;
        const textureResolutionLocation = gl.getUniformLocation(
          this.currentProgram,
          uniformSizeName
        );

        const activeSize =
          this.activeTextures[i].size === undefined
            ? { width: 1, height: 1 }
            : this.activeTextures[i].size;

        gl.uniform2f(
          textureResolutionLocation,
          activeSize.width,
          activeSize.height
        );

        gl.uniform1i(textureLocation, 1 + i);
        gl.activeTexture(gl.TEXTURE1 + i);
        gl.bindTexture(gl.TEXTURE_2D, this.activeTextures[i].texture);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frontTarget.framebuffer);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

      gl.useProgram(this.screenProgram);

      const resolutionLocation2 = gl.getUniformLocation(
        this.screenProgram,
        "resolution"
      );
      gl.uniform2f(resolutionLocation2, canvasSize.width, canvasSize.height);
      const textureLocation = gl.getUniformLocation(
        this.screenProgram,
        "texture"
      );
      gl.uniform1i(textureLocation, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.vertexAttribPointer(
        this.screenPositionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.frontTarget.texture);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

      // swap buffers
      const tmp = this.frontTarget;
      this.frontTarget = this.backTarget;
      this.backTarget = tmp;

      console.log("updateCanvas");
    },
    createShader(gl, type, source) {
      const shader = gl.createShader(type);
      if (!shader) {
        console.log("error: WebGLShader is null.");
        return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

      if (!success) {
        console.log(gl.getShaderInfoLog(shader));

        const errorLog = gl.getShaderInfoLog(shader);

        // Extract error messages from errorLog
        const errors = [];
        if (errorLog) {
          let match;
          while ((match = GLSL_ERROR_PATTERN.exec(errorLog))) {
            errors.push({
              errorLine: parseInt(match[1], 10) - 1,
              // Subtract 1 from errorLine since first index becomes 1.
              type: 4,
              message: match[2]
            });
          }
        }

        if (type === gl.FRAGMENT_SHADER) {
          this.$emit("onErrorLineUpdated", errors);
        }

        gl.deleteShader(shader);
        return null;
      }

      // When errors are fixed
      if (this.hasError) {
        if (type === gl.FRAGMENT_SHADER) {
          this.$emit("onErrorLineUpdated", []);
        }
      }

      return shader;
    },
    // added for testing image loading from store
    updateTextures(gl) {
      this.texturePromises = {};
      this.loadTextures(gl, this.activeExternalResources);
    },
    loadTextures(gl, externalResource) {
      this.activeTextures = [];
      if (!externalResource) {
        this.loadBlankTexture(gl, 0);
      } else {
        this.loadTexture(gl, externalResource, 0);
      }
    },
    loadBlankTexture(gl, index) {
      if (!gl) {
        return;
      }
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 55, 255]); // blank texture is currently dark-blue, open to change

      const size = {
        width: 1,
        height: 1
      };

      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
      );

      if (texture) {
        this.activeTextures[index] = {
          texture,
          size
        };
      }
    },
    // liberal use of https://docs.w3cub.com/dom/webgl_api/tutorial/using_textures_in_webgl/
    loadTexture(gl, externalResource, index) {
      if (!gl) {
        return;
      }

      const url = externalResource;

      console.log("loading texture", url);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 55, 255]); // opaque blue
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
      );

      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = url;

      const initalSize = {
        width: 1,
        height: 1
      };

      if (texture) {
        this.activeTextures[index] = {
          texture,
          size: initalSize
        };
      }

      this.texturePromises[`key_${index}`] = new Promise(
        (resolve, reject) => {
          image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
              gl.TEXTURE_2D,
              level,
              internalFormat,
              srcFormat,
              srcType,
              image
            );

            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_S,
              gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_T,
              gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_MAG_FILTER,
              gl.NEAREST
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_MIN_FILTER,
              gl.NEAREST
            );

            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_MIN_FILTER,
              gl.LINEAR
            );

            this.activeTextures[index].size = {
              width: image.width,
              height: image.height
            };

            resolve(index);
          };

          image.onerror = error => {
            reject(error);
          };
        }
      );

      gl.bindTexture(gl.TEXTURE_2D, null);
    },
    createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();

      if (!program) {
        console.log("WebGLProgram is null.");
        return null;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      gl.linkProgram(program);

      const success = gl.getProgramParameter(program, gl.LINK_STATUS);

      if (!success) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    },
    createFramebufferTarget(gl, width, height) {
      const target = {
        framebuffer: gl.createFramebuffer(),
        renderbuffer: gl.createRenderbuffer(),
        texture: gl.createTexture()
      };

      // set up framebuffer
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        target.texture,
        0
      );

      // set up renderbuffer
      gl.bindRenderbuffer(gl.RENDERBUFFER, target.renderbuffer);
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        width,
        height
      );
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        target.renderbuffer
      );

      // clean up
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return target;
    },
    createRenderTargets(gl) {
      this.frontTarget = this.createFramebufferTarget(
        gl,
        this.canvasWidth,
        this.canvasHeight
      );
      this.backTarget = this.createFramebufferTarget(
        gl,
        this.canvasWidth,
        this.canvasHeight
      );
    },
    compileScreenProgram(gl) {
      const program = gl.createProgram();
      const vs = this.createShader(gl, gl.VERTEX_SHADER, this.v);
      const fs = this.createShader(gl, gl.FRAGMENT_SHADER, this.f);

      if (program && vs && fs) {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.log(
            "VALIDATE_STATUS: " +
            gl.getProgramParameter(program, gl.VALIDATE_STATUS),
            "ERROR: " + gl.getError()
          );
          return;
        }
        this.screenProgram = program;

        gl.useProgram(this.screenProgram);
        this.screenPositionAttributeLocation = gl.getAttribLocation(
          this.screenProgram,
          "position"
        );
        gl.enableVertexAttribArray(this.screenPositionAttributeLocation);
      }
    },
    onMousemove(e) {
      if (!this.canvas) {
        return;
      }
      const rect = this.canvas.getBoundingClientRect();
      const root = document.documentElement;
      if (root) {
        const left = rect.top + root.scrollLeft;
        const top = rect.top + root.scrollTop;
        this.mouse.x = (e.pageX - left) / this.size.width;
        this.mouse.y = 1 - (e.pageY - top) / this.size.height;
      }
    },
    onWebglcontextlost(event) {
      console.log("onWebglcontextlost");

      event.preventDefault();
      this.stopAnimate();
    },
    onWebglcontextrestored() {
      console.log("onWebglcontextrestored");

      this.initGLSLCanvas();
      this.animate();
    }
  },
  computed: {
    canvas() {
      return this.$refs.canvas
    },
    canvasWidth() {
      return this.size.width / this.quality
    },
    canvasHeight() {
      return this.size.height / this.quality
    }
  },
  watch: {
    vertexShader() {
      this.currentProgram = null
    },
    fragmentShader() {
      this.currentProgram = null
    },
    activeExternalResources() {
      this.currentProgram = null
    },
    size() {
      this.createRenderTargets(this.getGL());
    },
    quality() {
      this.createRenderTargets(this.getGL());
    }
  },
  mounted() {
    this.initGLSLCanvas();

    window.addEventListener("mousemove", this.onMousemove);

    // webglcontextlost error is often thrown on only Safari.
    // https://www.khronos.org/webgl/wiki/HandlingContextLost
    this.canvas.addEventListener(
      "webglcontextlost",
      this.onWebglcontextlost,
      false
    );
    this.canvas.addEventListener(
      "webglcontextrestored",
      this.onWebglcontextrestored,
      false
    );

    this.animate();
  },
  beforeDestroy() {
    window.removeEventListener("mousemove", this.onMousemove);

    this.stopAnimate();
  }
}
</script>
