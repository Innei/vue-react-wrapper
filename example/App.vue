<template>
  <div ref="container"></div>
  <div ref="input"></div>

  <p>value: {{ value }}</p>

  <hr />

  <!-- <Test /> -->
  <TestInput />
  <hr />

  <TestList>
    <span>1111111</span>
    <template #children>
      <button @click="remove">remove</button>
    </template>
  </TestList>
</template>

<script lang="ts" setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import ReactMarkdown from 'react-markdown'
import { onMounted, reactive, ref, watchEffect } from 'vue'

import { createReactWrapper } from '../src/wrapper'
import { ReactInput, ReactInputProps } from './react-input'
import { List } from './react-props'

const container = ref()
const value = ref('')
const input = ref()

const reactiveProps = reactive({
  onChange(e) {
    reactiveProps.value = e.target.value
  },
  value: '1',
})
const TestInput = createReactWrapper(ReactInput, reactiveProps)

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

onMounted(() => {
  const element = createElement(ReactMarkdown, {}, '# Hello World')

  createRoot(container.value).render(element)
})

let inputReactRef: any
const memoOnChange = (e) => {
  value.value = e.target.value
}
let inputReactProps: () => ReactInputProps = () => ({
  value: value.value,
  onChange: memoOnChange,
})
onMounted(() => {
  const element = createElement(ReactInput, {
    ...inputReactProps(),
    ref: (el) => {
      inputReactRef = el
    },
  })

  createRoot(input.value).render(element)
})

watchEffect(() => {
  void value.value

  if (inputReactRef) {
    inputReactRef.onPropsChange(inputReactProps())
  }
})
</script>
