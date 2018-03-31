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
    length: (r, val) => val.length > r[0] && val.length < r[1], 
    size: (r, val) => val > r[0] && val < r[1], 
    object: (r, val) => new Validator(r).check(val),
    each: (r,val) => {
        let validator = new Validator({val: r})
        return Promise.all(val.map(v => validator.check({val:v})))
    },
    type: (r, val) => val.constructor === r,
    email:  (r, val) => r === /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val),
    value: (r, val) => r === val,
    regexMatch: (r, v) => r.test(v),
    regexFail: (r, v) => false === r.test(v),    
}

module.exports = Validator