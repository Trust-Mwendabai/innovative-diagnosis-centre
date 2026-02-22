import { motion } from "framer-motion";
import { Microscope, Camera, Users, Zap, Shield, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const galleryImages = [
    {
        url: "https://images.unsplash.com/photo-1579154234431-167824c08479?q=80&w=1200",
        title: "Advanced Laboratory",
        category: "Equipment",
        description: "Our state-of-the-art diagnostic laboratory equipped with the latest technology."
    },
    {
        url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200",
        title: "Welcoming Reception",
        category: "Interior",
        description: "A comfortable and modern waiting area designed for patient peace of mind."
    },
    {
        url: "https://images.unsplash.com/photo-1559839734-2b71f1536785?q=80&w=1200",
        title: "Our Expert Team",
        category: "Staff",
        description: "A dedicated team of specialists committed to providing accurate and timely results."
    },
    {
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200",
        title: "High-Field MRI",
        category: "Equipment",
        description: "3.0T High-Field MRI for superior image quality and faster scan times."
    },
    {
        url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200",
        title: "Multi-Slice CT Scanner",
        category: "Equipment",
        description: "Advanced multi-slice CT technology for rapid and precise internal imaging."
    },
    {
        url: "https://images.unsplash.com/photo-1581595221475-10ac7119f188?q=80&w=1200",
        title: "4D Ultrasound System",
        category: "Equipment",
        description: "High-definition ultrasound for detailed prenatal and vascular diagnostics."
    },
    {
        url: "https://images.unsplash.com/photo-1532187875605-2fe358a71473?q=80&w=1200",
        title: "Automated Analysis",
        category: "Equipment",
        description: "Fully automated chemical analysis for maximum precision and rapid turnaround."
    },
    {
        url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200",
        title: "Digital Pathology",
        category: "Equipment",
        description: "High-resolution digital microscopy for precise cell analysis and diagnostics."
    }
];

export default function Gallery() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Camera className="h-3 w-3" />
                        <span>Visual Journey</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tighter"
                    >
                        Our <span className="gradient-text">Gallery</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Explore our state-of-the-art facilities and meet the team dedicated to your health and well-being.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative rounded-3xl overflow-hidden bg-foreground/5 border border-border/50 hover:border-[hsl(var(--gold))]/30 transition-all duration-500"
                        >
                            <AspectRatio ratio={16 / 9} className="overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </AspectRatio>

                            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-[hsl(var(--gold))] text-white text-[10px] font-black uppercase tracking-widest">
                                        {image.category}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-[hsl(var(--gold))] transition-colors">
                                    {image.title}
                                </h3>
                                <p className="text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {image.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Highlights */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {[
                        { icon: Shield, title: "Clean Environment", desc: "Highest standards of hygiene and safety maintained in all our facilities." },
                        { icon: Zap, title: "Modern Technology", desc: "Equipped with the latest diagnostic tools for precision and accuracy." },
                        { icon: Users, title: "Expert Care", desc: "Our staff is highly trained to provide the best possible patient experience." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group hover:bg-[hsl(var(--gold))]/10 transition-colors">
                                <feature.icon className="h-8 w-8 text-muted-foreground group-hover:text-[hsl(var(--gold))] transition-colors" />
                            </div>
                            <h4 className="text-xl font-black mb-3 italic tracking-tight uppercase">{feature.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
