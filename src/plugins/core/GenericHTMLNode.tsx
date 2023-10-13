import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMExportOutput,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread
} from 'lexical'
import { MdxJsxAttribute } from 'mdast-util-mdx-jsx'

export type KnownHTMLTagType = (typeof htmlTags)[number]

const TYPE_NAME = 'generic-html' as const

export type SerializedGenericHTMLNode = Spread<
  {
    tag: KnownHTMLTagType
    type: typeof TYPE_NAME
    mdxType: MdxNodeType
    attributes: MdxJsxAttribute[]
    version: 1
  },
  SerializedElementNode
>

export const MDX_NODE_TYPES = ['mdxJsxTextElement', 'mdxJsxFlowElement']

type MdxNodeType = (typeof MDX_NODE_TYPES)[number]

/** @noInheritDoc */
export class GenericHTMLNode extends ElementNode {
  /** @internal */
  __tag: KnownHTMLTagType
  __nodeType: MdxNodeType
  __attributes: MdxJsxAttribute[]

  static getType(): string {
    return TYPE_NAME
  }

  static clone(node: GenericHTMLNode): GenericHTMLNode {
    return new GenericHTMLNode(node.__tag, node.__nodeType, node.__attributes, node.__key)
  }

  constructor(tag: KnownHTMLTagType, type: MdxNodeType, attributes: MdxJsxAttribute[], key?: NodeKey) {
    super(key)
    this.__tag = tag
    this.__nodeType = type
    this.__attributes = attributes
  }

  getTag(): KnownHTMLTagType {
    return this.__tag
  }

  getNodeType(): MdxNodeType {
    return this.__nodeType
  }

  getAttributes(): MdxJsxAttribute[] {
    return this.__attributes
  }

  // View

  createDOM(): HTMLElement {
    const tag = this.__tag
    const element = document.createElement(tag)
    // take the attributes and apply them to the element
    this.__attributes.forEach((attribute) => {
      element.setAttribute(attribute.name, attribute.value as string)
    })
    return element
  }

  updateDOM(): boolean {
    return false
  }

  static importDOM(): DOMConversionMap | null {
    // TODO: take the implementation of convertHeadingElement from headingsPlugin
    return {}
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    // TODO
    const { element } = super.exportDOM(editor)

    // this.getFormatType()
    /*
    if (element && isHTMLElement(element)) {
      if (this.isEmpty()) element.append(document.createElement('br'))

      const formatType = this.getFormatType()
      element.style.textAlign = formatType

      const direction = this.getDirection()
      if (direction) {
        element.dir = direction
      }
    }*/

    return {
      element
    }
  }

  static importJSON(serializedNode: SerializedGenericHTMLNode): GenericHTMLNode {
    const node = $createGenericHTMLNode(serializedNode.tag, serializedNode.mdxType, serializedNode.attributes)
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedGenericHTMLNode {
    return {
      ...super.exportJSON(),
      tag: this.getTag(),
      attributes: this.__attributes,
      mdxType: this.__nodeType,
      type: TYPE_NAME,
      version: 1
    }
  }

  /*
  // Mutation
  insertNewAfter(selection?: RangeSelection, restoreSelection = true): ParagraphNode | GenericHTMLNode {
    const anchorOffet = selection ? selection.anchor.offset : 0
    const newElement =
      anchorOffet > 0 && anchorOffet < this.getTextContentSize() ? $createHeadingNode(this.getTag()) : $createParagraphNode()
    const direction = this.getDirection()
    newElement.setDirection(direction)
    this.insertAfter(newElement, restoreSelection)
    return newElement
  }

  collapseAtStart(): true {
    const newElement = !this.isEmpty() ? $createHeadingNode(this.getTag()) : $createParagraphNode()
    const children = this.getChildren()
    children.forEach((child) => newElement.append(child))
    this.replace(newElement)
    return true
  }*/

  extractWithChild(): boolean {
    return true
  }
}

export function $createGenericHTMLNode(tag: KnownHTMLTagType, type: MdxNodeType, attributes: MdxJsxAttribute[]): GenericHTMLNode {
  return $applyNodeReplacement(new GenericHTMLNode(tag, type, attributes))
}

export function $isGenericHTMLNode(node: LexicalNode | null | undefined): node is GenericHTMLNode {
  return node instanceof GenericHTMLNode
}

export const htmlTags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  // 'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr'
] as const
