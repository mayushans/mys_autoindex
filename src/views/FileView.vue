<script>
import { RouterLink } from 'vue-router'
import axios from 'axios'
import config from '../config.json'

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      config: config,
      path: '',
      isLoading: false,
      isError: false,
      errorMessage: '',
      link: [],
      list: []
    }
  },
  mounted() {
    this.path = this.$route.fullPath
    this.init()
    this.listenRouter()
  },
  methods: {
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
          name: 'ROOT',
          link: '/',
          isLink: true
        })
        this.link = rlink
      } else {
        this.link = [
          {
            name: 'ROOT',
            link: '/',
            isLink: false
          }
        ]
      }
    },
    async loadData(path) {
      document.title = this.path + ' - ' + config.site_name
      this.list = []
      try {
        this.isLoading = true
        var res = await axios.get(config.api + path.substring(1))
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
            size: '',
            fileType: ''
          })
        }
        for (let i = 0; i < fileSort.length; i++) {
          let tmp = fileList[fileSort[i]]
          enderList.push({
            type: tmp.type,
            name: tmp.name,
            time: this.timeParse(tmp.mtime),
            link: config.api + this.path.substring(1) + tmp.name,
            size: this.sizeParse(tmp.size),
            fileType: this.fileTypeParse(tmp.name)
          })
        }
        this.list = enderList
        this.isLoading = false
        this.isError = false
      } catch (e) {
        //console.error(e)
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
      var suffix = name.split('.').pop()
      var imageSuffix = ['bmp', 'jpg', 'png', 'jpeg', 'gif', 'exif', 'svg', 'webp', 'avif']
      var videoSuffix = ['mp4', 'mpeg', 'mov', 'wmv', 'rmvb', 'mkv', 'flv', '3gp', 'webm']
      var compressSuffix = ['rar', 'zip', '7z', 'tar', 'gz', 'tgz', 'xz']
      var applicationSuffix = ['exe', 'msi', 'dmg', 'deb', 'rpm', 'flatpak', 'apk', 'ipa']
      if (imageSuffix.indexOf(suffix) >= 0) {
        return 'image'
      } else if (videoSuffix.indexOf(suffix) >= 0) {
        return 'video'
      } else if (compressSuffix.indexOf(suffix) >= 0) {
        return 'compress'
      } else if (applicationSuffix.indexOf(suffix) >= 0) {
        return 'application'
      }
    },
    back() {
      this.$router.back()
    },
    refresh() {
      this.init()
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="content-header">
      <div class="back" @click="back">
        <svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M708.383253 957.296943c-6.289728 0-12.576383-2.398963-17.376358-7.19689l-392.936471-392.937495c-25.550034-25.550034-25.550034-67.121826 0-92.671861 0.12389-0.12389 0.249828-0.246756 0.375766-0.367575l407.301582-390.221127c9.799606-9.388005 25.355496-9.056266 34.744525 0.744365s9.056266 25.355496-0.744365 34.744525L332.676724 499.389828c-3.002032 3.076775-4.652535 7.130337-4.652535 11.436799 0 4.375062 1.704769 8.490057 4.798951 11.583215l392.936471 392.936471c9.595853 9.596877 9.595853 25.154815 0 34.751692C720.961684 954.896956 714.670933 957.296943 708.383253 957.296943z"
            fill="black"
          ></path>
        </svg>
      </div>
      <div class="path">
        <template v-for="(i, k) in link" v-bind:key="k">
          <div class="path-link" v-if="i.isLink">
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
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M939.456 256.224c-16.672-5.984-34.976 2.72-40.896 19.36l-24.768 69.344c-28.992-65.312-74.784-122.72-133.088-165.92C555.328 41.728 291.296 79.232 152.32 262.656c-67.264 88.768-95.616 198.176-79.84 308.032 15.84 110.304 74.208 207.776 164.352 274.496 75.424 55.808 163.808 82.752 251.456 82.752 128.032 0 254.56-57.44 336.992-166.272 36.48-48.128 61.472-102.08 74.208-160.416 3.776-17.248-7.136-34.304-24.416-38.08-17.216-3.712-34.304 7.104-38.08 24.416-10.784 49.184-31.872 94.752-62.72 135.456-117.888 155.52-341.92 187.232-499.392 70.72-76.288-56.48-125.664-138.912-139.072-232.16-13.344-92.8 10.656-185.248 67.488-260.288 117.856-155.584 341.792-187.424 499.328-70.848 57.024 42.24 99.84 100.608 122.976 166.624l-109.984-42.944c-16.416-6.368-35.008 1.696-41.44 18.176-6.432 16.48 1.728 35.008 18.176 41.44l161.856 63.2c3.808 1.472 7.744 2.208 11.616 2.208 0.544 0 1.024-0.192 1.568-0.224 1.216 0.128 2.432 0.64 3.648 0.64 13.12 0 25.472-8.16 30.112-21.248l57.632-161.184C964.768 280.48 956.096 262.144 939.456 256.224z"
            fill="#black"
          ></path>
        </svg>
      </div>
    </div>
    <div class="list">
      <div class="list-header">
        <div class="list-header-name">Name</div>
        <div class="list-header-time">Time</div>
        <div class="list-header-size">Size</div>
      </div>
      <div class="item" v-for="(i, k) in list" v-bind:key="k">
        <RouterLink class="file-name" v-if="i.type == 'directory'" :to="i.link">{{
          i.name
        }}</RouterLink>
        <a class="file-name" v-if="i.type == 'file'" :href="i.link" target="_blank">{{ i.name }}</a>
        <div class="file-time">{{ i.time }}</div>
        <div class="file-size">{{ i.size }}</div>
      </div>
      <div class="loading" v-if="isLoading">Loading...</div>
    </div>
  </div>
  <div class="footer">
    <a href="https://www.mayushan.com">MaYushan.com</a>
  </div>
  <div class="error-mask" v-if="isError">
    <div class="error">{{ errorMessage }}</div>
  </div>
</template>
