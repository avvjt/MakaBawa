// Temporary demo menu. Replace these sample dishes/prices with the restaurant's actual menu.
export const categories = [
  { id: 'breakfast', label: 'Breakfast', start: 5, end: 12, icon: '☀️' },
  { id: 'lunch', label: 'Lunch', start: 12, end: 16, icon: '🍽️' },
  { id: 'snacks', label: 'Small Plates', start: 16, end: 19, icon: '🥗' },
  { id: 'dinner', label: 'Dinner', start: 19, end: 24, icon: '🌙' },
  { id: 'bar', label: 'Bar & Drinks', start: 16, end: 24, icon: '🍸' },
]

export const menuItems = [
  {
    id: 1, category: 'breakfast', name: 'Farmhouse Breakfast', description: 'Farm eggs, toasted sourdough, greens and slow-roasted tomato.',
    price: 289, tag: 'House favourite', veg: false, image: 'photo-1533089860892-a7c6f0a88666'
  },
  {
    id: 2, category: 'breakfast', name: 'Berry French Toast', description: 'Brioche, seasonal berries, vanilla cream and maple drizzle.',
    price: 249, tag: 'Sweet start', veg: true, image: 'photo-1484723091739-30a097e8f929'
  },
  {
    id: 3, category: 'breakfast', name: 'Avocado Toast', description: 'Smashed avocado, chilli flakes, lemon and toasted artisan bread.',
    price: 219, tag: 'Fresh pick', veg: true, image: 'photo-1525351484163-7529414344d8'
  },
  {
    id: 4, category: 'lunch', name: 'Grilled Garden Bowl', description: 'Seasonal vegetables, grains, herbs and a bright citrus dressing.',
    price: 329, tag: 'Light & fresh', veg: true, image: 'photo-1512621776951-a57141f2eefd'
  },
  {
    id: 5, category: 'lunch', name: 'Smoky Grilled Chicken', description: 'Char-grilled chicken, roasted vegetables and house jus.',
    price: 429, tag: 'Chef’s pick', veg: false, image: 'photo-1532550907401-a500c9a57435'
  },
  {
    id: 6, category: 'lunch', name: 'Creamy Mushroom Pasta', description: 'Mushrooms, parmesan, herbs and silky cream sauce.',
    price: 349, tag: 'Comfort food', veg: true, image: 'photo-1473093295043-cdd812d0e601'
  },
  {
    id: 7, category: 'snacks', name: 'Crispy Lotus Stem', description: 'Crunchy lotus stem tossed in a sweet, spicy house glaze.',
    price: 269, tag: 'Shareable', veg: true, image: 'photo-1547592180-85f173990554'
  },
  {
    id: 8, category: 'snacks', name: 'Loaded Nachos', description: 'Corn chips, melted cheese, salsa, jalapeño and fresh herbs.',
    price: 299, tag: 'Crowd favourite', veg: true, image: 'photo-1513456852971-30c0b8199d4d'
  },
  {
    id: 9, category: 'dinner', name: 'Charcoal Paneer Tikka', description: 'Smoky paneer, peppers and a mint yoghurt dip.',
    price: 339, tag: 'From the grill', veg: true, image: 'photo-1567188040759-fb8a883dc6d8'
  },
  {
    id: 10, category: 'dinner', name: 'Signature Roast', description: 'Slow-roasted, deeply savoury and finished with seasonal sides.',
    price: 549, tag: 'Signature plate', veg: false, image: 'photo-1544025162-d76694265947'
  },
  {
    id: 11, category: 'bar', name: 'Citrus Garden', description: 'A bright citrus-forward house special with aromatic herbs.',
    price: 349, tag: 'House special', veg: true, image: 'photo-1513558161293-cdaf765edfd7'
  },
  {
    id: 12, category: 'bar', name: 'Smoked Old Fashioned', description: 'A spirit-forward classic with warm spice and a smoky finish.',
    price: 499, tag: 'Classic', veg: true, image: 'photo-1470337458703-46ad1756a187'
  },
]
