import Parser from 'tree-sitter'
import HEEx from 'tree-sitter-heex'
import { createSorter } from 'prettier-plugin-tailwindcss'

const parser = new Parser()
parser.setLanguage(HEEx)

const sorter = await createSorter({
  stylesheetPath: '../hello_world/assets/css/app.css'
})

const QUOTED_CLASSES = `
    (attribute
        (attribute_name) @name
        (quoted_attribute_value 
        (attribute_value) @value)
        (#eq? @name "class"))
    `

function parse(text, options) {
  return {
    type: "root",
    source: prettify(text)
  }
}

function prettify(source) {
    const tree = parser.parse(source)
    const query = new Parser.Query(HEEx, QUOTED_CLASSES)
    const nodes = []

    for(const match of query.matches(tree.rootNode)) {
        match.captures
            .filter(c => c.name === 'value')
            .forEach(c => nodes.push(c.node))
    }

    return nodes
        .sort((a, b) => b.startIndex - a.startIndex)
        .reduce((source, node) => {
            const sortedClasses = sortTailwindClasses(node)
            return source.slice(0, node.startIndex) + sortedClasses + source.slice(node.endIndex)
        }, source)
}

function sortTailwindClasses(node) {
    return node.text.split(" ").sort().join(" ")
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
}