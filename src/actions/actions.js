import { auth, googleAuthProvider } from '../firebase/firebase'
import store from '../store/configureStore'

export const startLogInUser = () => {
	return () => {
		console.log('bitch lasagne')
		return auth.signInWithRedirect(googleAuthProvider).then(() => {
			const user = auth.currentUser
			store.dispatch(logInUser(user.uid))
			localStorage.setItem('uID', user.uid)
		}).catch(err => {
			console.log(this.state.status)
			console.log(err.message)
			console.log("error code", err.code)
		})
	}
}

export const startLogOutUser = () => {
	return () => {
		debugger;
		console.log('yeeee haw')
		return auth.signOut().then(() => {
			store.dispatch(logOutUser)
		}, err => {
			throw new Error(err)
		})
	}
}

export const logInUser = (uID = {}) => ({
	type: 'LOG_IN_USER',
	uID
})

export const logOutUser = () => ({
	type: 'LOG_OUT_USER'
})