const _urlRegex_ = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
const _domRegex_ = /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/

let __errors = {
  required: "Please fill in {field}",
  validate: "{field} value is invalid",
  email: "Please fill in a valid email",
  url: "Please fill in a valid URL",
  def: "Invalid value for {field}"
}

function genDefErrMsg(field, customFieldName) {
  let errMsg
  if(__errors[field]) {
    errMsg = __errors[field]
  } else {
    errMsg = __errors.def
  }

  return errMsg.replace("{field}", customFieldName)
}
class Validator {
	constructor(structure, options = {}) {
		 let isAllRequired = options && options.all && options.all.required
		 for(let field in structure) {
			let val = structure[field]
			if(isAllRequired) {
			  val.required = true
			}
		 }
		 this.structure = structure
		 this.options = options
	}
	check(checkObject) {
		 return new Promise((res, rej) => {
			  let proms = []
			  let structure = this.structure
			  let options = this.options
			  if(options.seal) {
				 if(Object.keys(checkObject).find(v => v in structure === false)) {
					return rej("seal")
				 }
			  }
			  for(let customField in structure) {
					let fields = structure[customField]
					let checkVal = checkObject[customField]
					if(!fields.required && !checkVal) {
						 continue
					}
					for(let field in fields) {
						 let val = fields[field]
						 if(field in Validator.prototype.types === false) {
							return rej("Invalid field: " + field)
						 }
						 let check = Validator.prototype.types[field](val, checkVal)
						 if(check instanceof Promise) {
							  proms.push(check)
						 }
						 else if(!check) {
							let rejectionObject = {userField: customField, structureField: field, object: checkObject, msg: genDefErrMsg(field, customField)}
							let onError = fields.onError
							if (typeof onError === "string") {
							  rejectionObject.msg = onError
							} else if(typeof onError === "object") {
							  if(onError[field]) {
							    rejectionObject.msg = onError[field]
							  } else if(onError.any) {
								  rejectionObject.msg = onError.any
							  }
							}
							return rej(rejectionObject)
						 }
					}
			  }
			  Promise.all(proms)
					.then(res)
					.catch(rej)
		 })
	}
}
Validator.prototype.types = {
	onError: (r, val) => true,
	$arrayIndex: (r, val) => true,
	required: (r, val) => !r || true == (val !== undefined && val !== null && val !== ''),
	length: (r, val) => (isNaN(r[0]) || val.length >= r[0]) && (isNaN(r[1]) || val.length <= r[1]),
	size: (r, val) => (isNaN(r[0]) || val >= r[0]) && (isNaN(r[1]) || val <= r[1]),
	min: (r, val) => val >= r,
	max: (r, val) => val <= r,
	minLen: (r, val) => val.length >= r,
	maxLen: (r, val) => val.length <= r,
	object: (r, val) => {
	  if(r instanceof Validator) {
		 return r.check(val)
	  }
	  let options = val.options
	  delete val.options
	  return (new Validator(r, options)).check(val)
	},
	each: (r,val) => {
		 if(r instanceof Validator) {

			return Promise.all(val.map((v, i) => {
			  if(typeof v === "object") {
				 v = Object.assign({}, v, {$arrayIndex: i})
			  }
			  return r.check(v)
			  }))
		 }
		 let validator = new Validator({val: r})
		 return Promise.all(val.map((v, i) => validator.check({val:v, $arrayIndex: i})))
	},
	type: (r, val) => val.constructor === r,
	email:  (r, val) => r === /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val),
  url: (r, val) => r === _urlRegex_.test(val),
  value: (r, val) => r === val,
	regexMatch: (r, val) => r.test(val),
	regexFail: (r, val) => false === r.test(val),
	validate: (r, val) => r(val)
}

module.exports = Validator
