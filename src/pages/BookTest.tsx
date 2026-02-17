import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, MapPin, Home, Check, ChevronLeft, ChevronRight, Sparkles, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { tests, healthPackages } from "@/data/tests";
import { branches } from "@/data/branches";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

const timeSlots = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "14:00", "15:00", "16:00"];
const steps = ["Select Test", "Location", "Date & Time", "Your Details", "Confirm"];

const stepVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function BookTest() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedTest, setSelectedTest] = useState(params.get("test") || params.get("package") || "");
  const [locationType, setLocationType] = useState<"branch" | "home">("branch");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const allOptions = [...tests.map((t) => ({ id: t.id, label: t.name, price: t.price })), ...healthPackages.map((p) => ({ id: p.id, label: p.name + " (Package)", price: p.price }))];
  const selected = allOptions.find((o) => o.id === selectedTest);

  useEffect(() => {
    if (params.get("test") || params.get("package")) setStep(1);
  }, []);

  const goNext = () => { setDirection(1); setStep(step + 1); };
  const goBack = () => { setDirection(-1); setStep(step - 1); };

  const handleSubmit = async () => {
    if (!date || !time || !form.name || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || "",
          phone: form.phone,
          date: format(date, "yyyy-MM-dd"),
          time: time,
          locationType: locationType,
          branch: branch,
          testId: selectedTest,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success("Appointment scheduled successfully!");
      } else {
        toast.error(data.message || "Failed to schedule appointment.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Connection error. Ensure the PHP server is running.");
    }
  };

  if (submitted) {
    return (
      <div className="container relative py-24 min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-[hsl(var(--emerald-india))]/10 blur-[100px]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full max-w-xl relative z-10"
        >
          <Card className="glass-card border-white/10 shadow-2xl overflow-hidden rounded-[3rem] text-center p-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[hsl(var(--gold))]/10 shadow-glow-gold rotate-6"
            >
              <Check className="h-12 w-12 text-[hsl(var(--gold))] -rotate-6" />
            </motion.div>

            <h1 className="font-heading text-4xl font-black text-foreground mb-4">Slot Secured!</h1>
            <p className="text-muted-foreground mb-10 font-medium tracking-wide">
              Your diagnostic appointment for <span className="text-[hsl(var(--gold))]">{selected?.label}</span> has been provisionally booked. Our medical coordinator will reach out shortly.
            </p>

            <div className="rounded-[2rem] bg-foreground/5 border border-foreground/5 p-8 text-left space-y-4 mb-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Appointment Date</p>
                  <p className="text-sm font-bold text-foreground">{date ? format(date, "PPP") : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Slotted Time</p>
                  <p className="text-sm font-bold text-foreground">{time}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-foreground/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Service Location</p>
                <p className="text-sm font-bold text-[hsl(var(--gold))]">
                  {locationType === "home" ? "Premium Home Collection" : branches.find((b) => b.id === branch)?.name}
                </p>
              </div>
            </div>

            <Button className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all">
              Back to Home
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden py-20 bg-slate-950/30">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-black mb-6 uppercase tracking-widest backdrop-blur-md">
              <CalendarIcon className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              Booking Center
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground leading-tight">
              Schedule Your <span className="text-[hsl(var(--gold))]">Appointment</span>
            </h1>
            <p className="mt-4 text-muted-foreground font-medium italic">Swift, secure, and hassle-free diagnostic scheduling.</p>
          </motion.div>
        </div>
      </section>

      <section className="container py-12 pb-24 max-w-3xl relative z-10">
        {/* Progress System */}
        <div className="flex items-center justify-between mb-16 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 rounded-full z-0" />
          {steps.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                animate={{
                  scale: i === step ? 1.2 : 1,
                  backgroundColor: i < step ? "hsl(var(--emerald-india))" : i === step ? "hsl(var(--gold))" : "rgba(255,255,255,0.05)"
                }}
                className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 border border-border",
                  i <= step ? "text-white shadow-glow" : "text-muted-foreground/40"
                )}
              >
                {i < step ? <Check className="h-6 w-6" /> : i + 1}
              </motion.div>
              <span className={cn(
                "hidden md:block text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                i <= step ? "text-foreground" : "text-muted-foreground/40"
              )}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step content with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Step 0: Select Test */}
            {step === 0 && (
              <Card className="glass-card border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <CardContent className="p-0 space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                      <FlaskConical className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-2xl text-foreground">Select Diagnostics</h2>
                      <p className="text-muted-foreground text-sm font-medium">Choose a test or health package to continue.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {allOptions.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSelectedTest(o.id)}
                        className={cn(
                          "group flex items-center justify-between p-6 rounded-[1.5rem] border text-left transition-all duration-300",
                          selectedTest === o.id
                            ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10 shadow-glow-gold"
                            : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                        )}
                      >
                        <span className={cn("font-bold text-lg transition-colors", selectedTest === o.id ? "text-foreground" : "text-muted-foreground")}>{o.label}</span>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground/60">ZMW Price</span>
                          <span className="font-heading font-black text-xl text-[hsl(var(--gold))]">ZMW {o.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Location */}
            {step === 1 && (
              <Card className="glass-card border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <CardContent className="p-0 space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-2xl text-foreground">Choose Location</h2>
                      <p className="text-muted-foreground text-sm font-medium">Select your preferred sampling point.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setLocationType("branch")}
                      className={cn(
                        "p-8 rounded-[2rem] border text-left transition-all duration-300 group relative overflow-hidden",
                        locationType === "branch" ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <MapPin className={cn("h-8 w-8 mb-4 transition-colors", locationType === "branch" ? "text-[hsl(var(--gold))]" : "text-muted-foreground/30")} />
                      <span className="text-xl font-black text-foreground block">Visit Clinic</span>
                      <p className="text-sm text-muted-foreground mt-1">Walk-in to any of our modern facilities.</p>
                      {locationType === "branch" && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[hsl(var(--gold))] animate-pulse" />}
                    </button>
                    <button
                      onClick={() => setLocationType("home")}
                      className={cn(
                        "p-8 rounded-[2rem] border text-left transition-all duration-300 group relative overflow-hidden",
                        locationType === "home" ? "border-[hsl(var(--emerald-india))] bg-[hsl(var(--emerald-india))]/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <Home className={cn("h-8 w-8 mb-4 transition-colors", locationType === "home" ? "text-[hsl(var(--emerald-india))]" : "text-muted-foreground/30")} />
                      <span className="text-xl font-black text-foreground block">Home Collection</span>
                      <p className="text-sm text-muted-foreground mt-1">Professional sample collection at your door.</p>
                      {locationType === "home" && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[hsl(var(--emerald-india))] animate-pulse" />}
                    </button>
                  </div>
                  {locationType === "branch" && (
                    <div className="space-y-3 pt-4">
                      {branches.map((b) => (
                        <button key={b.id} onClick={() => setBranch(b.id)} className={cn("w-full text-left p-6 rounded-2xl border transition-all duration-300", branch === b.id ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10" : "border-foreground/5 bg-foreground/5 hover:bg-foreground/10")}>
                          <div className="font-bold text-foreground mb-1">{b.name}</div>
                          <div className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">{b.address} · {b.hours}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <Card className="glass-card border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <CardContent className="p-0 space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-2xl text-foreground">Pick Date & Time</h2>
                      <p className="text-muted-foreground text-sm font-medium">When should we expect you?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className={cn("w-full justify-start h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10 text-lg font-bold", !date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-3 h-5 w-5 text-[hsl(var(--gold))]" />
                          {date ? format(date, "PPP") : "Select an available date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} className="p-4" />
                      </PopoverContent>
                    </Popover>

                    <div className="pt-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-4 block">Available Time Slots</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={cn(
                              "py-3 rounded-xl border text-sm font-black transition-all duration-300",
                              time === t ? "bg-[hsl(var(--gold))] text-white border-transparent shadow-glow-gold" : "bg-foreground/5 border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
                            )}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <Card className="glass-card border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <CardContent className="p-0 space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-2xl text-foreground">Contact Information</h2>
                      <p className="text-muted-foreground text-sm font-medium">To confirm your clinical appointment.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Full Patient Name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="h-14 bg-foreground/5 border-foreground/10 text-foreground rounded-2xl px-6 font-bold text-lg focus:border-[hsl(var(--gold))]/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Contact Phone Number</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+260 97xxx" className="h-14 bg-foreground/5 border-foreground/10 text-foreground rounded-2xl px-6 font-bold text-lg focus:border-[hsl(var(--gold))]/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email Address</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="patient@example.zm" className="h-14 bg-foreground/5 border-foreground/10 text-foreground rounded-2xl px-6 font-bold text-lg focus:border-[hsl(var(--gold))]/50 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <Card className="glass-card border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <CardContent className="p-0 space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-2xl text-foreground">Review Summary</h2>
                      <p className="text-muted-foreground text-sm font-medium">Finalize your slot before submission.</p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-white/3 text-sm p-8 space-y-6 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Diagnostic Test</p>
                        <p className="text-xl font-black text-white">{selected?.label}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Service Fee</p>
                        <p className="text-xl font-black text-[hsl(var(--gold))]">ZMW {selected?.price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Date & Time</p>
                        <p className="text-lg font-bold text-white">{date ? format(date, "PPP") : "—"} at {time}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Location</p>
                        <p className="text-lg font-bold text-white italic">{locationType === "home" ? "Home Collection" : branches.find((b) => b.id === branch)?.name}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] uppercase font-black text-white/20 text-center tracking-widest">No upfront payment required to secure this slot.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Global Navigation */}
        <div className="flex justify-between items-center mt-12 px-2">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
            className="h-14 px-8 rounded-2xl text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={goNext}
              disabled={
                (step === 0 && !selectedTest) ||
                (step === 1 && locationType === "branch" && !branch) ||
                (step === 2 && (!date || !time)) ||
                (step === 3 && (!form.name || !form.phone))
              }
              className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all disabled:opacity-20"
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--emerald-india))] to-[hsl(var(--accent))] text-white font-black uppercase tracking-widest shadow-lg hover:scale-[1.05] transition-all"
            >
              Secure Appointment <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
