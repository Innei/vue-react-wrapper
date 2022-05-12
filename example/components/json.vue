<script lang="ts" setup>
import { NGi, NGrid, NInput } from 'naive-ui'
import ReactJSONView, { ReactJsonViewProps } from 'react-json-view'
import { reactive, ref, watch } from 'vue'

import { createReactWrapper } from '../../src/wrapper'

const initialJSON = {
  message: 'Hello world',
}
const jsonText = ref(JSON.stringify(initialJSON, null, 2))

const props: ReactJsonViewProps = reactive({
  src: initialJSON,
  onEdit(e) {
    props.src = e.updated_src
    jsonText.value = JSON.stringify(e.updated_src, null, 2)
  },
})

watch(
  () => jsonText.value,
  () => {
    try {
      props.src = JSON.parse(jsonText.value)

      console.log(props.src)
    } catch {}
  },
)

const JSONView = createReactWrapper(ReactJSONView, props)
</script>

<template>
  <n-grid class="h-[300px] relative" x-gap="12" :cols="2">
    <n-gi class="h-full flex flex-col">
      <p>This is Vue component</p>
      <n-input v-model:value="jsonText" type="textarea" class="flex-grow" />
    </n-gi>
    <n-gi>
      This is React component
      <JSONView />
    </n-gi>
  </n-grid>
</template>
