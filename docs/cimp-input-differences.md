# CIMP vs Actual Input Differences

## Purpose
This document tracks where real inbound messages differ from a strict CIMP interpretation, and what parser behavior we chose. This document is intended for AI agents to reference and record reasoning for parser behavior.

Goals:
- Keep differences explicit and reviewable.
- Separate strict CIMP expectations from operational input reality.
- Provide a scalable record for `FWB/17`, `FFM/8`, and `FHL/4`.

## Scope and Terms
- **Strict CIMP expectation**: The canonical format expected from CIMP 34 message definitions.
- **Observed input**: Actual message text seen in `server/data/outputs`.
- **Parser decision**: Whether grammar remains strict or is relaxed for compatibility.
- **Evidence**: Concrete sample lines from actual files.

## How to Extend This File
Use the following format for each message family section (`FWB/17`, `FFM/8`, `FHL/4`):
1. Keep a `### Summary` subsection.
2. In `### Summary`, represent each difference as one record block:
  - Heading: `#### <ID>`
  - One line per field in this order:
    - `ID`
    - `Area`
    - `Strict CIMP Expectation (to verify against official text)`
    - `Observed Input`
    - `Parser Decision`
    - `Status`
3. Add one `#### <ID> Evidence` block under `### Evidence Samples` for each summary record.
4. In each evidence block, include at least one concrete sample:
  - `File: server/data/outputs/...json`
  - One or more representative `Line:`/`Lines:`/`Pattern:` values.
  - Add `Reasoning:` explaining what the evidence proves and why it supports the parser decision.
5. Keep `### Grammar compatibility changes` synchronized with the current ABNF behavior.
6. If behavior was updated from official CIMP interpretation, note the governing CIMP 34 rationale in either `Parser Decision` or `Grammar compatibility changes`.
7. Keep IDs stable once published; add new IDs instead of renumbering historical entries.

Authoring conventions:
- Write `Observed Input` as literal message fragments (do not paraphrase if exact text is available).
- Keep `Parser Decision` implementation-oriented (what rule was changed, added, or relaxed).
- Prefer `accepted-compat` for intentionally supported operational variants.
- Reserve `strict-only` for rules intentionally excluded from compatibility parsing.
- When only aggregate/corpus evidence exists, explicitly state that it is corpus-level observation.

Recommended status values:
- `open` = observed but not yet decided
- `accepted-compat` = intentionally accepted in compatibility grammar
- `strict-only` = allowed in strict mode only
- `rejected` = treated as non-conformant

---

## FWB/17 Differences

### Summary
This section records differences currently observed in `FWB/17` traffic and parser handling.

#### FWB-001
- ID: `FWB-001`
- Area: `CVD` charge indicator codes
- Strict CIMP Expectation (to verify against official text): Limited charge indicator code set expected
- Observed Input: `CVD/THB/PX/PP/NVD/NCV/XXX`
- Parser Decision: Accept 2-letter uppercase indicators in `CVD`
- Status: `accepted-compat`

#### FWB-002
- ID: `FWB-002`
- Area: Supplemental code usage
- Strict CIMP Expectation (to verify against official text): `SPH` line identifier expected for special handling style lines
- Observed Input: `COR/T1`
- Parser Decision: Accept `COR` as `SPH`-family supplemental line
- Status: `accepted-compat`

#### FWB-003
- ID: `FWB-003`
- Area: OCI continuation style
- Strict CIMP Expectation (to verify against official text): Single slash continuation generally expected in many line families
- Observed Input: `///ST/...` style continuation lines
- Parser Decision: Allow continuation prefixes with 1 to 3 slashes
- Status: `accepted-compat`

#### FWB-004
- ID: `FWB-004`
- Area: End-of-line strictness
- Strict CIMP Expectation (to verify against official text): Hard EOL termination for each logical line
- Observed Input: Last line may omit terminal newline in transport
- Parser Decision: Allow optional EOL at selected tail positions
- Status: `accepted-compat`

### Evidence Samples

#### FWB-001 Evidence
- File: `server/data/outputs/2026-04-15_03-32-09-000Z__uid-6141__from-spica-no-reply-anacargo-jp__subj-fwb-nh6929-13apr.json`
- Line: `CVD/THB/PX/PP/NVD/NCV/XXX`
- Reasoning: This shows mixed 2-letter indicator tokens in a single `CVD` line; accepting uppercase 2-letter tokens avoids rejecting operationally valid indicator combinations.

