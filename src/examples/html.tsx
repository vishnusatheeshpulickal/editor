import React from 'react'
import { DiffSourceToggleWrapper, MDXEditor, corePluginHooks, diffSourcePlugin, headingsPlugin, toolbarPlugin } from '../'
import { $patchStyleText } from '@lexical/selection'

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
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <HTMLToolbarComponent />
              </DiffSourceToggleWrapper>
            )
          })
        ]}
        onChange={(md) => {
          console.log('change', md)
        }}
      />
    </>
  )
}

const HTMLToolbarComponent = () => {
  const [currentSelection, activeEditor] = corePluginHooks.useEmitterValues('currentSelection', 'activeEditor')
  const onClick = () => {
    if (activeEditor !== null && currentSelection !== null) {
      activeEditor.update(() => {
        $patchStyleText(currentSelection, { color: 'orange' })
      })
    }
  }

  activeEditor?.getEditorState().read(() => {
    console.log(currentSelection?.getNodes())
  })

  return (
    <>
      <button onClick={onClick}>Make selection orange</button>
      <button
        onClick={() => {
          if (activeEditor !== null && currentSelection !== null) {
            activeEditor.update(() => {
              $patchStyleText(currentSelection, { 'font-size': '20px' })
            })
          }
        }}
      >
        Big font size
      </button>
    </>
  )
}
