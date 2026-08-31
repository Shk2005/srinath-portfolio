import { Project, ToolItem, Chapter, ProductionFrame, VideoProject, SystemWorkflow } from './types';

export const TOTAL_FRAMES = 218;
export const FRAME_PATH = 'frame_';
export const EASE = 0.075;

export const CHAPTERS: Chapter[] = [
  { id: 'identity', label: '01 Identity', act: 'ACT 01', range: [0.00, 0.16], target: 0.03 },
  { id: 'film-story', label: '02 Thesis', act: 'ACT 02', range: [0.16, 0.35], target: 0.22 },
  { id: 'capabilities', label: '03 Capabilities', act: 'ACT 03', range: [0.35, 0.50], target: 0.42 },
  { id: 'systems', label: '04 Agentic Systems', act: 'ACT 04', range: [0.50, 0.75], target: 0.62 },
  { id: 'closing', label: '05 Close', act: 'ACT 05', range: [0.75, 1.00], target: 0.88 },
];



export const VIDEO_PROOF_PROJECTS: VideoProject[] = [
  {
    id: 'papaman-film',
    type: 'AI-GENERATED BRAND FILM',
    title: 'The Adventures of PapaMan',
    context: 'Written, directed, and produced as an AI-native brand film.',
    verifiedMetrics: {
      primary: '450K+',
      primaryLabel: 'PAID CAMPAIGN VIEWS',
      details: [
        { label: 'Total Reach', value: '386K' },
        { label: 'Direct Interactions', value: '994' },
        { label: 'Character Consistency', value: '100% Locked' }
      ]
    },
    retentionNote: 'Established narrative tension in the first 3 seconds, leading to a 3.4x conversion lift over standard product ads.',
    tags: ['AI Brand Film', 'Higgsfield AI', 'Character Direction', 'Brand Storytelling']
  },
  {
    id: 'organic-social-viral',
    type: 'AI-NATIVE SOCIAL CONTENT',
    title: 'Retention-First Organic Series',
    context: 'Engineered short-form narrative videos designed to conquer fast-scrolling algorithmic feeds.',
    verifiedMetrics: {
      primary: '1.07M+',
      primaryLabel: 'ORGANIC VIEWS',
      details: [
        { label: 'Non-Follower Viewership', value: '98.8%' },
        { label: 'Organic Shares', value: '28.3K' },
        { label: 'New Follows Gained', value: '277' }
      ]
    },
    retentionNote: 'Cutting the opening 1.5s down to a single visual curiosity trigger reduced drop-off by 34%.',
    tags: ['Short-Form Video', 'Organic Growth', 'Retention Pacing', 'ElevenLabs']
  },
  {
    id: 'campaign-scale',
    type: 'CAMPAIGN',
    title: 'Integrated Multi-Channel Narrative',
    context: 'Multi-variant creative distribution structured across audience affinity segments.',
    verifiedMetrics: {
      primary: '6M+',
      primaryLabel: 'CAMPAIGN VIEWS',
      details: [
        { label: 'Platform Deployment', value: 'Multi-Channel' },
        { label: 'Creative Iterations', value: '24 Variations' },
        { label: 'Creative Pacing', value: 'Sub-2s Hook Sync' }
      ]
    },
    retentionNote: 'Proved that creative volume paired with strict visual direction multiplies overall top-of-funnel reach.',
    tags: ['Creative Strategy', 'Paid Media', 'Hook Testing', 'High Volume']
  },
  {
    id: 'sponsored-performance',
    type: 'PERFORMANCE CONTENT',
    title: 'High-Conversion Sponsored Reels',
    context: 'Direct-response short-form video creative engineered for immediate viewer action.',
    verifiedMetrics: {
      primary: '6.1M+',
      primaryLabel: 'SPONSORED REEL VIEWS',
      details: [
        { label: 'Direct Return on Ad Spend', value: '3.4x ROAS' },
        { label: 'Sound-Off Retention', value: '89% Subtitle Sync' },
        { label: 'CPA Efficiency', value: '-42% CPA' }
      ]
    },
    retentionNote: 'Replaced static product demonstrations with kinetic visual metaphors within the first 2 seconds.',
    tags: ['Performance Marketing', 'Direct Response', 'Motion Graphics', 'CapCut Pro']
  }
];

