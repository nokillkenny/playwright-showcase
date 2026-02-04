#!/bin/bash
set -e

DRY_RUN=false
[[ "$1" == "--dry-run" ]] && DRY_RUN=true

echo "=== GitHub Setup Validation ==="

# Check git remote
if git remote get-url origin &>/dev/null; then
  echo "✅ Git remote configured"
else
  echo "❌ No git remote. Run: gh repo create pw-patterns --public --source=."
  exit 1
fi

# Check SHOWCASE_PAT secret (can't verify value, just remind)
echo ""
echo "⚠️  Manual check required:"
echo "   1. Go to repo Settings → Secrets → Actions"
echo "   2. Verify SHOWCASE_PAT exists with repo scope"
echo "   3. Same token should be in nokillkenny/test-showcase"

# Check workflow file
if [ -f ".github/workflows/test.yml" ]; then
  echo "✅ Workflow file exists"
else
  echo "❌ Missing .github/workflows/test.yml"
  exit 1
fi

# Check package.json
if [ -f "package.json" ]; then
  echo "✅ package.json exists"
else
  echo "❌ Missing package.json"
  exit 1
fi

echo ""
if $DRY_RUN; then
  echo "🔍 Dry run complete. Ready to push."
else
  echo "✅ All checks passed."
fi
