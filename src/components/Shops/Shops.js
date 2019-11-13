import React from 'react'
import Jimp from 'jimp/es'
import database from '../../firebase/firebase'

class Shops extends React.Component {
	constructor() {
		super()

		this.handleChange = this.handleChange.bind(this)
		this.handleFiles = this.handleFiles.bind(this)
		this.addShop = this.addShop.bind(this)
		this.fetchShops = this.fetchShops.bind(this)
		this.handleRemove = this.handleRemove.bind(this)

		this.textRef = React.createRef()
		this.imageRef = React.createRef()

		this.state = {
			size: 50,

			shop: undefined,
			img: undefined,
			src: undefined,

			shops: undefined,
			shopsHtml: undefined
		}
	}

	componentDidMount() {
		console.log('mountage')
		this.fetchShops()
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	handleFiles(e) {
		let img = e.target.files[0]
		console.log(img)
		
		let reader = new FileReader()
		reader.readAsDataURL(img)
		reader.onload = () => {
			Jimp.read(reader.result).then(image => {
				return image.cover(
					this.state.size, this.state.size
				).quality(
					90
				).getBase64(
					Jimp.MIME_JPEG, (rej, res) => {
						this.setState({
							img,
							src: res
						})
					}
				)
			}).catch(err => {
				throw new Error(err)
			})
		}
	}

	async handleRemove(shop) {
		console.log('shop', shop)
		await database.ref(`${localStorage.getItem('uID')}/shops/${shop}`).remove()
		this.fetchShops()
	}

	async addShop() {
		await database.ref(`${localStorage.getItem('uID')}/shops/`).update({
			[this.state.shop]: this.state.src
		})
		const text = this.textRef.current
		const image = this.imageRef.current
		text.value = ''
		image.value = ''
		this.setState({ src: undefined })
		this.fetchShops()
	}

	fetchShops() {
		database.ref(`${localStorage.getItem('uID')}/shops/`).on('value', snapshot => {
			console.log('this are shops', snapshot.val())
			this.setState({ 
				shops: snapshot.val() 
			}, () => {
				let arr = []
	
				console.log(this.state.shops)
				if(this.state.shops) {
					Object.keys(this.state.shops).map((shop, i) => {
						arr = arr.concat(
							<li key={i}><img alt='logo' src={this.state.shops[shop]} />{shop}<button onClick={() => this.handleRemove(shop)}>X</button></li>
						)
		
						return console.log('wow a', shop, 'that has id of', i, 'with a picture look at it', this.state.shops[shop], 'now the full array is', arr)
					})
				}

				this.setState({ shopsHtml: arr })
			})
		})
	}

	render() {
		return (
			<div>
				<div>
					<ul>
						{ this.state.shopsHtml }	
					</ul>
				</div>
				<div>
					<input ref={this.textRef} id='shop' type='text' value={this.state.value} onChange={this.handleChange} />
					<input ref={this.imageRef} id='image' type='file' onChange={this.handleFiles} />
					<img src={this.state.src} alt='shop logo preview' />
					<button onClick={this.addShop}>UPLOAD</button>
				</div>
			</div>
		)
	}
}

export default Shops