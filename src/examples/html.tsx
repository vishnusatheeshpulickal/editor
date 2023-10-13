import React from 'react'
import { DiffSourceToggleWrapper, MDXEditor, diffSourcePlugin, headingsPlugin, toolbarPlugin } from '../'

const markdownWithSpan = `
  # Hello World

  A paragraph with <span style="color: red" class="some">some red text <span style="color: blue">with some blue nesting.</span> in here.</span> in it.
`

export function SpanWithColor() {
  return (
    <>
      <MDXEditor
        markdown={markdownWithSpan}
        plugins={[
          headingsPlugin(),
          diffSourcePlugin(),
          toolbarPlugin({ toolbarContents: () => <DiffSourceToggleWrapper>:)</DiffSourceToggleWrapper> })
        ]}
        onChange={console.log}
      />
    </>
  )
}
