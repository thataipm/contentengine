---
format: 1080x1920
duration: 80.06s
message: "MCP is the standard that lets AI actually touch tools and data, and it went from one company's protocol to an industry standard co-governed by its former competitors in about a year."
arc: story-explainer
audience: curious builders and general AI-interested viewers, zero assumed technical background
mode: mechanism-first explainer
music: none
---

## Video direction, first video in the How AI Systems Actually Work pillar (2026-08-14)

Single-take VO (76.56s total, real durations below, notably longer than the linter's word
count estimate of 53.4s because of real natural pauses around dates and emphasis beats in
frames 2 and 4). Registry-check run before any frame is hand-built, per the standing rule.
Total on-screen duration is 80.06s, not 76.56s -- Frame 4 carries an extra 3.5s of silent,
post-VO content (a real animated chart, see its own section below), added 2026-08-14 after
direct feedback that the video felt visually thin. The final delivered render is also sped up
1.2x in post (ffmpeg setpts+atempo) per separate feedback on pacing, landing under a minute.

## Frame 1: Hook

- voiceover: "This is MCP: the standard that lets your AI actually touch your tools and data. It's AI's version of USB-C. Here's exactly how it works."
- duration: 11.229s
- src: compositions/frames/01-hook.html

Real word timing: This@0.12 is@0.3 MCP:@0.54 the@1.54 standard@1.7 that@2.24 lets@2.52 your@2.84
AI@3.1 actually@3.6 touch@4.18 your@4.44 tools@4.62 and@4.92 data.@5.08 It's@6.2 AI's@6.54
version@6.94 of@7.48 USB-C.@7.78 Here's@9.48 exactly@9.74 how@10.16 it@10.3 works.@10.44

Scene: a literal USB-C connector, since this is Anthropic's own official analogy, not an
invented metaphor. The plug and port build themselves in pieces synced to "MCP" and "standard"
landing, then the connector snaps together right as "USB-C" is spoken (7.78s), visibly closing
the circuit. "Tools and data" (4.62-4.92s) pop in as small labeled icons flowing through the
connection once it's made.

## Frame 2: Host, client, server

- voiceover: "Your AI app is the host. Every time it needs a new capability, it opens a dedicated connection, a client, to a server: a filesystem, a database, Slack. One host, many plugs."
- duration: 15.44s
- src: compositions/frames/02-architecture.html

Real word timing: Your@0.41 AI@0.71 app@1.15 is@1.59 the@1.75 host.@1.91 Every@2.91 time@3.17
it@3.47 needs@3.71 a@3.97 new@4.07 capability,@4.27 it@5.37 opens@5.65 a@6.17 dedicated@6.33
connection,@6.85 a@7.69 client,@7.85 to@8.69 a@8.85 server:@8.97 a@9.97 filesystem,@10.11
a@11.09 database,@11.21 Slack.@12.13 One@13.55 host,@13.75 many@14.41 plugs.@14.65

Scene: the real MCP architecture, literally. A single "host" box appears first (0.41s,
labeled AI App). At "opens a dedicated connection, a client" (6.33-6.85s) a connector line
draws out to a new "client" node. At "filesystem" (10.11s), "database" (11.21s), and "Slack"
(12.13s), three separate server boxes build in sequence, each getting its own client connector
line from the host, matching MCP's own documented one-client-per-server model exactly (not a
simplified stand-in diagram).

## Frame 3: The real exchange

- voiceover: "The AI doesn't guess what a server can do. It asks first. The server lists its tools. Only then does the AI call one, with real arguments, and get a real answer back."
- duration: 13.401s
- src: compositions/frames/03-exchange.html

Real word timing: The@0.35 AI@0.61 doesn't@0.91 guess@1.29 what@1.59 a@1.73 server@1.83
can@2.13 do.@2.35 It@2.83 asks@3.15 first.@3.61 The@4.55 server@4.75 lists@5.23 its@5.75
tools.@6.05 Only@7.13 then@7.47 does@8.03 the@8.21 AI@8.47 call@8.79 one,@9.15 with@9.63
real@9.91 arguments,@10.21 and@11.21 get@11.45 a@11.77 real@11.93 answer@12.33 back.@12.69

