import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    UserCredential
} from "@firebase/auth";
import {auth} from "../config/firebase";


export type UserType = {
    uid: string,
    email: string | null,
    displayName: string | null,
    token: string | null
};


interface AuthContextData {
    currentUser: UserType | null;
    login: (email: string, password: string) => Promise<UserCredential>;
    register: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    getCurrentUserToken: () => Promise<string | undefined>;
}

const AuthContext = createContext({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);


interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: FC<AuthProviderProps> = ({children}) => {

    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    const register = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        setCurrentUser(null);
        return auth.signOut();
    }

    const getCurrentUserToken = async () => {
        return auth.currentUser?.getIdToken();
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    token: user.refreshToken
                });
            } else {
                setCurrentUser(null);
            }

        });
        return () => unsubscribe();

    }, []);

    return (
        <AuthContext.Provider value={{currentUser, login, logout, register, getCurrentUserToken}}>

            {children}
        </AuthContext.Provider>
    );
}
