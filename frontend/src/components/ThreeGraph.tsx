import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeGraph: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || 480;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const primaryColor = 0x6366f1; 
        const secondaryColor = 0x06b6d4; 

        const nodeCount = 50;
        const nodes: THREE.Mesh[] = [];
        const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({ 
            color: primaryColor, 
            emissive: primaryColor, 
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9
        });

        const group = new THREE.Group();
        for (let i = 0; i < nodeCount; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 12
            );
            node.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.015,
            (Math.random() - 0.5) * 0.015,
            (Math.random() - 0.5) * 0.015
            );
            nodes.push(node);
            group.add(node);
        }
        scene.add(group);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(primaryColor, 1.5, 60);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 8;

        const lineMaterial = new THREE.LineBasicMaterial({ color: secondaryColor, transparent: true, opacity: 0.25 });
        let lines: THREE.LineSegments | null = null;

        function updateLines() {
            if (lines) group.remove(lines);
            const positions = [];
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = nodes[i].position.distanceTo(nodes[j].position);
                    if (dist < 3.5) {
                        positions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
                        positions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
                    }
                }
            }
            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            lines = new THREE.LineSegments(lineGeometry, lineMaterial);
            group.add(lines);
        }

        let animationFrameId: number;
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            
            nodes.forEach(node => {
                node.position.add(node.userData.velocity);
                if (Math.abs(node.position.x) > 6) node.userData.velocity.x *= -1;
                if (Math.abs(node.position.y) > 6) node.userData.velocity.y *= -1;
                if (Math.abs(node.position.z) > 6) node.userData.velocity.z *= -1;
            });

            updateLines();
            group.rotation.y += 0.0012;
            group.rotation.x += 0.0006;
            
            renderer.render(scene, camera);
        }

        animate();

        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || 480;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none" id="threejs-container" />;
};
