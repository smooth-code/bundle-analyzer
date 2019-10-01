import React from 'react'
import styled, { Box } from '@xstyled/styled-components'
import { Sunburst } from 'react-vis'
import useDimensions from 'react-use-dimensions'
import { FileSize } from 'components'

function getChild(arr, name) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].name === name) {
      return arr[i]
    }
  }
  return null
}

function getFile(module, fileName, parentTree) {
  const charIndex = fileName.indexOf('/')

  if (charIndex !== -1) {
    let folder = fileName.slice(0, charIndex)
    if (folder === '~') {
      folder = 'node_modules'
    }

    let childFolder = getChild(parentTree.children, folder)
    if (!childFolder) {
      childFolder = {
        name: folder,
        children: [],
      }
      parentTree.children.push(childFolder)
    }

    getFile(module, fileName.slice(charIndex + 1), childFolder)
  } else {
    module.name = fileName
    parentTree.children.push(module)
  }
}

function buildHierarchy(modules) {
  let maxDepth = 1

  const root = {
    children: [],
    name: 'root',
  }

  modules.forEach(function addToTree(module) {
    // remove this module if either:
    // - index is null
    // - issued by extract-text-plugin
    const extractInIdentifier =
      module.identifier.indexOf('extract-text-webpack-plugin') !== -1
    const extractInIssuer =
      module.issuer &&
      module.issuer.indexOf('extract-text-webpack-plugin') !== -1
    if (extractInIdentifier || extractInIssuer || module.index === null) {
      return
    }

    const mod = {
      id: module.id,
      fullName: module.name,
      size: module.size,
      reasons: module.reasons,
    }

    const depth = mod.fullName.split('/').length - 1
    if (depth > maxDepth) {
      maxDepth = depth
    }

    let fileName = mod.fullName

    const beginning = mod.fullName.slice(0, 2)
    if (beginning === './') {
      fileName = fileName.slice(2)
    }

    getFile(mod, fileName, root)
  })

  root.maxDepth = maxDepth

  return root
}

function statsToData(stats) {
  return buildHierarchy(stats.modules)
}

const LabelContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
`

function getNodeSize(node) {
  return (node.children || []).reduce(
    (size, node) => size + getNodeSize(node),
    node.size || 0,
  )
}

function Label({ node }) {
  const size = getNodeSize(node)
  return (
    <LabelContainer>
      <div>{node.name}</div>
      <div>
        <FileSize>{size}</FileSize>
      </div>
    </LabelContainer>
  )
}

function getKeyPath(node) {
  if (!node.parent) {
    return ['root']
  }

  return [(node.data && node.data.name) || node.name].concat(
    getKeyPath(node.parent),
  )
}

function colorizeData(data, keyPath) {
  data = { ...data }
  if (data.children) {
    data.children = data.children.map(child => colorizeData(child, keyPath))
  }

  data.style = {
    ...data.style,
    fillOpacity: keyPath && !keyPath[data.name] ? 0.2 : 1,
  }

  return data
}

const colors = {
  file: '#db7100',
  default: '#487ea4',
}

export function getColor(node) {
  const { name } = node
  const dotIndex = name.indexOf('.')

  if (dotIndex !== -1 && dotIndex !== 0 && dotIndex !== name.length - 1) {
    return colors.file
  }
  if (node.parent && node.parent.name === 'node_modules') {
    return '#599e59'
  }

  return colors[name] || colors.default
}

export function StatsSunburst({ stats }) {
  const data = React.useMemo(() => statsToData(stats), [stats])
  const [activeNode, setActiveNode] = React.useState(data)
  const colorizedData = React.useMemo(() => {
    if (data === activeNode) return data
    const path = getKeyPath(activeNode).reverse()
    const pathAsMap = path.reduce((res, row) => {
      res[row] = true
      return res
    }, {})
    return colorizeData(data, pathAsMap)
  }, [data, activeNode])
  const [ref, { width, height }] = useDimensions()
  return (
    <Box ref={ref} height={500} maxWidth={500} position="relative" mx="auto">
      {width && height ? (
        <Sunburst
          hideRootNode
          colorType="literal"
          data={colorizedData}
          height={height}
          width={width}
          style={{
            stroke: '#ddd',
            strokeOpacity: 0.3,
            strokeWidth: '0.5',
          }}
          getColor={getColor}
          onValueMouseOver={node => setActiveNode(node)}
          onValueMouseOut={() => setActiveNode(data)}
        >
          {activeNode ? <Label node={activeNode} /> : null}
        </Sunburst>
      ) : null}
    </Box>
  )
}
