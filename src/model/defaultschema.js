import {Schema, Block, Textblock, Inline, Text, Attribute, MarkType} from "./schema"

// ;; The default top-level document node type.
export class Doc extends Block {}

// ;; The default blockquote node type.
export class BlockQuote extends Block {
  get matchTag() { return {"blockquote": null} }
}

// ;; The default ordered list node type. Has a single attribute,
// `order`, which determines the number at which the list starts
// counting, and defaults to 1.
export class OrderedList extends Block {
  get attrs() { return {order: new Attribute({default: 1})} }
  get matchTag() {
    return {"ol": dom => ({
      order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1
    })}
  }
}

// ;; The default bullet list node type.
export class BulletList extends Block {
  get matchTag() { return {"ul": null} }
}

// ;; The default list item node type.
export class ListItem extends Block {
  get matchTag() { return {"li": null} }
}

// ;; The default horizontal rule node type.
export class HorizontalRule extends Block {
  get matchTag() { return {"hr": null} }
}

// ;; The default heading node type. Has a single attribute
// `level`, which indicates the heading level, and defaults to 1.
export class Heading extends Textblock {
  get attrs() { return {level: new Attribute({default: 1})} }
  // :: number
  // Controls the maximum heading level. Has the value 6 in the
  // `Heading` class, but you can override it in a subclass.
  get maxLevel() { return 6 }
  get matchTag() { return {
    "h1": {level: 1},
    "h2": {level: 2},
    "h3": {level: 3},
    "h4": {level: 4},
    "h5": {level: 5},
    "h6": {level: 6}
  } }
}

// ;; The default code block / listing node type. Only
// allows unmarked text nodes inside of it.
export class CodeBlock extends Textblock {
  get isCode() { return true }
  get matchTag() { return {"pre": [null, {preserveWhitespace: true}]} }
}

// ;; The default paragraph node type.
export class Paragraph extends Textblock {
  get matchTag() { return {"p": null} }
}

// ;; The default inline image node type. Has these
// attributes:
//
// - **`src`** (required): The URL of the image.
// - **`alt`**: The alt text.
// - **`title`**: The title of the image.
export class Image extends Inline {
  get attrs() {
    return {
      src: new Attribute,
      alt: new Attribute({default: ""}),
      title: new Attribute({default: ""})
    }
  }
  get draggable() { return true }
  get matchTag() {
    return {"img[src]": dom => ({
      src: dom.getAttribute("src"),
      title: dom.getAttribute("title"),
      alt: dom.getAttribute("alt")
    })}
  }
}

// ;; The default hard break node type.
export class HardBreak extends Inline {
  get selectable() { return false }
  get isBR() { return true }
  get matchTag() { return {"br": null} }
}

// ;; The default emphasis mark type.
export class EmMark extends MarkType {
  get matchTag() { return {"i": null, "em": null} }
  get matchStyle() {
    return {"font-style": value => value == "italic" && null}
  }
}

// ;; The default strong mark type.
export class StrongMark extends MarkType {
  get matchTag() { return {"b": null, "strong": null} }
  get matchStyle() {
    return {"font-weight": value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}
  }
}

// ;; The default link mark type. Has these attributes:
//
// - **`href`** (required): The link target.
// - **`title`**: The link's title.
export class LinkMark extends MarkType {
  get attrs() {
    return {
      href: new Attribute,
      title: new Attribute({default: ""})
    }
  }
  get matchTag() {
    return {"a[href]": dom => ({
      href: dom.getAttribute("href"), title: dom.getAttribute("title")
    })}
  }
}

// ;; The default code font mark type.
export class CodeMark extends MarkType {
  get isCode() { return true }
  get matchTag() { return {"code": null} }
}

// :: Schema
// ProseMirror's default document schema.
export const defaultSchema = new Schema({
  nodes: {
    doc: {type: Doc, content: "block+"},

    paragraph: {type: Paragraph, content: "inline<_>*", group: "block"},
    blockquote: {type: BlockQuote, content: "block+", group: "block"},
    ordered_list: {type: OrderedList, content: "list_item+", group: "block"},
    bullet_list: {type: BulletList, content: "list_item+", group: "block"},
    horizontal_rule: {type: HorizontalRule, group: "block"},
    heading: {type: Heading, content: "inline<_>*", group: "block"},
    code_block: {type: CodeBlock, content: "text*", group: "block"},

    list_item: {type: ListItem, content: "block+"},

    text: {type: Text, group: "inline"},
    image: {type: Image, group: "inline"},
    hard_break: {type: HardBreak, group: "inline"}
  },

  marks: {
    em: EmMark,
    strong: StrongMark,
    link: LinkMark,
    code: CodeMark
  }
})
