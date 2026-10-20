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

function getDishImage(item) {
  if (item.image) return item.image

  const name = item.name.toLowerCase()
  const category = item.category || ""

  const photoGroups = [
    [/fries|hash brown|potato/i, "photo-1573080496219-bb080dd4f877"],
    [/pizza/i, "photo-1513104890138-7c749659a591"],
    [/burger|sandwich|toast|bread|pattice|patties/i, "photo-1568901346375-23c9450c58cd"],
    [/paneer|mutter|dal|jeera aloo|veg curry|dhansak|xacuti/i, "photo-1631452180519-c014fe946bc7"],
    [/chicken|wings|tidbits/i, "photo-1603894584373-5ac82b2ae398"],
    [/mutton|lamb|keema/i, "photo-1544025162-d76694265947"],
    [/fish|prawn|calamari|seafood/i, "photo-1519708227418-c8fd9a32b7a2"],
    [/rice|biryani|pulao/i, "photo-1512058564366-18510be2db19"],
    [/pasta|spaghetti|macaroni/i, "photo-1473093295043-cdd812d0e601"],
    [/cake|brownie|ice cream|dessert|gulab jamun|custard/i, "photo-1551024506-0ec5c6b7d0e7"],
    [/coffee|tea|juice|shake|mojito|lemonade/i, "photo-1513558161293-cad8d4d4e1d4"],
  ]

  const match = photoGroups.find(([pattern]) => pattern.test(name))
  const photo = match?.[1] || (
    category === "beverages" ? "photo-1513558161293-cad8d4d4e1d4" :
    category === "desserts" ? "photo-1551024506-0ec5c6b7d0e7" :
    category.includes("fish") ? "photo-1519708227418-c8fd9a32b7a2" :
    category.includes("chicken") || category.includes("nonveg") ? "photo-1603894584373-5ac82b2ae398" :
    "photo-1547592180-85f173990554"
  )

  return "https://images.unsplash.com/" + photo + "?auto=format&fit=crop&w=850&q=85"
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

function MenuCard({ item, index, onAdd }) {
  const image = imageUrl(getDishImage(item), 850)

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
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=850&q=80"
            }}
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

        <button
          type="button"
          className="add-to-cart"
          onClick={() => onAdd(item)}
        >
          <span>Add</span>
          <span aria-hidden="true">+</span>
        </button>
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

  const image = item ? imageUrl(getDishImage(item), 1200) : null

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
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  const addToCart = (item) => {
    setCart((current) => {
      const found = current.find((entry) => entry.item.id === item.id)
      if (found) return current.map((entry) => entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
      return [...current, { item, quantity: 1 }]
    })
    setOrderSubmitted(false)
    setCartOpen(true)
  }

  const changeQuantity = (itemId, amount) => {
    setCart((current) => current.map((entry) => entry.item.id === itemId ? { ...entry, quantity: entry.quantity + amount } : entry).filter((entry) => entry.quantity > 0))
    setOrderSubmitted(false)
  }

  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const cartTotal = cart.reduce((sum, entry) => sum + (typeof entry.item.price === 'number' ? entry.item.price : 0) * entry.quantity, 0)
  const hasVariablePrices = cart.some((entry) => typeof entry.item.price !== 'number')
  const checkoutWhatsApp = () => {
    const phone = "917890066480";
    const items = cart.map(({ item, quantity }) => {
      const price = typeof item.price === "number"
        ? "₹" + item.price.toLocaleString("en-IN") + " each"
        : "Price to be confirmed";
      const subtotal = typeof item.price === "number"
        ? "₹" + (item.price * quantity).toLocaleString("en-IN")
        : "To be confirmed";
      return "• " + item.name + " × " + quantity +
        "\\n  " + price + " — Subtotal: " + subtotal;
    });

    const message = [
      "NEW ORDER — MAKA BAWA",
      "",
      ...items,
      "",
      "Estimated subtotal: ₹" + cartTotal.toLocaleString("en-IN"),
      ...(hasVariablePrices ? ["", "Some prices need confirmation."] : []),
      "",
      "Please confirm availability and the final bill."
    ].join("\\n");

    window.open(
      "https://wa.me/" + phone + "?text=" + encodeURIComponent(message),
      "_blank",
      "noopener,noreferrer"
    );
  };



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
        <section className="compact-welcome">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {greeting.icon} MAKA BAWA · YOUR TABLE, YOUR MOMENT
          </span>
          <h1>{greeting.title}</h1>
          <p>{greeting.sub}</p>
          <span className="quick-picks-label">QUICK PICKS FOR THIS TIME</span>
          <div className="quick-picks">
            {(clock.hour >= 5 && clock.hour < 11
              ? ["eggs", "starters-veg", "beverages"]
              : clock.hour >= 11 && clock.hour < 16
                ? ["mains-veg", "chicken", "fish-prawns"]
                : clock.hour >= 16 && clock.hour < 19
                  ? ["starters-veg", "starters-nonveg", "beverages"]
                  : ["mains-veg", "chicken", "mutton"]
            ).map((id) => {
              const category = categories.find((entry) => entry.id === id)
              if (!category) return null
              return (
                <button
                  key={category.id}
                  type="button"
                  className="quick-pick"
                  onClick={() => {
                    selectCategory(category.id)
                    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <span>{category.icon}</span>
                  {category.label}
                  <ArrowUpRight size={14} />
                </button>
              )
            })}
          </div>
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
                <MenuCard key={item.id} item={item} index={index} onAdd={addToCart} />
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

      {cartCount > 0 && (
        <button
          type="button"
          className="cart-fab"
          onClick={() => setCartOpen(!cartOpen)}
        >
          <span>View cart</span>
          <span>{cartCount} item{cartCount === 1 ? "" : "s"}</span>
          <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
        </button>
      )}

      {cartOpen && (
        <div className="cart-backdrop" role="presentation" onClick={() => setCartOpen(false)}>
          <section
            className="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Your shopping cart"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-panel-heading">
              <div>
                <span className="small-label">MAKA BAWA</span>
                <h2>Your cart</h2>
              </div>
              <button type="button" className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
            </div>

            {orderSubmitted ? (
              <div className="cart-confirmation">
                <span className="cart-confirmation-icon">✓</span>
                <h3>Demo order complete!</h3>
                <p>This is only a front-end demonstration. No order was sent to the restaurant or kitchen, and no payment was taken.</p>
                <button type="button" className="explore-button" onClick={() => { setCart([]); setOrderSubmitted(false); setCartOpen(false) }}>Back to menu</button>
              </div>
            ) : (
              <>
                <div className="cart-demo-notice">
                  Review your order before sending it to the restaurant on WhatsApp.
                </div>

                <div className="cart-items">
                  {cart.map(({ item, quantity }) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-copy">
                        <strong>{item.name}</strong>
                        <span>{typeof item.price === "number" ? "₹" + item.price.toLocaleString("en-IN") : "Price to be confirmed"}</span>
                      </div>
                      <div className="quantity-control">
                        <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={"Remove one " + item.name}>−</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={"Add one " + item.name}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-total-row">
                  <span>Estimated subtotal</span>
                  <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
                </div>
                {hasVariablePrices && <p className="cart-price-warning">Some items have prices by size or need confirmation, so they are not included in this subtotal.</p>}
                <button type="button" className="cart-checkout" disabled={cart.length === 0} onClick={checkoutWhatsApp}>Order via WhatsApp</button>
                <p className="cart-disclaimer">WhatsApp opens with your order. Tap Send to submit it; no online payment is processed.</p>
              </>
            )}
          </section>
        </div>
      )}

      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
