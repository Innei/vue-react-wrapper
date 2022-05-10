/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  Fragment,
  FunctionComponent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createRoot } from 'react-dom/client'
import {
  RendererElement,
  RendererNode,
  VNode,
  createApp,
  defineComponent,
  h,
  isReactive,
  onMounted,
  ref,
  watch,
} from 'vue'

export const ReactWrapper = <P extends {}>(
  Component: FunctionComponent<P>,
  propsReactive: P,
) => {
  if (!isReactive(propsReactive)) {
    throw new Error('props must be reactive')
  }

  return defineComponent({
    setup(_, ctx) {
      const containerRef = ref(null)

      onMounted(() => {
        if (!containerRef.value) {
          return
        }

        const wrapperReact = forwardRef<any, P>((props, ref) => {
          const [state, setState] = useState(props)

          useEffect(() => {
            const clean = watch(
              () => propsReactive,
              (newProps) => {
                setState({ ...newProps } as any as P)
              },
              {
                deep: true,
              },
            )

            return clean
          }, [])
          const childrenRef = useRef(null)
          useEffect(() => {
            if (ctx.slots.default && childrenRef.current) {
              const defaults = ctx.slots.default()
              const app = createApp(
                defineComponent({
                  setup() {
                    return () => h('div', defaults)
                  },
                }),
              )
              app.mount(childrenRef.current)

              return () => {
                app.unmount()
              }
            }
          }, [])

          const vueChildrenIntoReact = useMemo(() => {
            if (ctx.slots.children) {
              const node = ctx.slots.children()

              return React.createElement(VueRenderHelper(node))
            }

            return null
          }, [])

          return React.createElement(Fragment, null, [
            React.createElement(Component, state, vueChildrenIntoReact),
            React.createElement('div', {
              ref: childrenRef,
            }),
          ])
        })

        createRoot(containerRef.value).render(
          // @ts-ignore
          React.createElement(wrapperReact, {
            ...(propsReactive as any as P),
          }),
        )
      })

      return () => h('div', { ref: containerRef })
    },
  })
}

const VueRenderHelper =
  (
    vnode:
      | VNode
      | VNode<
          RendererNode,
          RendererElement,
          {
            [key: string]: any
          }
        >[],
  ) =>
  () => {
    const ref = useRef(null)

    useEffect(() => {
      if (!ref.current || !vnode) {
        return
      }
      const vueInstance = createApp(
        defineComponent({
          setup() {
            return () => vnode
          },
        }),
      )
      vueInstance.mount(ref.current)

      return () => {
        vueInstance.unmount()
      }
    }, [])
    return React.createElement('div', {
      ref,
    })
  }