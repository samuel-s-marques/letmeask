import { createContext, ReactNode, useState, useEffect  } from "react"

import ProfileImg from '../assets/images/profile.svg'
import { firebase, auth } from '../services/firebase';

type User = {
	id: string;
	name: string;
	avatar: string;
}

type AuthContextType = {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
	const [user, setUser] = useState<User>()

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				const { displayName, photoURL, uid } = user
		
				if (!displayName) {
					throw new Error('Está faltando informações na conta do Google.')
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: !photoURL ? ProfileImg : photoURL
				})
			}
		})

		return () => {
			unsubscribe()
		}
	}, [])

	async function signInWithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider()
		const result = await auth.signInWithPopup(provider)

		if (result.user) {
			const { displayName, photoURL, uid } = result.user
		
			if (!displayName) {
				throw new Error('Está faltando informações na conta do Google.')
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: !photoURL ? ProfileImg : photoURL
			})
		}
	}

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle}}>
			{props.children}
		</AuthContext.Provider>
	)
}