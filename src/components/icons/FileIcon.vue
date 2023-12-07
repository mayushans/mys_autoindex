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
  <FileImageIcon v-if="type == 'image'"></FileImageIcon>
  <FileVideoIcon v-else-if="type == 'video'"></FileVideoIcon>
  <FileVoiceIcon v-else-if="type == 'voice'"></FileVoiceIcon>
  <FileCompressIcon v-else-if="type == 'compress'"></FileCompressIcon>
  <FileExcelIcon v-else-if="type == 'excel'"></FileExcelIcon>
  <FileWordIcon v-else-if="type == 'word'"></FileWordIcon>
  <FilePptIcon v-else-if="type == 'ppt'"></FilePptIcon>
  <FilePdfIcon v-else-if="type == 'pdf'"></FilePdfIcon>
  <FileTextIcon v-else-if="type == 'text'"></FileTextIcon>
  <FileUnknownIcon v-else></FileUnknownIcon>
</template>
