import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Helmet } from 'react-helmet'
import { Container } from './Container'

export function Markdown({ children, title }) {
  return (
    <Container my={4} color="gray300">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ReactMarkdown source={children} />
    </Container>
  )
}
