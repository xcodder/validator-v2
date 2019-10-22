const Validator = require('../../lib/index.js')

let personValidation = new Validator({
	name: {
		required: true,
		type: String
	},
	contact: {
		required: true,
		object: new Validator({
			tel: {
				required: false,
				regexMatch: /^\d+$/,
				onError: "Only numbers are allowed in 'tel' field. Remove last 'E' to make it work."
			},
			email: {
				required: true,
				email: true
			},
			address: {
				required: false,
				type: String
			}
		})
	}
 })
 
 
 let testObject = {
	name: "Renny Michael",
	contact: {
		email: "renny.michael@mail.com",
		tel: "05461321E"
	}
 }
 personValidation.check(testObject)
	.then(() => {
		console.log("Valid")
	})
	.catch(err => {
	  console.log(err.msg)
	})