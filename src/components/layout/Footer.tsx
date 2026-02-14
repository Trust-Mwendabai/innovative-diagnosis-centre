import { Link } from "react-router-dom";
import { Microscope, Phone, Mail, MapPin, ArrowUpRight, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white/80">
      {/* Decorative gradient at top */}
      <div className="section-divider opacity-50" />

      {/* Background decorative elements & Patterns */}
      <div className="absolute inset-0 pattern-mandala opacity-10 pointer-events-none" />
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-[hsl(var(--saffron))]/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-[hsl(var(--gold))]/10 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container relative py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-heading font-bold text-white mb-4 group">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Microscope className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold">Innovative Diagnosis Centre</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Accurate results. Caring service. Right here in Zambia. Trusted by thousands of patients nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[["Services", "/services"], ["Make an Appointment", "/book"], ["Patient Registration", "/register"], ["Locations", "/locations"], ["About Us", "/about"], ["Blog", "/blog"]].map(([label, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-white/60 hover:text-white transition-all duration-300 inline-flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm group">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-white/60">+260 960 917 837</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-white/60">info@innovativediagnosiscentre.co.zm</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-white/60">10101 Chigwilizano Rd, Lusaka</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Hours</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex justify-between">
                <span>Mon – Fri</span>
                <span className="font-medium text-white/80">7:00 – 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-white/80">8:00 – 14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-white/50">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Innovative Diagnosis Centre. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-100 fill-red-400 animate-bounce-gentle" /> in Zambia
          </p>
        </div>
      </div>
    </footer>
  );
}
