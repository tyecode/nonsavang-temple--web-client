import { create } from "zustand";
import { User } from "@/types/user";

interface UsersState {
  users: User[];
  updateUsers: (users: User[]) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  updateUsers: (users) => set((state) => ({ users: [...users] })),
}));
