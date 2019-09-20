import { configureStore } from 'redux-starter-kit'
import reducer from '../reducer/reducer'

const store = configureStore({
  reducer
})

export default store