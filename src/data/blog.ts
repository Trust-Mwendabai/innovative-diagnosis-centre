export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  { id: "prepare-blood-test", title: "How to Prepare for a Blood Test", excerpt: "Simple steps to ensure accurate results — from fasting tips to what to wear on the day.", category: "Patient Guide", readTime: "3 min", date: "2026-01-15", image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop" },
  { id: "lipid-profile", title: "Understanding Your Lipid Profile Results", excerpt: "What do LDL, HDL, and triglycerides mean? A plain-language guide to your cholesterol numbers.", category: "Health Education", readTime: "5 min", date: "2026-01-08", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop" },
  { id: "malaria-season", title: "Malaria Season in Zambia: When to Get Tested", excerpt: "Know the symptoms, understand rapid tests, and learn when to seek care during rainy season.", category: "Seasonal Health", readTime: "4 min", date: "2025-12-20", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop" },
  { id: "diabetes-screening", title: "Are You at Risk for Diabetes? 5 Warning Signs", excerpt: "Early screening saves lives. Learn the warning signs and which tests to request.", category: "Health Education", readTime: "4 min", date: "2025-12-10", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=400&fit=crop" },
  { id: "home-collection", title: "Lab Tests at Home: How Our Home Collection Works", excerpt: "Can't visit a branch? We come to you. Here's how our home sample collection service works.", category: "Patient Guide", readTime: "2 min", date: "2025-11-28", image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&h=400&fit=crop" },
];
