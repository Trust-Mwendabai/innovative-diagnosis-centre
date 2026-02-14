export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  mapUrl: string;
  image?: string;
}

export const branches: Branch[] = [
  {
    id: "lusaka-main",
    name: "Innovative Diagnosis Centre",
    address: "10101 Chigwilizano Rd",
    city: "Lusaka",
    phone: "+260 960 917 837",
    hours: "Mon–Fri 7:00–18:00, Sat 8:00–14:00",
    mapUrl: "https://maps.google.com/?q=10101+Chigwilizano+Rd+Lusaka",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"
  },
];
