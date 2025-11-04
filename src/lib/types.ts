import { type LucideIcon } from "lucide-react";

export type Amenity = {
  name: string;
  icon: LucideIcon;
};

export type Room = {
  id: string;
  type: 'Private' | 'Shared (2 beds)' | 'Shared (3+ beds)';
  price: number;
  isAvailable: boolean;
};

export type Review = {
  id: string;
  author: string;
  avatarImageId: string;
  rating: number;
  comment: string;
  date: string;
};

export type Property = {
  id: string;
  title: string;
  type: 'PG' | 'Hostel' | 'Shared Flat';
  location: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  mainImageId: string;
  galleryImageIds: string[];
  rooms: Room[];
  reviews: Review[];
};

export type Testimonial = {
  name: string;
  location: string;
  quote: string;
  imageId: string;
};

export type WhyChooseUsItem = {
  title: string;
  description: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type BlogPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageId: string;
}
