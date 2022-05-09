import { Attributes, FunctionComponent } from 'react'

export const ReactWrapper = <P extends {}>(
  component: FunctionComponent<P>,
  props: (Attributes & P) | null,
  wrapperEl: HTMLElement,
) => {}
