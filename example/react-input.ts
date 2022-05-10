import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

export type ReactInputProps = { value: string; onChange: any }
export const ReactInput = forwardRef<
  {
    onPropsChange: any
  },
  ReactInputProps
>((props, ref) => {
  const [state, setState] = useState(props)
  useImperativeHandle(ref, () => {
    return {
      onPropsChange: (props: ReactInputProps) => {
        setState(props)
      },
    }
  })
  useEffect(() => {
    setState(props)
  }, [props])
  return React.createElement('input', {
    value: state.value,
    onChange: state.onChange,
  })
})
