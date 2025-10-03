#!/usr/bin/env bash
# Format code for all packages

set -euo pipefail

cd "$(dirname "$0")/.."

echo "Formatting code with Prettier..."
npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}" --ignore-path .prettierignore

echo "Running ESLint with autofix..."
npx eslint . --ext .js,.jsx,.ts,.tsx --fix --max-warnings 0 || true

echo "Format complete!"
