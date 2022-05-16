import React, { forwardRef, useEffect, useState } from 'react'

export type ReactInputProps = { value: string; onChange: any }
export const ReactInput = forwardRef<HTMLInputElement, ReactInputProps>(
  (props, ref) => {
    const [state, setState] = useState(props)
    // useImperativeHandle(ref, () => {
    //   return {
    //     onPropsChange: (props: ReactInputProps) => {
    //       setState(props)
    //     },
    //   }
    // })
    useEffect(() => {
      setState(props)
    }, [props])
    return React.createElement('input', {
      value: state.value,
      onChange: state.onChange,
      ref,
    })
  },
)
