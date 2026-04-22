#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Database Setup for RetroVault (VGDB)   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCHEMA_FILE="$PROJECT_DIR/supabase/schema.sql"

echo -e "${GREEN}Step 1:${NC} Copy the schema SQL to clipboard..."
if command -v pbcopy &> /dev/null; then
    cat "$SCHEMA_FILE" | pbcopy
    echo -e "   ✅ Schema copied to clipboard!"
else
    echo -e "   ℹ️  Clipboard not available. You'll need to copy manually."
fi

echo ""
echo -e "${GREEN}Step 2:${NC} Opening Supabase SQL Editor in your browser..."
echo ""

# Open Supabase SQL Editor
SUPABASE_PROJECT="ocyyuldnzhhpyzlvwjop"
SQL_EDITOR_URL="https://supabase.com/dashboard/project/${SUPABASE_PROJECT}/sql/new"

if command -v open &> /dev/null; then
    open "$SQL_EDITOR_URL"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$SQL_EDITOR_URL"
else
    echo -e "   ${BLUE}Please open this URL manually:${NC}"
    echo -e "   $SQL_EDITOR_URL"
fi

echo ""
echo -e "${BLUE}Next steps in the Supabase Dashboard:${NC}"
echo ""
echo "   1. The SQL Editor should open in your browser"
echo "   2. Paste the schema (already in your clipboard)"
echo "   3. Click the '▶ Run' button (or press Cmd+Enter)"
echo "   4. Wait for all statements to execute"
echo ""
echo -e "${GREEN}After completion:${NC}"
echo "   • All tables will be created"
echo "   • RLS policies will be applied"
echo "   • You can sign up at http://localhost:3000/signup"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# If schema wasn't copied, show where to find it
if ! command -v pbcopy &> /dev/null; then
    echo -e "${BLUE}To copy the schema manually:${NC}"
    echo "   cat supabase/schema.sql"
    echo ""
fi
