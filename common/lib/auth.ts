import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword, signOut,
    User,
    connectAuthEmulator,
} from "firebase/auth";
import app from "@common/lib/app";
import {FirebaseError} from "firebase/app";

export const auth = getAuth(app);
// if (process.env["NODE_ENV"] === "development") {
//     connectAuthEmulator(auth, "http://localhost:9099");
// }


function cleanFirebaseError(e: FirebaseError): string {
    return e.code.replace("auth/", "").replace("-", " ").split(" ").map(w => w.replace(w[0], w[0].toUpperCase())).join(" ")
}

export const createUser = async (email: string, password: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            resolve(credential.user);
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                reject(cleanFirebaseError(e));
            }
            else reject("Failed to create user");
        }
    });
};

export const signInUser = async (
    email: string,
    password: string,
): Promise<User> => {
    return new Promise<User>(async (resolve, reject) => {
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            resolve(credential.user);
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                reject(cleanFirebaseError(e));
            }
            else reject("Login failed");
        }
    })
};

export const signOutUser = async () => {
    return signOut(auth);
};
