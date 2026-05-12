export type User = {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  school: string;
  gradYear: number;
  isVerifiedStudent?: boolean;
  isVerifiedAlum?: boolean;
  offersOfficeHours?: boolean;
  officeHoursSlots?: { id: string; date: string; time: string; duration: string; price: string }[];
  company?: string;
  role?: string;
  location?: string;
};

const av = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

export const currentUser: User = {
  id: "u0",
  name: "Akshaya Patel",
  headline: "PGP in Mgt and Tech @ SSB | Ex-Salesforce Application Developer @ Accenture",
  avatar: av("Akshaya"),
  school: "Scaler School of Business",
  gradYear: 2027,
  isVerifiedStudent: true,
  company: "Scaler School Of Business",
  role: "MBA Candidate",
  location: "Bhopal, Madhya Pradesh, India",
};

export const users: User[] = [
  currentUser,
  {
    id: "u1", name: "Rohit Kumar",
    headline: "Engagement Manager @ McKinsey & Company | SSB Alum '22",
    avatar: av("Rohit"), school: "Scaler School of Business", gradYear: 2022,
    isVerifiedAlum: true, offersOfficeHours: true,
    company: "McKinsey & Company", role: "Engagement Manager", location: "Mumbai, India",
    officeHoursSlots: [
      { id: "s1", date: "Thu, Nov 21", time: "4:00 PM", duration: "15 min", price: "Free" },
      { id: "s2", date: "Sat, Nov 23", time: "11:00 AM", duration: "30 min", price: "₹500" },
      { id: "s3", date: "Mon, Nov 25", time: "6:30 PM", duration: "20 min", price: "Free" },
    ],
  },
  {
    id: "u2", name: "Priya Sharma",
    headline: "Senior Consultant @ Bain & Company | SSB '23",
    avatar: av("Priya"), school: "Scaler School of Business", gradYear: 2023,
    isVerifiedAlum: true, offersOfficeHours: true,
    company: "Bain & Company", role: "Senior Consultant", location: "Gurgaon, India",
    officeHoursSlots: [
      { id: "s4", date: "Fri, Nov 22", time: "5:00 PM", duration: "15 min", price: "Free" },
    ],
  },
  {
    id: "u3", name: "Aanya Mehta",
    headline: "Product Manager @ Flipkart | SSB Alum '21",
    avatar: av("Aanya"), school: "Scaler School of Business", gradYear: 2021,
    isVerifiedAlum: true, offersOfficeHours: false,
    company: "Flipkart", role: "Product Manager", location: "Bengaluru, India",
  },
  {
    id: "u4", name: "Vikram Iyer",
    headline: "Associate @ BCG | Ex-Goldman Sachs",
    avatar: av("Vikram"), school: "Scaler School of Business", gradYear: 2022,
    isVerifiedAlum: true, offersOfficeHours: true,
    company: "BCG", role: "Associate", location: "Mumbai, India",
    officeHoursSlots: [
      { id: "s5", date: "Sun, Nov 24", time: "10:00 AM", duration: "30 min", price: "₹500" },
    ],
  },
  {
    id: "u5", name: "Sneha Reddy",
    headline: "Senior PM @ Zomato | Building consumer products",
    avatar: av("Sneha"), school: "Scaler School of Business", gradYear: 2020,
    isVerifiedAlum: true, offersOfficeHours: false,
    company: "Zomato", role: "Senior PM", location: "Bengaluru, India",
  },
  {
    id: "u6", name: "Arjun Nair",
    headline: "VP Strategy @ Razorpay | Angel investor",
    avatar: av("Arjun"), school: "Scaler School of Business", gradYear: 2019,
    isVerifiedAlum: true, offersOfficeHours: true,
    company: "Razorpay", role: "VP Strategy", location: "Bengaluru, India",
    officeHoursSlots: [
      { id: "s6", date: "Wed, Nov 27", time: "7:00 PM", duration: "20 min", price: "Free" },
    ],
  },
  // Cohort classmates - same gradYear 2027
  ...Array.from({ length: 12 }).map((_, i) => {
    const names = [
      "Yasodharan Katakam", "Harshal Patil", "Sagar Gupta", "Harshit Poddar",
      "Naresh Vadlamudi", "Abhignaa Alturu", "Mayur Panchal", "Soham Chotalia",
      "Jyoti Kumari Singh", "Sanyukta Singh", "Nikhil Narang", "Venkat Shreyas",
    ];
    const taglines = [
      "Selected at McKinsey for summer internship",
      "Got PPO at Bain & Company",
      "Won 1st place at HUL L.I.M.E case competition",
      "Joined Flipkart as APM intern",
      "Final round at BCG Associate role",
      "Internship offer from Zomato Product team",
      "Presented research at IIM-A conference",
      "Co-founded climate-tech startup",
      "Selected for Goldman Sachs Markets internship",
      "Won inter-college finance quiz",
      "Built ML side project, 2k GitHub stars",
      "Offer from Accenture Strategy",
    ];
    return {
      id: `c${i}`,
      name: names[i],
      headline: `MBA Candidate '27 · ${taglines[i]}`,
      avatar: av(names[i]),
      school: "Scaler School of Business",
      gradYear: 2027,
      isVerifiedStudent: true,
    } as User;
  }),
];

