# Changelog

## 1.2.0 - 2026-05-28

### Improved

- Prevents reports from claiming more than the raw evidence supports.
- Checks artifact references against CSV/JSON data, not just text.
- Detects reports that say `OPEN` but later imply `closed`, `implemented`, or `ship`.
- Expands the evaluation suite from 28 to 33 cases.
- Moves detailed guidance into reference files loaded only when needed.
- Updates the Claude Code plugin manifest to `1.2.0`.
