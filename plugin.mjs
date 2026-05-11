import Parser from 'tree-sitter'
import HEEx from 'tree-sitter-heex'
import { createSorter } from 'prettier-plugin-tailwindcss/sorter'

const parser = new Parser()
parser.setLanguage(HEEx)

const sorters = new Map()

const QUOTED_CLASSES = `
    (attribute
        (attribute_name) @name
        (quoted_attribute_value 
        (attribute_value) @value)
        (#eq? @name "class"))
    `

// TODO: Implement expression classes
const EXPRESSION_CLASSES = `
    (attribute
        (attribute_name) @name
        (expression 
        (expression_value) @value)
        (#eq? @name "class"))
    `

async function parse(text, options) {
  return {
    type: "root",
    source: await prettify(text, options)
  }
}

async function prettify(source, options) {
    const tree = parser.parse(source)
    const query = new Parser.Query(HEEx, QUOTED_CLASSES)
    const nodes = []

    for(const match of query.matches(tree.rootNode)) {
        match.captures
            .filter(c => c.name === 'value')
            .forEach(c => nodes.push(c.node))
    }

    const classes = await sortTailwindClasses(
        nodes
          .sort((a, b) => b.startIndex - a.startIndex)
          .map(n => n.text),
        options.tailwindStylesheet
    )

    return zip(nodes, classes).reduce((source, [node, cls]) => {
            return source.slice(0, node.startIndex) + cls + source.slice(node.endIndex)
        }, source)
}

async function sortTailwindClasses(classes, stylesheetPath) {
    let sorter;

    if (sorters.has(stylesheetPath)) {
      sorter = sorters.get(stylesheetPath)
    } else {
      sorter = await createSorter({ stylesheetPath })
      sorters.set(stylesheetPath, sorter)
    }

    return await sorter.sortClassAttributes(classes)
}

function zip(leftArr, rightArr) {
  return leftArr.map((val, i) => [val, rightArr[i]])
}

function print(path, options, print) {
  const node = path.getValue()
  if (node.type === "root") {
    return node.source
  }
}

// Prettier Plugin
export default {
  languages: [{
    name: "HEEx",
    parsers: ["heex"]
  }],
  parsers: {
    "heex": {
        parse,
        astFormat: "heex-ast"
    }
  },
  printers: {
    "heex-ast": {
        print
    }
  },
  options: {
    tailwindStylesheet: {
      type: "string",
      default: "",
      description: "Path to the Tailwind CSS stylesheet (v4+)"
    }
  }
}