export const findUser = (id: string) => users.find((u) => u.id === id)!;

export type Post = {
  id: string; authorId: string; content: string; image?: string;
  likes: number; comments: number; reposts: number; timestamp: string;
  socialProof?: string;
};

export const posts: Post[] = [
  {
    id: "p1", authorId: "u1",
    content: "Zepto is hiring Business Analysts.\n\nRole Details: 2-4 years exp in analytics, SQL/Python required, work directly with category leadership on growth experiments. DM if interested — happy to refer for SSB juniors.",
    image: "linear-gradient(135deg, #7c3aed, #a855f7)",
    likes: 247, comments: 23, reposts: 12, timestamp: "11h",
    socialProof: "Jitendra Bunkar likes this",
  },
  {
    id: "p2", authorId: "u2",
    content: "Just wrapped a 6-week engagement with a leading FMCG client on go-to-market strategy. Three things I learned about consulting that no MBA case prep teaches you: (1) the answer is rarely the deck (2) the partner only reads page one (3) your client's real question is never the one they asked.",
    likes: 412, comments: 56, reposts: 34, timestamp: "4h",
  },
  {
    id: "p3", authorId: "u3",
    content: "We're hiring APMs at Flipkart for the Grocery vertical. Looking for SSB '27 candidates passionate about consumer tech. Apply through campus or DM me.",
    likes: 189, comments: 41, reposts: 22, timestamp: "1d",
  },
  {
    id: "p4", authorId: "u4",
    content: "Reflection after 2 years at BCG: the best consultants I know don't just solve problems — they teach the client to solve them. Frameworks fade. Capability building compounds.",
    likes: 521, comments: 78, reposts: 45, timestamp: "2d",
  },
  {
    id: "c0", authorId: "c0",
    content: "Beyond grateful to share that I've accepted a Senior Analyst role at Genpact starting next month! Huge thanks to the SSB community and my mentors for the support 🙏",
    likes: 184, comments: 42, reposts: 8, timestamp: "3h",
  },
  {
    id: "c1", authorId: "c1",
    content: "Got my PPO from Bain & Company today! 4 months of work, 100s of late nights, but worth every minute. Thank you Scaler School of Business for the prep!",
    likes: 312, comments: 67, reposts: 15, timestamp: "5h",
  },
  {
    id: "c2", authorId: "c2",
    content: "Team won 1st place at HUL L.I.M.E! 6,500+ teams nationally, last 4 standing. Going to global rounds next month 🎉",
    likes: 421, comments: 89, reposts: 31, timestamp: "1d",
  },
  {
    id: "c3", authorId: "c3",
    content: "Starting my APM internship at Flipkart in the Grocery vertical next week. Excited to learn from the team!",
    likes: 156, comments: 34, reposts: 5, timestamp: "1d",
  },
];

export const stories = users.slice(0, 8);

export const notifications = [
  { id: "n1", type: "referral", avatarId: "u2", content: "Priya Sharma sent you a Referral Ask", preview: "Bain & Company · Senior Consultant role", timestamp: "10m", badge: "Referral Ask" },
  { id: "n2", type: "office", avatarId: "u1", content: "Office Hours booking confirmed", preview: "Thu 4 PM with Rohit Kumar · 15 min", timestamp: "1h", badge: "Office Hours" },
  { id: "n3", type: "like", avatarId: "u3", content: "Aanya Mehta liked your post", preview: "About cohort placement strategies...", timestamp: "2h" },
  { id: "n4", type: "view", avatarId: "u4", content: "Vikram Iyer viewed your profile", preview: "BCG · Associate", timestamp: "3h" },
  { id: "n5", type: "job", avatarId: "u3", content: "New job match: APM at Flipkart", preview: "Bengaluru · ₹28L", timestamp: "4h" },
  { id: "n6", type: "like", avatarId: "u1", content: "Rohit Kumar and 12 others liked your comment", preview: "Great insights on consulting prep!", timestamp: "6h" },
  { id: "n7", type: "mention", avatarId: "u5", content: "Sneha Reddy mentioned you in a post", preview: "@Akshaya Patel had brilliant takeaways...", timestamp: "8h" },
  { id: "n8", type: "like", avatarId: "c2", content: "Sagar Gupta liked your post", preview: "Cohort wins of the week", timestamp: "10h" },
  { id: "n9", type: "job", avatarId: "u2", content: "Bain is hiring at your school", preview: "3 new openings", timestamp: "12h" },
  { id: "n10", type: "view", avatarId: "u6", content: "Arjun Nair viewed your profile", preview: "Razorpay · VP Strategy", timestamp: "14h" },
  { id: "n11", type: "like", avatarId: "c5", content: "Abhignaa Alturu and 4 others reacted to your post", preview: "Internship reflections", timestamp: "1d" },
  { id: "n12", type: "mention", avatarId: "c0", content: "Yasodharan tagged you", preview: "Class of 2027 group photo", timestamp: "1d" },
  { id: "n13", type: "job", avatarId: "u4", content: "BCG opened applications", preview: "Associate Consultant · Mumbai", timestamp: "2d" },
  { id: "n14", type: "like", avatarId: "c7", content: "Soham Chotalia endorsed you", preview: "Skill: Data Management", timestamp: "2d" },
  { id: "n15", type: "view", avatarId: "u1", content: "5 recruiters viewed your profile", preview: "From McKinsey, Bain, BCG", timestamp: "3d" },
];

