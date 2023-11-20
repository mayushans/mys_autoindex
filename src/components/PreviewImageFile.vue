<script>
import axios from 'axios'
import CloseIcon from './icons/CloseIcon.vue'
import DownloadIcon from './icons/DownloadIcon.vue'
export default {
  components: {
    CloseIcon,
    DownloadIcon
  },
  data() {
    return {
      file: null,
      visible: false,
      isLoading: true,
      imageBlob: null,
      imageWidth: 0,
      imageHeight: 0,
      imageStyle: {},
      scale: 1,
      movesX: 0,
      movesY: 0,
      moveX: 0,
      moveY: 0,
      viewStyle: {}
    }
  },
  mounted() {},
  methods: {
    async preview(file) {
      this.file = file
      this.imageBlob = false
      this.top = 0
      this.left = 0
      this.movesX = 0
      this.movesY = 0
      this.moveX = 0
      this.moveY = 0
      this.scale = 1
      this.viewStyle = {}
      this.show()
      this.loadImage(file.src)
    },
    async loadImage(src) {
      try {
        this.isLoading = true
        var res = await axios.get(src, { responseType: 'blob' })
        if (res.status == 200) {
          var blob = new Blob([res.data])
          let url = window.URL.createObjectURL(blob)
          this.imageBlob = url
          var img = new Image()
          var waitLoad = new Promise((resolve) => {
            img.onload = resolve
          })
          img.src = url
          await waitLoad
          this.imageWidth = img.width
          this.imageHeight = img.height
          await this.initImage()
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    async initImage() {
      if (
        this.$refs.viewbox.clientWidth >= this.imageWidth &&
        this.$refs.viewbox.clientHeight >= this.imageHeight
      ) {
        this.imageStyle = {}
      } else if (
        this.$refs.viewbox.clientWidth / this.$refs.viewbox.clientHeight >
        this.imageWidth / this.imageHeight
      ) {
        this.imageStyle = {
          transform:
            'scale(' +
            Math.floor((this.$refs.viewbox.clientHeight / this.imageHeight) * 100) / 100 +
            ')'
        }
      } else {
        this.imageStyle = {
          transform:
            'scale(' +
            Math.floor((this.$refs.viewbox.clientWidth / this.imageWidth) * 100) / 100 +
            ')'
        }
      }
      return
    },
    moveStart(e) {
      this.movesX = e.clientX
      this.movesY = e.clientY
    },
    moveEnd(e) {
      if (this.movesX != 0 && this.movesY != 0) {
        this.moveX += e.clientX - this.movesX
        this.moveY += e.clientY - this.movesY
        this.movesX = 0
        this.movesY = 0
        this.viewStyle = {
          transform: this.viewStyle.transform,
          top: this.moveY + 'px',
          left: this.moveX + 'px'
        }
      }
    },
    moving(e) {
      if (this.movesX != 0 && this.movesY != 0) {
        this.viewStyle = {
          transform: this.viewStyle.transform,
          top: this.moveY + e.clientY - this.movesY + 'px',
          left: this.moveX + e.clientX - this.movesX + 'px'
        }
      }
    },
    changeScale(e) {
      //console.log(e.screenX,e.screenY,this.$refs.viewbox.clientWidth,this.$refs.viewbox.clientHeight)
      var scale = 0
      if (e.deltaY != undefined) {
        scale -= Math.round(e.deltaY / 100) / 20
      } else {
        scale -= Math.round(e.detail / 3) / 20
      }
      this.scale += scale
      if (this.scale < 0.2) this.scale = 0.2
      this.viewStyle.transform = 'scale(' + this.scale + ')'
    },
    show() {
      document.body.style.overflow = 'hidden'
      this.visible = true
    },
    hide() {
      document.body.style.overflow = 'auto'
      this.visible = false
    }
  }
}
</script>
<template>
  <div
    class="preview-mask"
    v-if="visible"
    @mouseup="moveEnd"
    @mousewheel="changeScale"
    @DOMMouseScroll="changeScale"
  >
    <div class="preview-top">
      <div class="preview-name">{{ file != null ? file.name : '' }}</div>
      <div class="preview-close" @click="hide">
        <CloseIcon></CloseIcon>
      </div>
    </div>
    <div
      class="preview-image"
      ref="viewbox"
      :style="viewStyle"
      @mousedown="moveStart"
      @mousemove="moving"
    >
      <img v-if="!isLoading" :style="imageStyle" :src="imageBlob != null ? imageBlob : ''" />
    </div>
    <div class="preview-action-box">
      <div class="preview-action">
        <a :href="imageBlob" :download="file.name" v-bind:class="{disable: isLoading}" class="preview-action-item">
          <div class="preview-action-icon">
            <DownloadIcon></DownloadIcon>
          </div>
          <div class="preview-action-text">下载</div>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.preview-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
}
.preview-top {
  width: calc(100vw - 24px);
  height: 48px;
  padding: 0 12px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
}
.preview-name {
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  flex-grow: 1;
}
.preview-close {
  width: 16px;
  height: 16px;
  padding: 4px;
  border: solid 1px rgba(0, 0, 0, 0);
}
.preview-close:hover {
  border-color: black;
}
.preview-close > svg {
  width: 16px;
  height: 16px;
  display: block;
}
.preview-action-box {
  width: 100vw;
  height: 60px;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.preview-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
  border: solid 1px black;
  background-color: white;
}
.preview-action-item {
    display: block;
  width: 36px;
  height: 36px;
  border: solid 1px rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
}
.preview-action-item.disable{
    pointer-events: none;
    opacity: 0.5;
}
.preview-action-item:hover {
  border-color: black;
}
.preview-action-icon,
.preview-action-icon > svg {
  width: 14px;
  height: 14px;
}
.preview-action-text {
  height: 10px;
  line-height: 10px;
  font-size: 10px;
  padding-top: 4px;
}
.preview-image {
  z-index: 1;
  width: 100vw;
  height: calc(100vh - 60px - 48px);
  position: fixed;
  padding-top: 48px;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.preview-image > img {
  user-select: none;
  pointer-events: none;
}
</style>
