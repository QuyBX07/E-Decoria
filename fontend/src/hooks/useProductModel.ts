import { useEffect, useState } from "react";
import { getModelsByProduct } from "@/services/Model3DService";

export default function useProductModel(productId: string) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const models = await getModelsByProduct(productId);

        console.log("Models:", models); // Debug

        if (models && models.length > 0 && models[0].modelUrl) {
          setModelUrl(models[0].modelUrl);
        } else {
          console.warn("Không tìm thấy modelUrl");
        }
      } catch (err) {
        console.error("Lỗi lấy model:", err);
      }
    }

    load();
  }, [productId]);

  return modelUrl;
}
