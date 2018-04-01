class Validator {
    constructor(structure, options) {
        if(options && options.all && options.all.required) {
            for(let field in structure) {
                let val = structure[field]
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
                    let check = Validator.prototype.types[field](val, checkVal)
                    if(check instanceof Promise) {
                        proms.push(check)
                    }
                    else if(!check) {
                        return rej(field)
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
    length: (r, val) => (isNaN(r[0]) || val.length > r[0]) && (isNaN(r[1]) || val.length < r[1]),
    size: (r, val) => (isNaN(r[0]) || val > r[0]) && (isNaN(r[1]) || val < r[1]),
    object: (r, val) => {
      let options = val.options || undefined
      delete val.options
      new Validator(r, options).check(val)
    },
    each: (r,val) => {
        let options = val.options || undefined
        delete val.options
        let validator = new Validator({val: r}, options)
        return Promise.all(val.map(v => validator.check({val:v})))
    },
    type: (r, val) => val.constructor === r,
    email:  (r, val) => r === /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val),
    value: (r, val) => r === val,
    regexMatch: (r, val) => r.test(val),
    regexFail: (r, val) => false === r.test(val),
    validate: (r, val) => r(val)
}

module.exports = Validator
