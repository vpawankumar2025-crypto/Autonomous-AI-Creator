# CyberForge — Autonomous AI Creator

ABTalks Hackathon · Problem Statement 3

CyberForge is an autonomous AI security persona. After one initialization call it discovers live AI/technology topics from RSS sources, scores them using editorial rules, rejects weak or repetitive candidates, generates a post, records the decision and sources, remembers previous publications, and repeats on a server-side schedule.

## Required API

### Initialize
`POST /api/agent/init`

Request:
```json
{"persona":{"name":"Ada","domain":"AI Security"}}
```

Response:
```json
{"agentId":"agent_..."}
```

### Feed
`GET /api/agent/feed?agentId=...`

Response:
```json
{"posts":[{"id":"p_...","createdAt":"2026-08-08T10:30:00.000Z","text":"...","rationale":"...","sources":["https://..."]}]}
```

Posts are newest first and are retained in `.data/state.json`.

## Autonomy

The server starts a background publishing cycle 15 seconds after boot and then runs every `PUBLISH_INTERVAL_MINUTES` (default 30). It discovers topics from live RSS sources, applies an editorial threshold, checks memory for duplicates, and publishes only a selected topic. The first initialization also starts a cycle without requiring another user prompt.

For stronger writing, set `GEMINI_API_KEY`. Without it, the application still runs using a deterministic editorial fallback, so the evaluator can exercise the API without a paid model dependency.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Environment variables

See `.env.example`.

- `PORT`
- `PUBLISH_INTERVAL_MINUTES`
- `MIN_TOPIC_SCORE`
- `GEMINI_API_KEY` (optional)
- `GEMINI_MODEL` (optional)

## Deployment

Deploy this as a long-running Node.js web service, not a static site or a serverless-only function, because the autonomous scheduler must remain alive between evaluator requests. Render, Railway, Fly.io, or another persistent Node host can run `npm start`.

Set the environment variables in the host dashboard. For a hackathon demo, a 30-minute interval is a sensible default; the evaluator can call the feed repeatedly and see retained history plus newly generated posts.

## Design decisions

1. Live information: multiple public RSS sources are queried.
2. Editorial judgment: relevance, freshness, content quality, and repetition affect the score.
3. Persona consistency: one stable identity, interests, audience and voice are applied to every post.
4. Memory: prior source titles are retained and used to reject repeats.
5. Autonomous publishing: a background loop runs after initialization without additional prompts.
6. Transparency: every post includes a selection rationale and source URL.

## Important evaluation note

The challenge's external Technical Specification is not included in the problem-statement file supplied with this project. The implementation therefore follows the two API contracts explicitly printed in the supplied problem statement and should be checked against the organizer's separate Technical Specification before final submission if that file is available.
