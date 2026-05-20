// Run: node verify-feeds.mjs
// Tests all 56 RSS feeds and the Open-Meteo weather API.

const feeds = [
  // AI
  { n: 'HuggingFace Blog',       url: 'https://huggingface.co/blog/feed.xml',                                        cat: 'ai'       },
  { n: 'OpenAI News',            url: 'https://openai.com/news/rss.xml',                                             cat: 'ai'       },
  { n: 'Google DeepMind',        url: 'https://deepmind.google/discover/blog/rss/',                                  cat: 'ai'       },
  { n: 'Google AI Research',     url: 'https://research.google/blog/rss/',                                           cat: 'ai'       },
  { n: 'Meta AI Blog',           url: 'https://ai.meta.com/blog/rss/',                                               cat: 'ai'       },
  { n: 'MIT Tech Review AI',     url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',        cat: 'ai'       },
  { n: 'The Verge – AI',         url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',          cat: 'ai'       },
  { n: 'Wired – AI',             url: 'https://www.wired.com/feed/tag/ai/latest/rss',                               cat: 'ai'       },
  { n: 'MarkTechPost',           url: 'https://www.marktechpost.com/feed/',                                          cat: 'ai'       },
  { n: 'Unite.AI',               url: 'https://www.unite.ai/feed/',                                                  cat: 'ai'       },
  { n: 'VentureBeat AI',         url: 'https://venturebeat.com/category/ai/feed/',                                   cat: 'ai'       },
  // Tech
  { n: 'Hacker News',            url: 'https://news.ycombinator.com/rss',                                           cat: 'tech'     },
  { n: 'TechCrunch',             url: 'https://techcrunch.com/feed/',                                               cat: 'tech'     },
  { n: 'The Verge',              url: 'https://www.theverge.com/rss/index.xml',                                     cat: 'tech'     },
  { n: 'Ars Technica',           url: 'https://feeds.arstechnica.com/arstechnica/index/',                           cat: 'tech'     },
  { n: 'Wired',                  url: 'https://www.wired.com/feed/rss',                                             cat: 'tech'     },
  { n: 'The New Stack',          url: 'https://thenewstack.io/feed/',                                               cat: 'tech'     },
  { n: 'InfoQ',                  url: 'https://feed.infoq.com/',                                                    cat: 'tech'     },
  { n: 'Changelog News',         url: 'https://changelog.com/news/feed',                                            cat: 'tech'     },
  { n: 'Fast Company Tech',      url: 'https://www.fastcompany.com/technology/rss',                                 cat: 'tech'     },
  // Dev
  { n: 'JavaScript Weekly',      url: 'https://javascriptweekly.com/rss/',                                          cat: 'dev'      },
  { n: 'Node Weekly',            url: 'https://nodeweekly.com/rss/',                                                cat: 'dev'      },
  { n: 'React Status',           url: 'https://react.statuscode.com/rss/',                                          cat: 'dev'      },
  { n: 'Frontend Focus',         url: 'https://frontendfoc.us/rss/',                                                cat: 'dev'      },
  { n: 'Bytes.dev',              url: 'https://bytes.dev/rss.xml',                                                  cat: 'dev'      },
  { n: 'Changelog Weekly',       url: 'https://changelog.com/weekly/feed',                                          cat: 'dev'      },
  { n: 'CSS-Tricks',             url: 'https://css-tricks.com/feed/',                                               cat: 'dev'      },
  { n: 'Smashing Magazine',      url: 'https://www.smashingmagazine.com/feed/',                                     cat: 'dev'      },
  { n: 'Dev.to',                 url: 'https://dev.to/feed/',                                                       cat: 'dev'      },
  { n: 'TypeScript Blog',        url: 'https://devblogs.microsoft.com/typescript/feed/',                            cat: 'dev'      },
  { n: 'GitHub Blog',            url: 'https://github.blog/feed/',                                                  cat: 'dev'      },
  { n: 'Node.js Official',       url: 'https://nodejs.github.io/nodejs-news-feeder/feed.xml',                      cat: 'dev'      },
  { n: 'Deno Blog',              url: 'https://deno.com/feed',                                                      cat: 'dev'      },
  { n: 'Bun Blog',               url: 'https://bun.sh/blog/rss',                                                   cat: 'dev'      },
  { n: 'Rust Blog',              url: 'https://blog.rust-lang.org/feed.xml',                                        cat: 'dev'      },
  { n: 'Go Blog',                url: 'https://go.dev/blog/feed.atom',                                              cat: 'dev'      },
  { n: 'Python Insider',         url: 'https://feeds.feedburner.com/PythonInsider',                                 cat: 'dev'      },
  { n: 'Cloudflare Blog',        url: 'https://blog.cloudflare.com/rss/',                                           cat: 'dev'      },
  { n: 'Vercel Blog',            url: 'https://vercel.com/blog/rss.xml',                                            cat: 'dev'      },
  { n: 'Netlify Blog',           url: 'https://www.netlify.com/blog/index.xml',                                     cat: 'dev'      },
  // Security
  { n: 'CVEFeed High+Critical',  url: 'https://cvefeed.io/rssfeed/severity/high.xml',                              cat: 'security' },
  { n: 'CVEFeed Cyber News',     url: 'https://cvefeed.io/rssfeed/news.xml',                                       cat: 'security' },
  { n: 'CISA Advisories',        url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',                     cat: 'security' },
  { n: 'Krebs on Security',      url: 'https://krebsonsecurity.com/feed/',                                         cat: 'security' },
  { n: 'Schneier on Security',   url: 'https://www.schneier.com/blog/atom.xml',                                    cat: 'security' },
  { n: 'The Hacker News',        url: 'https://feeds.feedburner.com/TheHackersNews',                               cat: 'security' },
  { n: 'BleepingComputer',       url: 'https://www.bleepingcomputer.com/feed/',                                    cat: 'security' },
  { n: 'Dark Reading',           url: 'https://www.darkreading.com/rss.xml',                                       cat: 'security' },
  { n: 'SecurityWeek',           url: 'https://feeds.feedburner.com/Securityweek',                                 cat: 'security' },
  { n: 'Sophos Naked Security',  url: 'https://news.sophos.com/en-us/category/naked-security/feed/',               cat: 'security' },
  { n: 'Exploit-DB',             url: 'https://www.exploit-db.com/rss.xml',                                        cat: 'security' },
  // Cloud
  { n: 'AWS News',               url: 'https://aws.amazon.com/blogs/aws/feed/',                                    cat: 'cloud'    },
  { n: 'Azure Blog',             url: 'https://azure.microsoft.com/en-us/blog/feed/',                              cat: 'cloud'    },
  { n: 'Kubernetes Blog',        url: 'https://kubernetes.io/feed.xml',                                            cat: 'cloud'    },
  { n: 'Docker Blog',            url: 'https://www.docker.com/blog/feed/',                                         cat: 'cloud'    },
  { n: 'HashiCorp Blog',         url: 'https://www.hashicorp.com/blog/feed.xml',                                   cat: 'cloud'    },
]

const UA = 'TechNewsBoard/1.0 (RSS Aggregator; contact tech@shiftline.ai)'

const GREEN = '\x1b[32m'
const RED   = '\x1b[31m'
const YELLOW = '\x1b[33m'
const DIM   = '\x1b[2m'
const RESET = '\x1b[0m'

async function testFeed(f) {
  try {
    const r = await fetch(f.url, {
      headers: { 'User-Agent': UA, Accept: 'application/rss+xml,application/xml,text/xml,*/*' },
      signal: AbortSignal.timeout(12_000),
      redirect: 'follow',
    })
    const text = await r.text()
    const isXml = /(<rss|<feed|<channel|<\?xml)/i.test(text.slice(0, 500))
    const items = (text.match(/<item>|<entry>/gi) || []).length
    const ok = r.ok && isXml
    const catPad = f.cat.padEnd(8)
    if (ok) {
      console.log(`${GREEN}✅${RESET} [${catPad}] ${String(items).padStart(3)} items  ${f.n}`)
    } else {
      console.log(`${RED}❌${RESET} [${catPad}] ${r.status} ${r.statusText.padEnd(12)} ${f.n}`)
      if (r.ok && !isXml) {
        console.log(`${DIM}   → body: ${text.slice(0, 120).replace(/\n/g, ' ')}${RESET}`)
      }
    }
    return ok
  } catch (e) {
    const catPad = f.cat.padEnd(8)
    console.log(`${RED}❌${RESET} [${catPad}] ERROR              ${f.n} ${DIM}— ${e.message}${RESET}`)
    return false
  }
}

async function testWeather() {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=-33.9249&longitude=18.4241' +
    '&current=temperature_2m,weather_code,wind_speed_10m' +
    '&timezone=Africa/Johannesburg'
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8_000) })
    const d = await r.json()
    console.log(
      `${GREEN}✅${RESET} [weather ] Cape Town: ${d.current.temperature_2m}°C  ` +
      `code=${d.current.weather_code}  wind=${d.current.wind_speed_10m}km/h`
    )
    return true
  } catch (e) {
    console.log(`${RED}❌${RESET} [weather ] Open-Meteo failed — ${e.message}`)
    return false
  }
}

async function main() {
  console.log(`\nVerifying ${feeds.length} feeds + weather API...\n`)

  const results = await Promise.allSettled(feeds.map(testFeed))
  const passed = results.filter(r => r.status === 'fulfilled' && r.value).length
  const failed = feeds.length - passed

  console.log('\nWeather API:')
  await testWeather()

  console.log(`\n${'─'.repeat(55)}`)
  console.log(`${GREEN}Passed: ${passed}${RESET}  ${failed > 0 ? RED : DIM}Failed: ${failed}${RESET}  Total: ${feeds.length}`)
  if (failed > 0) {
    console.log(`${YELLOW}→ Remove or replace ❌ feeds in backend/src/config/feeds.ts before deploying.${RESET}`)
  }
  console.log()
}

main()
