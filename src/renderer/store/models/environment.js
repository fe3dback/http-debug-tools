import uuid4 from 'uuid4'
import store from '../index'

const Environment = function (name) {
  this.id = uuid4()
  this.name = name
  this.data = '{}'
}

Environment.prototype.setAsActive = function () {
  store.dispatch('envSetActive', this.id)
}

Environment.prototype.clone = function () {
  let newEnv = new Environment(this.name + ' clone')
  newEnv.data = this.data
  return newEnv
}

Environment.prototype.updateVariables = function (vars) {
  store.dispatch('envUpdateVariables', {
    id: this.id,
    vars
  })
}

Environment.prototype.getComputedVariables = function () {
  let data = {}

  try {
    data = JSON.parse(this.data)
  } catch (e) {
    // todo show warning
    console.error(e)
    data = {}
  }

  // parse
  let variables = {}
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let val = data[key]

      if ((typeof val) !== 'string' && (typeof val) !== 'number') {
        val = ''
      }

      variables[key] = `${val}`
    }
  }

  for (let key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      let value = variables[key]
      variables[key] = this.replaceVars(value, variables, 3)
    }
  }

  return variables
}

Environment.prototype.getComputedVariablesForPreview = function () {
  return JSON.stringify(this.getComputedVariables(), null, 2)
}

Environment.prototype.parse = function (str) {
  return this.replaceVars(str, this.getComputedVariables(), 3)
}

Environment.prototype.replaceVars = function (str, vars, times) {
  let max = Number(times)
  if (max <= 0) {
    max = 1
  }
  if (max >= 10) {
    max = 10
  }

  let cur = 0
  while (cur < max) {
    for (let key in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        let value = vars[key]
        let re = new RegExp(`{{${key}}}`, 'g')
        str = str.replace(re, value)
      }
    }

    cur++
  }

  return str
}

export default Environment
