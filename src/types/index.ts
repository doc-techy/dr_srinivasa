export interface Doctor {
  name: string;
  title: string;
  qualifications: string[];
  yearsOfPractice: number;
  specialties: string[];
  location: string;
  languages: string[];
  description: string;
  image?: string;
}

export interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  message?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
  slug: string;
  featuredImage?: string;
}
