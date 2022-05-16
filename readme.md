# Vue React Wrapper

Status: Alpha

A wrapper of react component, use react component in vue quickly.

## Why

As we all know, Vue 3 is becoming more and more popular, not only for its light weight, but also for its efficient performance. However, Vue's ecology has always been lacking, and in some cases, there is no substitute for the same React component.

I just wanted to find a JSONViewer for Vue 3, but there wasn't one, but the React ecosystem blossomed.

So, is there a way to use React in Vue? Only in a certain scenario, because the whole business uses Vue and only a few scenarios need React support, so it is not a big problem to mix the two frameworks. In the decimal scenario, createReactWrapper can be dynamically imported to reduce the first loading bundle size of the entire App.

## Install

```
npm i vue-react-wrapper
```

## Requirement

- Vue 3

## Simple Usage

Example for [react-json-view](https://github.com/mac-s-g/react-json-view)

```tsx
import ReactJSONView from 'react-json-view'
import { defineComponent, reactive } from 'vue'
import { createReactWrapper } from 'vue-react-wrapper'

// must pass a vue reactive object or Ref
const props = reactive({
  // ref type also work
  // props
  src: null as any,
  indentWidth: 2,
  theme: 'rjv-default',
})

// JSONView is vue component
// ReactJSONView is a React Component
const JSONView = createReactWrapper(ReactJSONView, props)

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
import { createReactWrapper } from 'vue-react-wrapper'

// must pass a vue reactive object or ref type
const props = ref({
  // or reactive
  // props
  src: null as any,
  indentWidth: 2,
  theme: 'rjv-default',
})

// JSONView is vue component
// ReactJSONView is a React Component
const JSONView = createReactWrapper(ReactJSONView, props)
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
import { createReactWrapper } from 'vue-react-wrapper'

const props = reactive({
  data: ['0', '1', '2'],
})

const VList = createReactWrapper(List, props)

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

## Get react component inner ref

```vue
<template>
  <TestInput :react-ref="inputRefCb" @react-mount="onMountedReact" />
</template>

<script lang="ts" setup>
const reactiveProps = ref({
  onChange(e) {
    reactiveProps.value = e.target.value
  },
  value: '1',
})

const TestInput = createReactWrapper(ReactInput, reactiveProps)
const inputRef = ref<HTMLElement>()
const inputRefCb = () => inputRef // because vue template sfc will automatically destruct ref.value so pass a function wrapped ref

const onMountedReact = () => {
  console.log(inputRef) // can access ref here
}
</script>
```

## Access react lifecycle

- pass `:onReactMount` or `@react-mount`
- pass `:onReactUnMount` or `@react-unmount`

## Other usage

Check `./example/App.vue`

## TODO

- [x] support react forwardRef
- [ ] support root react container and root context
- [x] support pass vue ref
- [x] react types without global jsx namespace

## Reference

Other similar libraries.

- For Vue 2 [vuera](https://github.com/akxcv/vuera)

## License

MIT. Coding with ❤.
