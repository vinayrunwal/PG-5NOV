
import type { Property, Testimonial, WhyChooseUsItem, FAQ, BlogPost } from './types';

export const properties: Property[] = [
  {
    id: 'p1',
    title: 'Ganesh PG',
    type: 'PG',
    location: '45, College Road, Nungambakkam, Chennai',
    city: 'Chennai',
    coordinates: { lat: 13.06, lng: 80.24 },
    priceRange: { min: 12000, max: 18000 },
    amenities: ['Wi-Fi', 'Food', 'Housekeeping'],
    mainImageId: 'property-1-1',
    galleryImageIds: ['property-1-1', 'property-1-2', 'property-1-3'],
    rooms: [
      { id: 'r1', type: 'Private', price: 18000, isAvailable: true },
      { id: 'r2', type: 'Shared (2 beds)', price: 12000, isAvailable: false },
    ],
    reviews: [
      { id: 'rev1', author: 'Rahul', rating: 5, comment: 'Amazing place, great community!', date: '2024-07-20', avatarImageId: 'testimonial-2' },
      { id: 'rev2', author: 'Sneha', rating: 4, comment: 'Very clean and well maintained. The food could be better.', date: '2024-07-18', avatarImageId: 'testimonial-1' },
    ],
  },
  {
    id: 'p2',
    title: 'Luxury PG',
    type: 'PG',
    location: '90, Vidya Vihar, Pilani',
    city: 'Pilani',
    coordinates: { lat: 28.37, lng: 75.60 },
    priceRange: { min: 10000, max: 15000 },
    amenities: ['Wi-Fi', 'Cooler', 'Food'],
    mainImageId: 'property-2-1',
    galleryImageIds: ['property-2-1', 'property-2-2', 'property-2-3'],
    rooms: [
      { id: 'r3', type: 'Private', price: 15000, isAvailable: false },
      { id: 'r4', type: 'Shared (2 beds)', price: 11000, isAvailable: true },
      { id: 'r5', type: 'Shared (3+ beds)', price: 10000, isAvailable: true },
    ],
    reviews: [],
  },
  {
    id: 'p3',
    title: 'Atlantis PG',
    type: 'PG',
    location: '56, Adyar, Chennai',
    city: 'Chennai',
    coordinates: { lat: 13.00, lng: 80.25 },
    priceRange: { min: 11000, max: 25000 },
    amenities: ['Wi-Fi', 'Food'],
    mainImageId: 'property-3-1',
    galleryImageIds: ['property-3-1', 'property-3-2', 'property-3-3'],
    rooms: [
      { id: 'r6', type: 'Private', price: 25000, isAvailable: true },
    ],
    reviews: [
       { id: 'rev3', author: 'Vikram', rating: 5, comment: 'Top-notch facilities and a great location.', date: '2024-06-25', avatarImageId: 'testimonial-2' }
    ],
  },
  {
    id: 'p4',
    title: 'Homies Living PG',
    type: 'PG',
    location: '15, Hauz Khas Village, Delhi',
    city: 'Delhi',
    coordinates: { lat: 28.55, lng: 77.20 },
    priceRange: { min: 16000, max: 22000 },
    amenities: ['Wi-Fi', 'AC', 'Housekeeping'],
    mainImageId: 'property-4-1',
    galleryImageIds: ['property-4-1', 'property-2-2', 'property-1-2'],
    rooms: [
      { id: 'r7', type: 'Shared (2 beds)', price: 18000, isAvailable: true },
      { id: 'r8', type: 'Shared (3+ beds)', price: 16000, isAvailable: true },
    ],
    reviews: [],
  },
    {
    id: 'p5',
    title: 'Executive Co-living Space',
    type: 'Shared Flat',
    location: 'Hitech City, Hyderabad',
    city: 'Hyderabad',
    coordinates: { lat: 17.44, lng: 78.37
     },
    priceRange: { min: 18000, max: 30000 },
    amenities: ['Wifi', 'AC', 'Power Backup', 'Housekeeping', 'Gym', 'Parking'],
    mainImageId: 'property-5-1',
    galleryImageIds: ['property-5-1', 'property-3-2', 'property-1-3'],
    rooms: [
      { id: 'r9', type: 'Private', price: 30000, isAvailable: true },
      { id: 'r10', type: 'Shared (2 beds)', price: 18000, isAvailable: true },
    ],
    reviews: [],
  },
  {
    id: 'p6',
    title: 'Girls Hostel "The Nest"',
    type: 'Hostel',
    location: 'Sector 15, Noida',
    city: 'Noida',
    coordinates: { lat: 28.586, lng: 77.32
     },
    priceRange: { min: 10000, max: 14000 },
    amenities: ['Wifi', 'AC', 'Meals', 'Laundry', 'Security'],
    mainImageId: 'property-6-1',
    galleryImageIds: ['property-6-1', 'property-2-2', 'property-1-2'],
    rooms: [
      { id: 'r11', type: 'Private', price: 14000, isAvailable: false },
      { id: 'r12', type: 'Shared (2 beds)', price: 10000, isAvailable: true },
    ],
    reviews: [],
  },
];

