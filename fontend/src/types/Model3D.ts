export interface Model3D {
  id?: string;              // 👈 thêm dòng này
  productId: string;
  modelUrl: string;
  previewImage?: string;
  fileSize?: number;
}