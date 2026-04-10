import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "admin" | "viewer";

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
    role: UserRole;
    setRole: (role: UserRole) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            role: "viewer",
            setRole: (role) => set({ role }),
            isLoading: false,
            setIsLoading: (isLoading) => set({ isLoading }),
            sidebarCollapsed: false,
            setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        }),
        {
            name: "corex-app-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