#### FWB-002 Evidence
- File: `server/data/outputs/2026-04-15_03-08-51-000Z__uid-6126__from-spica-no-reply-anacargo-jp__subj-fwb-nh6929-13apr.json`
- Line: `COR/T1`
- Reasoning: `COR` appears in the same practical role as special handling supplement lines; treating `COR` as an accepted supplemental alias preserves interoperability.

#### FWB-003 Evidence
- File: `server/data/outputs/2026-04-14_23-27-27-000Z__uid-6088__from-nca-info-nca-aero__subj-fwb-kz134-14apr.json`
- Line: `///ST/ALL AVAILABLE DOCUMENTATION AND`
- Reasoning: The triple-slash prefix is a real continuation form in traffic; permitting 1-3 slashes prevents false negatives while preserving continuation semantics.

#### FWB-004 Evidence
- Transport-level observation from parser runs where strict final EOL would fail on terminal lines.
- Representative line families impacted: `OCI`, `REF`, `SPH/COR`, `ARD`, `SRI`, `Notify` sub-lines.
- Reasoning: Terminal newline omission is a transport artifact rather than a content error; optional tail EOL handling improves robustness without changing field interpretation.

### Grammar compatibility changes
- `cpp/data/grammars/fwb17_grammar.abnf`
- Key compatibility rules currently include:
  - `CvdLine` with uppercase code tolerance
  - `SphLine = ("SPH" / "COR") ...`
  - `ContinuationLine = Slant [Slant [Slant]] *LineChar [EOL]`

---

## FFM/8 Differences

### Summary
This section records observed `FFM/8` input variants and compatibility decisions adopted in the recreated grammar.

#### FFM-001
- ID: `FFM-001`
- Area: Route line multiplicity
- Strict CIMP Expectation (to verify against official text): Single canonical route representation may be assumed in strict lexical models
- Observed Input: Multiple route lines in one message
- Parser Decision: Allow `1*(RouteLine EOL)`
- Status: `accepted-compat`

#### FFM-002
- ID: `FFM-002`
- Area: Transit route variant
- Strict CIMP Expectation (to verify against official text): Route often modeled as destination with `//` timestamp
- Observed Input: `ANC/NIL/14APR0200/14APR0330` form appears
- Parser Decision: Add explicit `AirportCode / NIL / ...` route alternative
- Status: `accepted-compat`

#### FFM-003
- ID: `FFM-003`
- Area: Missing ULD header before AWB block
- Strict CIMP Expectation (to verify against official text): ULD section may require explicit `ULD/...` lead line
- Observed Input: AWB appears immediately after route lines in some traffic
- Parser Decision: Make `ULDLine` optional within `UldSection`
- Status: `accepted-compat`

#### FFM-004
- ID: `FFM-004`
- Area: Supplemental COR line
- Strict CIMP Expectation (to verify against official text): Supplemental lines often constrained to OSI/OCI/slash qualifiers
- Observed Input: `COR/T1` appears in manifest body
- Parser Decision: Accept `CorLine` in `SupplementLine` alternatives
- Status: `accepted-compat`

#### FFM-005
- ID: `FFM-005`
- Area: OCI continuation depth
- Strict CIMP Expectation (to verify against official text): Continuations may be modeled with simpler slash forms
- Observed Input: `///ED/...`, `///ST/...` patterns appear heavily
- Parser Decision: Keep explicit triple-slash continuation rule
- Status: `accepted-compat`

#### FFM-006
- ID: `FFM-006`
- Area: OCI qualifier with empty middle token
- Strict CIMP Expectation (to verify against official text): Some strict lexical models reject empty qualifier token segments
- Observed Input: `/JP//KC/142`
- Parser Decision: Allow empty qualifier tokens via `QualifierToken = *NoSlashChar`
- Status: `accepted-compat`

#### FFM-007
- ID: `FFM-007`
- Area: DNR overflow qualifiers with double leading slash
- Strict CIMP Expectation (to verify against official text): `DNR` may be modeled only as part of canonical OCI element composition
- Observed Input: `//DNR/D/UN3480` and `//DNR/D/UN3090`
- Parser Decision: Accept as `SlashQualifierLine` tokens with empty first segment
- Status: `accepted-compat`

### Evidence Samples

#### FFM-001 Evidence
- File: `server/data/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Lines: `ANC/NIL/14APR0200/14APR0330` and `ORD//14APR1235`
- Reasoning: Multiple route rows appear in one message and are semantically cumulative; allowing repeated `RouteLine` captures full routing information.

