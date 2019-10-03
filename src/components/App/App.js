import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from '../Home/Home'
import Transactions from '../Transactions/Transactions'
import Spendings from '../Spendings/Spendings'
import Categories from '../Categories/Categories.js'
import store from '../../store/configureStore'
store.subscribe(() => console.log(store.getState()))

class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div id='AppContainer'>
						<Route path='/' exact component={Home} />
						<Route path='/transactions' render={() => <Transactions uID={store.getState().uID} />} />
						<Route path='/spendings' render={() => <Spendings uID={store.getState().uID} />} />
						<Route path='/categories' render={() => <Categories uID={store.getState().uID} />} />
					</div>
				</Router>
			</Provider>
		)
	}
}

export default App