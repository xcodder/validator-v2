# data-validator v2
Javascript module that can be very efficiently and conveniently used with forms validation.  
Can be used either in html file script tags or as a node.js module

## Use
```javascript

const Validator = require('validator-v2')
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

```

### Options
* required: boolean (default is false)
* minLen: number
* maxLen: number
* length: number(exact length) or array[min, max]
* validate: function (view below)
* type: string (Number, String, etc.)
* regexMatch: regex (on unmatch is invalid)
* regexFail: regex (on match is invalid)
* onError: object (view below)

### onError
  an object that decides which message to return on rejection.
  Every failed field may have its own message.  
  ** 'any' property is the default error message (for all cases).  
  ** not more then one (option) message will be returned for a field
  
### validate
  #### Use:
  validate: (value, cb) => { ... cb(boolean) }  
  
  #### Parameters
  value: The value which was inserted in the check method  
  cb: The function to invoke when a result whether the validation has succeeded or not was concluded  
  
  #### Details:
  Best used for:
  1. Async validations (such as database querying, etc.)  
  2. Customized validations  
  
  #### Example:  

        validate: (value, cb) => {
            setTimeout(() => { 
                cb(value > 5)
            }, 1000
        });


