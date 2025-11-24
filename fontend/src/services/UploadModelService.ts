// src/services/Model3DService.ts
const BASE_URL = "http://localhost:8081/api/models";

/**
 * Upload file 3D (glb/gltf/fbx)
 * @param file File 3D
 * @returns URL của file model
 */
export async function uploadModelFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload file 3D thất bại");
  }

  return res.text();
}
