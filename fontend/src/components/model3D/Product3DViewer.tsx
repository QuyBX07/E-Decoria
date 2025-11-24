import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
}

export default function Product3DViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div
      className="w-full h-[500px] rounded-2xl overflow-hidden relative"
      style={{
        // Màu mới: Tâm là xám sáng (#555555), viền là xám đậm (#333333)
        // Đủ sáng để không bị đen kịt, nhưng vẫn tối ở viền để tập trung vào model
        background:
          "radial-gradient(circle at 50% 50%, #555555 0%, #333333 100%)",
      }}
    >
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [1.5, 1.5, 1.5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        {/* Khi nền sáng lên, có thể giảm ambientLight xuống 0.6 hoặc 0.7 
            để bóng đổ (shadow) của model trông rõ nét hơn */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <OrbitControls minDistance={0.5} maxDistance={4} />

        <Environment preset="studio" />

        <Model url={modelUrl} />
      </Canvas>
    </div>
  );
}
