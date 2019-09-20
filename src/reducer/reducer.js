const defaultState = {
	uID: undefined
}

const reducer = (state = defaultState, action) => {
	switch(action.type) {
		case 'LOG_IN_USER':
			return {
				uID: action.uID
			}
		
		case 'LOG_OUT_USER':
			return {
				uID: undefined
			}

		default:
			return state
	}
}

export default reducer