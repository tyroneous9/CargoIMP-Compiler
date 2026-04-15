# CIMP vs Actual Input Differences

## Purpose
This document tracks where real inbound messages differ from a strict CIMP interpretation, and what parser behavior we chose.

Goals:
- Keep differences explicit and reviewable.
- Separate strict CIMP expectations from operational input reality.
- Provide a scalable record for `FWB/17`, `FFM/8`, and `FHL/4`.

## Scope and Terms
- **Strict CIMP expectation**: The canonical format expected from CIMP 34 message definitions.
- **Observed input**: Actual message text seen in `server/outputs`.
- **Parser decision**: Whether grammar remains strict or is relaxed for compatibility.
- **Evidence**: Concrete sample lines from actual files.

## How to Extend This File
When adding a new difference:
1. Add one row to the format table.
2. Add at least one real example under that row.
3. Mark whether this is a strict mode rule or compatibility mode rule.
4. If parser behavior changed, reference the grammar location.

Recommended status values:
- `open` = observed but not yet decided
- `accepted-compat` = intentionally accepted in compatibility grammar
- `strict-only` = allowed in strict mode only
- `rejected` = treated as non-conformant

---

## FWB/17 Differences

### Summary
This section records differences currently observed in `FWB/17` traffic and parser handling.

| ID | Area | Strict CIMP Expectation (to verify against official text) | Observed Input | Parser Decision | Status |
|---|---|---|---|---|---|
| FWB-001 | CVD charge indicator codes | Limited charge indicator code set expected | `CVD/THB/PX/PP/NVD/NCV/XXX` | Accept 2-letter uppercase indicators in `CVD` | accepted-compat |
| FWB-002 | Supplemental code usage | `SPH` line identifier expected for special handling style lines | `COR/T1` | Accept `COR` as SPH-family supplemental line | accepted-compat |
| FWB-003 | OCI continuation style | Single slash continuation generally expected in many line families | `///ST/...` style continuation lines | Allow continuation prefixes with 1 to 3 slashes | accepted-compat |
| FWB-004 | End-of-line strictness | Hard EOL termination for each logical line | Last line may omit terminal newline in transport | Allow optional EOL at selected tail positions | accepted-compat |

### Evidence Samples

#### FWB-001 Evidence
- File: `server/outputs/2026-04-15_03-32-09-000Z__uid-6141__from-spica-no-reply-anacargo-jp__subj-fwb-nh6929-13apr.json`
- Line: `CVD/THB/PX/PP/NVD/NCV/XXX`

#### FWB-002 Evidence
- File: `server/outputs/2026-04-15_03-08-51-000Z__uid-6126__from-spica-no-reply-anacargo-jp__subj-fwb-nh6929-13apr.json`
- Line: `COR/T1`

#### FWB-003 Evidence
- File: `server/outputs/2026-04-14_23-27-27-000Z__uid-6088__from-nca-info-nca-aero__subj-fwb-kz134-14apr.json`
- Line: `///ST/ALL AVAILABLE DOCUMENTATION AND`

#### FWB-004 Evidence
- Transport-level observation from parser runs where strict final EOL would fail on terminal lines.
- Representative line families impacted: `OCI`, `REF`, `SPH/COR`, `ARD`, `SRI`, `Notify` sub-lines.

### Grammar Touchpoints
- `cpp/data/grammars/fwb17_grammar.abnf`
- Key compatibility rules currently include:
  - `CvdLine` with uppercase code tolerance
  - `SphLine = ("SPH" / "COR") ...`
  - `ContinuationLine = Slant [Slant [Slant]] *LineChar [EOL]`

---

## FFM/8 Differences

### Summary
This section records observed `FFM/8` input variants and compatibility decisions adopted in the recreated grammar.

| ID | Area | Strict CIMP Expectation (to verify against official text) | Observed Input | Parser Decision | Status |
|---|---|---|---|---|---|
| FFM-001 | Route line multiplicity | Single canonical route representation may be assumed in strict lexical models | Multiple route lines in one message | Allow `1*(RouteLine EOL)` | accepted-compat |
| FFM-002 | Transit route variant | Route often modeled as destination with `//` timestamp | `ANC/NIL/14APR0200/14APR0330` form appears | Add explicit `AirportCode / NIL / ...` route alternative | accepted-compat |
| FFM-003 | Missing ULD header before AWB block | ULD section may require explicit `ULD/...` lead line | AWB appears immediately after route lines in some traffic | Make `ULDLine` optional within `UldSection` | accepted-compat |
| FFM-004 | Supplemental COR line | Supplemental lines often constrained to OSI/OCI/slash qualifiers | `COR/T1` appears in manifest body | Accept `CorLine` in `SupplementLine` alternatives | accepted-compat |
| FFM-005 | OCI continuation depth | Continuations may be modeled with simpler slash forms | `///ED/...`, `///ST/...` patterns appear heavily | Keep explicit triple-slash continuation rule | accepted-compat |

