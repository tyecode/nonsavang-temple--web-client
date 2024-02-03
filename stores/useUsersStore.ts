import { UserInterface } from "@/types";
import { create } from "zustand";

interface UsersState {
  users: UserInterface[];
  updateUsers: (users: UserInterface[]) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  updateUsers: (users) => set((state) => ({ users: [...users] })),
}));