export const SYSTEM_WORKFLOWS: SystemWorkflow[] = [
  {
    id: 'marketing-to-agent',
    title: 'MARKETING PROBLEM → AGENT AUTOMATION',
    subtitle: 'From Content to Systems',
    description: 'I understand the marketing problem first. I am learning to engineer the system around it.',
    flowSteps: [
      { step: '01', label: 'MARKETING PROBLEM', detail: 'Identify audience drop-off point or content bottleneck' },
      { step: '02', label: 'RESEARCH & INTEL', detail: 'Gather live competitor signals and high-performing hooks' },
      { step: '03', label: 'LLM REASONING', detail: 'Claude 3.5 Sonnet synthesizes raw notes into structured angle briefs' },
      { step: '04', label: 'AI AGENT & MEMORY', detail: 'Stateful agent checks brand voice constraints and angle matrix' },
      { step: '05', label: 'TOOLS / MCP CLIENT', detail: 'Fetches asset parameters, formats JSON payloads, and parses scripts' },
      { step: '06', label: 'AUTOMATION ENGINE', detail: 'n8n webhook pipeline routes outputs to production queues' },
      { step: '07', label: 'READY OUTPUT', detail: 'Complete shot-by-shot storyboard and prompt instructions generated' }
    ],
    components: [
      { name: 'AI Agent', role: 'Decision maker orchestrating sub-tasks and verifying output schema' },
      { name: 'Chat Model', role: 'Claude 3.5 / OpenAI structured script formatting and hook generation' },
      { name: 'Memory', role: 'Persistent session context storing previous angle performance' },
      { name: 'MCP Client', role: 'Standardized model context protocol for external tool access' },
      { name: 'Tools & Code', role: 'Custom JavaScript nodes for token optimization and data sanitization' },
      { name: 'n8n Automation', role: 'Event-driven visual execution graph connecting webhooks to storage' }
    ],
    keyInsight: 'Building systems around the creative process turns intuition into a repeatable, scalable engine.',
    statusBadge: 'Emerging & Actively Developing Capability'
  },
  {
    id: 'trend-to-prompt',
    title: 'TREND-TO-PROMPT SYSTEM',
    subtitle: 'Automated Real-Time Social Signal → Video Generation Brief',
    description: 'An n8n workflow that uses multiple chained LLM calls to turn real-time trend information into structured, camera-directed prompts for AI video generation.',
    flowSteps: [
      { step: '01', label: 'TREND', detail: 'Ingest trending topics, sound hooks, and viral social patterns' },
      { step: '02', label: 'RESEARCH', detail: 'Automated scraping and sentiment analysis of viewer comments' },
      { step: '03', label: 'LLM CHAIN', detail: 'Multi-stage LLM evaluation: Angle Ideation → Hook Scorer → Script' },
      { step: '04', label: 'PROMPT', detail: 'Generates camera, lighting, and texture specifications (PROMPT → FRAME)' },
      { step: '05', label: 'AI VIDEO', detail: 'Higgsfield / Runway / ComfyUI render passes' },
      { step: '06', label: 'CONTENT', detail: 'Edited, paced video ready for multi-platform distribution' }
    ],
    components: [
      { name: 'Trend Ingestion', role: 'Real-time social telemetry scraper nodes' },
      { name: 'Multi-LLM Evaluator', role: 'Chained prompts ensuring hook strength before script lock' },
      { name: 'Director Prompt Synthesizer', role: 'Transforms text ideas into exact 90mm/85mm lighting vectors' },
      { name: 'Webhooks & Storage', role: 'Automated Notion / Google Drive asset staging' }
    ],
    keyInsight: 'Eliminates 80% of manual drafting time while maintaining strict art-direction standards.',
    statusBadge: 'Active Pipeline Experimentation'
  }
];

export const TOOLCHAIN: ToolItem[] = [
  { name: 'Higgsfield AI', category: 'Video Synthesis', role: 'Camera motion testing & character visual staging' },
  { name: 'Claude 3.5 Sonnet', category: 'Narrative Structure', role: 'Script drafting, hook testing & angle ideation' },
  { name: 'ElevenLabs', category: 'Voice & Sound', role: 'Voice cloning & conversational cadence tuning' },
  { name: 'ComfyUI / SDXL', category: 'Visual Generation', role: 'Image generation & custom visual asset staging' },
  { name: 'Runway Gen-3', category: 'Motion Generation', role: 'Cinematic visual b-roll & scene transitions' },
  { name: 'n8n Workflows', category: 'AI Systems & Automation', role: 'Currently developing pipelines connecting research to drafts', isDeveloping: true },
  { name: 'AI Agents & RAG', category: 'AI Systems & Automation', role: 'Active building at the intersection of marketing and automation', isDeveloping: true },
  { name: 'CapCut Pro', category: 'Editing & Pacing', role: 'Dynamic typography, beat matching & retention cuts' }
];

