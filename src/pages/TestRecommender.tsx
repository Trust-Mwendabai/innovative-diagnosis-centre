import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  question: string;
  options: string[];
}

const questions: Question[] = [
  { question: "What is your age range?", options: ["Under 18", "18–30", "31–45", "46–60", "Over 60"] },
  { question: "Are you experiencing any of these symptoms?", options: ["Fatigue or tiredness", "Frequent headaches", "Joint or body pain", "Weight changes", "None of these"] },
  { question: "Do you have a family history of any of these?", options: ["Diabetes", "Heart disease", "Cancer", "High blood pressure", "None / Not sure"] },
  { question: "How would you describe your lifestyle?", options: ["Very active", "Moderately active", "Mostly sedentary", "High stress job"] },
  { question: "When was your last health check-up?", options: ["Less than 6 months", "6–12 months ago", "1–2 years ago", "Over 2 years ago", "Never had one"] },
];

interface Recommendation {
  name: string;
  reason: string;
  id: string;
  price: number;
}

function getRecommendations(answers: number[]): Recommendation[] {
  const recs: Recommendation[] = [];
  recs.push({ name: "Basic Wellness Check", reason: "A great starting point for everyone.", id: "basic", price: 250 });

  if (answers[0] >= 3) {
    recs.push({ name: "Executive Health Screen", reason: "Comprehensive screening recommended for your age group.", id: "executive", price: 1200 });
    recs.push({ name: "PSA (Prostate Screening)", reason: "Important for men over 40.", id: "psa", price: 300 });
  }
  if (answers[1] === 0 || answers[1] === 3) {
    recs.push({ name: "Thyroid Function Test", reason: "Fatigue and weight changes can indicate thyroid issues.", id: "thyroid", price: 350 });
  }
  if (answers[2] === 0) {
    recs.push({ name: "Random Blood Sugar", reason: "Family history of diabetes — screening is recommended.", id: "rbs", price: 60 });
  }
  if (answers[2] === 1) {
    recs.push({ name: "Lipid Profile", reason: "Family history of heart disease — check your cholesterol.", id: "lipid", price: 180 });
  }
  if (answers[4] >= 2) {
    recs.push({ name: "Full Blood Count", reason: "It's been a while since your last check-up.", id: "fbc", price: 120 });
  }

  const seen = new Set<string>();
  return recs.filter((r) => { if (seen.has(r.id)) return false; seen.add(r.id); return true; }).slice(0, 4);
}

export default function TestRecommender() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = answers.length === questions.length;

  const selectAnswer = (index: number) => {
    setAnswers([...answers, index]);
    setCurrent(current + 1);
  };

  const recommendations = done ? getRecommendations(answers) : [];

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-sm mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI-Powered Recommendations</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">Smart Test Recommender</h1>
            <p className="mt-2 text-white/60">Answer 5 quick questions and we'll suggest the right tests for you.</p>
          </motion.div>
        </div>
      </section>

      <section className="container py-12 max-w-xl">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              {/* Progress */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>Question {current + 1} of {questions.length}</span>
                <span className="font-medium gradient-text">{Math.round(((current + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted mb-8 overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: `${(current / questions.length) * 100}%` }}
                  animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">{questions[current].question}</h2>
              <div className="space-y-3">
                {questions[current].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className="w-full text-left p-5 rounded-2xl border border-border/50 hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all duration-300 text-sm font-medium group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:gradient-primary group-hover:text-white transition-all duration-300">
                        {String.fromCharCode(65 + i)}
                      </div>
                      {opt}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 h-16 w-16 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold">Your Recommended Tests</h2>
                <p className="text-muted-foreground mt-2">Based on your answers, we suggest these tests:</p>
              </div>

              <div className="space-y-4">
                {recommendations.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="card-hover border-border/50 group">
                      <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-heading font-semibold group-hover:text-primary transition-colors duration-300">{r.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{r.reason}</p>
                          <span className="text-sm font-bold gradient-text mt-1 block">ZMW {r.price}</span>
                        </div>
                        <Link to={`/book?test=${r.id}`}>
                          <Button size="sm" className="gap-1 gradient-primary text-white border-0 shadow-sm hover:shadow-glow transition-all duration-300">
                            Book <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={() => { setAnswers([]); setCurrent(0); }} className="gap-2 rounded-xl">
                  <RotateCcw className="h-4 w-4" /> Retake Quiz
                </Button>
                <Link to="/services">
                  <Button variant="outline" className="gap-2 rounded-xl hover:gradient-primary hover:text-white hover:border-transparent transition-all duration-300">
                    Browse All Tests <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
