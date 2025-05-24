import React, { useEffect, useRef } from "react";

const ShaderCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      alert("WebGL not supported");
      return;
    }

    // Vertex Shader (Full screen quad)
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fragmentShaderSource = `
      precision highp float;
      
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      
      #define PI 3.14159265359
      #define PURPLE1 0.6    // Main purple (reduced from 0.8)
      #define PURPLE2 0.4    // Secondary purple (reduced from 0.5)
      #define PURPLE3 0.2    // Dark purple (reduced from 0.3)
      #define SINE1 1.0   // Standard sine modulation
      #define SINE2 1.2   // Slightly faster modulation
      #define SINE3 0.5   // Softer sine effect
      #define MOD1 0.05   // Base modulation (reduced from 0.1)
      #define MOD2 0.15   // Enhanced variation (reduced from 0.3)
      #define MOD3 0.1    // Reduced modulation (reduced from 0.2)

      vec4 effect(vec2 screenSize, vec2 screen_coords) {
          vec2 uv = (screen_coords - 0.5 * screenSize) / (length(screenSize) * 0.5);
          float uv_len = length(uv);
          
          float day = mod(4.0, 7.0);
          
          if(day < 1.0) {
              float speed = mod(iTime * 0.2, PI * 2.0);
              float new_pixel_angle = atan(uv.y, uv.x) + speed - 20.0 * (0.25 * uv_len + 0.75);
              vec2 mid = (screenSize / length(screenSize)) / 2.0;
              uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
          }
          else if(day < 2.0) {
              float angle = iTime * 0.5 + uv_len * 5.0;
              uv = vec2(uv.x * cos(angle) - uv.y * sin(angle),
                      uv.x * sin(angle) + uv.y * cos(angle));
              uv += 0.1 * vec2(sin(uv.y * 15.0 + iTime * 0.5),
                              cos(uv.x * 15.0 + iTime * 0.5));
          }
          else if(day < 3.0) {
              uv += 0.05 * vec2(sin(uv.y * 20.0 + iTime * 0.5),
                              cos(uv.x * 20.0 + iTime * 0.5));
          }
          else if(day < 4.0) {
              vec2 originalUV = uv;
              for (int i = 0; i < 7; i++) {
                  uv += 0.1 * vec2(sin(uv.y * 10.0 + iTime * 0.25 + float(i)),
                                  cos(uv.x * 10.0 + iTime * 0.25 + float(i)));
                  uv *= 1.1;
              }
              uv = mix(uv, originalUV, 0.5);
          }
          else if(day < 5.0) {
              float jitter = 0.2 * sin(uv_len * 20.0 - iTime * 0.5);
              float a = atan(uv.y, uv.x);
              uv += jitter * vec2(cos(a), sin(a));
          }
          else if(day < 6.0) {
              float n = sin(dot(uv, vec2(12.9898,78.233)) + iTime * 1.5);
              uv += 0.03 * vec2(n, cos(dot(uv, vec2(12.9898,78.233)) + iTime * 1.5));
          }
          else {
              uv = fract(uv * 2.0 * (sin(iTime * 0.35 + 0.2) + 2.0) + (iTime * 0.125));
              uv *= 1.5;
          }
          
          vec2 uv_loop = uv * 30.0;
          float speed = iTime * 3.5;
          vec2 uv2 = vec2(uv_loop.x + uv_loop.y);
          for (int i = 0; i < 5; i++) {
              uv2 += sin(max(uv_loop.x, uv_loop.y)) + uv_loop;
              uv_loop += 0.5 * vec2(
                  cos(5.1123314 + 0.353 * uv2.y + speed * 0.0655605),
                  sin(uv2.x - 0.0565 * speed)
              );
              uv_loop -= cos(uv_loop.x + uv_loop.y) - sin(uv_loop.x * 0.711 - uv_loop.y);
          }

          float paint_res = min(2.0, max(0.0, length(uv_loop) * 0.077));
          float c1p = max(0.0, 1.0 - 2.2 * abs(1.0 - paint_res));
          float c2p = max(0.0, 1.0 - 2.2 * abs(paint_res));
          float c3p = 1.0 - min(1.0, c1p + c2p);
          float light = 0.1 * max(c1p * 5.0 - 4.0, 0.0) + 0.2 * max(c2p * 5.0 - 4.0, 0.0);  // Reduced light intensity

          vec4 purple1 = vec4(PURPLE1 * 0.7, 0.0, PURPLE1 * 0.9, 1.0) + MOD1 * sin(iTime + SINE1) * vec4(0.1, 0.0, 0.2, 0.0);
          vec4 purple2 = vec4(PURPLE2 * 0.7, 0.0, PURPLE2 * 0.9, 1.0) + MOD2 * sin(iTime + SINE2) * vec4(0.1, 0.0, 0.2, 0.0);
          vec4 purple3 = vec4(PURPLE3 * 0.7, 0.0, PURPLE3 * 0.9, 1.0) + MOD3 * sin(iTime + SINE3) * vec4(0.1, 0.0, 0.2, 0.0);

          return (0.3 / 3.5) * purple1
              + (1.0 - 0.3 / 3.5) * (purple1 * c1p + purple2 * c2p + vec4(c3p * purple3.rgb, c3p * purple1.a))
              + light;
      }

      void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          vec2 mouse = iMouse;
          
          float radius = 70.0;
          float d = distance(fragCoord, mouse);
          float t = 1.0 - smoothstep(0.0, radius, d);
          float angle = t * 0.5 * sin(iTime + d * 0.1);
          
          vec2 dir = fragCoord - mouse;
          vec2 rotatedDir = vec2(
              dir.x * cos(angle) - dir.y * sin(angle),
              dir.x * sin(angle) + dir.y * cos(angle)
          );
          vec2 swirledCoord = mouse + rotatedDir;
          
          gl_FragColor = effect(iResolution, swirledCoord);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad covering entire screen
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttribute = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    const iResolution = gl.getUniformLocation(program, "iResolution");
    const iTime = gl.getUniformLocation(program, "iTime");
    const iMouse = gl.getUniformLocation(program, "iMouse");

    let startTime = Date.now() / 1000;
    let mouse = [0, 0];

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouse = [
        (e.clientX - rect.left) * scaleX,
        canvas.height - ((e.clientY - rect.top) * scaleY)
      ];
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      const now = Date.now() / 1000;
      const time = now - startTime;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iTime, time);
      gl.uniform2f(iMouse, mouse[0], mouse[1]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} style={{ width: "100%", height: "100%" }} />;
};

export default ShaderCanvas;