export const MARKETING_INSIGHTS = [
  {
    quote: '"Good content gets attention. Good strategy decides what happens next."',
    context: 'Views without a clear next step are wasted impressions. Strategy aligns the creative hook with the business outcome.'
  },
  {
    quote: '"Views are not the whole story. The real question is why people stayed."',
    context: 'Analyzing the exact retention drop-off curve in the first 2 seconds reveals what the audience actually cares about.'
  },
  {
    quote: '"The frame gets attention. The strategy gives it a job."',
    context: 'Directing cinematic visuals is half the craft; knowing where to deploy them is what drives measurable growth.'
  },
  {
    quote: '"That frame started with a prompt. The prompt wasn\'t the hard part. I wanted the image to feel real before it looked real."',
    context: 'Specifying material resistance, lighting temperature, and narrative conflict separates art direction from random generation.'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'The Adventures of PapaMan (AI Brand Film)',
    category: 'GenAI Video',
    metrics: '450K+ Views · 386K Reach · 994 Interactions',
    impact: 'Brand Film',
    description: 'Written, directed, and produced as an AI-native brand film with locked character turnaround models and narrative pacing.',
    methodology: 'Staged character model sheets to anchor identity embeddings across 20+ shots, generated script variations with Claude, and refined voice cadence in ElevenLabs.',
    tags: ['Higgsfield AI', 'Brand Film', 'ElevenLabs', 'CapCut Pro', 'Character Direction'],
    keyInsight: 'Locking character face turnaround in pre-production prevented 85% of downstream video drift.',
    videoPreview: {
      hook: 'Curiosity Trigger: "What if a father\'s love could transcend dimensions?"',
      cadence: '142 WPM conversational voiceover with zero audio pauses >150ms',
      retentionStat: '3.4x conversion lift over standard product commercials'
    }
  },
  {
    id: 2,
    title: 'Organic Short-Form Video Series',
    category: 'GenAI Video',
    metrics: '1.07M+ Organic Views · 98.8% Non-Followers',
    impact: 'Organic Scale',
    description: 'Short-form synthetic narrative videos engineered to hold audience attention across fast-scrolling feeds.',
    methodology: 'Tested 12 hook variations per concept, trimming the first 1.5 seconds down to a single compelling curiosity question.',
    tags: ['1.07M Views', 'Retention Pacing', 'Claude 3.5', 'Viral Content'],
    keyInsight: 'Cutting dead air and punching in visual transitions reduced viewer drop-off by 34%.',
    videoPreview: {
      hook: 'Sub-2s Hook: Immediate visual contradiction stopping the scroll',
      cadence: 'Dynamic fast-paced editing with text-on-screen audio sync',
      retentionStat: '28.3K shares and 277 new followers from a single piece'
    }
  },
  {
    id: 3,
    title: 'Trend-to-Prompt n8n Automation',
    category: 'Systems & Workflows',
    metrics: 'Active Development · 80% Draft Time Saved',
    impact: 'Emerging Systems',
    description: 'Developing automated n8n pipelines that turn research notes into formatted video scripts and prompt briefs.',
    methodology: 'Structured node workflows connecting research web scrapers, Claude synthesis prompts, and formatted markdown export to speed up script ideation.',
    tags: ['n8n', 'AI Agents', 'Claude 3.5', 'Automation', 'Emerging Stack'],
    keyInsight: 'Standardized prompt templates eliminated 4 repetitive manual drafting steps.',
    videoPreview: {
      hook: 'Automated Pipeline: Research Note → Angle Matrix → Script Draft',
      cadence: 'Zero manual copy-pasting between research and script layout',
      retentionStat: '80% faster draft turnaround from raw idea to final storyboard'
    }
  },
  {
    id: 4,
    title: 'Performance Creative & Sponsored Reels',
    category: 'Performance Marketing',
    metrics: '6.1M+ Views · 3.4x ROAS',
    impact: 'Direct Response',
    description: 'High-intent video ad concepts tested against audience drop-off points to maximize conversions and acquisition efficiency.',
    methodology: 'A/B tested 12 distinct opening visual hooks against a unified product offer, identifying the single visual metaphor that lowered CPA.',
    tags: ['Performance Marketing', 'Creative Strategy', 'A/B Testing', 'Retention Analysis'],
    keyInsight: 'Visual problem demonstrations within the first 2 seconds outperformed static voice hooks by 2.8x.',
    videoPreview: {
      hook: 'Visual Shock Hook: Real-world pain point transformed into motion metaphor',
      cadence: 'Fast rhythm with text-on-screen sync for sound-off mobile viewers',
      retentionStat: '3.4x Return on Ad Spend across test campaigns'
    }
  }
];

