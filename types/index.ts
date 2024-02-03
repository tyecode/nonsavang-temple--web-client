export interface UserInterface {
  id: string;
  email: string;
  password: string;
  role: string;
  firstname: string;
  lastname: string;
  image: string;
  created_at: Date;
  displayName?: string;
}