export const jobs = [
  { id: "j1", company: "Turing", role: "Remote Sr Software Developer - Python", location: "Hyderabad (Remote)", salary: "₹35-45L", postedById: "u1", logo: "T", logoColor: "#000000" },
  { id: "j2", company: "ServiceTitan", role: "Senior Salesforce Developer", location: "India (Remote)", salary: "₹28-38L", postedById: "u3", logo: "S", logoColor: "#1a1a1a" },
  { id: "j3", company: "Accenture in India", role: "Custom Software Engineer", location: "Greater Chennai Area", salary: "₹18-26L", postedById: "u2", logo: "A", logoColor: "#7c3aed" },
  { id: "j4", company: "McKinsey & Company", role: "Business Analyst", location: "Mumbai, India", salary: "₹24-32L", postedById: "u1", logo: "M", logoColor: "#0a66c2" },
  { id: "j5", company: "Flipkart", role: "Associate Product Manager", location: "Bengaluru, India", salary: "₹26-34L", postedById: "u3", logo: "F", logoColor: "#2874f0" },
];

export const messages = [
  { id: "m1", participantId: "u1", lastMessage: "Welcome", timestamp: "Mon", unread: false, badge: "Office Hours", folder: "Focus" },
  { id: "m2", participantId: "u2", lastMessage: "Hello Akshaya, I hope you are doing well. Based on your experience and current ro...", timestamp: "Thu", unread: true, folder: "Focus" },
  { id: "m3", participantId: "u3", lastMessage: "Sponsored · Executive M.Tech in AI & ML Online From NIT Sikkim", timestamp: "May 2", unread: false, folder: "Other" },
  { id: "m4", participantId: "u4", lastMessage: "oh okay! Thank you so much for the info:)", timestamp: "May 2", unread: false, folder: "Focus" },
  { id: "m5", participantId: "c6", lastMessage: "👍", timestamp: "May 1", unread: false, folder: "Focus" },
  { id: "m6", participantId: "c8", lastMessage: "HI jyoti, u can ping me on whatsapp 9575535987", timestamp: "May 1", unread: false, folder: "Focus" },
  { id: "m7", participantId: "c9", lastMessage: "Hi Sanyukta, the avg package is 18L. and most of them are placed.", timestamp: "May 1", unread: false, folder: "Focus", badge: "Referral Ask" },
  { id: "m8", participantId: "u6", lastMessage: "Hi Akshaya, sure Email Id: akshayanakhate123@gmail.com OS - W...", timestamp: "Apr 6", unread: false, folder: "Focus" },
];

export const invitations = [
  { id: "i1", type: "newsletter", title: "Meta invited you to subscribe to Behind the Build", subtitle: "Newsletter · Monthly", time: "19 hours ago", logo: "M", logoColor: "#0668E1" },
  { id: "i2", type: "newsletter", title: "Tata Communications invited you to subscribe to ConnectED Dots", subtitle: "Newsletter · Weekly", time: "6 days ago", logo: "TC", logoColor: "#486AB3" },
  { id: "i3", type: "connection", title: "Vikram Iyer wants to connect", subtitle: "Associate at BCG · 12 mutual", time: "1 day ago", avatarId: "u4" },
];

export const cohortPulse = "12 classmates were selected at consulting firms this week";

export const salaryBenchmark = [
  { function: "Consulting", median: "₹28L", color: "#0a66c2" },
  { function: "Product", median: "₹26L", color: "#057642" },
  { function: "Finance", median: "₹24L", color: "#915907" },
  { function: "Tech", median: "₹22L", color: "#7c3aed" },
];