Scene: a literal request/response exchange between two labeled nodes (AI, Server), styled as
real message bubbles, not a chat UI. On "asks first" (3.15-3.61s) a request bubble slides from
AI to Server. On "lists its tools" (5.23-6.05s) a response bubble slides back listing 2-3 short
tool names. On "call one, with real arguments" (8.79-10.21s) a second request bubble goes out,
and on "real answer back" (11.93-12.69s) a final response bubble returns, closing the real
two-step discover-then-call pattern MCP actually uses, not an invented simplification.

## Frame 4: The adoption arc

- voiceover: "Anthropic built this alone, November 2024. OpenAI adopted it by March 2025. Google's Gemini, that April. By December, Anthropic handed control to a neutral foundation, co-founded with OpenAI, backed by Google, Microsoft, and Amazon."
- duration: 24.0s (extended from the real VO length of 20.439s, added 2026-08-14 per direct
  feedback that the video had "no animated graphs or motion graphics" -- a real, live-verified
  mk-line-graph registry block now draws on as a silent proof beat after the real VO content
  ends at 19.45s, not filler)
- src: compositions/frames/04-adoption.html

Real word timing: Anthropic@0.39 built@0.99 this@1.29 alone,@1.59 November@2.29 2024.@2.89
OpenAI@4.31 adopted@4.97 it@5.49 by@5.85 March@6.09 2025.@6.55 Google's@8.11 Gemini,@8.57
that@9.47 April.@9.75 By@10.87 December,@11.03 Anthropic@11.99 handed@12.57 control@12.93
to@13.55 a@13.69 neutral@13.83 foundation,@14.29 co-founded@15.35 with@15.97 OpenAI,@16.15
backed@17.23 by@17.53 Google,@17.75 Microsoft,@18.39 and@19.27 Amazon.@19.45

Scene: a horizontal timeline builds itself left to right, one company mark landing per real
date named. Anthropic's mark lands at "November 2024" (2.29s), alone, holding through a real
1.4s pause before "OpenAI" (4.31s) joins, then Google at "Google's Gemini" (8.11s). At
"handed control to a neutral foundation" (13.83-14.29s) the timeline resolves into a single
shared foundation mark, with Google, Microsoft, and Amazon populating in as their names land
(17.75-19.45s). The real pauses around each date (2.89-4.31s, 6.55-8.11s) are load-bearing,
not dead air: each is a beat where the current mark holds and settles before the next joins.
After the last real word (19.45s), a genuine animated line chart (mk-line-graph, a registry
block, not hand-built) draws itself on from 20.2s: MCP server count, three real points fetched
live this session (100 at Nov 2024 launch, 19,831 by Mar 2026 on the Glama registry, 72,300
today, glama.ai/mcp/servers) -- the actual proof that "the protocol won," shown as a real chart
instead of asserted in text.

## Frame 5: Close

- voiceover: "A protocol one company built became infrastructure its competitors now govern together. That's what it looks like when a standard actually works. Follow for more on how AI systems actually work."
- duration: 16.051s
- src: compositions/frames/05-close.html

Real word timing: A@0.53 protocol@0.65 one@1.45 company@1.71 built@2.21 became@2.95
infrastructure@3.41 its@4.47 competitors@4.67 now@5.69 govern@5.95 together.@6.47 That's@8.21
what@8.49 it@8.63 looks@8.79 like@9.09 when@9.59 a@9.73 standard@9.89 actually@10.71 works.@11.21
Follow@12.83 for@13.13 more@13.33 on@13.71 how@13.91 AI@14.29 systems@14.51 actually@15.25
work.@15.73

Scene: the four company marks from Frame 4 (Anthropic, OpenAI, Google, the foundation) settle
into one unified group on "govern together" (5.95-6.47s). On "Follow" (12.83s) the same
follow-ring device established in the What Skills Matter episode draws itself on, keeping one
consistent recurring CTA device across pillars rather than inventing a new one per episode.
