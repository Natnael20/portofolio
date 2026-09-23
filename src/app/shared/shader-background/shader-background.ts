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
  precision lowp float;

  uniform vec2  u_resolution;
  uniform float u_time;

  #define LINE_COUNT 8

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution)
            / min(u_resolution.x, u_resolution.y);

    // Background + atmosphere (single exp)
    vec3 color = vec3(0.02, 0.01, 0.05);
    color += vec3(0.05, 0.02, 0.12) * exp(-uv.y * uv.y * 4.0 - uv.x * uv.x * 0.5);

    // Precomputed palette
    vec3 blue   = vec3(0.30, 0.42, 1.00);
    vec3 violet = vec3(0.55, 0.22, 1.00);
    vec3 pink   = vec3(1.00, 0.35, 0.92);

    for (int i = 0; i < LINE_COUNT; i++) {
      float fi = float(i);
      float baseY = (fi - 3.5) * 0.09;
      float phase = fi * 0.47;

      // One sine only
      float wave  = sin(uv.x * 2.2 + phase + u_time * 0.15) * 0.14;
      float lineY = baseY + wave;
      float d = abs(uv.y - lineY);

      float core = smoothstep(0.008, 0.0, d);
      float glow = exp(-d * 55.0);

      float t = clamp(uv.x * 0.5 + 0.5, 0.0, 1.0);
      vec3 lineColor = mix(mix(blue, violet, t), pink, t * t);

      color += lineColor * (core * 1.5 + glow * 0.35);
    }

    // Vignette
    color *= 1.0 - dot(uv * 0.6, uv * 0.6);

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
  const parent = canvas.parentElement!;

  // Lower DPR cap — biggest performance win
  const dpr = 1.0;   // ← was 1.5, now 1.0 (or even 0.75 on mobile)
  const w = Math.floor(parent.clientWidth * dpr);
  const h = Math.floor(parent.clientHeight * dpr);

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