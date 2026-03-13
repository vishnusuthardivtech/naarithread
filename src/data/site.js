export const logoPath = '/assets/ChatGPT Image Jan 6, 2026, 11_31_50 AM.png'
export const assetPath = (path = '') => {
  const normalizedPath = path.replace(/\\/g, '/').replace(/^assets\//, '')
  return `/assets/${normalizedPath}`
}

export const states = [
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Delhi',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'Punjab',
  'Haryana',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Kerala',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Telangana',
  'Andhra Pradesh',
]

export const heroSlides = [
  {
    image: 'banner/rianta_blog_2.2_1.webp',
    title: 'Timeless Royal Elegance',
    text: 'Non-bridal lehengas crafted for modern women',
    link: '/collection1',
    cta: 'Explore Collection',
  },
  {
    image: 'banner/4.webp',
    title: 'Grace in Every Thread',
    text: 'Designed with heritage, styled for today',
    link: '/new-arrival',
    cta: 'Shop New Arrivals',
  },
  {
    image: 'banner/5.webp',
    title: 'Where Tradition Meets Luxury',
    text: 'Exclusive handcrafted collections',
    link: '/best-seller',
    cta: 'View Best Sellers',
  },
]

export const signatureProducts = [
  { image: 'signature/festival.jpg', title: 'Festive Elegance', subtitle: 'Festive Wear' },
  { image: 'signature/party-wear.jpg', title: 'Evening Glam', subtitle: 'Party Wear' },
  { image: 'signature/lightweight.jpg', title: 'Everyday Grace', subtitle: 'Lightweight' },
  { image: 'signature/wedding.jpg', title: 'Wedding Guest Edit', subtitle: 'Occasion Wear' },
]

export const megaMenuItems = [
  { image: 'best seller/1.jpg', label: 'Mirror Lehenga', href: '/collection1' },
  { image: 'best seller/2.jpg', label: 'Sequence Lehenga', href: '/collection2' },
  { image: 'best seller/3.jpg', label: 'Party Lehenga', href: '/collection3' },
]
