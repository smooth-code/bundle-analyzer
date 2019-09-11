import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Container } from './Container'

export function Markdown({ children }) {
  return (
    <Container my={4} color="gray300">
      <ReactMarkdown source={children} />
    </Container>
  )
}
