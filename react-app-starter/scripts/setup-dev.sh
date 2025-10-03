#!/bin/bash

set -e

npm install

if [ ! -f .env.local ]; then
    cat > .env.local << EOL
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EOL
    echo "Created .env.local"
fi
