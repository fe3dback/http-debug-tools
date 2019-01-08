import uuid4 from 'uuid4'

const Environment = function (name) {
  this.id = uuid4()
  this.name = name
  this.data = '{}'
}

export function serialize (env) {
  return {
    name: env.name,
    data: env.data
  }
}

export function unserialize (state) {
  let env = new Environment(state.name)
  env.data = state.data
  return env
}

export function clone (srcEnv) {
  let newEnv = new Environment(srcEnv.name + ' clone')
  newEnv.data = srcEnv.data
  return newEnv
}

export function getComputedVariables (env) {
  let data = {}

  try {
    data = JSON.parse(env.data)
  } catch (e) {
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
      variables[key] = replaceVars(value, variables, 3)
    }
  }

  return variables
}

export function getComputedVariablesForPreview (env) {
  return JSON.stringify(getComputedVariables(env), null, 2)
}

export function parse (env, str) {
  return replaceVars(str, getComputedVariables(env), 3)
}

export function replaceVars (str, vars, times) {
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
