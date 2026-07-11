import React, { useEffect, useRef } from 'react';

export const ThreeBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            void main() {
                v_texCoord = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            varying vec2 v_texCoord;

            void main() {
                vec2 uv = v_texCoord;
                vec2 p = uv * 2.0 - 1.0;
                p.x *= u_resolution.x / u_resolution.y;
                
                // Smooth interaction
                vec2 m = u_mouse / u_resolution * 2.0 - 1.0;
                m.x *= u_resolution.x / u_resolution.y;
                float d = length(p - m);
                
                // Liquid noise structure
                float t = u_time * 0.3;
                for(float i = 1.0; i < 4.0; i++) {
                    p.x += sin(p.y * 1.5 + t + i) * 0.5;
                    p.y += cos(p.x * 1.5 + t + i) * 0.5;
                }
                
                // Obsidian / Electric Indigo Palette
                vec3 baseColor = vec3(0.008, 0.024, 0.09); // Deep Slate Navy
                vec3 accent1 = vec3(0.388, 0.4, 0.945);    // Electric Indigo
                vec3 accent2 = vec3(0.545, 0.22, 0.902);   // Vibrant Violet
                
                float intensity = sin(p.x * p.y * 0.5 + t) * 0.5 + 0.5;
                intensity *= (1.0 - d * 0.25); // Fade slightly with distance from mouse
                
                vec3 color = mix(baseColor, accent1, intensity * 0.25);
                color = mix(color, accent2, pow(intensity, 3.0) * 0.15);
                
                // Add a slight "metallic" sheen
                float sheen = pow(max(0.0, 1.0 - length(p * 0.5)), 3.0);
                color += accent1 * sheen * 0.05;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const program = gl.createProgram();
        if (!program) return;
        
        const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (vs) gl.attachShader(program, vs);
        if (fs) gl.attachShader(program, fs);
        gl.linkProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        const mouseLocation = gl.getUniformLocation(program, "u_mouse");

        let mouseX = 0, mouseY = 0;
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = window.innerHeight - e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        function resize() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl?.viewport(0, 0, canvas.width, canvas.height);
        }
        window.addEventListener('resize', resize);
        resize();

        let animationFrameId: number;
        function render(time: number) {
            if (!gl || !program) return;
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.uniform1f(timeLocation, time * 0.001);
            gl.uniform2f(resolutionLocation, canvas!.width, canvas!.height);
            gl.uniform2f(mouseLocation, mouseX, mouseY);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        }
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            id="bg-canvas" 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" 
        />
    );
};
