export interface Test {
  id: string;
  name: string;
  category: string;
  description: string;
  preparation: string;
  price: number;
  currency: string;
  turnaroundTime: string;
  popular?: boolean;
}

export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  tests: string[];
  price: number;
  currency: string;
  popular?: boolean;
}

export const categories = [
  "Blood Tests",
  "Imaging",
  "Women's Health",
  "Men's Health",
  "Infectious Disease",
  "Wellness Screening",
];

export const tests: Test[] = [
  { id: "fbc", name: "Full Blood Count (FBC)", category: "Blood Tests", description: "Measures red and white blood cells, haemoglobin, and platelets to check for infections, anaemia, and more.", preparation: "No fasting required.", price: 120, currency: "ZMW", turnaroundTime: "4 hours", popular: true },
  { id: "rbs", name: "Random Blood Sugar", category: "Blood Tests", description: "Quick check of your current blood glucose level.", preparation: "No special preparation.", price: 60, currency: "ZMW", turnaroundTime: "1 hour", popular: true },
  { id: "lipid", name: "Lipid Profile", category: "Blood Tests", description: "Measures cholesterol and triglycerides to assess heart disease risk.", preparation: "Fast for 10–12 hours before the test.", price: 180, currency: "ZMW", turnaroundTime: "6 hours", popular: true },
  { id: "lft", name: "Liver Function Tests (LFT)", category: "Blood Tests", description: "Evaluates liver health by measuring enzymes and proteins.", preparation: "No fasting required.", price: 200, currency: "ZMW", turnaroundTime: "6 hours" },
  { id: "rft", name: "Renal Function Tests", category: "Blood Tests", description: "Checks kidney function including creatinine and urea levels.", preparation: "No special preparation.", price: 180, currency: "ZMW", turnaroundTime: "6 hours" },
  { id: "thyroid", name: "Thyroid Function (TSH, T3, T4)", category: "Blood Tests", description: "Screens for thyroid disorders.", preparation: "Best taken in the morning.", price: 350, currency: "ZMW", turnaroundTime: "24 hours" },
  { id: "hiv", name: "HIV Rapid Test", category: "Infectious Disease", description: "Confidential rapid HIV screening with same-day results.", preparation: "No preparation needed.", price: 50, currency: "ZMW", turnaroundTime: "30 minutes", popular: true },
  { id: "malaria", name: "Malaria Parasite Test", category: "Infectious Disease", description: "Detects malaria parasites in a blood smear.", preparation: "No preparation needed.", price: 80, currency: "ZMW", turnaroundTime: "1 hour", popular: true },
  { id: "hepb", name: "Hepatitis B Screening", category: "Infectious Disease", description: "Tests for Hepatitis B surface antigen.", preparation: "No fasting required.", price: 150, currency: "ZMW", turnaroundTime: "4 hours" },
  { id: "pap", name: "Pap Smear", category: "Women's Health", description: "Cervical cancer screening for women.", preparation: "Avoid intercourse 48 hours before.", price: 250, currency: "ZMW", turnaroundTime: "3–5 days" },
  { id: "preg", name: "Pregnancy Test (HCG)", category: "Women's Health", description: "Confirms pregnancy through blood HCG levels.", preparation: "No preparation.", price: 100, currency: "ZMW", turnaroundTime: "2 hours" },
  { id: "psa", name: "PSA (Prostate Screening)", category: "Men's Health", description: "Screens for prostate abnormalities in men over 40.", preparation: "No ejaculation 48 hours before.", price: 300, currency: "ZMW", turnaroundTime: "24 hours" },
  { id: "xray", name: "Chest X-Ray", category: "Imaging", description: "Standard chest radiograph for lungs and heart.", preparation: "Remove metal jewellery.", price: 200, currency: "ZMW", turnaroundTime: "2 hours" },
  { id: "ultrasound", name: "Abdominal Ultrasound", category: "Imaging", description: "Non-invasive imaging of abdominal organs.", preparation: "Fast for 6 hours; drink water 1 hour before.", price: 350, currency: "ZMW", turnaroundTime: "Same day" },
  { id: "vitd", name: "Vitamin D Test", category: "Wellness Screening", description: "Checks vitamin D levels important for bones and immunity.", preparation: "No fasting required.", price: 280, currency: "ZMW", turnaroundTime: "24 hours" },
];

export const healthPackages: HealthPackage[] = [
  { id: "basic", name: "Basic Wellness Check", description: "Essential screening for everyday health.", tests: ["Full Blood Count", "Random Blood Sugar", "Urinalysis"], price: 250, currency: "ZMW", popular: true },
  { id: "executive", name: "Executive Health Screen", description: "Comprehensive check-up for busy professionals.", tests: ["Full Blood Count", "Lipid Profile", "Liver Function", "Renal Function", "Thyroid", "Chest X-Ray", "Urinalysis"], price: 1200, currency: "ZMW", popular: true },
  { id: "womens", name: "Women's Wellness Package", description: "Tailored screening for women's health needs.", tests: ["Full Blood Count", "Pap Smear", "Thyroid Function", "Pregnancy Test", "Urinalysis"], price: 800, currency: "ZMW" },
  { id: "mens", name: "Men's Health Package", description: "Complete screening for men over 30.", tests: ["Full Blood Count", "Lipid Profile", "PSA", "Liver Function", "Random Blood Sugar"], price: 900, currency: "ZMW" },
  { id: "corporate", name: "Corporate Screening", description: "Pre-employment and annual staff health check.", tests: ["Full Blood Count", "HIV Rapid Test", "Hepatitis B", "Chest X-Ray", "Urinalysis", "Drug Screen"], price: 600, currency: "ZMW" },
];