### Evidence Samples

#### FFM-001 Evidence
- File: `server/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Lines: `ANC/NIL/14APR0200/14APR0330` and `ORD//14APR1235`

#### FFM-002 Evidence
- File: `server/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Line: `ANC/NIL/14APR0200/14APR0330`

#### FFM-003 Evidence
- File: `server/outputs/2026-04-14_23-42-00-000Z__uid-6114__from-nca-info-nca-aero__subj-ffm-kz134-14apr.json`
- First AWB line appears before any `ULD/...`: `933-34686853HKGORD/S10K206MC0.15T92/CNSL CGH MIX 13`

#### FFM-004 Evidence
- File: `server/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Line: `COR/T1`

#### FFM-005 Evidence
- File: `server/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Line: `///ED/1299`

### Grammar Touchpoints
- `cpp/data/grammars/ffm_grammar.abnf`
- Key compatibility rules currently include:
  - `FFM8` with repeated route lines: `1*(RouteLine EOL)`
  - `RouteLine` alternatives for both `//` and `/NIL/` patterns
  - `UldSection = [ULDLine EOL] 1*AwbBlock`
  - `SupplementLine` including `CorLine`
  - `ContinuationLine = Slant Slant Slant *LineChar`

---

## FHL/4 Differences

### Summary
This section records observed `FHL/4` input variants and compatibility decisions adopted in the recreated grammar.

| ID | Area | Strict CIMP Expectation (to verify against official text) | Observed Input | Parser Decision | Status |
|---|---|---|---|---|---|
| FHL-001 | HBS line optional extra piece count + free text | Core HBS structure is fixed and field-count constrained | `HBS/.../31/K531/31/DRESS WOMEN WOV` | Allow optional second piece-count and trailing free text field in `HouseBillLine` | accepted-compat |
| FHL-002 | HBS continuation rows | HBS often modeled as single line in strict lexical parsing | Slash-prefixed continuation rows after HBS (`/ST ...`) | Accept repeated `EOL + /...` continuations in `HouseBillLine` | accepted-compat |
| FHL-003 | OCI continuation prefix width | Continuations commonly represented as single slash | `///...` appears in OCI-style continuation text in broader traffic patterns | Allow 1 to 3 leading slashes in `OciContLine` | accepted-compat |
| FHL-004 | Terminal EOL strictness | Every line ends with explicit EOL | Last line may omit trailing newline after transport normalization | Make selected terminal EOL positions optional (`HouseBillLine`, `CvdLine`) | accepted-compat |
| FHL-005 | Optional segments | Some implementations may require all descriptive/commercial lines | Missing `HTS`, `OCI`, and occasionally `CVD` in valid operational messages | Keep `HTS`, `OCI`, and `CVD` optional at message level | accepted-compat |

### Evidence Samples

#### FHL-001 Evidence
- File: `server/outputs/2026-04-14_19-24-25-000Z__uid-6025__from-nca-info-nca-aero__subj-fhl.json`
- Line: `HBS/SGH5135041/PVGORD/31/K531/31/DRESS WOMEN WOV`

#### FHL-002 Evidence
- File: `server/outputs/2026-04-14_19-24-25-000Z__uid-6025__from-nca-info-nca-aero__subj-fhl.json`
- Line: `/ST CHAI WAN 999077 15 GSH 2801 TREN`

#### FHL-003 Evidence
- Evidence pattern seen in operational OCI continuation families using multi-slash prefixes (compatibility retained for cross-feed consistency).

#### FHL-004 Evidence
- Transport-level observation from parser runs where strict terminal newline assumptions can fail on last line.

#### FHL-005 Evidence
- Corpus-level counts from current `FHL/4` set show optional segment presence variability (`HTS`/`OCI` missing in multiple messages, `CVD` missing in some messages).

### Grammar Touchpoints
- `cpp/data/grammars/fhl4_grammar.abnf`
- Key compatibility rules currently include:
  - `HouseBillLine` with optional extra piece count and trailing free text plus slash continuations
  - `OciContLine = Slant [Slant [Slant]] *LineChar [EOL]`
  - Optional terminal EOL handling for selected tail positions
  - Optional message-level segments (`HtsBlock`, `OciBlock`, `CvdLine`)

---

## Open Validation Work
- Validate each “Strict CIMP Expectation” item line-by-line against the official CIMP 34 text.
- Split grammar policy into two modes if needed:
  - `strict` (canonical only)
  - `compat` (canonical + accepted operational variants)
