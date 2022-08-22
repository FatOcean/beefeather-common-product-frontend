<template>
  <div class="directory-tree-warpper">
    <!-- <lls-directory-tree :data="diectoryData"></lls-directory-tree> -->
  </div>
</template>

<script>
// import llsDirectoryTree from '@linklogis/directory-tree'

export default {
  components: {
    // llsDirectoryTree
  },

  data () {
    return {
      diectoryData: {
        label: '压缩文件.zip',
        children: [
          {
            label: '文件夹名称一',
            children: [
              {
                label: '图片名称一.jpg',
                type: 'image'
              },
              {
                label: '文件名称一.pdf'
              },
              {
                label: '文件名称二.pdf'
              }
            ]
          },
          {
            label: '文件夹名称一',
            expand: false,
            children: [
              {
                label: '图片名称一.jpg',
                type: 'image'
              },
              {
                label: '文件名称一.pdf'
              },
              {
                label: '文件名称二.pdf'
              }
            ]
          },
          {
            label: '文件夹名称一',
            children: [
              {
                label: '图片名称一.jpg',
                type: 'image'
              },
              {
                label: '文件名称一.pdf'
              },
              {
                label: '文件名称二.pdf'
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.directory-tree-warpper {
  padding: 16px 0 0 16px;
}
</style>
