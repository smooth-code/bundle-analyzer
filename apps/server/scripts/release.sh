set -e

# Run migrations
yarn workspace server db:migrate

# Setup releases on Sentry
export SENTRY_ORG=bundle-analyzer
VERSION=$(sentry-cli releases propose-version)

# Create a release
yarn sentry-cli releases new -p server $VERSION

# Associate commits with the release
yarn sentry-cli releases set-commits --commit "smooth-code/bundle-analyzer@$VERSION" $VERSION

# Mark the deploy
sentry-cli releases deploys $VERSION new -e production