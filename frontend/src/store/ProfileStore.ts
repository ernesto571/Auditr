import toast from "react-hot-toast";
import axios from "../lib/axios"
import { create } from "zustand";
interface Profile {
    auth_id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    created_at: string;
    image: string | null;
    active_sessions: number;
    last_login: string ;
    provider: string | null;
}
interface ProfileState {
    profile: Profile | null;
    profileLoading: boolean;
    fetchProfile: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    clearProfile: () => void;
}
export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    profileLoading: false,
    clearProfile: () => set({ profile: null, profileLoading: false }),

    fetchProfile: async () => {
        console.log("📡 fetchProfile: sending request...");
        set({ profileLoading: true });
        try {
            const res = await axios.get("/user/profile");
            const data = res.data.user;
            console.log("🟢 fetchProfile: backend response", data);
            set({
                profile: {
                    auth_id: data.auth_id,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role: data.role,
                    created_at: data.created_at,
                    image: data.image,
                    active_sessions: data.active_sessions,
                    last_login: data.last_login,
                    provider: data.provider,
                },
                profileLoading: false,
            });
        } catch (err: any) {
            console.error("🔴 fetchProfile failed:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ profileLoading: false });
            if (err.response?.status === 401 || err.response?.status === 404) set({ profile: null });
            throw err;
        }
    },

    deleteAccount: async () => {
        console.log("📡 deleteAccount: sending request...");
        set({ profileLoading: true });
        try {
            const res = await axios.delete("/user/delete");
            console.log("✅ Account deleted", res.data.deletedUser);
            set({ profile: null, profileLoading: false });
            window.location.href = "/";
        } catch (err: any) {
            console.error("🔴 deleteAccount failed:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ profileLoading: false });
            toast.error("Failed to delete account.");
        }
    }
}))