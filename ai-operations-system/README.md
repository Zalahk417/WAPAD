# AI Operations System v1

Owner-governed operating layer for reusable AI agents, skills, workflows and Inspector General oversight.

## Core principles
- Git-backed plain text is the canonical machine-readable source format.
- Notion is the human-facing command centre and native reusable-skill surface.
- Operating agents must not self-certify material work.
- Completion claims require inspectable evidence of target state.
- Authority is explicit: AUTONOMOUS, AUTO-WITH-LIMITS, OWNER APPROVAL, PROHIBITED.
- Inspector General reports directly to the Owner.
- Health states: GREEN 85–100, AMBER 70–84, RED below 70, BLACK for serious governance/security/privacy breach.

## Structure
- `00_governance/` constitution, authority and evidence rules
- `01_skills/` reusable skill specifications
- `02_agents/` accountable agent definitions
- `03_workflows/` orchestration between skills
- `04_tests/` regression and red-team scenarios
- `05_audit/` Inspector General standards and audit rules
- `06_schemas/` common machine-readable schemas

## Governance rule
A statement that work is complete is not sufficient evidence. The target system state, connector result, repository state, transaction/message identifier, or equivalent inspectable evidence must support completion claims.
