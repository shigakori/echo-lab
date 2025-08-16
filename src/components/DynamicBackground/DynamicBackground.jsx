"use client";
import { useEffect, useRef } from "react";

const DynamicBackground = ({ logoPath = "/images/logos/logo_light.png" }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const geometryRef = useRef(null);
  const particleGridRef = useRef([]);
  const posArrayRef = useRef(null);
  const colorArrayRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const execCountRef = useRef(0);
  const isCleanedUpRef = useRef(false);
  const isMobileRef = useRef(false);

  const CONFIG = {
    canvasBg: "#1a1a1a",
    logoSize: 1100,
    distortionRadius: 1000,
    forceStrength: 0.003,
    maxDisplacement: 120,
    returnForce: 0.025,
    animationThrottle: 8,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("DynamicBackground: Canvas ref not available");
      return;
    }

    // Always initialize when component is mounted

    console.log("DynamicBackground: Initializing on home page", { logoPath });

    isCleanedUpRef.current = false;
    execCountRef.current = 0;

    canvas.width =
      window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    canvas.height =
      window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    console.log(
      "DynamicBackground: Device check passed, proceeding with initialization"
    );

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    console.log("DynamicBackground: Canvas dimensions set", {
      width: canvas.width,
      height: canvas.height,
      styleWidth: canvas.style.width,
      styleHeight: canvas.style.height,
    });

    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error("DynamicBackground: WebGL not supported");
      return;
    }

    console.log("DynamicBackground: WebGL context created successfully");

    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const bgColor = hexToRgb(CONFIG.canvasBg);
    gl.clearColor(bgColor.r, bgColor.g, bgColor.b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log("DynamicBackground: Background color set", bgColor);

    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 0, g: 0, b: 0 };
    }

    const vertexShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      attribute vec2 a_position;
      attribute vec4 a_color;
      varying vec4 v_color;
      void main() {
         vec2 zeroToOne = a_position / u_resolution;
         vec2 clipSpace = (zeroToOne * 2.0 - 1.0);
         v_color = a_color;
         gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
         gl_PointSize = 5.0;
     }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
          if (v_color.a < 0.01) discard;
          
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          float alpha = 1.0 - smoothstep(0.0, 0.4, dist);
          
          vec3 brightColor = v_color.rgb * 1.3;
          gl_FragColor = vec4(brightColor, v_color.a * alpha);
      }
    `;

    function createShader(gl, type, source) {
      if (!gl || isCleanedUpRef.current) return null;

      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
      if (!gl || !vertexShader || !fragmentShader || isCleanedUpRef.current)
        return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );

    const loadLogo = () => {
      if (isCleanedUpRef.current) {
        console.log(
          "DynamicBackground: Skipping logo load - component cleaned up or not on home page"
        );
        return;
      }

      console.log("DynamicBackground: Loading logo...");

      isCleanedUpRef.current = false;

      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        if (isCleanedUpRef.current || !canvasRef.current) return;

        console.log("DynamicBackground: Logo image loaded successfully", {
          width: image.width,
          height: image.height,
        });

        const testCtx = canvas.getContext("2d");
        if (testCtx) {
          testCtx.clearRect(0, 0, canvas.width, canvas.height);
          testCtx.fillStyle = "#1a1a1a";
          testCtx.fillRect(0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const logoSize = 400;

          testCtx.drawImage(
            image,
            centerX - logoSize / 2,
            centerY - logoSize / 2,
            logoSize,
            logoSize
          );

          console.log("DynamicBackground: TEST - Logo drawn on 2D canvas at", {
            centerX,
            centerY,
            logoSize,
          });
        }

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = CONFIG.logoSize;
        tempCanvas.height = CONFIG.logoSize;

        tempCtx.clearRect(0, 0, CONFIG.logoSize, CONFIG.logoSize);

        const scale = 0.8;
        const scaledSize = CONFIG.logoSize * scale;
        const offset = (CONFIG.logoSize - scaledSize) / 2;

        tempCtx.drawImage(image, offset, offset, scaledSize, scaledSize);
        const imageData = tempCtx.getImageData(
          0,
          0,
          CONFIG.logoSize,
          CONFIG.logoSize
        );

        let nonTransparentPixels = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] > 10) {
            nonTransparentPixels++;
          }
        }
        console.log("Found", nonTransparentPixels, "non-transparent pixels");

        if (nonTransparentPixels === 0) {
          console.error(
            "DynamicBackground: No visible pixels found in logo image"
          );
          return;
        }

        initParticleSystem(imageData.data, CONFIG.logoSize);
      };

      image.onerror = (error) => {
        console.error("Failed to load logo image:", logoPath, error);
      };

      image.src = logoPath;
    };

    function initParticleSystem(pixels, dim) {
      if (isCleanedUpRef.current) {
        console.log(
          "DynamicBackground: Skipping particle system init - component cleaned up or not on home page"
        );
        return;
      }

      console.log("DynamicBackground: Initializing particle system...");

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particleGridRef.current = [];
      const validParticles = [];
      const validPositions = [];
      const validColors = [];

      const step = Math.max(1, Math.floor(dim / 150));
      for (let i = 0; i < dim; i += step) {
        for (let j = 0; j < dim; j += step) {
          const pixelIndex = (i * dim + j) * 4;
          const alpha = pixels[pixelIndex + 3];

          if (alpha > 2) {
            const x = centerX + (j - dim / 2) * 1.0;
            const y = centerY + (i - dim / 2) * 1.0;

            validPositions.push(x, y);
            validColors.push(
              pixels[pixelIndex] / 255,
              pixels[pixelIndex + 1] / 255,
              pixels[pixelIndex + 2] / 255,
              pixels[pixelIndex + 3] / 255
            );

            validParticles.push({
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }

      particleGridRef.current = validParticles;
      posArrayRef.current = new Float32Array(validPositions);
      colorArrayRef.current = new Float32Array(validColors);

      const positionBuffer = gl.createBuffer();
      const colorBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, posArrayRef.current, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorArrayRef.current, gl.STATIC_DRAW);

      geometryRef.current = {
        positionBuffer,
        colorBuffer,
        vertexCount: validParticles.length,
      };

      console.log(`Created ${validParticles.length} particles`);
      console.log("DynamicBackground: Starting animation...");

      isCleanedUpRef.current = false;
      startAnimation();
    }

    function startAnimation() {
      let lastTime = 0;
      function animate(currentTime) {
        if (
          isCleanedUpRef.current ||
          !gl ||
          !programRef.current ||
          !geometryRef.current ||
          !canvasRef.current
        ) {
          return;
        }

        // keep animating while mounted

        if (currentTime - lastTime < CONFIG.animationThrottle) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
        lastTime = currentTime;

        if (execCountRef.current > 0) {
          execCountRef.current -= 1;

          const rad = CONFIG.distortionRadius * CONFIG.distortionRadius;
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          for (
            let i = 0, len = particleGridRef.current.length;
            i < len;
            i += 1
          ) {
            const x = posArrayRef.current[i * 2];
            const y = posArrayRef.current[i * 2 + 1];
            const d = particleGridRef.current[i];

            const dx = mx - x;
            const dy = my - y;
            const dis = dx * dx + dy * dy;

            if (dis < rad && dis > 0) {
              const f = -rad / dis;
              const t = Math.atan2(dy, dx);

              d.vx += f * Math.cos(t) * CONFIG.forceStrength;
              d.vy += f * Math.sin(t) * CONFIG.forceStrength;
            }

            const newX = x + (d.vx *= 0.82) + (d.ox - x) * CONFIG.returnForce;
            const newY = y + (d.vy *= 0.82) + (d.oy - y) * CONFIG.returnForce;

            const dx_origin = newX - d.ox;
            const dy_origin = newY - d.oy;
            const distFromOrigin = Math.sqrt(
              dx_origin * dx_origin + dy_origin * dy_origin
            );

            if (distFromOrigin > CONFIG.maxDisplacement) {
              const scale = CONFIG.maxDisplacement / distFromOrigin;
              posArrayRef.current[i * 2] = d.ox + dx_origin * scale;
              posArrayRef.current[i * 2 + 1] = d.oy + dy_origin * scale;
              d.vx *= 0.8;
              d.vy *= 0.8;
            } else {
              posArrayRef.current[i * 2] = newX;
              posArrayRef.current[i * 2 + 1] = newY;
            }
          }

          if (execCountRef.current > 0) {
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArrayRef.current);
          }
        }

        const bgColor = hexToRgb(CONFIG.canvasBg);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(bgColor.r, bgColor.g, bgColor.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (execCountRef.current === 0) {
          console.log("DynamicBackground: Animation frame rendered", {
            particles: geometryRef.current?.vertexCount || 0,
            canvasSize: { width: canvas.width, height: canvas.height },
            mousePos: { x: mouseRef.current.x, y: mouseRef.current.y },
            programActive: !!programRef.current,
            geometryActive: !!geometryRef.current,
          });
        }

        gl.useProgram(programRef.current);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(
          positionAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.colorBuffer);
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(
          colorAttributeLocation,
          4,
          gl.FLOAT,
          false,
          0,
          0
        );

        if (execCountRef.current === 0) {
          console.log("DynamicBackground: About to draw particles", {
            vertexCount: geometryRef.current.vertexCount,
            positionBuffer: !!geometryRef.current.positionBuffer,
            colorBuffer: !!geometryRef.current.colorBuffer,
          });
        }

        gl.drawArrays(gl.POINTS, 0, geometryRef.current.vertexCount);

        animationFrameRef.current = requestAnimationFrame(animate);
      }

      animate();
    }

    let mouseThrottle = 0;
    const handleMouseMove = (event) => {
      const now = performance.now();
      if (now - mouseThrottle < 4) return;
      mouseThrottle = now;

      if (isCleanedUpRef.current || !canvasRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      mouseRef.current.x = (event.clientX - rect.left) * dpr;
      mouseRef.current.y = (event.clientY - rect.top) * dpr;
      execCountRef.current = 150;
    };

    let resizeThrottle = 0;
    const handleResize = () => {
      const now = performance.now();
      if (now - resizeThrottle < 100) return;
      resizeThrottle = now;

      if (isCleanedUpRef.current || !canvasRef.current) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      if (geometryRef.current && particleGridRef.current.length > 0) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dim = Math.sqrt(particleGridRef.current.length);

        for (let i = 0; i < particleGridRef.current.length; i++) {
          const row = Math.floor(i / dim);
          const col = i % dim;
          const newX = centerX + (col - dim / 2) * 1.0;
          const newY = centerY + (row - dim / 2) * 1.0;

          particleGridRef.current[i].ox = newX;
          particleGridRef.current[i].oy = newY;
          posArrayRef.current[i * 2] = newX;
          posArrayRef.current[i * 2 + 1] = newY;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArrayRef.current);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    loadLogo();

    return () => {
      console.log("DynamicBackground: Component unmounting, cleaning up...");
      isCleanedUpRef.current = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (gl && !gl.isContextLost()) {
        try {
          if (geometryRef.current) {
            if (geometryRef.current.positionBuffer) {
              gl.deleteBuffer(geometryRef.current.positionBuffer);
            }
            if (geometryRef.current.colorBuffer) {
              gl.deleteBuffer(geometryRef.current.colorBuffer);
            }
            geometryRef.current = null;
          }

          if (programRef.current) {
            const shaders = gl.getAttachedShaders(programRef.current);
            if (shaders) {
              shaders.forEach((shader) => {
                gl.detachShader(programRef.current, shader);
                gl.deleteShader(shader);
              });
            }
            gl.deleteProgram(programRef.current);
            programRef.current = null;
          }
        } catch (error) {
          console.warn("Error during WebGL cleanup:", error);
        }
      }

      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      particleGridRef.current = [];
      posArrayRef.current = null;
      colorArrayRef.current = null;
      mouseRef.current = { x: 0, y: 0 };
      execCountRef.current = 0;
      glRef.current = null;
    };
  }, [logoPath]);

  return (
    <canvas
      suppressHydrationWarning
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        backgroundColor: CONFIG.canvasBg,
        mixBlendMode: "normal",
        willChange: "transform",
        transform: "translateZ(0)",
        isolation: "isolate",
        opacity: 1,
        visibility: "visible",
      }}
    />
  );
};

export default DynamicBackground;
