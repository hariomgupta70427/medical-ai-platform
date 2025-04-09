"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

interface ThreeComponentsProps {
  rotationSpeed: number
  bondLength: number
  atomSize: number
}

// Export the component as the default export
export default function ThreeComponents({ rotationSpeed, bondLength, atomSize }: ThreeComponentsProps) {
  return (
    <Canvas>
      <MoleculeModel rotationSpeed={rotationSpeed} bondLength={bondLength} atomSize={atomSize} />
    </Canvas>
  )
}

// Define the MoleculeModel component as a regular component
function MoleculeModel({ rotationSpeed = 1, bondLength = 2, atomSize = 1 }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Central atom */}
      <mesh>
        <sphereGeometry args={[atomSize, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Connected atoms */}
      <mesh position={[bondLength, 0, 0]}>
        <sphereGeometry args={[atomSize * 0.8, 32, 32]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.5} roughness={0.2} />
      </mesh>

      <mesh position={[-bondLength * 0.75, bondLength * 0.5, 0]}>
        <sphereGeometry args={[atomSize * 0.6, 32, 32]} />
        <meshStandardMaterial color="#f43f5e" metalness={0.5} roughness={0.2} />
      </mesh>

      <mesh position={[-bondLength * 0.5, -bondLength * 0.75, bondLength * 0.25]}>
        <sphereGeometry args={[atomSize * 0.7, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Bonds */}
      <mesh position={[bondLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1 * atomSize, 0.1 * atomSize, bondLength, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <mesh position={[-bondLength * 0.375, bondLength * 0.25, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.1 * atomSize, 0.1 * atomSize, bondLength * 0.75, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <mesh
        position={[-bondLength * 0.25, -bondLength * 0.375, bondLength * 0.125]}
        rotation={[Math.PI / 8, 0, -Math.PI / 3]}
      >
        <cylinderGeometry args={[0.1 * atomSize, 0.1 * atomSize, bondLength * 0.75, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={rotationSpeed} />
      <Environment preset="studio" />
    </>
  )
} 