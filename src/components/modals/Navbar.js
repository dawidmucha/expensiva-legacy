import React from 'react'
import nav1 from '../../resources/nav1.svg'
import nav2 from '../../resources/nav2.svg'
import nav3 from '../../resources/nav3.svg'
import av from '../../resources/av.jpg'

class Navbar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currently: undefined
		}
	}

	render() {
		return (
			<div id='navbar'>
				<div id='navbar-spendings' style={{display: 'inline-block'}}><img src={nav1} alt='spendings_icon' width='50px' /></div>
				<div id='navbar-transactions' style={{display: 'inline-block'}}><img src={nav2} alt='transactions_icon' width='50px' /></div>
				<div id='navbar-categories' style={{display: 'inline-block'}}><img src={nav3} alt='categories_icon' width='50px' /></div>
				<div id='navbar-profile' style={{display: 'inline-block'}}><img src={av} alt='avatar' width='50px' /></div>
			</div>
		)
	}
}

export default Navbar