export const featuredProperties = properties.slice(0, 4);

export const testimonials: Testimonial[] = [
  {
    name: 'Anjali Sharma',
    location: 'Student in Pune',
    quote: "RoomVerse made finding a PG a breeze! The property was exactly as shown, and the amenities are fantastic. Highly recommended for students.",
    imageId: 'testimonial-1',
  },
  {
    name: 'Rohan Verma',
    location: 'IT Professional, Mumbai',
    quote: "Moved to Mumbai for a new job and found a great shared flat through RoomVerse. The process was smooth and the tenant dashboard is super convenient.",
    imageId: 'testimonial-2',
  },
  {
    name: 'Priya Singh',
    location: 'Designer in Delhi',
    quote: "I love my new place! It's clean, well-maintained, and the community is great. RoomVerse really understands what young professionals need.",
    imageId: 'testimonial-3',
  },
];

export const whyChooseUs: WhyChooseUsItem[] = [
    {
        title: 'Verified Properties',
        description: 'Every property is handpicked and verified by our team to ensure quality and safety.'
    },
    {
        title: 'Transparent Pricing',
        description: 'No hidden costs. What you see is what you pay. All-inclusive pricing for your convenience.'
    },
    {
        title: 'Community & Events',
        description: 'Join a vibrant community of like-minded people and enjoy exclusive events and workshops.'
    }
]

export const faqs: FAQ[] = [
    {
        question: 'What is the booking process?',
        answer: 'You can browse properties, select a room, fill in your details, and book online. Our team will then contact you to complete the verification and move-in process.'
    },
    {
        question: 'Is there a security deposit?',
        answer: 'Yes, most properties require a security deposit, which is typically equivalent to one or two months\' rent. It is fully refundable at the end of your stay, provided there are no damages.'
    },
    {
        question: 'Can I visit the property before booking?',
        answer: 'Absolutely! We encourage you to schedule a visit to the property. You can book a visit directly from the property page or contact our support team.'
    },
    {
        question: 'What is included in the rent?',
        answer: 'Inclusions vary by property, but most of our all-inclusive plans cover rent, utilities (electricity, water), Wi-Fi, housekeeping, and access to all listed amenities.'
    },
    {
        question: 'How do I raise a maintenance request?',
        answer: 'You can easily raise a maintenance request through your tenant dashboard. Our maintenance team will address the issue at the earliest.'
    }
]

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Tips for Your First Time Living in a PG',
    author: 'RoomVerse Team',
    date: 'July 15, 2024',
    excerpt: 'Moving into a PG for the first time? Here are 10 essential tips to make your transition smooth and enjoyable...',
    imageId: 'blog-post-1',
  },
  {
    id: '2',
    title: 'A Guide to the Best Cafes for Students in Pune',
    author: 'Ananya Desai',
    date: 'July 10, 2024',
    excerpt: 'Explore the best student-friendly cafes in Pune for studying, hanging out, and grabbing a great cup of coffee.',
    imageId: 'blog-post-2',
  },
  {
    id: '3',
    title: 'The Benefits of Co-living for Young Professionals',
    author: 'RoomVerse Team',
    date: 'July 5, 2024',
    excerpt: 'Co-living is more than just sharing a space. Discover how it can boost your career and social life.',
    imageId: 'blog-post-3',
  }
]
