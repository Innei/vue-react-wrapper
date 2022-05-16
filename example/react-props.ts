import React, { forwardRef, useImperativeHandle } from 'react'

export const List = forwardRef<{}, { data: string[]; onChange: any }>(
  (props, ref) => {
    useImperativeHandle(
      () => ref,
      () => ({
        get() {
          return props.data
        },
      }),
    )

    return React.createElement('div', null, [
      React.createElement(
        'ul',
        null,
        props.data.map((item) =>
          React.createElement('li', { key: item }, item),
        ),
      ),

      React.createElement('div', { style: { display: 'flex', gap: '2rem' } }, [
        React.createElement(
          'button',
          {
            onClick() {
              props.onChange([...props.data, props.data.length.toString()])
            },
          },
          'add',
        ),

        props.children,
      ]),
    ])
  },
)
