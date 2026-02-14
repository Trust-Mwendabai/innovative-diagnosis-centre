import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  ArrowRight,
  Newspaper,
  BookOpen,
  Sparkles,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  image?: string;
  readTime?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost/IDC/api/blog/read.php");
        const data = await res.json();
        if (data.success) {
          // Only show published posts on public site
          const published = data.posts.filter((p: any) => p.status === 'published');
          setPosts(published);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Unable to load latest insights");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = ["All Articles", "Patient Guide", "Health Education", "Diagnostic Tech", "News & Events"];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Articles" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-indian opacity-90" />
        <div className="absolute inset-0 pattern-mandala opacity-20" />

        <div className="container relative text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-2xl">
              <Sparkles className="h-4 w-4 text-[hsl(var(--gold))]" />
              Strategic Intelligence Hub
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 italic">
              Clinical <span className="text-[hsl(var(--gold))] underline decoration-4 underline-offset-8">Perspectives</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
              Synthesizing complex diagnostic data into actionable health insights for Zambia's healthcare community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container -mt-12 relative z-20">
        <div className="glass-card border-white/10 p-4 md:p-6 rounded-[2.5rem] shadow-glow-gold flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <Input
              placeholder="Search intelligence repository..."
              className="h-16 pl-16 pr-8 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 font-bold focus:ring-2 focus:ring-[hsl(var(--gold))] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-[hsl(var(--gold))] text-white shadow-glow-gold"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container py-24">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[500px] rounded-[3rem] bg-slate-900 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-white/10 bg-white/5">
            <Newspaper className="h-20 w-20 text-white/5 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white italic">Analysis Not Found</h3>
            <p className="text-white/40 font-medium px-4">Our expert team is currently preparing more diagnostic insights.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <Card
                  className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all duration-500 rounded-[3rem] h-full cursor-pointer flex flex-col"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={post.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 text-[hsl(var(--gold))] text-[10px] font-black uppercase tracking-widest shadow-2xl">
                      {post.category}
                    </div>
                  </div>
                  <CardContent className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[hsl(var(--gold))]" /> {new Date(post.created_at || Date.now()).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[hsl(var(--gold))]" /> {post.readTime || "5 min read"}
                      </div>
                    </div>
                    <h3 className="font-heading text-2xl font-black text-white group-hover:text-[hsl(var(--gold))] transition-all mb-4 leading-tight italic">
                      {post.title}
                    </h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[hsl(var(--gold))] font-black uppercase tracking-widest text-[10px]">
                        Extract Intelligence <ChevronRight className="h-3 w-3" />
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="container">
        <div className="glass-card border-white/10 rounded-[4rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--saffron))]/20 to-transparent" />
          <div className="absolute inset-0 pattern-mandala opacity-10 pointer-events-none" />

          <div className="relative p-12 md:p-24 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white italic mb-6">
                Stay <span className="text-[hsl(var(--gold))] underline decoration-4 underline-offset-8">Informed</span>
              </h2>
              <p className="text-white/50 text-xl font-medium max-w-xl mx-auto lg:mx-0">
                Subscribe to our clinical bulletin for the latest diagnostic breakthroughs and health protocols.
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Expert email address..."
                className="h-16 sm:w-80 rounded-2xl bg-white/5 border-white/10 text-white font-bold"
              />
              <Button className="h-16 px-10 rounded-2xl bg-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[10px] shadow-glow-gold hover:scale-[1.05] transition-all">
                Secure Subscription
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
