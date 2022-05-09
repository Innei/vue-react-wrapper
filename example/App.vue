<template>
  <div ref="container"></div>
  <div ref="input"></div>

  <p>value: {{ value }}</p>
</template>

<script lang="ts" setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import ReactMarkdown from 'react-markdown'
import { onMounted, ref, watchEffect } from 'vue'

import { ReactInput, ReactInputProps } from './react-input'

const container = ref()
const value = ref('')
const input = ref()
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
