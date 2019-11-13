import React from 'react'
import Select from 'react-select'
import Jimp from 'jimp/es'
import database from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'

class Settings extends React.Component { 
	constructor() {
		super()

		this.state = {
			size: 100,

			currency: undefined, 
			currencyList: [
				{ label: 'czk', value: 'Kč'},
				{ label: 'yen', value: '¥'},
				{ label: 'ils', value: '₪'}
			],
			dateFormat: undefined,
			dateFormatList: [
				{ label: 'MM/DD/YY', value: 'MM/DD/YY'},
				{ label: 'DD/MM/YY', value: 'DD/MM/YY'},
				{ label: 'YY/MM/DD', value: 'YY/MM/DD'}
			],
			language: undefined, 
			languageList: [
				{ label: 'english', value: 'english' }
			],
			weight: undefined, 
			volume: undefined, 
			timeSystem: undefined,
			avatar: undefined,
			affix: undefined
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
		this.handleLanguageChange = this.handleLanguageChange.bind(this)
		this.handleDateFormatChange = this.handleDateFormatChange.bind(this)
		this.handleFiles = this.handleFiles.bind(this)
		this.fetchSettings = this.fetchSettings.bind(this)
		this.saveChanges = this.saveChanges.bind(this)

		this.refDateFormat = React.createRef()
		this.refCurrency = React.createRef()
		this.refLanguage = React.createRef()

		this.refAffixPre = React.createRef()
		this.refAffixSuf = React.createRef()
		this.refTimeFormat12 = React.createRef()
		this.refTimeFormat24 = React.createRef()
		this.refWeightKg = React.createRef()
		this.refWeightLbs = React.createRef()
		this.refVolumeL = React.createRef()
		this.refVolumeOz = React.createRef()
		
		this.refUsername = React.createRef()
		this.refEmail = React.createRef()
		this.refPassword = React.createRef()
	}

	componentDidMount() {
		this.fetchSettings()

		auth.onAuthStateChanged(function(user) {
			if (user) {
				console.log('current user is...', user)
				// User is signed in.
			} else {
				// No user is signed in.
			}
		})
	}

	async fetchSettings() {
		const ref = database.ref(`${localStorage.getItem('uID')}/settings`)
		const snapshot = await ref.once('value') 
		const value = snapshot.val()
		console.log('value', value)
		this.refDateFormat.current.state.value = this.state.dateFormatList.filter(item => item.value === snapshot.val().dateFormat)[0]
		this.refCurrency.current.state.value = this.state.currencyList.filter(item => item.value === snapshot.val().currency)[0]
		this.refLanguage.current.state.value = this.state.languageList.filter(item => item.value === snapshot.val().language)[0]

		if(snapshot.val().timeSystem === '12h') {
			this.refTimeFormat12.current.checked = true
			this.refTimeFormat24.current.checked = false
		} else if(snapshot.val().timeSystem === '24h') {
			this.refTimeFormat12.current.checked = false
			this.refTimeFormat24.current.checked = true
		} else {
			this.refTimeFormat12.current.checked = false
			this.refTimeFormat24.current.checked = false
		}

		if(snapshot.val().volume === 'l') {
			this.refVolumeL.current.checked = true
			this.refVolumeOz.current.checked = false
		} else if(snapshot.val().volume === 'oz') {
			this.refVolumeL.current.checked = false
			this.refVolumeOz.current.checked = true
		} else {
			this.refVolumeL.current.checked = false
			this.refVolumeOz.current.checked = false
		}

		if(snapshot.val().weight === 'kg') {
			this.refWeightKg.current.checked = true
			this.refWeightLbs.current.checked = false
		} else if(snapshot.val().weight === 'lbs') {
			this.refWeightKg.current.checked = false
			this.refWeightLbs.current.checked = true
		} else {
			this.refWeightKg.current.checked = false
			this.refWeightLbs.current.checked = false
		} 

		if(snapshot.val().affix === 'prefix') {
			this.refAffixPre.current.checked = true
			this.refAffixSuf.current.checked = false
		} else if(snapshot.val().affix === 'suffix') {
			this.refAffixPre.current.checked = false
			this.refAffixSuf.current.checked = true
		} else {
			this.refAffixPre.current.checked = false
			this.refAffixSuf.current.checked = false
		} 

		this.setState({ 
			dateFormat: this.refDateFormat.current.state.value,
			currency: this.refCurrency.current.state.value,
			language: this.refLanguage.current.state.value, 

			avatar: snapshot.val().avatar, 
			timeSystem: snapshot.val().timeSystem, 
			volume: snapshot.val().volume, 
			weight: snapshot.val().weight,
			affix: snapshot.val().affix 
		})

		this.forceUpdate()
	}

	handleChange(e) {
		e.target.id ? this.setState({ [e.target.id]: e.target.value }) : this.setState({ [e.target.name]: e.target.value }) // for radio selectors
	}

	handleCurrencyChange(e) {
		this.setState({ currency: e.value })
		console.log(e.value)
	}

	handleLanguageChange(e) {
		this.setState({ language: e.value })
	}

	handleDateFormatChange(e) {
		this.setState({ dateFormat: e.value })
	}

	handleFiles(e) {
		let img = e.target.files[0]
		
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
							avatar: res
						})
					}
				)
			}).catch(err => {
				throw new Error(err)
			})
		}
	}

	saveChanges() {
		database.ref(`${localStorage.getItem('uID')}/settings/`).set({
			language: this.state.language || null, // this is how you make things optional
			currency: this.state.currency || null, 
			dateFormat: this.state.dateFormat || null, 
			weight: this.state.weight || null, 
			volume: this.state.volume || null, 
			timeSystem: this.state.timeSystem || null,
			avatar: this.state.avatar || null,
			affix: this.state.affix || null
		})

		auth.onAuthStateChanged(async (user) => {
			if (user) {
				console.log('was is das', this)
				
				if(this.refUsername.current.value) {
					await user.updateProfile({
						displayName: this.refUsername.current.value
					}).then(() => console.log('username updated!'))
				}

				if(this.refEmail.current.value){
					await user.updateEmail(this.refEmail.current.value).then(() => console.log('emailUpdated'))
				}

				if(this.refPassword.current.value){
					await user.updatePassword(this.refPassword.current.value).then(() => console.log('password updated'))
				}

				console.log(user.displayName, user.email)
			}
		})
	}

	render() {
		return(
			<div>
				<h3>change personal informaiton</h3>
				
				<div>username:</div>
				<input ref={this.refUsername} type="text" onChange={this.handleCredentials}/>
				
				<div>email:</div>
				<input ref={this.refEmail} type="text" onChange={this.handleCredentials}/>
				
				<div>password:</div>
				<input ref={this.refPassword} type="password" onChange={this.handleCredentials}/>
				
				<button>delete account</button>
				
				<h3>preferences</h3>
				
				<img src={this.state.avatar} alt='avatar' />
				<input type='file' onChange={this.handleFiles} />
				
				<div>language</div>
				<Select ref={this.refLanguage} options={this.state.languageList} onChange={this.handleLanguageChange} />

				<div>currency</div>
				<Select ref={this.refCurrency} options={this.state.currencyList} onChange={this.handleCurrencyChange} />
				<input ref={this.refAffixPre} type="radio" name="affix" value="prefix" onChange={this.handleChange}/>prefix
				<input ref={this.refAffixSuf} type="radio" name="affix" value="suffix" onChange={this.handleChange}/>suffix

				<div>date format</div>
				<Select ref={this.refDateFormat} options={this.state.dateFormatList} onChange={this.handleDateFormatChange} /> 

				<div>time format</div>
				<input ref={this.refTimeFormat12} type="radio" name="timeSystem" value="12h" onChange={this.handleChange}/>12h
				<input ref={this.refTimeFormat24} type="radio" name="timeSystem" value="24h" onChange={this.handleChange}/>24h

				<div>weight</div>
				<input ref={this.refWeightKg}  type="radio" name="weight" value="kg" onChange={this.handleChange}/>kg
				<input ref={this.refWeightLbs} type="radio" name="weight" value="lbs" onChange={this.handleChange}/>lbs

				<div>volume</div>
				<input ref={this.refVolumeL} type="radio" name="volume" value="l" onChange={this.handleChange}/>l
				<input ref={this.refVolumeOz}  type="radio" name="volume" value="oz" onChange={this.handleChange}/>oz

				<button>export data</button>
				
				<button onClick={this.saveChanges}>SAVE</button>
			</div>
		)
	}
}

export default Settings