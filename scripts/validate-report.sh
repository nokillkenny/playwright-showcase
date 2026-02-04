#!/bin/bash
set -e

REPORT_DIR="playwright-report"

if [ ! -d "$REPORT_DIR" ]; then
  echo "❌ Report directory not found. Run tests first."
  exit 1
fi

if [ ! -f "$REPORT_DIR/index.html" ]; then
  echo "❌ index.html not found in report."
  exit 1
fi

# Check HTML validity (basic)
if ! grep -q "<html" "$REPORT_DIR/index.html"; then
  echo "❌ Invalid HTML in report."
  exit 1
fi

echo "✅ Report validated: $REPORT_DIR/index.html"
