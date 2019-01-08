<template>
    <div class="request-list" ref="urlWidthContainer">
        <div class="list-group list-group-flush">
            <a
                class="list-group-item list-group-item-action pt-1 pb-1"
                :class="{'active': request.id === activeId}"
                v-for="request in list"
                :key=request.id
                @click="requestSetActive(request.id)"
            >
                <span class="row">
                    <span class="col-2 pl-1 pr-0">
                        <small class="badge" :class="`badge-${getBadgeClass(request)}`">
                            {{request.method}}
                        </small>
                    </span>
                    <span class="col-10 pl-1 pr-1 text-right">
                        <span class="request-url" :class="{'text-primary': request.id === activeId}">
                            {{getShortUrl(request)}}
                        </span>
                    </span>
                </span>
            </a>
        </div>
        <sidebar-model-actions
            :id="activeId"
            :hide-edit=true
            v-on:create="requestCreate"
            v-on:clone="requestCloneActive"
            v-on:delete="requestDeleteActive"
        ></sidebar-model-actions>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {getUrlShort} from '../../../store/models/request'
    import SidebarModelActions from '../sidebar-model-actions'
    export default {
      name: 'request-list',
      components: {SidebarModelActions},
      data () {
        return {
          sidebarWidth: 180
        }
      },
      mounted () {
        this.$nextTick(() => {
          window.addEventListener('resize', () => {
            let el = this.$refs.urlWidthContainer
            if (el) {
              let bounds = this.$refs.urlWidthContainer.getBoundingClientRect()
              this.sidebarWidth = bounds.width > 150 ? parseInt(bounds.width) : 150
            }
          })
        })
      },
      computed: {
        ...mapState({
          'list': state => state.requests.list,
          'activeId': state => state.requests.activeId
        }),
        urlCharsMax () {
          return parseInt(this.sidebarWidth * 0.09)
        }
      },
      methods: {
        ...mapActions([
          'requestCreate',
          'requestDeselect',
          'requestSetActive',
          'requestDeleteActive',
          'requestCloneActive'
        ]),
        getShortUrl (req) {
          return getUrlShort(req, this.urlCharsMax)
        },
        getBadgeClass (req) {
          switch (req.method) {
            case 'GET': return 'success'
            case 'HEAD': return 'dark'
            case 'POST': return 'warning'
            case 'PUT': return 'info'
            case 'PATCH': return 'primary'
            case 'DELETE': return 'danger'
            case 'OPTIONS': return 'secondary'
            default: return 'light'
          }
        }
      }
    }
</script>

<style>
    .request-url {
        font-size: 12px;
        line-height: 14px;
        font-family: monospace;
        word-wrap: initial;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
