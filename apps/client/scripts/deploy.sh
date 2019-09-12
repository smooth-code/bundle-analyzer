set -e

yarn workspace client build

if [[ $HEAD = "master" ]]; then
  ./apps/client/scripts/release.sh
fi
