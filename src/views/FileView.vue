<script>
import axios from 'axios'
import HomeIcon from '../components/icons/HomeIcon.vue'
import RefreshIcon from '../components/icons/RefreshIcon.vue'
import RightIcon from '../components/icons/RightIcon.vue'
import FileIcon from '../components/icons/FileIcon.vue'
import DirectoryIcon from '../components/icons/FileDirectoryIcon.vue'
import EmptyIcon from '../components/icons/EmptyIcon.vue';
import { marked } from 'marked'
import nfc from '../lib/NginxFileClient'

export default {
  components: {
    HomeIcon,
    RefreshIcon,
    RightIcon,
    FileIcon,
    DirectoryIcon,
    EmptyIcon
  },
  data() {
    return {
      config: null,
      isLoading: false,
      nfc: null,
      path: [],
      list: [],
      markdown_html: ''
    }
  },
  async mounted() {
    if (this.config == null) await this.loadConfig()
    this.init()
    this.listenRouter()
  },
  methods: {
    async loadConfig() {
      try {
        var res = await axios.get('/config.json')
        if (res.status == 200) {
          this.config = res.data
          document.title = res.data.site_name
        }
        return
      } catch (e) {
        console.error(e)
      }
    },
    async init() {
      this.nfc = new nfc(this.config.base_url, (data) => {
        this.path = data.pathData
        this.list = data.fileList
      })
      this.nfc.registerFilter('README.md', (file) => {
        this.loadMarkdown(file.src)
      })
      this.isLoading = true
      await this.nfc.go(decodeURI(this.$route.fullPath.split('%20').join(' ')))
      this.isLoading = false
    },
    async listenRouter() {
      this.$router.beforeEach(async (to, from, next) => {
        await next()
        this.markdown_html = ''
        this.isLoading = true
        await this.nfc.go(to.fullPath)
        this.isLoading = false
      })
    },
    async loadMarkdown(link) {
      var md = await axios.get(link)
      this.markdown_html = marked.parse(md.data)
      this.markdown_visible = true
    },
    back() {
      this.$router.back()
    },
    async refresh() {
      this.isLoading = true
      await this.nfc.refresh()
      this.isLoading = false
    },
    go(path) {
      this.$router.push(path)
    },
    open(file){
      window.open(file.src)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="path" v-bind:class="{disable: isLoading}">
        <template v-for="(i, k) in path" v-bind:key="k">
          <div class="path-link">
            <div class="path-root" @click="go(i.link)" v-bind:class="{ link: i.isLink }" v-if="i.link == '/'">
              <HomeIcon></HomeIcon>
            </div>
            <div class="path-name" @click="go(i.link)" v-bind:class="{ link: i.isLink }" v-else>{{ i.name }}</div>
            <div class="path-arrow" v-if="i.link == '/' || i.isLink == true">
              <RightIcon></RightIcon>
            </div>
          </div>
        </template>
        <div class="refresh" @click="refresh()">
          <RefreshIcon></RefreshIcon>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="empty" v-if="list.length == 0">
        <EmptyIcon></EmptyIcon>
      </div>
      <div class="markdown-view markdown-body" v-if="markdown_html != ''" v-html="markdown_html"></div>
      <div class="file" v-for="(i, k) in list"  v-bind:class="{disable: isLoading}" v-bind:key="k" @click="i.type == 'directory' ? go(i.path) : open(i)">
        <div class="icon">
          <DirectoryIcon v-if="i.type == 'directory'"></DirectoryIcon>
          <FileIcon v-if="i.type == 'file'" :type="i.fileType"></FileIcon>
        </div>
        <div class="info">
          <div class="name">{{ i.name }}</div>
          <div class="data">
            <div class="time">{{ i.time }}</div>
            <div class="size">{{ i.size }}</div>
          </div>
        </div>
        <div class="arrow" v-bind:class="{show: i.type == 'directory'}">
          <RightIcon></RightIcon>
        </div>
      </div>
    </div>
  </div>
</template>
