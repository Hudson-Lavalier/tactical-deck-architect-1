import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// CosmicBackground — High Refresh Rate (>60Hz / 120Hz / 144Hz / 240Hz+) Three.js Starfield.
// Decoupled from monitor refresh rates using dynamic delta timing & delta clamping (Math.min(delta, 0.1)).
export default function CosmicBackground({ density = 1800 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer = null;
    let scene = null;
    let camera = null;
    let animFrameId = 0;
    let clock = new THREE.Clock();

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 120;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.pointerEvents = 'none';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);

      // Starfield Geometry & Materials
      const starCount = Math.max(800, Number(density) || 1800);
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const speeds = new Float32Array(starCount);

      const colorPalette = [
        new THREE.Color('#a855f7'), // Purple/Adaptation
        new THREE.Color('#00ffff'), // Blue/System
        new THREE.Color('#00ff41'), // Green/Grounding
        new THREE.Color('#ffffff'), // Deep White
        new THREE.Color('#d8b4fe'), // Soft Violet
      ];

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Distribute in a spherical volume
        positions[i3] = (Math.random() - 0.5) * 360;
        positions[i3 + 1] = (Math.random() - 0.5) * 360;
        positions[i3 + 2] = (Math.random() - 0.5) * 280;

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;

        speeds[i3 / 3] = 0.5 + Math.random() * 1.5;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Circular particle texture generator for high fidelity without external image load
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.35, 'rgba(255,255,255,0.75)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      const texture = new THREE.CanvasTexture(canvas);

      const material = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Distant subtle nebula cloud particles
      const nebulaCount = 180;
      const nebulaPositions = new Float32Array(nebulaCount * 3);
      const nebulaColors = new Float32Array(nebulaCount * 3);
      for (let j = 0; j < nebulaCount; j++) {
        const j3 = j * 3;
        nebulaPositions[j3] = (Math.random() - 0.5) * 240;
        nebulaPositions[j3 + 1] = (Math.random() - 0.5) * 240;
        nebulaPositions[j3 + 2] = (Math.random() - 0.5) * 160;

        const isPurple = Math.random() > 0.5;
        const col = isPurple ? new THREE.Color('#3b0764') : new THREE.Color('#082f49');
        nebulaColors[j3] = col.r;
        nebulaColors[j3 + 1] = col.g;
        nebulaColors[j3 + 2] = col.b;
      }

      const nebulaGeometry = new THREE.BufferGeometry();
      nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
      nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

      const nebulaMaterial = new THREE.PointsMaterial({
        size: 14,
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const nebulaSystem = new THREE.Points(nebulaGeometry, nebulaMaterial);
      scene.add(nebulaSystem);

      // Frame-rate independent render loop
      const render = () => {
        animFrameId = requestAnimationFrame(render);

        // Dynamic delta time calculation with clamping (Math.min(delta, 0.1))
        // Prevents animation jumps / teleporting when switching tabs or experiencing frame drops
        const rawDelta = clock.getDelta();
        const delta = Math.min(rawDelta, 0.1);

        // Constant speed regardless of 60Hz, 120Hz, 144Hz, or 240Hz
        particleSystem.rotation.y += delta * 0.024;
        particleSystem.rotation.x += delta * 0.008;

        nebulaSystem.rotation.y -= delta * 0.012;
        nebulaSystem.rotation.z += delta * 0.006;

        renderer.render(scene, camera);
      };

      render();

      const handleResize = () => {
        if (!renderer || !camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animFrameId) cancelAnimationFrame(animFrameId);
        if (renderer?.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        nebulaGeometry.dispose();
        nebulaMaterial.dispose();
        texture.dispose();
        renderer?.dispose();
      };
    } catch (e) {
      console.warn('Three.js CosmicBackground init failed, falling back to CSS:', e);
    }
  }, [density]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden cosmic-shell"
      style={{ zIndex: 0 }}
    >
      {/* Nebula washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 15% 10%, rgba(26, 11, 46, 0.45), transparent 55%), radial-gradient(ellipse 55% 45% at 88% 92%, rgba(10, 22, 40, 0.4), transparent 50%)',
        }}
      />

      {/* Faint scanlines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.15) 2px, rgba(0,255,65,0.15) 4px)',
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
