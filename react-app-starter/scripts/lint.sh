#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

echo "Running ESLint with autofix..."
npx eslint . --ext .js,.jsx,.ts,.tsx --fix
