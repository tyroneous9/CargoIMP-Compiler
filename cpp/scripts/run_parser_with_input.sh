#!/usr/bin/env bash
set -euo pipefail

# Run a selected generated parser against an input file.
#
# How to use:
#   1) Choose parser key: ffm8, fwb17, or fhl4
#   2) Provide an input file path (for example from cpp/data/input_tests)
#   3) The script streams parser JSON to stdout and also mirrors output to stderr
#
# Quick examples:
#   cpp/scripts/run_parser_with_input.sh ffm8 cpp/data/input_tests/ffm_test.txt
#   cpp/scripts/run_parser_with_input.sh fwb17 cpp/data/input_tests/fwb17_test.txt
#   cpp/scripts/run_parser_with_input.sh fhl4 cpp/data/input_tests/fhl4_test.txt
#   cpp/scripts/run_parser_with_input.sh cpp/build/parser_fwb17_json cpp/data/input_tests/fwb17_test.txt

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CPP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
  cat <<'EOF' >&2
Usage:
  run_parser_with_input.sh <parser> <input_file>

Arguments:
  <parser>      One of: ffm8, fwb17, fhl4
                Or an absolute/relative parser binary path
  <input_file>  Path to input file (relative paths resolve from current directory)

Examples:
  cpp/scripts/run_parser_with_input.sh ffm8 cpp/data/input_tests/ffm_test.txt
  cpp/scripts/run_parser_with_input.sh fwb17 cpp/data/input_tests/fwb17_test.txt
  cpp/scripts/run_parser_with_input.sh fhl4 cpp/data/input_tests/fhl4_test.txt
  cpp/scripts/run_parser_with_input.sh cpp/build/parser_fwb17_json cpp/data/input_tests/fwb17_test.txt
EOF
}

resolve_parser_binary() {
  local parser_input="$1"
  case "${parser_input,,}" in
    ffm|ffm8)
      echo "$CPP_DIR/build/parser_ffm_json"
      ;;
    fwb|fwb17)
      echo "$CPP_DIR/build/parser_fwb17_json"
      ;;
    fhl|fhl4)
      echo "$CPP_DIR/build/parser_fhl4_json"
      ;;
    *)
      echo "$parser_input"
      ;;
  esac
}

if [[ $# -ne 2 ]]; then
  usage
  exit 1
fi

PARSER_BIN="$(resolve_parser_binary "$1")"
INPUT_FILE="$2"

if [[ ! -f "$PARSER_BIN" ]]; then
  echo "error: parser binary not found: $PARSER_BIN" >&2
  exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "error: input file not found: $INPUT_FILE" >&2
  exit 1
fi

echo "Running parser: $PARSER_BIN" >&2
echo "Input file: $INPUT_FILE" >&2

# Capture stdout and stderr separately for detailed error reporting
TMPOUT=$(mktemp)
TMPERR=$(mktemp)
trap "rm -f $TMPOUT $TMPERR" EXIT

# Run parser without -e flag so we can capture the exit code
set +e
"$PARSER_BIN" -file "$INPUT_FILE" > "$TMPOUT" 2> "$TMPERR"
EXIT_CODE=$?
set -e

# Display output sections
echo >&2
echo "=== PARSER STDERR ===" >&2
cat "$TMPERR" >&2

echo "=== JSON OUTPUT ===" >&2
cat "$TMPOUT" >&2

# Print exit code and error status
echo >&2
if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✓ Parser succeeded" >&2
else
  echo "✗ Parser failed with exit code $EXIT_CODE" >&2
fi
echo >&2

# Output JSON to stdout for further processing
cat "$TMPOUT"

exit $EXIT_CODE
