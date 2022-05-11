# Vue React Wrapper

Status: Alpha

A wrapper of react component, use react component in vue quickly.

## Install

```
npm i vue-react-wrapper react react-dom
```

## Requirement

React ^18
ReactDOM ^18
Vue ^3

## Why

As we all know, Vue 3 is becoming more and more popular, not only for its light weight, but also for its efficient performance. However, Vue's ecology has always been lacking, and in some cases, there is no substitute for the same React component.

I just wanted to find a JSONViewer for Vue 3, but there wasn't one, but the React ecosystem blossomed.

So, is there a way to use React in Vue? Only in a certain scenario, because the whole business uses Vue and only a few scenarios need React support, so it is not a big problem to mix the two frameworks. In the decimal scenario, ReactWrapper can be dynamically imported to reduce the first loading bundle size of the entire App.

## Simple Usage

Example for [react-json-view](https://github.com/mac-s-g/react-json-view)

```tsx
import ReactJSONView from 'react-json-view'
import { reactive } from 'vue'
import { ReactWrapper, defineComponent } from 'vue-react-wrapper'

// must pass a vue reactive object
const props = reactive({
  // props
  src: null as any,
  indentWidth: 2,
  theme: 'rjv-default',
})

// JSONView is vue component
// ReactJSONView is a React Component
const JSONView = ReactWrapper(ReactJSONView, props)

export default defineComponent({
  setup() {
    return () => <JSONView />
  },
})
```

And if you prefer write vue sfc.

```vue
<template>
  <JSONView />
</template>

<script setup lang="ts">
import ReactJSONView from 'react-json-view'
import { reactive } from 'vue'
import { ReactWrapper, defineComponent } from 'vue-react-wrapper'

// must pass a vue reactive object
const props = reactive({
  // props
  src: null as any,
  indentWidth: 2,
  theme: 'rjv-default',
})

// JSONView is vue component
// ReactJSONView is a React Component
const JSONView = ReactWrapper(ReactJSONView, props)
</script>
```

## Pass slot or react children

Here is a simple React component.

```ts
export const List = (props) => {
  return React.createElement('div', null, [
    React.createElement(
      'ul',
      null,
      props.data.map((item) => React.createElement('li', { key: item }, item)),
    ),

    props.children,
  ])
}
```

Pass react children like this.

```vue
<template>
  <VList>
    <template #children>
      <button @click="remove">remove</button>
    </template>
  </VList>
</template>

<script lang="ts" setup>
import { ReactWrapper } from 'vue-react-wrapper'

const props = reactive({
  data: ['0', '1', '2'],
})

const VList = ReactWrapper(List, props)

const remove = () => {
  props.data.splice(props.data.length - 1, 1)
}

// and props pass into react will be reactive.
</script>
```

Pass default slot just change to this. Unlike the above, this will be injected into the Vue container instead of the React Children scope.

```vue
<template>
  <VList>
    <button @click="remove">remove</button>
  </VList>
</template>
```

## Other usage

Check `./example/App.vue`

## License

MIT. Coding with ❤.
