'use strict'
import axios from 'axios'
/**
 * @class NginxFileClient
 * @author mayushans<levimacn@qq.com>
 */
class NginxFileClient {
  /**
   * Nginx autoindex server bash url
   */
  bashUrl = ''
  /**
   * path string
   */
  path = '/'
  /**
   * path array
   */
  pathData = []
  /**
   * file list
   */
  fileList = []
  /**
   * path and list listener function
   */
  fileListListener = null
  /**
   * filter file
   */
  fileFilter = {}
  /**
   * @constructor
   * @param {String} bashUrl Nginx autoindex server bash url
   * @param {Function} callback path and list listener
   */
  constructor(bashUrl, callback) {
    this.bashUrl = bashUrl
    if (typeof callback == 'function') this.fileListListener = callback
  }
  /**
   * @method getFileList
   */
  async getFileList() {
    try {
      var res = await axios.get(this.bashUrl + this.path)
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
          time: this.timeFormat(tmp.mtime),
          path: this.path + tmp.name + '/',
          src: this.bashUrl + this.path.substring(1) + tmp.name + '/',
          size: '',
          suffix: '',
          fileType: ''
        })
      }
      let fileFilterKeys = Object.keys(this.fileFilter)
      for (let i = 0; i < fileSort.length; i++) {
        let tmp = fileList[fileSort[i]]
        let suffix = this.getSuffix(tmp.name)
        let tmpFile = {
          type: tmp.type,
          name: tmp.name,
          time: this.timeFormat(tmp.mtime),
          path: this.path + tmp.name,
          src: this.bashUrl + this.path.substring(1) + tmp.name,
          size: this.sizeFormat(tmp.size),
          suffix: suffix,
          fileType: this.getFileType(suffix)
        }
        if (fileFilterKeys.indexOf(tmpFile.name) >= 0) {
          this.fileFilter[tmpFile.name](tmpFile)
        }
        enderList.push(tmpFile)
      }
      this.fileList = enderList
      if (typeof this.fileListListener == 'function')
        this.fileListListener({
          path: this.path,
          pathData: this.pathData,
          fileList: this.fileList
        })
    } catch (e) {
      if (e.code == 'ERR_NETWORK') {
        console.error('ERR_NETWORK')
      } else if (e.code == 'ERR_BAD_REQUEST') {
        console.error('ERR_BAD_REQUEST')
      }
      console.error(e)
    }
    return
  }
  /**
   * @method refresh
   */
  async refresh() {
    await this.getFileList()
    return
  }
  /**
   * @method getSuffix
   * @param {String} fileName
   */
  getSuffix(fileName) {
    return fileName.split('.').pop().toLowerCase()
  }
  /**
   * @method getFileType
   * @param {String} fileName
   * @returns file type
   */
  getFileType(suffix) {
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
      text: ['txt'],
      windows: ['exe', 'msi', 'appx'],
      android: ['apk'],
      linux: ['sh', 'rpm', 'deb']
    }
    for (let i in typeMap) {
      if (typeMap[i].indexOf(suffix) >= 0) {
        return i
      }
    }
    return 'unknown'
  }
  /**
   * @method sizeFormat
   * @param {String} sizeStr
   * @returns formated file size
   */
  sizeFormat(sizeStr) {
    var sizeNumber = sizeStr
    var sizeUnit = ['B', 'KB', 'MB', 'GB', 'TB']
    for (let i = 0; i < sizeUnit.length; i++) {
      var unit = sizeUnit[i]
      if (sizeNumber < 1024) {
        return sizeNumber + ' ' + unit
      }
      sizeNumber = Math.floor((sizeNumber / 1024) * 100) / 100
    }
    return sizeNumber + ' EB'
  }
  /**
   * @method timeFormat
   * @param {String} time
   * @returns formated time
   */
  timeFormat(time) {
    var dsex = time.split(' ')
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
  }
  /**
   * register File
   */
  registerFilter(fileName, callback) {
    if (typeof callback == 'function') this.fileFilter[fileName] = callback
  }
  /**
   * @method go
   * @param {String} path
   */
  async go(path) {
    this.path = path
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
        name: '',
        link: '/',
        isLink: true
      })
      this.pathData = rlink
    } else {
      this.pathData = [
        {
          name: '',
          link: '/',
          isLink: false
        }
      ]
    }
    await this.getFileList()
    return
  }
}
export default NginxFileClient
