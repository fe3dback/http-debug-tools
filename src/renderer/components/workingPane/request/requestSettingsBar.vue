<template>
    <div class="request-settings-bar">
        <form>
            <div class="form-row">
                <div class="col-3 col-lg-2 form-group">
                    <select class="custom-select w-100" :value="request.method" @change="onEditMethod" aria-label="method">
                        <option v-for="method in request.methods()" :key="method" :selected="method === request.method">
                            {{method}}
                        </option>
                    </select>
                </div>
                <div class="col form-group">
                    <input class="form-control" type="text" :value="request.url" @input="onEditUrl" aria-label="url">
                </div>
                <div class="col-3 col-lg-2 form-group">
                    <a href="#" class="btn btn-primary w-100" @click="request.send()">
                        <i class="fa fa-paper-plane"></i> Send
                    </a>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
      name: 'request-settings-bar',
      props: ['request'],
      methods: {
        onEditUrl (e) {
          this.request.onEditUrl(e.target.value)
        },
        onEditMethod (e) {
          this.request.onEditMethod(e.target.value)
        }
      }
    }
</script>
