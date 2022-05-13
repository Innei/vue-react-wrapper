<script lang="ts" setup>
import { NGi, NGrid, NInput } from 'naive-ui'
import ReactMarkdown, { Options } from 'react-markdown'
import { reactive, ref, watch } from 'vue'

import { createReactWrapper } from '../../src/wrapper'

const props: Options = reactive({ children: `# Hello world` })
const MdView = createReactWrapper(ReactMarkdown, props)
</script>

<template>
  <n-grid class="h-[300px] relative" x-gap="12" :cols="2">
    <n-gi class="h-full">
      This is Vue component
      <n-input v-model:value="props.children" type="textarea" />
    </n-gi>
    <n-gi>
      This is React component
      <MdView />
    </n-gi>
  </n-grid>
</template>
