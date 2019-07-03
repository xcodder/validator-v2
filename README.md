# data-validator v2
Javascript module that can be very efficiently and conveniently used with forms validation.  
Can be used either in html file script tags or as a node.js module

## Use
```javascript
const dataValidator = require('./data-validator')
const songs = dataValidator({
    id: {
        required: true,
        type: "number",
        onError: {
            required: "ID is necessary",
            type: "ID is not a number"
        }
    },
    title: {
        required: true,
        type: "string",
        minLength: 4,
        maxLength: 25,
        regexMatch: /^[a-zA-Z\s]+$/,
        onError: {
            any: "Title must be of 4-25 chars and contain only english letters"
        }
    },
    uploaderUsername: {
        type: "string",
        minLength: 4,
        maxLength: 20,
        regexMatch: /^[a-zA-Z_]+/,
        onError: {
            any: "Username must be of 4-20 chars",
            regexMatch: "Username must contain only english letters and underscore"
        }
    },
    duration: {
        required: true,
        type: "string",
        regexMatch: /^(\d+):(\d+)$/,
        onError: {
            regexMatch: "Duration must be of x:y structure. example: 4:25"
        }
    }
})
songs.check({id:232, title: "asdadL", duration: "4:35"}, (error, messages) => {
  if(error) {
    messages.map(m => console.log(m))
  }
  else {
    console.log("Great!")
  }
})
```

### Options
* required: boolean (default is false)
* minLength: number (also: *minlen*)
* maxLength: number (also: *maxlen*)
* length: number(exact length) or array[min, max]
* validate: function (view validate)
* type: string (view types)
* regexMatch: regex (on false is invalid)
* regexFail: regex (on true is invalid)
* onError: object (view onError)


### Types
* 'string'
* 'number' (5,2,3)
* 'numeric' ('2',4,'12')
* 'email'
* 'boolean'

### onError
  an object that has a message to return (in the example above, it is supposed to be delievered to the client)  
  for every option that has failed.  
  **'any' is a keyword what the default message should be  
  not more then one (option) message will be returned for a field**
  
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

### Demo
[Using Html](https://jsbin.com/rineve/edit?css,output)


