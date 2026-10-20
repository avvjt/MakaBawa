import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Clock3, Leaf, Search, Sparkles, UtensilsCrossed, Wine } from 'lucide-react'
import { categories, menuItems } from './data/menu'

function getIndiaTime() {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)
  return { hour, minute, total: hour * 60 + minute }
}

function getRecommendation(hour) {
  if (hour >= 5 && hour < 12) return 'breakfast'
  if (hour >= 12 && hour < 16) return 'lunch'
  if (hour >= 16 && hour < 19) return 'snacks'
  if (hour >= 19 || hour < 5) return 'dinner'
  return 'lunch'
}

function getGreeting(hour) {
  if (hour >= 5 && hour < 12) return { title: 'A beautiful morning.', sub: 'Start your day with something made fresh.', icon: '☀️' }
  if (hour >= 12 && hour < 16) return { title: 'Make lunch a moment.', sub: 'A good meal makes the day better.', icon: '☀️' }
  if (hour >= 16 && hour < 19) return { title: 'Ease into the evening.', sub: 'Small plates, good company, no rush.', icon: '🌤️' }
  return { title: 'Your evening, well served.', sub: 'Settle in. Your table is waiting.', icon: '🌙' }
}

function formatTime(hour, minute) {
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' })
    .format(new Date(Date.UTC(2020, 0, 1, hour, minute)))
}

function imageUrl(id, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

function MenuCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.35) }}
      className="menu-card group"
    >
      <div className="card-image-wrap">
        <img src={imageUrl(item.image, 850)} alt={item.name} className="card-image" loading={index > 2 ? 'lazy' : 'eager'} />
        <div className="image-vignette" />
        {item.tag && <span className="item-tag"><Sparkles size={12} /> {item.tag}</span>}
        <span className={`diet-dot ${item.veg ? 'is-veg' : 'is-nonveg'}`} title={item.veg ? 'Vegetarian sample item' : 'Non-vegetarian sample item'}>
          <span />
        </span>
        <button className="image-open" aria-label={`View ${item.name}`} onClick={() => window.dispatchEvent(new CustomEvent('open-menu-item', { detail: item }))}>
          <ArrowUpRight size={18} />
        </button>
      </div>
      <div className="card-copy">
        <div className="card-heading">
          <h3>{item.name}</h3>
          <span className="price">₹{item.price}</span>
        </div>
        <p>{item.description}</p>
      </div>
    </motion.article>
  )
}

function ItemModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="item-modal" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}>
            <img src={imageUrl(item.image, 1200)} alt={item.name} />
            <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
            <div className="modal-copy">
              <span className="eyebrow">{item.tag}</span>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="modal-bottom"><span>₹{item.price}</span><span className="demo-note">Sample menu item</span></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [clock, setClock] = useState(getIndiaTime)
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const timer = window.setInterval(() => setClock(getIndiaTime()), 30_000)
    const onOpen = (event) => setSelectedItem(event.detail)
    window.addEventListener('open-menu-item', onOpen)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('open-menu-item', onOpen)
    }
  }, [])

  const recommended = getRecommendation(clock.hour)
  const greeting = getGreeting(clock.hour)
  const chosenCategory = activeCategory || recommended
  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return menuItems.filter((item) => {
      const matchesCategory = item.category === chosenCategory
      const matchesSearch = !query || `${item.name} ${item.description} ${item.tag}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [chosenCategory, search])

  const timeText = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())

  const selectCategory = (id) => {
    setActiveCategory(id)
    setSearch('')
  }

  return (
    <div className="site-shell">
      <div className="topline"><span><span className="live-dot" /> MENU FOR EVERY MOMENT</span><span><Clock3 size={13} /> INDIA · {timeText}</span></div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Ember and Oak home">
          <span className="brand-mark"><UtensilsCrossed size={20} /></span>
          <span><strong>EMBER <i>&</i> OAK</strong><small>RESTAURANT · BAR · LOUNGE</small></span>
        </a>
        <div className="header-note"><span>GOOD FOOD.</span><span>GREAT COMPANY.</span></div>
      </header>

      <main>
        <section className="hero">
          <img className="hero-photo" src={imageUrl('photo-1414235077428-338989a2e8c0', 1800)} alt="Warmly lit restaurant dining table" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="eyebrow"><span className="eyebrow-line" /> {greeting.icon} CURATED FOR THIS MOMENT</span>
              <h1>{greeting.title.split(' ').slice(0, -1).join(' ')} <em>{greeting.title.split(' ').slice(-1)}</em></h1>
              <p>{greeting.sub}</p>
              <button className="explore-button" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore the menu <ArrowDown size={16} />
              </button>
            </motion.div>
          </div>
          <div className="hero-bottom"><span>SEASONAL IN SPIRIT. TIMELESS IN TASTE.</span><span>01 — MENU</span></div>
        </section>

        <section className="welcome-strip">
          <div><span className="small-label">THE RIGHT MOOD, RIGHT NOW</span><h2>Whatever you're in the mood for.</h2></div>
          <p>We’ll bring today’s moment to the front. <strong>Every menu is always yours to explore.</strong></p>
        </section>

        <section id="menu" className="menu-section">
          <div className="section-top">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> THE MENU</span>
              <h2>Made to be <em>savored.</em></h2>
            </div>
            <label className="search-box">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a dish..." aria-label="Search menu items" />
            </label>
          </div>

          <div className="category-row" role="tablist" aria-label="Menu categories">
            {categories.map((category) => (
              <button
                key={category.id}
                role="tab"
                aria-selected={chosenCategory === category.id}
                className={`category-tab ${chosenCategory === category.id ? 'active' : ''}`}
                onClick={() => selectCategory(category.id)}
              >
                <span>{category.icon}</span>{category.label}
                {category.id === recommended && <i className="recommended-dot" title="Recommended for now" />}
              </button>
            ))}
          </div>

          <div className="recommendation-line">
            <span className="recommendation-pip" />
            {chosenCategory === recommended
              ? `Recommended for ${timeText} · ${categories.find((category) => category.id === recommended)?.label}`
              : `You're exploring ${categories.find((category) => category.id === chosenCategory)?.label} · available to browse anytime`}
          </div>

          {visibleItems.length ? (
            <motion.div layout className="menu-grid">
              {visibleItems.map((item, index) => <MenuCard key={item.id} item={item} index={index} />)}
            </motion.div>
          ) : (
            <div className="empty-state"><Wine size={25} /><h3>No dishes found</h3><p>Try another search or select a different category.</p></div>
          )}
          <div className="menu-footnote"><Leaf size={14} /> Menu items and prices shown are demo content and will be replaced with your restaurant’s actual menu.</div>
        </section>

        <section className="closing-note">
          <span className="closing-mark">✳</span>
          <p>Take your time.<br /><em>There’s something good waiting.</em></p>
          <span className="closing-sub">THANK YOU FOR JOINING US</span>
        </section>
      </main>

      <footer className="footer"><span>EMBER & OAK <i>©</i> 2026</span><span>GOOD MOMENTS, SERVED DAILY.</span></footer>
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
