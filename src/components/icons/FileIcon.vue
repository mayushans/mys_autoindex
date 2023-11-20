<script>
import FileUnknownIcon from './FileUnknownIcon.vue';
import FileImageIcon from './FileImageIcon.vue';
import FileVideoIcon from './FileVideoIcon.vue';
import FileVoiceIcon from './FileVoiceIcon.vue';
import FileCompressIcon from './FileCompressIcon.vue';
import FileExcelIcon from './FileExcelIcon.vue';
import FileWordIcon from './FileWordIcon.vue';
import FilePptIcon from './FilePptIcon.vue';
import FilePdfIcon from './FilePdfIcon.vue';
import FileTextIcon from './FileTextIcon.vue';
export default {
  components: {
    FileUnknownIcon,
    FileImageIcon,
    FileVideoIcon,
    FileVoiceIcon,
    FileCompressIcon,
    FileExcelIcon,
    FileWordIcon,
    FilePptIcon,
    FilePdfIcon,
    FileTextIcon
  },
  props: ['type']
}
</script>
<template>
  <FileUnknownIcon v-if="type == 'unknown'"></FileUnknownIcon>
  <FileImageIcon v-if="type == 'image'"></FileImageIcon>
  <FileVideoIcon v-if="type == 'video'"></FileVideoIcon>
  <FileVoiceIcon v-if="type == 'voice'"></FileVoiceIcon>
  <FileCompressIcon v-if="type == 'compress'"></FileCompressIcon>
  <FileExcelIcon v-if="type == 'excel'"></FileExcelIcon>
  <FileWordIcon v-if="type == 'word'"></FileWordIcon>
  <FilePptIcon v-if="type == 'ppt'"></FilePptIcon>
  <FilePdfIcon v-if="type == 'pdf'"></FilePdfIcon>
  <FileTextIcon v-if="type == 'text'"></FileTextIcon>
</template>
