import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  Leaf,
  Search,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from 'lucide-react'
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

function getGreeting(hour) {
  if (hour >= 5 && hour < 12) {
    return {
      title: 'A beautiful morning.',
      sub: 'Good food and fresh beginnings start here.',
      icon: '☀️',
    }
  }

  if (hour >= 12 && hour < 16) {
    return {
      title: 'Make lunch a moment.',
      sub: 'Take a break, settle in, and enjoy something good.',
      icon: '☀️',
    }
  }

  if (hour >= 16 && hour < 19) {
    return {
      title: 'Ease into the evening.',
      sub: 'Good bites, refreshing drinks, and better company.',
      icon: '🌤️',
    }
  }

  return {
    title: 'Your evening, well served.',
    sub: 'Come for the food. Stay for the atmosphere.',
    icon: '🌙',
  }
}

function imageUrl(image, width = 900) {
  if (!image) return null

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`
}

function formatPrice(price) {
  return price == null ? null : `₹${price}`
}

function PriceDisplay({ item }) {
  if (item.price30 != null || item.price60 != null) {
    return (
      <span className="price price-sizes">
        {item.price30 != null && (
          <span>30 ml {formatPrice(item.price30)}</span>
        )}
        {item.price60 != null && (
          <span>60 ml {formatPrice(item.price60)}</span>
        )}
      </span>
    )
  }

  if (item.priceBySize || item.price == null) {
    return <span className="price">Price by size</span>
  }

  return <span className="price">{formatPrice(item.price)}</span>
}

function ItemDetailsButton({ item }) {
  return (
    <button
      type="button"
      className="image-open"
      aria-label={`View ${item.name} details`}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent('open-menu-item', { detail: item }),
        )
      }}
    >
      <ArrowUpRight size={18} />
    </button>
  )
}

function MenuCard({ item, index }) {
  const image = imageUrl(item.image, 850)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.28) }}
      className="menu-card group"
    >
      <div className="card-image-wrap">
        {image ? (
          <img
            src={image}
            alt={item.name}
            className="card-image"
            loading={index > 2 ? 'lazy' : 'eager'}
          />
        ) : (
          <div className="card-image flex items-center justify-center">
            <UtensilsCrossed size={32} />
          </div>
        )}

        <div className="image-vignette" />

        {item.tag && (
          <span className="item-tag">
            <Sparkles size={12} />
            {item.tag}
          </span>
        )}

        {typeof item.veg === 'boolean' && (
          <span
            className={`diet-dot ${item.veg ? 'is-veg' : 'is-nonveg'}`}
            title={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
          >
            <span />
          </span>
        )}

        <ItemDetailsButton item={item} />
      </div>

      <div className="card-copy">
        <div className="card-heading">
          <h3>{item.name}</h3>
          <PriceDisplay item={item} />
        </div>

        {item.description && <p>{item.description}</p>}

        {item.note && <p className="item-note">{item.note}</p>}
      </div>
    </motion.article>
  )
}

function ItemModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [item, onClose])

  const image = item ? imageUrl(item.image, 1200) : null

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="item-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-item-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={(event) => event.stopPropagation()}
          >
            {image && <img src={image} alt={item.name} />}

            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="modal-copy">
              {item.tag && <span className="eyebrow">{item.tag}</span>}

              <h2 id="menu-item-title">{item.name}</h2>

              {item.description && <p>{item.description}</p>}

              {item.note && <p className="item-note">{item.note}</p>}

              <div className="modal-bottom">
                <PriceDisplay item={item} />

                {typeof item.veg === 'boolean' && (
                  <span className="demo-note">
                    {item.veg ? 'Vegetarian' : 'Non-vegetarian'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [clock, setClock] = useState(getIndiaTime)
  const [activeCategory, setActiveCategory] = useState(
    () => categories[0]?.id ?? '',
  )
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(getIndiaTime())
    }, 30000)

    const onOpen = (event) => setSelectedItem(event.detail)

    window.addEventListener('open-menu-item', onOpen)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('open-menu-item', onOpen)
    }
  }, [])

  const greeting = getGreeting(clock.hour)

  const timeText = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())

  const activeCategoryLabel =
    categories.find((category) => category.id === activeCategory)?.label ??
    'Menu'

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return menuItems.filter((item) => {
      const searchableText = [
        item.name,
        item.description,
        item.tag,
        item.category,
        item.note,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      // Search across the entire menu when a search term is entered.
      if (query) return searchableText.includes(query)

      return item.category === activeCategory
    })
  }, [activeCategory, search])

  const selectCategory = (id) => {
    setActiveCategory(id)
    setSearch('')
  }

  return (
    <div className="site-shell">
      <div className="topline">
        <span>
          <span className="live-dot" />
          GOOD FOOD · GOOD VIBES
        </span>

        <span>
          <Clock3 size={13} />
          INDIA · {timeText}
        </span>
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Maka Bawa home">
          <span className="brand-mark">
            <UtensilsCrossed size={20} />
          </span>

          <span>
            <strong>
              MAKA <i>BAWA</i>
            </strong>
            <small>CAFÉ · BAR · GOOD TIMES</small>
          </span>
        </a>

        <div className="header-note">
          <span>GOOD FOOD.</span>
          <span>GREAT COMPANY.</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <img
            className="hero-photo"
            src={imageUrl('photo-1414235077428-338989a2e8c0', 1800)}
            alt="Restaurant dining atmosphere"
          />

          <div className="hero-overlay" />

          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="eyebrow">
                <span className="eyebrow-line" />
                {greeting.icon} YOUR TABLE, YOUR MOMENT
              </span>

              <h1>
                {greeting.title.split(' ').slice(0, -1).join(' ')}{' '}
                <em>{greeting.title.split(' ').slice(-1).join(' ')}</em>
              </h1>

              <p>{greeting.sub}</p>

              <button
                type="button"
                className="explore-button"
                onClick={() =>
                  document
                    .getElementById('menu')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Explore our menu
                <ArrowDown size={16} />
              </button>
            </motion.div>
          </div>

          <div className="hero-bottom">
            <span>GOOD TASTE. BETTER MEMORIES.</span>
            <span>01 — MENU</span>
          </div>
        </section>

        <section className="welcome-strip">
          <div>
            <span className="small-label">WELCOME TO MAKA BAWA</span>
            <h2>Whatever you're in the mood for.</h2>
          </div>

          <p>
            From comforting favourites to evening drinks.{' '}
            <strong>Find your next favourite.</strong>
          </p>
        </section>

        <section id="menu" className="menu-section">
          <div className="section-top">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" />
                EXPLORE OUR MENU
              </span>

              <h2>
                Made to be <em>savored.</em>
              </h2>
            </div>

            <label className="search-box">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search food or drinks..."
                aria-label="Search all menu items"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch('')}
                >
                  ×
                </button>
              )}
            </label>
          </div>

          <div
            className="category-row"
            role="tablist"
            aria-label="Menu categories"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={!search && activeCategory === category.id}
                className={`category-tab ${
                  !search && activeCategory === category.id ? 'active' : ''
                }`}
                onClick={() => selectCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          <div className="recommendation-line">
            <span className="recommendation-pip" />
            {search.trim()
              ? `Search results for "${search.trim()}"`
              : `Now exploring ${activeCategoryLabel} · ${visibleItems.length} items`}
          </div>

          {visibleItems.length > 0 ? (
            <motion.div layout className="menu-grid">
              {visibleItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="empty-state">
              <Wine size={25} />
              <h3>No matching items</h3>
              <p>
                Try another search term or choose a different menu category.
              </p>

              {search && (
                <button
                  type="button"
                  className="explore-button"
                  onClick={() => setSearch('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          <div className="menu-footnote">
            <Leaf size={14} />
            Prices are listed in Indian rupees. Items priced by size may vary.
            Please confirm availability and current prices with the restaurant.
          </div>
        </section>

        <section className="closing-note">
          <span className="closing-mark">✳</span>

          <p>
            Take your time.
            <br />
            <em>There's something good waiting.</em>
          </p>

          <span className="closing-sub">THANK YOU FOR JOINING US</span>
        </section>
      </main>

      <footer className="footer">
        <span>
          MAKA BAWA <i>©</i> {new Date().getFullYear()}
        </span>
        <span>GOOD MOMENTS, SERVED DAILY.</span>
      </footer>

      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}Find your next favourite.</strong>
          </p>
        </section>

        <section id="menu" className="menu-section">
          <div className="section-top">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" />
                EXPLORE OUR MENU
              </span>

              <h2>
                Made to be <em>savored.</em>
              </h2>
            </div>

            <label className="search-box">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search food or drinks..."
                aria-label="Search food or drinks"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch('')}
                >
                  ×
                </button>
              )}
            </label>
          </div>

          <div
            className="category-row"
            role="tablist"
            aria-label="Menu categories"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={chosenCategory === category.id}
                className={`category-tab ${
                  chosenCategory === category.id ? 'active' : ''
                }`}
                onClick={() => selectCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.label}

                {category.id === recommended && (
                  <i
                    className="recommended-dot"
                    title="Recommended for now"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="recommendation-line">
            <span className="recommendation-pip" />

            {chosenCategory === recommended
              ? `A suggestion for ${timeText} · ${activeCategoryLabel}`
              : `Now exploring ${activeCategoryLabel} · browse whenever you like`}
          </div>

          {visibleItems.length > 0 ? (
            <motion.div layout className="menu-grid">
              {visibleItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="empty-state">
              <Wine size={25} />
              <h3>No matching items</h3>
              <p>
                Try another search term or choose a different menu category.
              </p>
              {search && (
                <button
                  type="button"
                  className="explore-button"
                  onClick={() => setSearch('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          <div className="menu-footnote">
            <Leaf size={14} />
            Prices are listed in Indian rupees. Please confirm availability and
            current prices with the restaurant.
          </div>
        </section>

        <section className="closing-note">
          <span className="closing-mark">✳</span>

          <p>
            Take your time.
            <br />
            <em>There's something good waiting.</em>
          </p>

          <span className="closing-sub">
            THANK YOU FOR JOINING US
          </span>
        </section>
      </main>

      <footer className="footer">
        <span>
          MAKA BAWA <i>©</i> {new Date().getFullYear()}
        </span>
        <span>GOOD MOMENTS, SERVED DAILY.</span>
      </footer>

      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}

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
