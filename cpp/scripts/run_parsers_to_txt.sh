#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CPP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$CPP_DIR/output/parser_outputs"

mkdir -p "$OUTPUT_DIR"

"$CPP_DIR/build/parser_ffm_json" -file "$CPP_DIR/data/input_tests/ffm_test.txt" > "$OUTPUT_DIR/ffm_output.txt"
"$CPP_DIR/build/parser_fwb17_json" -file "$CPP_DIR/data/input_tests/fwb17_test.txt" > "$OUTPUT_DIR/fwb17_output.txt"
"$CPP_DIR/build/parser_fhl4_json" -file "$CPP_DIR/data/input_tests/fhl4_test.txt" > "$OUTPUT_DIR/fhl4_output.txt"

echo "Wrote parser outputs to: $OUTPUT_DIR"
echo "- $OUTPUT_DIR/ffm_output.txt"
echo "- $OUTPUT_DIR/fwb17_output.txt"
echo "- $OUTPUT_DIR/fhl4_output.txt"
