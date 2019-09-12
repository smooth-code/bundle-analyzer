set -e

yarn workspace client build

if [[ $HEAD = "master" ]]; then
  ./apps/client/release.sh
fi
