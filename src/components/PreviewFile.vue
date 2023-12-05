<script>
import CloseIcon from './icons/CloseIcon.vue'
import DownloadIcon from './icons/DownloadIcon.vue'
export default {
    components: {
        CloseIcon,
        DownloadIcon
    },
    data(){
        return {
            file: null,
            visible: false
        }
    },
    methods: {
        preview(file){
            this.file = file
            this.show()
        },
        show(){
            this.visible = true
        },
        hide(){
            this.visible = false
        },
        download(){
            this.hide()
            window.open(this.file.src)
        }
    }
}
</script>
<template>
    <div class="preview-mask" v-if="visible">
        <div class="preview-content">
            <div class="preview-header">
                <div class="preview-title"></div>
                <div class="preview-close" @click="hide">
                    <CloseIcon></CloseIcon>
                </div>
            </div>
            <div class="preview-info">
                <div class="preview-info-item">
                    <div class="pii-label">Name</div>
                    <div class="pii-value">{{ file != null ? file.name : '' }}</div>
                </div>
                <div class="preview-info-item">
                    <div class="pii-label">Size</div>
                    <div class="pii-value">{{ file != null ? file.size : '' }}</div>
                </div>
                <div class="preview-info-item">
                    <div class="pii-label">Update Time</div>
                    <div class="pii-value">{{ file != null ? file.time : '' }}</div>
                </div>
            </div>
            <div class="preview-action">
                <div class="preview-action-item" @click="download">
                    <div class="pai-icon">
                        <DownloadIcon></DownloadIcon>
                    </div>
                    <div class="pai-text">下载</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.preview-mask{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top:0;
    left:0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255,255,255,0.7);
}
.preview-content{
    width: 400px;
    padding: 4px;
    background-color: white;
    border:solid 1px black;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}
.preview-header{
    padding: 4px;
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.preview-title{
    flex-shrink: 0;
    height: 16px;
    line-height: 16px;
    user-select: none;
}
.preview-close{
    width: 14px;
    height: 14px;
    padding: 3px;
    border: solid 1px rgba(0,0,0,0);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
}
.preview-close:hover{
    border-color: black;
}
.preview-close>svg{
    width: 16px;
    height: 16px;
}
.preview-info{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}
.preview-info-item{
    padding: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}
.pii-label{
    width: 120px;
    line-height: 18px;
    font-size: 16px;
    flex-shrink: 0;
}
.pii-value{
    line-height: 18px;
    font-size: 16px;
    word-break: break-all;
}
.preview-action{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
}
.preview-action-item{
    padding: 4px;
    margin: 4px;
    user-select: none;
    cursor: pointer;
    border: solid 1px black;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.preview-action-item:hover{
    background-color: rgba(0,0,0,0.1);
}
.pai-icon{
    width: 14px;
    height: 14px;
    display: block;
}
.pai-icon>svg{
    width: 14px;
    height: 14px;
    display: block;
}
.pai-text{
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    text-align: center;
}
</style>