---
description: Run engineering tasks with the Gravitas Reliability Runtime (scoped recon, adaptive planning, evidence-backed verification)
---

# Gravitas Engineering Reliability Runtime

Execute the task adhering strictly to the **Gravitas Protocol**:

## The 6 Invariants
1. **Ground before mutating**: Read the target file, tests, and callers before making any edits. Never act on assumed state.
2. **Stay in declared scope**: Only modify files within the declared scope.
3. **Completion needs evidence**: A criterion is done only when a validator passes *after* the last relevant mutation. Stale evidence or self-review does not count.
4. **Never exact-retry a failure**: When an approach fails, diagnose the root cause and change strategy before retrying.
5. **Satisfy the contract**: Meet all acceptance criteria and required verification gates.
6. **Say what you can't verify**: Explicitly state any unverifiable claims; never fabricate certainty.

## Verification Hierarchy
1. Hidden / Deterministic acceptance validator
2. Integration / Runtime execution
3. Project test suite
4. Compiler / Type checker / Linter
5. Reproducer / Verification script
6. Structural diff analysis

Always end verification with `VERDICT: PASS` or `VERDICT: FAIL -- [reason]`.

## Output Format
For every non-trivial response:
### What Changed
[files modified, lines changed, behavior delta]

### Evidence
[actual command output -- pass counts, lint results, build output]

### Why
[rationale for key decisions]

---
Task: $ARGUMENTS
