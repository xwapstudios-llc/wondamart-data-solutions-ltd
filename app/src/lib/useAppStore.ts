import {create} from "zustand";
import {persist} from "zustand/middleware";
import {onAuthStateChanged, type User} from "firebase/auth";
import {collection, onSnapshot} from "firebase/firestore";
import {auth, signInUser, signOutUser} from "@common/lib/auth";
import type {UserClaims, UserInfoDocument, UserWalletDocument} from "@common/types/user";
import {type Unsubscribe} from "firebase/database";
import {ClUser} from "@common/client-api/user";
import {
    type CommonAFA,
    type CommonDataBundles,
    type CommonDocs,
    type CommonPaymentMethods,
    type CommonResultChecker,
    type CommonSettings,
    type CommonUserRegistration,
    initialCommonSettings
} from "@common/types/common-settings";
import {ClCommonSettings} from "@common/client-api/db-common-settings";
import {collections, db} from "@common/lib/db";
import type {LucideIcon} from "lucide-react";
import type {ButtonVariant} from "@/cn/components/ui/button.tsx";

interface AppDetailedError {
    title?: string;
    description?: string;
    Icon?: LucideIcon;
    actions?: Array<{label: string, variant?: ButtonVariant; action: () => void;}>;
}
type AppError = string | null | AppDetailedError;

interface AppState {
    // Utils
    loading: boolean;
    error: AppError;

    // utils
    setLoading: (state: boolean) => void;
    setError: (err: string | AppError) => void;
    clearError: () => void;

    // Logins and logouts
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;

    // Common Settings
    commonSettings: CommonSettings;
    fetchCommonSettings: () => Promise<void>;
    subscribeCommonSettings: () => Unsubscribe | undefined;

    // Auth User
    user: User | null;
    setUser: (user: User | null) => void;

    // User Profile
    profile: UserInfoDocument | null;
    fetchProfile: () => Promise<void>;
    subscribeProfile: () => Unsubscribe | undefined;

    // User Wallet
    wallet: UserWalletDocument | null;
    fetchWallet: () => Promise<void>;
    subscribeWallet: () => Unsubscribe | undefined;

    // User Claims
    claims: UserClaims | null;
    fetchClaims: () => Promise<void>;

}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // utils
            loading: false,
            error: null,
            setLoading: (state: boolean) => {
                set({loading: state});
            },
            setError: (err: string | AppError) => {
                set({error: err});
            },
            clearError: () => {
                set({error: null});
            },

            // Logins and logouts
            login: async (email, password) => {
                set({loading: true, error: null});
                try {
                    await signInUser(email, password);
                    // ✅ Do NOT set user here
                    // onAuthStateChanged will fire and update the store
                    set({loading: false});
                } catch (err: unknown) {
                    // @ts-expect-error Unknown but it's a firebase https return
                    set({error: err.message, loading: false});
                    throw err;
                }
            },
            logout: async () => {
                set({loading: true, error: null});
                await signOutUser();
                set({user: null, profile: null});
                set({loading: false, error: null});
            },

            // Common Settings
            commonSettings: initialCommonSettings,
            fetchCommonSettings: async () => {
                set({loading: true, error: null});
                set({commonSettings: await ClCommonSettings.read_all()})
                set({loading: false, error: null});
            },
            subscribeCommonSettings: () => {
                const q = collection(db, collections.commonSettings);
                return onSnapshot(q, snapshot => {
                    const commonSettings: CommonSettings = initialCommonSettings;
                    snapshot.docs.forEach(doc => {
                        const docID = doc.id as CommonDocs;
                        switch (docID) {
                            case "afa":
                                commonSettings.afa = doc.data() as CommonAFA;
                                break;
                            case "result-checker":
                                commonSettings.resultChecker = doc.data() as CommonResultChecker;
                                break;
                            case "user-registration":
                                commonSettings.userRegistration = doc.data() as CommonUserRegistration;
                                break;
                            case "payment-methods":
                                commonSettings.paymentMethods = doc.data() as CommonPaymentMethods;
                                break;
                            case "data-bundles":
                                commonSettings.dataBundles = doc.data() as CommonDataBundles;
                                break;
                            default:
                                console.log(`Unknown common settings > ${doc.id} :`, doc.data());
                        }
                    });
                    console.log("New Common Settings > ", commonSettings);
                    set({commonSettings: commonSettings});
                });
            },

            // Auth User
            user: null,
            setUser: (user) => {
                set({user})
            },

            // User Profile
            profile: null,
            fetchProfile: async () => {
                set({loading: true, error: null});
                const user = get().user;
                if (user) {
                    const doc = await ClUser.readInfo(user.uid);
                    if (doc) {
                        set({profile: doc});

                        console.log(`After setting profile: `, get().profile)
                    }
                }
                set({loading: false});
            },
            subscribeProfile: (): Unsubscribe | undefined => {
                // realtime subscription to profile changes
                const {user} = get();
                if (!user) return;
                return onSnapshot(ClUser.getRef(user.uid), (snap) => {
                    if (snap.exists()) {
                        set({profile: snap.data() as UserInfoDocument});
                    }
                });
            },


            // User Wallet
            wallet: null,
            fetchWallet: async () => {
                set({loading: true, error: null});
                const user = get().user;
                if (user) {
                    const doc = await ClUser.readWallet(user.uid);
                    if (doc) {
                        set({wallet: doc});
                    }
                }
                set({loading: false});
            },
            subscribeWallet: (): Unsubscribe | undefined => {
                const {user} = get();
                if (!user) return;
                return onSnapshot(ClUser.getWalletRef(user.uid), (snap) => {
                    if (snap.exists()) {
                        set({wallet: snap.data() as UserWalletDocument});
                    }
                });
            },

            // User Claims
            claims: {
                admin: false,
                isActivated: true,
            },
            fetchClaims: async () => {
                set({loading: true, error: null});
                const user = get().user;
                if (user) {
                    console.log("Fetching claims");
                    const tokenResult = await user.getIdTokenResult(true);
                    set({claims: tokenResult.claims as UserClaims});
                }
                set({loading: false});
            },

        }),
        {
            name: "wondamart-data-solutions-storage",
            partialize: (state) => ({
                user: state.user ? {uid: state.user.uid, email: state.user.email} : null,
                profile: state.profile
            }),
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
        await useAppStore.getState().fetchCommonSettings();
    } else {
        useAppStore.setState({
            loading: false,
            error: null,
            user: null,
            profile: null,
            wallet: null,
            claims: null,
            commonSettings: initialCommonSettings,
        });
    }
});
