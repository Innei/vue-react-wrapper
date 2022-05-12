<script lang="ts" setup>
import { NGi, NGrid, NInput } from 'naive-ui'
import ReactMarkdown, { Options } from 'react-markdown'
import { reactive, ref, watch } from 'vue'

import { createReactWrapper } from '../../src/wrapper'

const initialText = ref(`# Hello world`)

const props: Options = reactive({ children: initialText.value })
const MdView = createReactWrapper(ReactMarkdown, props, initialText.value)
</script>

<template>
  <n-grid class="h-[300px] relative" x-gap="12" :cols="2">
    <n-gi class="h-full">
      This is Vue component
      <n-input v-model:value="initialText" type="textarea" />
    </n-gi>
    <n-gi>
      This is React component
      <MdView />
    </n-gi>
  </n-grid>
</template>
