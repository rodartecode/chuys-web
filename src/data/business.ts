export interface SocialLink {
  label: string;
  href: string;
}

export interface OpeningHours {
  days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  opens: string; // 24h "HH:MM"
  closes: string;
}

// Single source for contact details — rendered by Hero, HoursLocation, Footer,
// and the Restaurant JSON-LD in BaseLayout.
export const business = {
  name: "Chuy's Tacos",
  url: "https://chuystacos.com",
  phone: "+15592854374",
  phoneDisplay: "(559) 285-4374",
  email: "chuy@chuystacos.com",
  address: {
    street: "365 West Bedford Ave",
    suite: "Suite 105",
    note: "around the back!",
    city: "Fresno",
    state: "CA",
    zip: "93711",
  },
  // Display rows for the Hours card. Keep in sync with openingHours below.
  hours: [
    { day: "Mon – Fri", value: "10:00 AM – 6:00 PM" },
    { day: "Sat – Sun", value: "Closed" },
  ],
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
  ] satisfies OpeningHours[],
  // TODO(owner): add Instagram/Facebook URLs — the footer's Follow column stays hidden while empty.
  social: [] as SocialLink[],
};

export const inquiry = {
  /** Where catering inquiries are delivered. */
  to: "chuy@chuystacos.com",
  /** Sender address — must be on a domain verified in Resend. */
  from: "inquiries@mail.chuystacos.com",
  // TODO(owner): replace with the real Turnstile site key. This is Cloudflare's
  // always-pass test key; the widget works but blocks nothing until swapped.
  turnstileSiteKey: "1x00000000000000000000AA",
};
