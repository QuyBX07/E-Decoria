// src/services/ImageService.ts
const BASE_URL = "http://localhost:8081/api";

/**
 * Upload 1 ảnh lên backend
 * @param file File hình ảnh
 * @returns URL đầy đủ của ảnh (vd: http://localhost:8081/images/abc.png)
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload ảnh thất bại");
  }

  const imageUrl = await res.text(); // backend trả về chuỗi URL
  return imageUrl;
}
