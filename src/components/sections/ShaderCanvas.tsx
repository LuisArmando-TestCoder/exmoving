"use client";

import React, { useEffect, useRef } from 'react';
import styles from './ShaderCanvas.module.scss';

interface ShaderCanvasProps {
  shader: string;
  iChannel0?: string;
  iChannel1?: string;
  iChannel2?: string;
  iChannel3?: string;
}

export const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
  shader,
  iChannel0,
  iChannel1,
  iChannel2,
  iChannel3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now() + Math.random() * 1e8);
  const mouseRef = useRef({ x: 0, y: 0, z: 0, w: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec4 iMouse;
      uniform sampler2D iChannel0;
      uniform sampler2D iChannel1;
      uniform sampler2D iChannel2;
      uniform sampler2D iChannel3;

      ${shader}

      void main() {
        vec4 color;
        mainImage(color, gl_FragCoord.xy);
        gl_FragColor = color;
      }
    `;

    const compileShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program failed to link:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
    const iChannelLocations = [
      gl.getUniformLocation(program, 'iChannel0'),
      gl.getUniformLocation(program, 'iChannel1'),
      gl.getUniformLocation(program, 'iChannel2'),
      gl.getUniformLocation(program, 'iChannel3'),
    ];

    const loadTexture = (url: string, unit: number) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const image = new Image();
      if (url.startsWith('http')) image.crossOrigin = 'anonymous';
      image.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
      };
      image.src = url;
      return texture;
    };

    [iChannel0, iChannel1, iChannel2, iChannel3].forEach((url, i) => {
      if (url) loadTexture(url, i);
    });

    // Trail Canvas Setup (Channel 1)
    const trailCanvas = document.createElement('canvas');
    trailCanvas.width = canvas.width;
    trailCanvas.height = canvas.height;
    const trailCtx = trailCanvas.getContext('2d');
    
    let trailTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, trailTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let lastMouseX = mouseRef.current.x;
    let lastMouseY = mouseRef.current.y;

    const render = () => {
      if (!gl || !program) return;
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;

      // Smooth mouse movement
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.15;

      // Update Trail Canvas
      if (trailCtx && trailCanvas.width > 0 && trailCanvas.height > 0) {
        // Fade out existing trail (lower alpha = slower fade)
        trailCtx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);

        // Always draw at current mouse position so it stains when stationary
        trailCtx.beginPath();
        trailCtx.moveTo(lastMouseX, lastMouseY); 
        trailCtx.lineTo(mouseRef.current.x, mouseRef.current.y);
        
        // If mouse hasn't moved much, we just draw a point at the current location
        if (Math.hypot(mouseRef.current.x - lastMouseX, mouseRef.current.y - lastMouseY) <= 0.1) {
          trailCtx.lineTo(mouseRef.current.x + 0.1, mouseRef.current.y);
        }

        trailCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        trailCtx.lineWidth = 200; // Size of the trail "spray" (much thicker)
        trailCtx.lineCap = 'round';
        trailCtx.lineJoin = 'round';
        
        // Add some blur/glow to the stroke itself
        trailCtx.shadowBlur = 100; // Increased blur for much thicker spray
        trailCtx.shadowColor = 'white';
        
        trailCtx.stroke();
        
        lastMouseX = mouseRef.current.x;
        lastMouseY = mouseRef.current.y;

        // Update Texture from Trail Canvas
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, trailTexture);
        // Ensure UNPACK_FLIP_Y_WEBGL is consistently true for correct orientation
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trailCanvas);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform3f(iResolutionLocation, canvas.width, canvas.height, 1.0);
      gl.uniform1f(iTimeLocation, elapsedTime);
      gl.uniform4f(iMouseLocation, mouseRef.current.x, mouseRef.current.y, mouseRef.current.z, mouseRef.current.w);

      iChannelLocations.forEach((loc, i) => gl.uniform1i(loc, i));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current.x = e.clientX - rect.left;
      targetMouseRef.current.y = rect.height - (e.clientY - rect.top);
      if (isMouseDownRef.current) {
        mouseRef.current.z = targetMouseRef.current.x;
        mouseRef.current.w = targetMouseRef.current.y;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      handleMouseMove(e);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (programRef.current) gl.deleteProgram(programRef.current);
    };
  }, [shader, iChannel0, iChannel1, iChannel2, iChannel3]);

  return (
    <div className={styles.canvasContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};
