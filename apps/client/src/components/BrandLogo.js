import React from 'react'

export const BrandLogo = props => (
  <svg width={28} height={32} viewBox="0 0 28 32" {...props}>
    <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="prefix__a">
        <stop stopColor="#00BFFB" offset="0%" />
        <stop stopColor="#0270D7" offset="100%" />
      </linearGradient>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="prefix__b">
        <stop stopColor="#1F232A" stopOpacity={0.48} offset="0%" />
        <stop stopColor="#1F2329" stopOpacity={0} offset="100%" />
      </linearGradient>
      <linearGradient
        x1="87.665%"
        y1="103.739%"
        x2="-3.169%"
        y2="38.807%"
        id="prefix__c"
      >
        <stop stopColor="#FFF" stopOpacity={0} offset="0%" />
        <stop stopColor="#FFF" stopOpacity={0.64} offset="100%" />
      </linearGradient>
      <linearGradient
        x1="-14.104%"
        y1="111.262%"
        x2="109.871%"
        y2="26.355%"
        id="prefix__d"
      >
        <stop stopColor="#0270D7" offset="0%" />
        <stop stopColor="#0270D7" stopOpacity={0} offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#prefix__a)"
        transform="rotate(90 14 16)"
        d="M6 2l-8 13.999L6 30h16l8-14.001L22 2z"
      />
      <path fill="url(#prefix__b)" d="M14 0v32L0 24V8z" />
      <path fill="url(#prefix__c)" d="M28 24L0 8l14.001-8L28 8z" />
      <path
        fillOpacity={0.48}
        fill="url(#prefix__d)"
        style={{
          mixBlendMode: 'multiply',
        }}
        d="M28 8L0 23.978V8l14.001-8L28 8z"
      />
    </g>
  </svg>
)
