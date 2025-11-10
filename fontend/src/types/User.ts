export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}