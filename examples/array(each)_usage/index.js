const Validator = require('../../lib/index.js')

let authorValidation = new Validator({
	name: {
		required: true,
		type: String
	},
	books: {
		each: new Validator({
			title: {
				required: true,
				type: String
			},
			pagesAmount: {
				required: true,
				type: Number
			}
		})
	}
 })
 
 
 let testObject = {
	 name: "Renny Michael",
	 books: [
		 {
			 title: "With the Wind",
			 pagesAmount: 151
		 },
		 {
			 title: "",
			 pagesAmount: 14
		 }
	 ]
 }
 authorValidation.check(testObject)
	.then(() => {
		console.log("Valid")
	})
	.catch(err => {
	  console.log(err)
	})