# SCRIPT: mcp-the-usb-c-standard-for-ai

**STATUS: DRAFT 2, in review** (draft 1 hook restructured per direct feedback: "we should tell
what video is about followed by verbal hook," since the USB-C analogy was doing hook duty
before the topic was clearly named. Fixed by leading with a direct topic statement, then the
analogy as reinforcement, not the other way around. User confirmed "Now better," 2026-08-14.)

**Pillar**: How AI Systems Actually Work (Pillar 3 of the 3-pillar test, opened 2026-08-14).
First video in this pillar. See `docs/experiment_log.md` Batch 4 for the full Quality Gate.

**Voice**: existing ElevenLabs voice (`ELEVENLABS_VOICE_ID` in `.env`), not yet generated for
this draft.

**Sources** (all fetched directly this session, not from memory): Anthropic's MCP announcement
(anthropic.com/news/model-context-protocol, Nov 25 2024), the official architecture docs
(modelcontextprotocol.io/docs/2026-07-28/learn/architecture), and Anthropic's foundation
donation announcement (anthropic.com/news/donating-the-model-context-protocol-and-establishing-
of-the-agentic-ai-foundation, Dec 9 2025). Full citation detail in the Quality Gate entry.

## Line 1: Hook (Frame 1)

    This is MCP: the standard that lets your AI actually touch your tools and data. It's AI's version of USB-C. Here's exactly how it works.

## Line 2: Host, client, server (Frame 2)

    Your AI app is the host. Every time it needs a new capability, it opens a dedicated connection, a client, to a server: a filesystem, a database, Slack. One host, many plugs.

## Line 3: The real exchange (Frame 3)

    The AI doesn't guess what a server can do. It asks first. The server lists its tools. Only then does the AI call one, with real arguments, and get a real answer back.

## Line 4: The adoption arc (Frame 4)

    Anthropic built this alone, November 2024. OpenAI adopted it by March 2025. Google's Gemini, that April. By December, Anthropic handed control to a neutral foundation, co-founded with OpenAI, backed by Google, Microsoft, and Amazon.

## Line 5: Close (Frame 5)

    A protocol one company built became infrastructure its competitors now govern together. That's what it looks like when a standard actually works. Follow for more on how AI systems actually work.
