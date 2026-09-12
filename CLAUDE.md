# CLAUDE.md

Guidance for Claude (and Claude Code) when working in this repository.

## Project overview

This repo implements a **web4.0** semantic digital-infrastructure layer for
agent-driven applications, with a concrete IoT telemetry use case.

Core execution model:

```
ROUTE -> INSTRUCT -> VERIFY -> RESULT
```

- **ROUTE** — inbound events (device telemetry, HTTP requests) are matched to
  a handler.
- **INSTRUCT** — an MCP (Model Context Protocol) tool membrane lets an AI
  agent fetch context (device RDF profile, recent readings) bounded by an
  MRH (Markov Relevancy Horizon), and decides what action to take.
- **VERIFY** — identity and trust checks run before any action is committed:
  LCT (Linked Context Token) for witnessed identity, T3/V3 for
  trust-in-competence / trust-in-value thresholds, and ATP/ADP for
  resource accounting.
- **RESULT** — the verified outcome is served (e.g. via `web4_get`-style
  responses) or the event is quarantined on failure.

See `iot-web4-pipeline.yaml` for a worked example of this flow applied to an
IoT temperature sensor event, and `webapi-model.yaml` for the corresponding
HTTP/OpenAPI surface.

## Repository layout

- `site/` — standalone dashboard (no build step, no external deps; served
  as static files).
- `Docs/` — protocol research and reference material (RDF vocab, LCT/T3V3/MRH
  definitions, ATP/ADP accounting rules).
- `Dockerfile`, `nginx.conf` — production static container with hardened
  security headers (CSP, permissions-policy, frame-ancestors).
- `iot-web4-pipeline.yaml` — sample config mapping an IoT event through
  ROUTE → INSTRUCT → VERIFY → RESULT.
- `webapi-model.yaml` — OpenAPI model for the device/telemetry HTTP surface.

## Running locally

```bash
# Dashboard only (no dependencies)
python3 -m http.server 8080 --directory site

# Full production-style container
docker build -t web4.0 .
docker run --rm -p 8080:80 web4.0
```

## Conventions for changes in this repo

- Keep `site/` dependency-free — no bundlers, no npm packages added there.
  If a feature needs a library, vendor a single static file into `site/`
  rather than introducing a package manager.
- Any new IoT device type or event kind should be reflected as:
  1. an RDF profile shape in `Docs/`,
  2. a route/instruct/verify/result mapping in a pipeline YAML,
  3. a corresponding path in `webapi-model.yaml`.
- Trust thresholds (`min_t3`, `min_v3`) and ATP costs are configuration,
  not code — change them in the pipeline YAML, not in handler logic.
- Security headers in `nginx.conf` should not be loosened without a stated
  reason in the commit message.

## What Claude should NOT assume

- There is no package manager or build step for `site/` — don't add one
  speculatively.
- MCP tool implementations referenced in pipeline configs (e.g.
  `fetch_device_profile`) are illustrative interfaces here, not yet wired to
  a real registry — treat them as a spec to implement, not existing code,
  unless you find the implementation in this repo.