#### FFM-002 Evidence
- File: `server/data/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Line: `ANC/NIL/14APR0200/14APR0330`
- Reasoning: The `/NIL/` middle token appears as an operational route variant; explicit grammar support avoids misclassifying a valid transit pattern.

#### FFM-003 Evidence
- File: `server/data/outputs/2026-04-14_23-42-00-000Z__uid-6114__from-nca-info-nca-aero__subj-ffm-kz134-14apr.json`
- First AWB line appears before any `ULD/...`: `933-34686853HKGORD/S10K206MC0.15T92/CNSL CGH MIX 13`
- Reasoning: This demonstrates that AWB blocks can exist without a preceding `ULD` header in live feeds; making `ULDLine` optional preserves successful parsing of such manifests.

#### FFM-004 Evidence
- File: `server/data/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Line: `COR/T1`
- Reasoning: `COR` appears as a standalone supplement line in manifest context; including `CorLine` in supplement alternatives aligns grammar with observed traffic.

#### FFM-005 Evidence
- File: `server/data/outputs/2026-04-14_19-47-43-000Z__uid-6072__from-nca-info-nca-aero__subj-ffm-kz7138-14apr.json`
- Line: `///ED/1299`
- Reasoning: Triple-slash continuations are not isolated anomalies and carry continuation payload data; retaining explicit triple-slash support avoids data loss.

#### FFM-006 Evidence
- File: `server/data/outputs/2026-04-15_07-31-22-000Z__uid-6160__from-spica-no-reply-anacargo-jp__subj-ffm-nh6929-14apr.json`
- Line: `/JP//KC/142`
- Reasoning: The empty middle qualifier segment (`//`) is present in real OCI qualifier composition; allowing empty tokens is required for compatibility.

#### FFM-007 Evidence
- File: `server/data/outputs/2026-04-15_07-31-22-000Z__uid-6160__from-spica-no-reply-anacargo-jp__subj-ffm-nh6929-14apr.json`
- Lines: `//DNR/D/UN3480`, `//DNR/D/UN3090`
- Reasoning: Double-leading-slash qualifier rows encode overflow/continuation qualifier content; supporting empty first segments captures these entries correctly.

### Grammar compatibility changes
- `cpp/data/grammars/ffm_grammar.abnf`
- Key compatibility rules currently include:
  - `FFM8` with repeated route lines: `1*(RouteLine EOL)`
  - `RouteLine` alternatives for both `//` and `/NIL/` patterns
  - `UldSection = [ULDLine EOL] 1*AwbBlock`
  - `SupplementLine` including `CorLine`
  - `ContinuationLine = Slant Slant Slant *LineChar`
  - `QualifierToken = *NoSlashChar` to support `/CC//CRI/...` and `//DNR/...` qualifier forms

---

## FHL/4 Differences

### Summary
This section records observed `FHL/4` input variants and compatibility decisions adopted in the recreated grammar.

#### FHL-001
- ID: `FHL-001`
- Area: HBS line optional extra piece count + free text
- Strict CIMP Expectation (to verify against official text): Core HBS structure is fixed and field-count constrained
- Observed Input: `HBS/.../31/K531/31/DRESS WOMEN WOV`
- Parser Decision: Allow optional second piece-count and trailing free text field in `HouseBillLine`
- Status: `accepted-compat`

#### FHL-002
- ID: `FHL-002`
- Area: HBS continuation rows
- Strict CIMP Expectation (to verify against official text): HBS often modeled as single line in strict lexical parsing
- Observed Input: Slash-prefixed continuation rows after HBS (`/ST ...`)
- Parser Decision: Accept repeated `EOL + /...` continuations in `HouseBillLine`
- Status: `accepted-compat`

#### FHL-003
- ID: `FHL-003`
- Area: OCI continuation prefix width
- Strict CIMP Expectation (to verify against official text): Continuations commonly represented as single slash
- Observed Input: `///...` appears in OCI-style continuation text in broader traffic patterns
- Parser Decision: Allow 1 to 3 leading slashes in `OciContLine`
- Status: `accepted-compat`

#### FHL-004
- ID: `FHL-004`
- Area: Terminal EOL strictness
- Strict CIMP Expectation (to verify against official text): Every line ends with explicit EOL
- Observed Input: Last line may omit trailing newline after transport normalization
- Parser Decision: Make selected terminal EOL positions optional (`HouseBillLine`, `CvdLine`)
- Status: `accepted-compat`

#### FHL-005
- ID: `FHL-005`
- Area: Optional segments
- Strict CIMP Expectation (to verify against official text): Some implementations may require all descriptive/commercial lines
- Observed Input: Missing `HTS`, `OCI`, and occasionally `CVD` in valid operational messages
- Parser Decision: Keep `HTS`, `OCI`, and `CVD` optional at message level
- Status: `accepted-compat`

