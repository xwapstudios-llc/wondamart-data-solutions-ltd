import { create } from "zustand";
import { persist } from "zustand/middleware";
import {onAuthStateChanged, type User} from "firebase/auth";
import {onSnapshot} from "firebase/firestore";
import {auth, signInUser, signOutUser} from "@common/lib/auth.ts";
import type {UserClaims, UserInfoDocument, UserWalletDocument} from "@common/types/user.ts";
import {type Unsubscribe} from "firebase/database";
import {AdminUser} from "@common/admin-api/user.ts";


interface AppState {
    user: User | null;
    profile: UserInfoDocument | null;
    wallet: UserWalletDocument | null;
    claims: UserClaims | null;
    loading: boolean;
    error: string | null;

    // utils
    setLoading: (state: boolean) => void;
    setError: (err: string) => void;

    // actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;

    // fetching
    fetchProfile: () => Promise<void>;
    fetchWallet: () => Promise<void>;
    fetchClaims: () => Promise<void>;
    subscribeProfile: () => Unsubscribe | undefined;
    subscribeWallet: () => Unsubscribe | undefined;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            wallet: null,
            claims: null,
            loading: false,
            error: null,

            // utils
            setLoading: (state: boolean) => {
                set({loading: state});
            },
            setError: (err: string) => {
                set({error: err});
            },

            // login
            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    await signInUser(email, password);
                    // ✅ Do NOT set user here
                    // onAuthStateChanged will fire and update the store
                    set({ loading: false });
                } catch (err: unknown) {
                    // @ts-expect-error Unknown but it's a firebase https return
                    set({ error: err.message, loading: false });
                    throw err;
                }
            },

            // logout
            logout: async () => {
                set({ loading: true, error: null });
                await signOutUser();
                set({ user: null, profile: null });
                set({ loading: false, error: null });
            },

            // set user manually (for listener)
            setUser: (user) => {
                set({ user })
                // console.log("User Set")
            },

            // fetch user profile once
            fetchProfile: async () => {
                set({ loading: true, error: null });
                const user = get().user;
                if (user) {
                    const doc = await AdminUser.readInfo(user.uid);
                    if (doc) {
                        set({ profile: doc });

                        console.log(`After setting profile: `, get().profile)
                    }
                }
                set({ loading: false });
            },
            fetchWallet: async () => {
                set({ loading: true, error: null });
                const user = get().user;
                if (user) {
                    const doc = await AdminUser.readWallet(user.uid);
                    if (doc) {
                        set({ wallet: doc });
                    }
                }
                set({ loading: false });
            },
            fetchClaims: async () => {
                set({ loading: true, error: null });
                const user = get().user;
                if (user) {
                    user.getIdTokenResult().then(tokenResult => {
                        set({claims: tokenResult.claims as UserClaims});
                    })
                }
                set({ loading: false });
            },

            // realtime subscription to profile changes
            subscribeProfile: (): Unsubscribe | undefined => {
                const { user } = get();
                if (!user) return;
                return onSnapshot(AdminUser.getRef(user.uid), (snap) => {
                    if (snap.exists()) {
                        set({ profile: snap.data() as UserInfoDocument });
                    }
                });
            },
            subscribeWallet: (): Unsubscribe | undefined => {
                const { user } = get();
                if (!user) return;
                return onSnapshot(AdminUser.getWalletRef(user.uid), (snap) => {
                    if (snap.exists()) {
                        set({ wallet: snap.data() as UserWalletDocument });
                    }
                });
            }
        }),
        {
            name: "wondamart-data-solutions-storage",
            partialize: (state) => ({user: state.user ? { uid: state.user.uid, email: state.user.email } : null, profile: state.profile}),
        }
    )
);

// keep App Store in sync with Firebase Auth
onAuthStateChanged(auth, async (user) => {
    useAppStore.getState().setUser(user);
    if (user) {
        await useAppStore.getState().fetchProfile();
        await useAppStore.getState().fetchWallet();
        await useAppStore.getState().fetchClaims();
        // console.log("AUTH CHANGED. User True")
    } else {
        useAppStore.setState({wallet: null, profile: null});
    }
});
