<template>
  <div class="pt-10"></div>
  <JSONView />
  <hr />

  <MdView />
  <hr />
  TestInput
  <TestInput :react-ref="inputRefCb" @react-mount="onMountedReact" />
  <hr />

  <TestList>
    <span>Vue</span>
    <template #children>
      <button @click="remove">remove</button>

      <p>React Button</p>
    </template>
  </TestList>

  <hr />

  <DnDView />
  <kbar />
</template>

<script lang="ts" setup>
import { KBar } from 'kbar'
import { onMounted, reactive, ref } from 'vue'

import { createReactWrapper } from '../src/wrapper'
import DnDView from './components/dnd.vue'
import JSONView from './components/json.vue'
import MdView from './components/markdown.vue'
import { ReactInput } from './react-input'
import { List } from './react-props'

const kbar = createReactWrapper(KBar)
const inputRef = ref<HTMLElement>()
const reactiveProps = ref({
  onChange(e) {
    reactiveProps.value = e.target.value
  },
  value: '1',
})
const TestInput = createReactWrapper(ReactInput, reactiveProps)
const inputRefCb = () => inputRef

const onMountedReact = () => {
  console.log(inputRef)
}
const props2 = reactive({
  data: ['0'],
  onChange(data) {
    props2.data = data
  },
})

const TestList = createReactWrapper(List, props2)
const remove = () => {
  props2.data.splice(props2.data.length - 1, 1)
}
</script>
