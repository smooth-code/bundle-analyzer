import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'
// import * as d3 from "d3";

export const InsetShadow = createReactClass({
  propTypes: {
    id: PropTypes.string,
    stdDeviation: PropTypes.string,
    floodColor: PropTypes.string,
    floodOpacity: PropTypes.string,
  },
  render: function() {
    return (
      <defs>
        <filter id={this.props.id}>
          <feOffset dx="0" dy="0" />
          <feGaussianBlur
            is
            stdDeviation={this.props.stdDeviation}
            result="offset-blur"
          />
          <feComposite
            is
            operator="out"
            in="SourceGraphic"
            in2="offset-blur"
            result="inverse"
          />
          <feFlood
            is
            flood-color={this.props.floodColor}
            flood-opacity={this.props.floodOpacity}
            result="color"
          />
          <feComposite
            is
            operator="in"
            in="color"
            in2="inverse"
            result="shadow"
          />
          <feComposite is operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
    )
  },
})

export const D3Gradient = createReactClass({
  propTypes: {
    id: PropTypes.string,
    color1: PropTypes.string,
    color2: PropTypes.string,
  },
  render: function() {
    return (
      <defs>
        <linearGradient
          is
          id={this.props.id}
          x1="0%"
          y1="100%"
          x2="0%"
          y2="0%"
          spreadMethod="pad"
        >
          <stop
            is
            offset="10%"
            stop-color={this.props.color1}
            stop-opacity={0.4}
          />
          <stop
            is
            offset="80%"
            stop-color={this.props.color2}
            stop-opacity={1}
          />
        </linearGradient>
      </defs>
    )
  },
})
