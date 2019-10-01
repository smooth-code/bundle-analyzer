module.exports = {
  plugins: [
    {
      resolve: 'smooth-doc',
      options: {
        standalone: true,
        name: 'Bundle Analyzer',
        slug: 'bundle-analyzer',
        author: 'Greg Bergé',
        description: 'Keep your webpack bundle optimized over time.',
        siteUrl: 'https://docs.bundle-analyzer.com',
        github: 'https://github.com/smooth-code/bundle-analyzer',
        menu: ['Getting Started', 'Advanced', 'Troubleshooting'],
        nav: [
          { title: 'Docs', url: '/docs/' },
          { title: 'Back to app', url: '/app/' },
        ],
        theme: {
          colors: {
            primary: '#0a80cc',
          },
        },
      },
    },
  ],
}
