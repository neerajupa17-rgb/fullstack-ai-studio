export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
  createdAt: string;
}

