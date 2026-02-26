#!/usr/bin/env bash
# Upload project documentation to NotebookLM
# Run from project root: bash scripts/upload-docs-to-notebooklm.sh
# Requires: nlm login --manual --file cookies.json --profile daluz (first time)

PROFILE="daluz"
NOTEBOOK_NAME="DA LUZ Project"

echo ""
echo "=== DA LUZ - Upload docs to NotebookLM ==="
echo ""

# Check auth
echo "1. Checking authentication..."
if ! nlm login --check --profile "$PROFILE" 2>/dev/null; then
    echo ""
    echo "[ERROR] Authentication required. Run:"
    echo "  nlm login --manual --file cookies.json --profile $PROFILE"
    echo ""
    exit 1
fi

echo ""
echo "2. Creating notebook: $NOTEBOOK_NAME..."
nlm notebook create "$NOTEBOOK_NAME" --profile "$PROFILE"

echo ""
echo "3. Run the following with your notebook ID (from the list above):"
echo ""
echo "   nlm notebook list --profile $PROFILE"
echo "   nlm source add <NOTEBOOK_ID> --file Docs/PROJECT_OVERVIEW.md --profile $PROFILE --wait --title 'Project Overview'"
echo ""
echo "   Example: nlm source add notebooks/abc123 --file Docs/PROJECT_OVERVIEW.md --profile $PROFILE --wait --title 'Project Overview'"
echo ""
