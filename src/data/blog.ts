export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "prepare-blood-test",
    title: "How to Prepare for a Blood Test",
    excerpt: "Simple steps to ensure accurate results — from fasting tips to what to wear on the day.",
    content: `Preparing properly for a blood test is crucial for obtaining accurate results. Many common tests, such as glucose and lipid profiles, require fasting for 8–12 hours. During this time, you should only consume water.

Beyond fasting, here are key tips:
1. Hydration: Drink plenty of water. It makes your veins easier to find and keeps you from feeling faint.
2. Medication: Continue taking your regular medications unless specifically told otherwise by your doctor.
3. Attire: Wear a short-sleeved shirt or a top with sleeves that can be easily rolled up.
4. Stress Management: If you're nervous, notify the technician. Deep breathing and looking away can help.

Following these simple protocols ensures your IDC diagnostic team can provide the most precise health intelligence.`,
    category: "Patient Guide",
    readTime: "3 min",
    date: "2026-01-15",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80"
  },
  {
    id: "lipid-profile",
    title: "Understanding Your Lipid Profile Results",
    excerpt: "What do LDL, HDL, and triglycerides mean? A plain-language guide to your cholesterol numbers.",
    content: `A lipid profile measures the amount of cholesterol and fats in your blood. These metrics are vital indicators of cardiovascular health.

What the numbers mean:
• LDL (Low-Density Lipoprotein): Often called "bad" cholesterol. High levels can lead to plaque buildup in arteries.
• HDL (High-Density Lipoprotein): The "good" cholesterol. It helps remove LDL from your bloodstream.
• Triglycerides: A type of fat found in your blood. High levels can increase heart disease risk.

At IDC, we use molecular-grade instruments to ensure your lipid profile is accurate down to the most minute measurement, allowing for targeted clinical intervention.`,
    category: "Health Education",
    readTime: "5 min",
    date: "2026-01-08",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80"
  },
  {
    id: "malaria-season",
    title: "Malaria Season in Zambia: When to Get Tested",
    excerpt: "Know the symptoms, understand rapid tests, and learn when to seek care during rainy season.",
    content: `Zambia's rainy season brings an increased risk of malaria. Early detection is life-saving. If you experience fever, chills, headaches, or muscle aches, it is imperative to get tested immediately.

At IDC, we provide both Rapid Diagnostic Tests (RDTs) and microscopic blood film examinations—considered the gold standard for malaria diagnosis. Microscopic examination allows our pathologists to identify the specific malaria parasite species and the density of infection, which is critical for choosing the right treatment.

Don't wait for symptoms to worsen. Precision diagnostics are your first line of defense.`,
    category: "Seasonal Health",
    readTime: "4 min",
    date: "2025-12-20",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80"
  },
  {
    id: "diabetes-screening",
    title: "Are You at Risk for Diabetes? 5 Warning Signs",
    excerpt: "Early screening saves lives. Learn the warning signs and which tests to request.",
    content: `Diabetes is often a "silent" condition until it reaches advanced stages. Early screening through IDC's HbA1c and Fasting Blood Sugar tests can identify pre-diabetes, allowing for lifestyle changes that can prevent the disease.

Watch out for these 5 signs:
1. Increased thirst and frequent urination.
2. Unexplained weight loss.
3. Blurred vision.
4. Extreme fatigue.
5. Sores that heal slowly.

A simple HbA1c test provides a 3-month average of your blood sugar levels, providing a more comprehensive view than a single daily check.`,
    category: "Health Education",
    readTime: "4 min",
    date: "2025-12-10",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80"
  },
  {
    id: "diagnostic-tech-idc",
    title: "How Next-Gen Diagnostic Tech is Changing Zambia",
    excerpt: "From molecular screening to automated pathology, explore the innovations at IDC.",
    content: `IDC is proud to lead Zambia into the future of diagnostics. By integrating AI-assisted pathology and high-throughput molecular analyzers, we've reduced turnaround times while increasing precision.

Innovation Highlights:
• Automated Immunoassay Systems: Eliminating human error in hormonal and infectious disease testing.
• Digital Pathology: Allowing for instant remote consultation with global experts.
• Precision Genomics: Looking into the genetic markers that determine individual health risks.

We believe that every Zambian deserves access to world-class clinical intelligence.`,
    category: "Diagnostic Tech",
    readTime: "6 min",
    date: "2026-02-01",
    image: "https://images.unsplash.com/photo-1532187863486-abf9b3c341b1?w=800&q=80"
  }
];
