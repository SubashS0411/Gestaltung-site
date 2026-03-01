"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══ 3D Gold Abstract Object ═══ */
function GoldObject({
    shape,
    position,
    rotationSpeed,
}: {
    shape: "torus" | "icosahedron" | "octahedron";
    position: [number, number, number];
    rotationSpeed: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += rotationSpeed;
        meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1;
    });

    return (
        <mesh ref={meshRef} position={position}>
            {shape === "torus" && <torusGeometry args={[1, 0.4, 32, 64]} />}
            {shape === "icosahedron" && <icosahedronGeometry args={[1.2, 1]} />}
            {shape === "octahedron" && <octahedronGeometry args={[1.2, 0]} />}
            <meshStandardMaterial
                color="#D4AF37"
                metalness={0.95}
                roughness={0.1}
                wireframe
            />
        </mesh>
    );
}

function ArsenalScene({ velocityRef }: { velocityRef: React.MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += velocityRef.current * 0.00002;
        }
    });

    return (
        <>
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#D4AF37" decay={2} />
            <pointLight position={[-5, -3, -5]} intensity={0.3} color="#ffffff" decay={2} />
            <group ref={groupRef}>
                <GoldObject shape="torus" position={[-3.5, 0, 0]} rotationSpeed={0.005} />
                <GoldObject shape="icosahedron" position={[0, 0.5, -1]} rotationSpeed={0.004} />
                <GoldObject shape="octahedron" position={[3.5, -0.3, 0]} rotationSpeed={0.006} />
            </group>
        </>
    );
}

export default function ArsenalCanvas({ velocityRef }: { velocityRef: React.MutableRefObject<number> }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
        >
            <Suspense fallback={null}>
                <ArsenalScene velocityRef={velocityRef} />
            </Suspense>
        </Canvas>
    );
}
