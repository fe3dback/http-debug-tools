import uuid4 from 'uuid4'
import store from '../index'

const Environment = function (name) {
  this.id = uuid4()
  this.name = name
}

Environment.prototype.setAsActive = function () {
  store.dispatch('envSetActive', this.id)
}

export default Environment
