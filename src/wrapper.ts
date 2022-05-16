/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  Fragment,
  FunctionComponent,
  ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Root, createRoot } from 'react-dom/client'
import {
  Ref,
  RendererElement,
  RendererNode,
  VNode,
  createApp,
  defineComponent,
  h,
  isReactive,
  isRef,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

type WithChildren<C> = C & { children?: ReactNode | ReactNode[] }
export function createReactWrapper<P extends {}>(
  Component: FunctionComponent<P>,
  propsReactive?: Ref<WithChildren<P>> | WithChildren<P>,
  children?: React.ReactNode[],
) {
  const propsIsVueRef = isRef(propsReactive)

  if (
    typeof propsReactive === 'object' &&
    !isReactive(propsReactive) &&
    !propsIsVueRef
  ) {
    throw new Error('props must be reactive')
  }

  return defineComponent({
    setup(_, ctx) {
      const containerRef = ref(null)

      let reactDOMRoot: Root | null = null

      onMounted(() => {
        if (!containerRef.value) {
          return
        }

        const wrapperReact = forwardRef<any, P>((props, ref) => {
          const [state, setState] = useState(props)

          useEffect(() => {
            if (propsReactive) {
              const clean = watch(
                () => (propsIsVueRef ? propsReactive.value : propsReactive),
                (newProps) => {
                  setState({ ...newProps } as any as P)
                },
                {
                  deep: true,
                },
              )

              return clean
            }
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
          let combinedChildren: ReactNode[] | null = [
            vueChildrenIntoReact,
            state.children,
          ].filter(Boolean)
          // @ts-ignore
          combinedChildren =
            combinedChildren.length == 0
              ? undefined
              : combinedChildren.length === 1
              ? combinedChildren[0]
              : combinedChildren

          return React.createElement(Fragment, null, [
            React.createElement(Component, state, combinedChildren),

            React.createElement('div', {
              ref: childrenRef,
            }),
          ])
        })
        reactDOMRoot = createRoot(containerRef.value)

        if (propsIsVueRef) {
          reactDOMRoot!.render(
            React.createElement(
              wrapperReact,
              // @ts-ignore
              {
                ...(propsReactive.value as any as P),
              },
              propsReactive.value?.children ?? children,
            ),
          )
        } else {
          reactDOMRoot!.render(
            React.createElement(
              wrapperReact,
              // @ts-ignore
              {
                ...(propsReactive as any as P),
              },
              propsReactive?.children ?? children,
            ),
          )
        }
      })

      onUnmounted(() => {
        if (reactDOMRoot) {
          reactDOMRoot.unmount()
        }
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

/** @deprecated please use createReactWrapper */
export const ReactWrapper = createReactWrapper