#### FHL-006
- ID: `FHL-006`
- Area: Repeating house bill groups in one FHL
- Strict CIMP Expectation (to verify against official text): Single-house lexical models may assume one `HBS` block per message
- Observed Input: Multiple `HBS` groups each with their own `TXT/HTS/OCI` content
- Parser Decision: Model `FHL4` as `1*HouseBillGroup` where each group is `HBS + optional TXT/HTS/OCI`
- Status: `accepted-compat`

#### FHL-007
- ID: `FHL-007`
- Area: HTS continuation rows after `HTS/...`
- Strict CIMP Expectation (to verify against official text): Some models accept only one HTS line item per `HTS` identifier line
- Observed Input: `HTS/731815` followed by `/731816`
- Parser Decision: Add `HtsContLine = Slant *LineChar [EOL]` and allow repeats in `HtsBlock`
- Status: `accepted-compat`

### Evidence Samples

#### FHL-001 Evidence
- File: `server/data/outputs/2026-04-14_19-24-25-000Z__uid-6025__from-nca-info-nca-aero__subj-fhl.json`
- Line: `HBS/SGH5135041/PVGORD/31/K531/31/DRESS WOMEN WOV`
- Reasoning: The second piece count plus trailing free text are present in one operational HBS row; optional trailing fields prevent rejecting otherwise valid house data.

#### FHL-002 Evidence
- File: `server/data/outputs/2026-04-14_19-24-25-000Z__uid-6025__from-nca-info-nca-aero__subj-fhl.json`
- Line: `/ST CHAI WAN 999077 15 GSH 2801 TREN`
- Reasoning: Slash-prefixed continuation text directly follows HBS content; enabling HBS continuation rows preserves multi-line descriptive content.

#### FHL-003 Evidence
- Evidence pattern seen in operational OCI continuation families using multi-slash prefixes (compatibility retained for cross-feed consistency).
- Reasoning: Even where single corpus files are not quoted, repeated multi-slash OCI continuation patterns across feeds justify 1-3 slash compatibility handling.

#### FHL-004 Evidence
- Transport-level observation from parser runs where strict terminal newline assumptions can fail on last line.
- Reasoning: Missing final newline is transport normalization noise, not business-data deviation; optional terminal EOL avoids fragile parse outcomes.

#### FHL-005 Evidence
- Corpus-level counts from current `FHL/4` set show optional segment presence variability (`HTS`/`OCI` missing in multiple messages, `CVD` missing in some messages).
- Reasoning: Segment absence occurs in otherwise parseable operational messages; keeping these blocks optional reflects real message completeness variability.

#### FHL-006 Evidence
- File: `server/data/outputs/2026-04-15_07-31-11-000Z__uid-6158__from-spica-no-reply-anacargo-jp__subj-fhl-nh8402-14apr.json`
- Pattern: one `MBI` followed by multiple `HBS` blocks in a single message body.
- Reasoning: One master bill can carry multiple house consignments in a single transmission; modeling repeated `HouseBillGroup` is necessary to represent complete payload structure.

#### FHL-007 Evidence
- File: `server/data/outputs/2026-04-15_07-31-11-000Z__uid-6158__from-spica-no-reply-anacargo-jp__subj-fhl-nh8402-14apr.json`
- Lines: `HTS/731815` followed by `/731816` continuation row.
- Reasoning: HTS values can span follow-on slash rows, not only a single identifier line; HTS continuation support preserves full tariff coding data.

### Grammar compatibility changes
- `cpp/data/grammars/fhl4_grammar.abnf`
- Key compatibility rules currently include:
  - `FHL4` with repeating `1*HouseBillGroup`
  - `HouseBillGroup = HouseBillLine [EOL] [DescriptionBlock] [HtsBlock] [OciBlock]`
  - `HouseBillLine` with optional extra piece count and trailing free text plus slash continuations
  - `HtsBlock = 1*(HtsLine *HtsContLine)` for slash-prefixed continuation HS rows
  - `OciContLine = Slant [Slant [Slant]] *LineChar [EOL]`
  - Optional terminal EOL handling for selected tail positions
  - Optional message-level tail segments (`ShipperBlock`, `ConsigneeBlock`, `CvdLine`)

---

## Open Validation Work
- Validate each “Strict CIMP Expectation” item line-by-line against the official CIMP 34 text.
- Split grammar policy into two modes if needed:
  - `strict` (canonical only)
  - `compat` (canonical + accepted operational variants)
