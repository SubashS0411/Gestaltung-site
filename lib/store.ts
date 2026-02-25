import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    user: { name: string; role: string; avatar: string } | null;
    login: (name: string) => void;
    logout: () => void;
}

interface AppState {
    activeNodeId: string | null;
    setActiveNode: (id: string | null) => void;
    savedItems: string[];
    toggleSaved: (id: string) => void;
    assistantMessages: { role: "user" | "assistant"; content: string }[];
    addMessage: (role: "user" | "assistant", content: string) => void;
    selectedRegistryItem: string | null;
    setSelectedRegistryItem: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    login: (name) =>
        set({
            isAuthenticated: true,
            user: { name, role: "OPERATOR", avatar: name.slice(0, 2).toUpperCase() },
        }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));

export const useAppStore = create<AppState>((set) => ({
    activeNodeId: null,
    setActiveNode: (id) => set({ activeNodeId: id }),
    savedItems: [],
    toggleSaved: (id) =>
        set((s) => ({
            savedItems: s.savedItems.includes(id)
                ? s.savedItems.filter((x) => x !== id)
                : [...s.savedItems, id],
        })),
    assistantMessages: [
        { role: "assistant", content: "GESTALTUNG PROTOCOL v2.4.0 — Neural Assistant online. How can I help?" },
    ],
    addMessage: (role, content) =>
        set((s) => ({ assistantMessages: [...s.assistantMessages, { role, content }] })),
    selectedRegistryItem: null,
    setSelectedRegistryItem: (id) => set({ selectedRegistryItem: id }),
}));
