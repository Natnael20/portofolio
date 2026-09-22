import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-shader-background',
  standalone: false,
  templateUrl: './shader-background.html',
  styleUrls: ['./shader-background.css']
})
export class ShaderBackground implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private gl!: WebGLRenderingContext;
  private program!: WebGLProgram;
  private animationId!: number;
  private startTime = 0;
  private resizeObserver?: ResizeObserver;

  // ================================
  // VERTEX SHADER
  // ================================
  private readonly vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // ================================
  // FRAGMENT SHADER — Plasma Grid
  // ================================
private readonly fragmentShaderSource = `
  precision highp float;

  uniform vec2  u_resolution;
  uniform float u_time;

  #define LINE_COUNT 18

  // ------------------------------------------------------------
  // Soft glowing line
  // ------------------------------------------------------------
  float glowLine(float d, float thickness) {
    float core = 1.0 - smoothstep(0.0, thickness, d);
    float glow = exp(-d * 55.0);
    return core * 0.9 + glow * 0.45;
  }

  void main() {

    // Aspect-correct coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution)
            / min(u_resolution.x, u_resolution.y);

    // ------------------------------------------------------------
    // Background
    // ------------------------------------------------------------
    vec3 color = vec3(0.018, 0.012, 0.045);

    // Purple atmospheric glow behind the lines
    float atmosphere =
        exp(-pow((uv.y + 0.02) * 2.0, 2.0)) *
        exp(-pow(uv.x * 0.65, 2.0));

    color += vec3(0.045, 0.018, 0.12) * atmosphere;

    // ------------------------------------------------------------
    // Neon flowing lines
    // ------------------------------------------------------------
    for (int i = 0; i < LINE_COUNT; i++) {

      float fi = float(i);

      // Spread the lines vertically
      float baseY =
          (fi - float(LINE_COUNT - 1) * 0.5) * 0.043;

      // Give every line a slightly different shape.
      // Large, slow curves are what create the look in the image.
      float phase = fi * 0.47;

      float speed =
          0.12 +
          mod(fi, 5.0) * 0.012;

      float x = uv.x;

      float wave = 0.0;

      // Large primary arc
      wave +=
          sin(x * 2.15 + phase + u_time * speed)
          * (0.115 + 0.025 * sin(fi * 1.7));

      // Secondary broad bend
      wave +=
          sin(x * 4.1 - phase * 0.8 + u_time * speed * 0.72)
          * 0.045;

      // Small irregularity
      wave +=
          sin(x * 8.5 + phase * 1.3 + u_time * 0.12)
          * 0.012;

      // A few lines get much taller arcs,
      // creating the tall loops visible in the reference.
      float tall =
          smoothstep(0.15, 0.85, abs(sin(fi * 1.31)));

      wave +=
          sin(x * 1.45 + phase * 1.7 + u_time * speed * 0.55)
          * tall * 0.085;

      float lineY = baseY + wave;

      // ----------------------------------------------------------
      // Distance to line
      // ----------------------------------------------------------
      float d = abs(uv.y - lineY);

      // Thin bright core
      float core =
          smoothstep(0.0055, 0.0, d);

      // Broad neon glow
      float glow1 =
          exp(-d * 42.0);

      float glow2 =
          exp(-d * 120.0);

      // ----------------------------------------------------------
      // Blue -> violet -> pink
      // ----------------------------------------------------------
      float t = clamp(uv.x * 0.5 + 0.5, 0.0, 1.0);

      vec3 blue   = vec3(0.25, 0.40, 1.00);
      vec3 violet = vec3(0.52, 0.20, 1.00);
      vec3 pink   = vec3(1.00, 0.32, 0.92);

      vec3 lineColor;

      if (t < 0.55) {
        lineColor = mix(blue, violet, t / 0.55);
      } else {
        lineColor = mix(violet, pink, (t - 0.55) / 0.45);
      }

      // Slight variation per line
      lineColor *=
          0.82 +
          0.18 * sin(fi * 2.17);

      // ----------------------------------------------------------
      // Fade some lines for depth
      // ----------------------------------------------------------
      float depth =
          0.72 +
          0.28 * sin(fi * 0.83 + 1.0);

      // Main glow
      color += lineColor * glow1 * 0.20 * depth;

      // Bright neon core
      color += lineColor * core * 1.65 * depth;

      // Very bright center
      color += lineColor * glow2 * 0.75 * depth;
    }

    // ------------------------------------------------------------
    // A few tiny luminous particles on the lines
    // ------------------------------------------------------------
    for (int i = 0; i < 7; i++) {

      float fi = float(i);

      // Slowly moving particle position
      float px =
          mod(fi * 0.73 + u_time * (0.025 + fi * 0.003), 2.0) - 1.0;

      float phase = fi * 1.73;

      float py =
          sin(px * 2.15 + phase + u_time * 0.12) * 0.115
        + sin(px * 4.1 - phase * 0.8 + u_time * 0.09) * 0.045;

      float particle =
          exp(-length(uv - vec2(px, py)) * 180.0);

      color += vec3(1.0, 0.65, 1.0) * particle * 0.8;
    }

    // ------------------------------------------------------------
    // Vignette
    // ------------------------------------------------------------
    float vignette =
        1.0 - smoothstep(
          0.35,
          1.05,
          length(uv * vec2(0.72, 0.85))
        );

    color *= vignette;

    // Purple bloom
    color +=
        vec3(0.035, 0.01, 0.08) *
        atmosphere;

    // Slight gamma adjustment
    color = pow(max(color, 0.0), vec3(0.88));

    gl_FragColor = vec4(color, 1.0);
  }
`;


  // ================================
  // LIFECYCLE
  // ================================
  ngAfterViewInit(): void {
    this.initWebGL();
    this.startTime = performance.now();
    this.render();

    // Handle container resize
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvasRef.nativeElement);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.resizeObserver?.disconnect();
    const ext = this.gl?.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resize();
  }

  // ================================
  // WEBGL SETUP
  // ================================
  private initWebGL(): void {
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power'
    });

    if (!gl) {
      console.warn('WebGL not supported — background disabled.');
      return;
    }
    this.gl = gl;

    // Compile shaders
    const vs = this.compileShader(gl.VERTEX_SHADER, this.vertexShaderSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource);
    if (!vs || !fs) return;

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    this.program = program;
    gl.useProgram(program);

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
      ]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    (this as any).uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    (this as any).uTimeLoc       = gl.getUniformLocation(program, 'u_time');

    this.resize();
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // ================================
  // RESIZE
  // ================================
  private resize(): void {
    if (!this.gl) return;
    const canvas = this.canvasRef.nativeElement;

    // Cap DPR to keep perf reasonable on retina
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.floor(canvas.clientWidth  * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  // ================================
  // RENDER LOOP
  // ================================
  private render = (): void => {
    this.animationId = requestAnimationFrame(this.render);

    if (!this.gl || !this.program) return;

    const time = (performance.now() - this.startTime) / 1000;
    const canvas = this.canvasRef.nativeElement;

    this.gl.uniform2f((this as any).uResolutionLoc, canvas.width, canvas.height);
    this.gl.uniform1f((this as any).uTimeLoc, time);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  };
}