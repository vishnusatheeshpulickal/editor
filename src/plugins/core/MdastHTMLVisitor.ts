import type { MdxJsxAttribute, MdxJsxTextElement } from 'mdast-util-mdx'
import { MdastImportVisitor } from '../../importMarkdownToLexical'
import { $createGenericHTMLNode, KnownHTMLTagType, MDX_NODE_TYPES, htmlTags } from './GenericHTMLNode'

export const MdastHTMLVisitor: MdastImportVisitor<MdxJsxTextElement> = {
  testNode: (node) => {
    return (
      MDX_NODE_TYPES.includes(node.type) && (htmlTags as readonly string[]).includes((node as MdxJsxTextElement).name?.toLowerCase() ?? '')
    )
  },
  visitNode: function ({ mdastNode, actions }): void {
    actions.addAndStepInto(
      $createGenericHTMLNode(mdastNode.name as KnownHTMLTagType, mdastNode.type, mdastNode.attributes as MdxJsxAttribute[])
    )
  }
}
