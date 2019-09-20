export const logInUser = (uID = {}) => ({
	type: 'LOG_IN_USER',
	uID
})

export const logOutUser = () => ({
	type: 'LOG_OUT_USER'
})