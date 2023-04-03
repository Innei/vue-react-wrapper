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

  <AppVue :react-ref="reactRef" />

  <button @click="pub">Pub</button>
  <DnDView />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

import { createReactWrapper as $$ } from '../dist/index.esm'
import { createReactWrapper } from '../src/wrapper'
import DnDView from './components/dnd.vue'
import JSONView from './components/json.vue'
import MdView from './components/markdown.vue'
import { ReactInput } from './react-input'
import { List } from './react-props'
import { App } from './xlog'

const AppVue = $$(App)
const ref$ = ref()
const reactRef = () => ref$

setTimeout(() => {
  ref$.value.show()
}, 1000)

const pub = () => {
  const create = ref$.value.createOrUpdatePage
  create({
    title: 't',
    publishedAt: '2023-04-01T14:42:02.945Z',
    published: true,
    excerpt: '',
    slug: 't0' + Math.random(),
    tags: '',
    content: 'tttt',
    siteId: 'innei-4525',
    isPost: true,
    externalUrl: 'https://innei-4525.xlog.app/posts/t',
    applications: ['xlog'],
  })
}

console.log(ref$, 'reactRef')

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
