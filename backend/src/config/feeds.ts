import type { FeedConfig } from '../types.js'

export const FEEDS: FeedConfig[] = [
  // ── AI ──────────────────────────────────────────────────────────────────
  { name: 'HuggingFace Blog',      url: 'https://huggingface.co/blog/feed.xml',                                        category: 'ai',       pollInterval: 10 },
  { name: 'OpenAI News',           url: 'https://openai.com/news/rss.xml',                                             category: 'ai',       pollInterval: 10 },
  { name: 'Google DeepMind',       url: 'https://deepmind.google/discover/blog/rss/',                                  category: 'ai',       pollInterval: 10 },
  { name: 'Google AI Research',    url: 'https://research.google/blog/rss/',                                           category: 'ai',       pollInterval: 10 },
  { name: 'Meta AI Blog',          url: 'https://ai.meta.com/blog/rss/',                                               category: 'ai',       pollInterval: 10 },
  { name: 'MIT Tech Review AI',    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',        category: 'ai',       pollInterval: 10 },
  { name: 'The Verge – AI',        url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',          category: 'ai',       pollInterval: 10 },
  { name: 'Wired – AI',            url: 'https://www.wired.com/feed/tag/ai/latest/rss',                               category: 'ai',       pollInterval: 10 },
  { name: 'MarkTechPost',          url: 'https://www.marktechpost.com/feed/',                                          category: 'ai',       pollInterval: 10 },
  { name: 'Unite.AI',              url: 'https://www.unite.ai/feed/',                                                  category: 'ai',       pollInterval: 10 },
  { name: 'VentureBeat AI',        url: 'https://venturebeat.com/category/ai/feed/',                                   category: 'ai',       pollInterval: 10 },

  // ── TECH ────────────────────────────────────────────────────────────────
  { name: 'Hacker News',           url: 'https://news.ycombinator.com/rss',                                           category: 'tech',     pollInterval: 15 },
  { name: 'TechCrunch',            url: 'https://techcrunch.com/feed/',                                               category: 'tech',     pollInterval: 15 },
  { name: 'The Verge',             url: 'https://www.theverge.com/rss/index.xml',                                     category: 'tech',     pollInterval: 15 },
  { name: 'Ars Technica',          url: 'https://feeds.arstechnica.com/arstechnica/index/',                           category: 'tech',     pollInterval: 15 },
  { name: 'Wired',                 url: 'https://www.wired.com/feed/rss',                                             category: 'tech',     pollInterval: 15 },
  { name: 'The New Stack',         url: 'https://thenewstack.io/feed/',                                               category: 'tech',     pollInterval: 15 },
  { name: 'InfoQ',                 url: 'https://feed.infoq.com/',                                                    category: 'tech',     pollInterval: 15 },
  { name: 'Changelog News',        url: 'https://changelog.com/news/feed',                                            category: 'tech',     pollInterval: 15 },
  { name: 'Fast Company Tech',     url: 'https://www.fastcompany.com/technology/rss',                                 category: 'tech',     pollInterval: 15 },

  // ── DEV ─────────────────────────────────────────────────────────────────
  { name: 'JavaScript Weekly',     url: 'https://javascriptweekly.com/rss/',                                          category: 'dev',      pollInterval: 60 },
  { name: 'Node Weekly',           url: 'https://nodeweekly.com/rss/',                                                category: 'dev',      pollInterval: 60 },
  { name: 'React Status',          url: 'https://react.statuscode.com/rss/',                                          category: 'dev',      pollInterval: 60 },
  { name: 'Frontend Focus',        url: 'https://frontendfoc.us/rss/',                                                category: 'dev',      pollInterval: 60 },
  { name: 'Bytes.dev',             url: 'https://bytes.dev/rss.xml',                                                  category: 'dev',      pollInterval: 60 },
  { name: 'Changelog Weekly',      url: 'https://changelog.com/weekly/feed',                                          category: 'dev',      pollInterval: 60 },
  { name: 'CSS-Tricks',            url: 'https://css-tricks.com/feed/',                                               category: 'dev',      pollInterval: 15 },
  { name: 'Smashing Magazine',     url: 'https://www.smashingmagazine.com/feed/',                                     category: 'dev',      pollInterval: 15 },
  {
    name: 'Dev.to',
    url: 'https://dev.to/feed/',
    category: 'dev',
    pollInterval: 15,
    tags: ['javascript', 'typescript', 'react', 'node', 'python', 'webdev', 'devops', 'docker', 'kubernetes', 'programming', 'opensource', 'ai', 'ml', 'machinelearning', 'security', 'rust', 'go'],
  },
  { name: 'TypeScript Blog',       url: 'https://devblogs.microsoft.com/typescript/feed/',                            category: 'dev',      pollInterval: 15 },
  { name: 'GitHub Blog',           url: 'https://github.blog/feed/',                                                  category: 'dev',      pollInterval: 15 },
  { name: 'Node.js Official',      url: 'https://nodejs.github.io/nodejs-news-feeder/feed.xml',                      category: 'dev',      pollInterval: 60 },
  { name: 'Deno Blog',             url: 'https://deno.com/feed',                                                     category: 'dev',      pollInterval: 60 },
  { name: 'Bun Blog',              url: 'https://bun.sh/blog/rss',                                                   category: 'dev',      pollInterval: 60 },
  { name: 'Rust Blog',             url: 'https://blog.rust-lang.org/feed.xml',                                       category: 'dev',      pollInterval: 60 },
  { name: 'Go Blog',               url: 'https://go.dev/blog/feed.atom',                                             category: 'dev',      pollInterval: 60 },
  { name: 'Python Insider',        url: 'https://feeds.feedburner.com/PythonInsider',                                 category: 'dev',      pollInterval: 60 },
  { name: 'Cloudflare Blog',       url: 'https://blog.cloudflare.com/rss/',                                          category: 'dev',      pollInterval: 15 },
  { name: 'Vercel Blog',           url: 'https://vercel.com/blog/rss.xml',                                           category: 'dev',      pollInterval: 15 },
  { name: 'Netlify Blog',          url: 'https://www.netlify.com/blog/index.xml',                                    category: 'dev',      pollInterval: 15 },

  // ── SECURITY ────────────────────────────────────────────────────────────
  { name: 'CVEFeed High+Critical', url: 'https://cvefeed.io/rssfeed/severity/high.xml',                              category: 'security', pollInterval: 5,  isCveFeed: true },
  { name: 'CVEFeed Cyber News',    url: 'https://cvefeed.io/rssfeed/news.xml',                                       category: 'security', pollInterval: 10 },
  { name: 'CISA Advisories',       url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',                     category: 'security', pollInterval: 10 },
  { name: 'Krebs on Security',     url: 'https://krebsonsecurity.com/feed/',                                         category: 'security', pollInterval: 10 },
  { name: 'Schneier on Security',  url: 'https://www.schneier.com/blog/atom.xml',                                    category: 'security', pollInterval: 10 },
  { name: 'The Hacker News',       url: 'https://feeds.feedburner.com/TheHackersNews',                               category: 'security', pollInterval: 10 },
  { name: 'BleepingComputer',      url: 'https://www.bleepingcomputer.com/feed/',                                    category: 'security', pollInterval: 10 },
  { name: 'Dark Reading',          url: 'https://www.darkreading.com/rss.xml',                                       category: 'security', pollInterval: 10 },
  { name: 'SecurityWeek',          url: 'https://feeds.feedburner.com/Securityweek',                                 category: 'security', pollInterval: 10 },
  { name: 'Sophos Naked Security', url: 'https://news.sophos.com/en-us/category/naked-security/feed/',               category: 'security', pollInterval: 10 },
  { name: 'Exploit-DB',            url: 'https://www.exploit-db.com/rss.xml',                                        category: 'security', pollInterval: 10 },

  // ── CLOUD ───────────────────────────────────────────────────────────────
  { name: 'AWS News',              url: 'https://aws.amazon.com/blogs/aws/feed/',                                     category: 'cloud',    pollInterval: 5 },
  { name: 'Azure Blog',            url: 'https://azure.microsoft.com/en-us/blog/feed/',                              category: 'cloud',    pollInterval: 5 },
  { name: 'Kubernetes Blog',       url: 'https://kubernetes.io/feed.xml',                                            category: 'cloud',    pollInterval: 5 },
  { name: 'Docker Blog',           url: 'https://www.docker.com/blog/feed/',                                         category: 'cloud',    pollInterval: 5 },
  { name: 'HashiCorp Blog',        url: 'https://www.hashicorp.com/blog/feed.xml',                                   category: 'cloud',    pollInterval: 5 },

  // ── WORLD ───────────────────────────────────────────────────────────────
  { name: 'Sky News – Home',       url: 'https://feeds.skynews.com/feeds/rss/home.xml',       category: 'world', pollInterval: 5 },
  { name: 'Sky News – World',      url: 'https://feeds.skynews.com/feeds/rss/world.xml',      category: 'world', pollInterval: 5 },
  { name: 'Sky News – Business',   url: 'https://feeds.skynews.com/feeds/rss/business.xml',  category: 'world', pollInterval: 5 },
  { name: 'Sky News – Technology', url: 'https://feeds.skynews.com/feeds/rss/technology.xml', category: 'world', pollInterval: 5 },
  { name: 'Sky News – US',         url: 'https://feeds.skynews.com/feeds/rss/us.xml',         category: 'world', pollInterval: 5 },
]
