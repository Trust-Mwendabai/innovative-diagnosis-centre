export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  { id: "1", name: "Chipo Mwanza", role: "Patient, Lusaka", quote: "I got my results the same day — no long queues, no confusion. The staff were so kind and professional.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face" },
  { id: "2", name: "Dr. James Phiri", role: "General Practitioner", quote: "I refer all my patients here. The accuracy and turnaround time are the best I've seen in Zambia.", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" },
  { id: "3", name: "Mutale Banda", role: "Corporate Client", quote: "We use Innovative Diagnosis Centre for our annual staff screenings. The process is seamless and affordable.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "4", name: "Grace Tembo", role: "Patient, Kitwe", quote: "The home collection service is a lifesaver — especially with young children. Highly recommend!", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
];
