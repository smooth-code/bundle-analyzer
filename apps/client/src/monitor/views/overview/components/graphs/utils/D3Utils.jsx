import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import createReactClass from 'create-react-class'
import * as d3 from 'd3'

export const D3Axis = createReactClass({
  propTypes: {
    h: PropTypes.number,
    scale: PropTypes.func,
    axisType: PropTypes.oneOf(['x', 'y']),
    orient: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
    className: PropTypes.string,
    tickFormat: PropTypes.string,
    ticks: PropTypes.number,
  },

  componentDidUpdate() {
    this.renderAxis()
  },
  componentDidMount() {
    this.renderAxis()
  },

  renderAxis() {
    if (this.props.orient === 'left') {
      this.axis = d3
        .axisLeft()
        .scale(this.props.scale)
        // .orient(this.props.orient)
        .ticks(this.props.ticks)
    } else {
      this.axis = d3
        .axisBottom()
        .scale(this.props.scale)
        // .orient(this.props.orient)
        .ticks(this.props.ticks)
    }
    // if (this.props.tickFormat != null && this.props.axisType === 'x')
    // this.axis.tickFormat(d3.time.format(this.props.tickFormat));

    const node = ReactDOM.findDOMNode(this)
    d3.select(node).call(this.axis)
  },

  render() {
    const translate = `translate(0,${this.props.h})`

    return (
      <g
        className={this.props.className}
        transform={this.props.axisType === 'x' ? translate : ''}
      />
    )
  },
})

export const D3Grid = createReactClass({
  propTypes: {
    h: PropTypes.number,
    len: PropTypes.number,
    scale: PropTypes.func,
    gridType: PropTypes.oneOf(['x', 'y']),
    orient: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
    className: PropTypes.string,
    ticks: PropTypes.number,
  },

  componentDidUpdate: function() {
    this.renderGrid()
  },
  componentDidMount: function() {
    this.renderGrid()
  },
  renderGrid: function() {
    this.grid = d3
      .axisLeft()
      .scale(this.props.scale)
      // .orient(this.props.orient)
      .ticks(this.props.ticks)
      .tickSize(-this.props.len, 0, 0)
      .tickFormat('')

    var node = ReactDOM.findDOMNode(this)
    d3.select(node).call(this.grid)
  },
  render: function() {
    var translate = 'translate(0,' + this.props.h + ')'
    return (
      <g
        className={this.props.className}
        transform={this.props.gridType == 'x' ? translate : ''}
      ></g>
    )
  },
})

export const D3ToolTip = createReactClass({
  propTypes: {
    tooltip: PropTypes.object,
    bgStyle: PropTypes.string,
    textStyle1: PropTypes.string,
    textStyle2: PropTypes.string,
    xValue: PropTypes.string,
    yValue: PropTypes.string,
  },
  render: function() {
    let visibility = 'hidden'
    let transform = ''
    let x = 0
    let y = 0
    const width = 150
    const height = 70
    const transformText =
      'translate(' + width / 2 + ',' + (height / 2 - 5) + ')'
    let transformArrow = ''

    if (this.props.tooltip.display == true) {
      const position = this.props.tooltip.pos

      x = position.x
      y = position.y
      visibility = 'visible'

      if (y > height) {
        transform =
          'translate(' + (x - width / 2) + ',' + (y - height - 20) + ')'
        transformArrow =
          'translate(' + (width / 2 - 20) + ',' + (height - 0.2) + ')'
      } else if (y < height) {
        transform =
          'translate(' + (x - width / 2) + ',' + (Math.round(y) + 20) + ')'
        transformArrow =
          'translate(' + (width / 2 - 20) + ',' + 0 + ') rotate(180,20,0)'
      }
    } else {
      visibility = 'hidden'
    }

    return (
      <g transform={transform}>
        <rect
          class={this.props.bgStyle}
          is
          width={width}
          height={height}
          rx="5"
          ry="5"
          visibility={visibility}
        />
        <polygon
          class={this.props.bgStyle}
          is
          points="10,0  30,0  20,10"
          transform={transformArrow}
          visibility={visibility}
        />
        <text is visibility={visibility} transform={transformText}>
          <tspan is x="0" class={this.props.textStyle1} text-anchor="middle">
            {this.props.xValue + ' : ' + this.props.tooltip.data.key}
          </tspan>
          <tspan
            is
            x="0"
            class={this.props.textStyle2}
            text-anchor="middle"
            dy="25"
          >
            {this.props.yValue + ' : ' + this.props.tooltip.data.value}
          </tspan>
        </text>
      </g>
    )
  },
})

export const D3Dots = createReactClass({
  propTypes: {
    data: PropTypes.array,
    xData: PropTypes.string.isRequired,
    yData: PropTypes.string.isRequired,
    x: PropTypes.func,
    y: PropTypes.func,
    r: PropTypes.string,
    format: PropTypes.string,
    removeFirstAndLast: PropTypes.bool,
    handleClickCircle: PropTypes.func,
    activeIndex: PropTypes.number,
  },

  render: function() {
    var _self = this

    //remove last & first point

    var data = []
    if (this.props.removeFirstAndLast) {
      for (var i = 1; i < this.props.data.length - 1; ++i) {
        data[i - 1] = this.props.data[i]
      }
    } else {
      data = this.props.data
    }

    var circles = data.map(function(d, i) {
      return (
        <circle
          onClick={_self.props.handleCircleClick}
          className="dot"
          /* zero means non existing, therefor hide the circle */
          r={
            d.size === 0
              ? 0
              : i === _self.props.activeIndex
              ? _self.props.r * 2
              : _self.props.r
          }
          cx={_self.props.x(d[_self.props.xData])}
          cy={_self.props.y(d[_self.props.yData])}
          data-build={i}
          key={i}
          onMouseOver={_self.props.showToolTip}
          onMouseOut={_self.props.hideToolTip}
          data-key={d[_self.props.xData]}
          // data-key="Date"
          data-value={Math.floor(d[_self.props.yData])}
        />
      )
    })

    return <g>{circles}</g>
  },
})
