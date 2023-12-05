<script>
import { RouterLink } from 'vue-router'
import axios from 'axios'
import BackIcon from '../components/icons/BackIcon.vue'
import RefreshIcon from '../components/icons/RefreshIcon.vue'
import FileIcon from '../components/icons/FileIcon.vue'
import DirectoryIcon from '../components/icons/FileDirectoryIcon.vue'
import PreviewFile from '../components/PreviewFile.vue'
import PreviewImageFile from '../components/PreviewImageFile.vue'
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'

export default {
  components: {
    RouterLink,
    BackIcon,
    RefreshIcon,
    FileIcon,
    DirectoryIcon,
    PreviewFile,
    PreviewImageFile
  },
  data() {
    return {
      config: null,
      path: '',
      isLoading: false,
      isError: false,
      errorMessage: '',
      link: [],
      list: [],
      markdown_visible: false,
      markdown_html: ''
    }
  },
  async mounted() {
    if (this.config == null) await this.loadConfig()
    this.path = this.$route.fullPath.split('%20').join(' ')
    this.init()
    this.listenRouter()
  },
  methods: {
    async loadConfig() {
      try {
        var res = await axios.get('/config.json')
        if (res.status == 200) {
          this.config = res.data
        }
      } catch (e) {
        console.error(e)
      }
    },
    init() {
      this.parsePath(this.path)
      this.loadData(this.path)
    },
    listenRouter() {
      this.$router.beforeEach(async (to, from, next) => {
        this.path = to.fullPath
        await next()
        this.init()
      })
    },
    async parsePath(path) {
      if (path != '/') {
        var pex = path.substring(1, path.length - 1).split('/')
        var rlink = []
        while (pex.length > 0) {
          var tl = '/' + pex.join('/') + '/'
          var tn = pex.pop()
          rlink.push({
            name: tn,
            link: tl,
            isLink: true
          })
        }
        rlink[0].isLink = false
        rlink.reverse()
        rlink.unshift({
          name: 'Root',
          link: '/',
          isLink: true
        })
        this.link = rlink
      } else {
        this.link = [
          {
            name: 'Root',
            link: '/',
            isLink: false
          }
        ]
      }
    },
    async loadData(path) {
      document.title = this.path + ' - ' + this.config.site_name
      this.list = []
      this.markdown_visible = false
      this.markdown_html = ''
      try {
        this.isLoading = true
        var res = await axios.get(this.config.api + path.substring(1))
        var resultList = res.data
        var directoryList = {}
        var directorySort = []
        var fileList = {}
        var fileSort = []
        for (let i = 0; i < resultList.length; i++) {
          if (resultList[i].type == 'directory') {
            directoryList[resultList[i].name] = resultList[i]
            directorySort.push(resultList[i].name)
          } else if (resultList[i].type == 'file') {
            fileList[resultList[i].name] = resultList[i]
            fileSort.push(resultList[i].name)
          }
        }
        directorySort.sort()
        fileSort.sort()
        var enderList = []
        for (let i = 0; i < directorySort.length; i++) {
          let tmp = directoryList[directorySort[i]]
          enderList.push({
            type: tmp.type,
            name: tmp.name,
            time: this.timeParse(tmp.mtime),
            link: this.path + tmp.name + '/',
            src: this.config.api + this.path.substring(1) + tmp.name + '/',
            size: '',
            fileType: ''
          })
        }
        for (let i = 0; i < fileSort.length; i++) {
          let tmp = fileList[fileSort[i]]
          if (tmp.name == 'README.md') {
            this.loadMarkdown(this.config.api + this.path.substring(1) + tmp.name)
          }
          enderList.push({
            type: tmp.type,
            name: tmp.name,
            time: this.timeParse(tmp.mtime),
            link: this.path + tmp.name,
            src: this.config.api + this.path.substring(1) + tmp.name,
            size: this.sizeParse(tmp.size),
            fileType: this.fileTypeParse(tmp.name)
          })
        }
        this.list = enderList
        this.isLoading = false
        this.isError = false
      } catch (e) {
        if (e.code == 'ERR_NETWORK') {
          this.errorMessage = 'ERR_NETWORK'
        } else if (e.code == 'ERR_BAD_REQUEST') {
          this.errorMessage = 'ERR_BAD_REQUEST'
        }
        this.isLoading = false
        this.isError = true
      }
    },
    timeParse(dtStr) {
      var dsex = dtStr.split(' ')
      var year = dsex[3]
      var month = '__'
      switch (dsex[2]) {
        case 'Jan':
          month = '01'
          break
        case 'Feb':
          month = '02'
          break
        case 'Mar':
          month = '03'
          break
        case 'Apr':
          month = '04'
          break
        case 'May':
          month = '05'
          break
        case 'Jun':
          month = '06'
          break
        case 'Jul':
          month = '07'
          break
        case 'Aug':
          month = '08'
          break
        case 'Sep':
          month = '09'
          break
        case 'Oct':
          month = '10'
          break
        case 'Nov':
          month = '11'
          break
        case 'Dec':
          month = '12'
          break
      }
      var day = dsex[1]
      var tsex = dsex[4].split(':')
      var hour = tsex[0]
      var minute = tsex[1]
      var second = tsex[2]
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },
    sizeParse(sizeStr) {
      var sizeNumber = sizeStr
      var sizeUnit = ['B', 'KB', 'MB', 'GB']
      for (let i = 0; i < sizeUnit.length; i++) {
        var unit = sizeUnit[i]
        if (sizeNumber < 1024) {
          return sizeNumber + ' ' + unit
        }
        sizeNumber = Math.floor((sizeNumber / 1024) * 100) / 100
      }
      return sizeNumber + ' TB'
    },
    fileTypeParse(name) {
      var suffix = name.split('.').pop().toLowerCase()
      var typeMap = {
        image: [
          'apng',
          'avif',
          'bmp',
          'gif',
          'ico',
          'cur',
          'jpg',
          'jpeg',
          'jfif',
          'pjpeg',
          'pjp',
          'png',
          'webp',
          'svg'
        ],
        video: ['mp4', '3gp', 'ogg'],
        voice: ['mp3', 'ogg', 'wav'],
        compress: ['zip', 'rar', '7z', 'xz', 'tgz', 'tar', 'gz'],
        excel: ['xls', 'xlsx'],
        word: ['doc', 'docx'],
        ppt: ['ppt', 'pptx'],
        pdf: ['pdf'],
        text: ['txt']
      }
      for (let i in typeMap) {
        if (typeMap[i].indexOf(suffix) >= 0) {
          return i
        }
      }
      return 'unknown'
    },
    async loadMarkdown(link) {
      var md = await axios.get(link)
      console.log(md.data)

      this.markdown_html = marked.parse(md.data)

      console.log(this.markdown_html)

      this.markdown_visible = true
    },
    back() {
      this.$router.back()
    },
    refresh() {
      this.init()
    },
    go(link) {
      this.$router.push(link)
    },
    preview(file) {
      if (file.fileType == 'image') {
        this.$refs.previewImage.preview(file)
      } else {
        this.$refs.preview.preview(file)
      }
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="content-header">
      <div class="back" @click="back">
        <BackIcon></BackIcon>
      </div>
      <div class="path">
        <template v-for="(i, k) in link" v-bind:key="k">
          <div class="path-link" v-bind:class="{ disable: isLoading }" v-if="i.isLink">
            <RouterLink :to="i.link">{{ i.name }}</RouterLink>
          </div>
          <div class="path-name" v-if="!i.isLink">{{ i.name }}</div>
          <div class="path-slash">
            <svg viewBox="0 0 8 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1 L1 15" stroke="black" stroke-width="1"></path>
            </svg>
          </div>
        </template>
      </div>
      <div class="refresh" v-bind:class="{ disable: isLoading }" @click="refresh">
        <RefreshIcon></RefreshIcon>
      </div>
    </div>
    <div class="list">
      <div class="list-header">
        <div class="list-header-icon"></div>
        <div class="list-header-name">Name</div>
        <div class="list-header-time">Time</div>
        <div class="list-header-size">Size</div>
      </div>
      <div class="item" v-for="(i, k) in list" v-bind:key="k">
        <div class="file-icon">
          <DirectoryIcon v-if="i.type == 'directory'"></DirectoryIcon>
          <FileIcon v-if="i.type == 'file'" :type="i.fileType"></FileIcon>
        </div>
        <div class="file-name" @click="i.type == 'directory' ? go(i.link) : preview(i)">
          {{ i.name }}
        </div>
        <div class="file-time">{{ i.time }}</div>
        <div class="file-size">{{ i.size }}</div>
      </div>
      <div class="loading" v-if="isLoading">Loading...</div>
    </div>
    <div class="markdown-view markdown-body" v-if="markdown_visible" v-html="markdown_html"></div>
  </div>
  <div class="footer" v-if="config != null" v-html="config.footer"></div>
  <div class="error-mask" v-if="isError">
    <div class="error">{{ errorMessage }}</div>
  </div>
  <PreviewFile ref="preview"></PreviewFile>
  <PreviewImageFile ref="previewImage"></PreviewImageFile>
</template>
