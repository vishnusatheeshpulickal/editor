import React from 'react'
import { DiffSourceToggleWrapper, MDXEditor, corePluginHooks, diffSourcePlugin, headingsPlugin, toolbarPlugin } from '../'
import { $patchStyleText } from '@lexical/selection'
import { $getRoot, $isTextNode, ElementNode, LexicalNode } from 'lexical'
import { $isGenericHTMLNode } from '@/plugins/core/GenericHTMLNode'

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
  const [currentStyle, setCurrentStyle] = React.useState('')
  const onClick = () => {
    if (activeEditor !== null && currentSelection !== null) {
      activeEditor.update(() => {
        $patchStyleText(currentSelection, { color: 'orange' })
      })
    }
  }

  React.useEffect(() => {
    activeEditor?.getEditorState().read(() => {
      const selectedNodes = currentSelection?.getNodes() || []
      if (selectedNodes.length === 1) {
        let node: ElementNode | LexicalNode | null | undefined = selectedNodes[0]
        let style = ''
        while (!style && node && node !== $getRoot()) {
          if ($isTextNode(node) || $isGenericHTMLNode(node)) {
            style = node.getStyle()
          }

          node = node?.getParent()
        }
        setCurrentStyle(style)
      } else {
        setCurrentStyle('')
      }
    })
  }, [currentSelection, activeEditor])

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
      {currentStyle && <div>Current style: {currentStyle}</div>}
    </>
  )
}
