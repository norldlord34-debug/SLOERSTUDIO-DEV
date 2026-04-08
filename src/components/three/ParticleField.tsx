"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1800;
const SPREAD = 18;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const cobalt = new THREE.Color("#4f8cff");
    const teal = new THREE.Color("#28e7c5");
    const violet = new THREE.Color("#8b5cf6");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * SPREAD;
      pos[i3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i3 + 2] = (Math.random() - 0.5) * SPREAD * 0.6;

      sz[i] = Math.random() * 2.5 + 0.5;

      const t = Math.random();
      const color =
        t < 0.3
          ? cobalt
          : t < 0.5
            ? teal
            : t < 0.65
              ? violet
              : white;

      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }

    return [pos, sz, col];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;

    mouseRef.current.x += (pointer.x * viewport.width * 0.15 - mouseRef.current.x) * 0.04;
    mouseRef.current.y += (pointer.y * viewport.height * 0.15 - mouseRef.current.y) * 0.04;

    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.018 + mouseRef.current.x * 0.02;
    meshRef.current.rotation.x = Math.sin(t * 0.012) * 0.08 + mouseRef.current.y * 0.02;

    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += Math.sin(t * 0.3 + i * 0.01) * 0.0008;
      arr[i3] += Math.cos(t * 0.2 + i * 0.015) * 0.0005;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.08;
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.position.y = Math.sin(t * 0.3) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial
        color="#4f8cff"
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -3, -4]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshBasicMaterial
        color="#4f8cff"
        wireframe
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <>
      <fog attach="fog" args={["#050505", 5, 22]} />
      <ambientLight intensity={0.1} />
      <Particles />
      <FloatingMesh />
      <GridFloor />
    </>
  );
}
