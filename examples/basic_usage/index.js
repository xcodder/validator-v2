const Validator = require('../../lib/index.js')
const songValidation = new Validator({
    id: {
        required: true,
        type: Number,
        onError: {
            required: "ID is necessary",
            type: "ID is not a number"
        }
    },
    title: {
        required: true,
        type: String,
        minLen: 4,
        maxLen: 25,
        regexMatch: /^[a-zA-Z\s]+$/,
        onError: {
            any: "Title must be of 4-25 chars and contain only english letters"
        }
    },
    uploaderUsername: {
        type: String,
        minLen: 4,
        maxLen: 20,
        regexMatch: /^[a-zA-Z_]+/,
        onError: {
            any: "Username must be of 4-20 chars",
            regexMatch: "Username must contain only english letters and underscore"
        }
    },
    duration: {
        required: true,
        type: String,
        regexMatch: /^(\d+):(\d+)$/,
        onError: {
            regexMatch: "Duration must be of m:s structure. example: 4:25"
        }
    }
})
songValidation.check({id: "string id", title: "One Day", duration: "3:35"})
	.then(() => {
		console.log("Song is valid")
	})
	.catch(err => {
		console.log(err.msg)
	})