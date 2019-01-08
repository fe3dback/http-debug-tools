<template>
    <div class="env-edit">
        <h5 class="d-none d-xl-block">Edit environment:</h5>
        <input class="form-control" aria-label="env name" :value=env.name />
        <hr />
        <div class="row">
            <div class="col-9">
                <tabs active-tab-id="env-var-edit">
                    <tabs-tab id="env-var-edit">Edit</tabs-tab>
                    <tabs-tab id="env-var-preview">Preview</tabs-tab>

                    <template slot="content">
                        <tabs-tab-content id="env-var-edit">
                            <app-editor
                                :value=env.data
                                @input=onVariablesUpdate
                                lang="json"
                                height="400px"
                            ></app-editor>
                        </tabs-tab-content>
                        <tabs-tab-content id="env-var-preview">
                            <app-editor
                                :value=preview
                                :read-only=true
                                lang="json"
                                height="400px"
                            ></app-editor>
                        </tabs-tab-content>
                    </template>
                </tabs>
            </div>
            <div class="col-3">
                <h5 class="text-info">tips:</h5>
                <p>
                    - Before each request, all variables in all text/code
                    fields like <b v-pre>{{varname}}</b>
                    will be replaced to env value.
                </p>
                <div class="d-none d-xl-block">
                    <p>
                        - You can clone existing environments and
                        change only different variables
                    </p>
                    <p>
                        - You can use variables in variables
                        (up to 3 recursion level)
                    </p>
                </div>
                <p>
                    - JSON <b>should contain</b> only simple types: <b>strings</b>
                    and <b>numbers</b>. All arrays, objects and other types
                    will be replaced to empty string.
                </p>
            </div>
        </div>
    </div>
</template>
<script>
  import {getComputedVariablesForPreview} from '../../../store/models/environment'
  import {mapActions} from 'vuex'
  import Tabs from '../../shared/tabs'
  import TabsTab from '../../shared/tabs-tab'
  import TabsTabContent from '../../shared/tabs-tab-content'
  import AppEditor from '../../shared/editor'
  export default {
    name: 'environment-edit',
    props: ['env'],
    components: {AppEditor, TabsTabContent, TabsTab, Tabs},
    methods: {
      ...mapActions([
        'envUpdateVariables'
      ]),
      onVariablesUpdate (vars) {
        this.envUpdateVariables({
          id: this.env.id,
          vars
        })
      }
    },
    computed: {
      preview () {
        return getComputedVariablesForPreview(this.env)
      }
    }
  }
</script>
