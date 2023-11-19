import type { MdxJsxAttribute } from 'mdast-util-mdx'
import { MdastImportVisitor } from '../../importMarkdownToLexical'
import { $createGenericHTMLNode } from './GenericHTMLNode'
import { isMdastHTMLNode, MdastHTMLNode } from './MdastHTMLNode'

export const MdastHTMLVisitor: MdastImportVisitor<MdastHTMLNode> = {
  testNode: (node) => {
    return isMdastHTMLNode(node)
  },
  visitNode: function ({ mdastNode, actions }): void {
    actions.addAndStepInto($createGenericHTMLNode(mdastNode.name, mdastNode.type, mdastNode.attributes as MdxJsxAttribute[]))
  }
}
