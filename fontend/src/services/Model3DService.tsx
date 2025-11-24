import { Model3D } from "../types/Model3D";

const BASE_URL = "http://localhost:8081/api/models";

export async function createModel(data: Model3D): Promise<Model3D> {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Tạo model thất bại");
  return res.json();
}

export async function getModelsByProduct(productId: string) {
  const res = await fetch(`${BASE_URL}/product/${productId}`);

  if (!res.ok) throw new Error("Không lấy được model theo productId");

  return res.json();
}
