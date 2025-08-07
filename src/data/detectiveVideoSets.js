export const detectionSets = [
  // 1) Famous Faces Speaking Out (Celebrity Speeches)
  {
    title: "Famous Faces Speaking Out",
    videos: [
      { url: "/videos/detection/Real1.mp3", label: "real" },
      { url: "/videos/detection/Fake1.mp3", label: "fake" }
    ]
  },

  // 2) Tech Visionary Speaks (Elon Musk's Talks)
  {
    title: "Tech Visionary Speaks",
    videos: [
      { url: "/videos/detection/Fake2.mp3", label: "fake" },
      { url: "/videos/detection/Fake22.mp3", label: "fake" }
    ]
  },

  // 3) Science in Action (Scientists' Talks)
  {
    title: "Science in Action",
    videos: [
      { url: "/videos/detection/Fake3.mp3", label: "fake" },
      { url: "/videos/detection/Real3.mp3", label: "real" }
    ]
  },

  // 4) Tales of Legends (Giants Stories)
  {
    title: "Tales of Legends",
    videos: [
      { url: "/videos/detection/Fake4.mp3", label: "fake" },
      { url: "/videos/detection/Fake44.mp3", label: "fake" }
    ]
  },

  // 5) Laugh Out Loud (Funny Videos)
  {
    title: "Laugh Out Loud",
    videos: [
      { url: "/videos/detection/Fake5.mp3", label: "fake" },
      { url: "/videos/detection/Fake55.mp3", label: "fake" }
    ]
  },

  // 6) Meet the Guys (Men's Intro)
  {
    title: "Meet the Guys",
    videos: [
      { url: "/videos/detection/Fake6.mp3", label: "fake" },
      { url: "/videos/detection/Real6.mp3", label: "real" }
    ]
  },

  // 7) Acts of Kindness (Charity)
  {
    title: "Acts of Kindness",
    videos: [
      { url: "/videos/detection/Real7.mp3", label: "real" },
      { url: "/videos/detection/Fake7.mp3", label: "fake" }
    ]
  },

  // 8) Breaking Stories (News)
  {
    title: "Breaking Stories",
    videos: [
      { url: "/videos/detection/Real8.mp3", label: "real" },
      { url: "/videos/detection/Fake8.mp3", label: "fake" }
    ]
  },

  // 9) Action & Moves (Motions)
  {
    title: "Action & Moves",
    videos: [
      { url: "/videos/detection/Fake9.mp3", label: "fake" },
      { url: "/videos/detection/Fake99.mp3", label: "fake" }
    ]
  },

  // 10) Style on Screen (Fashion Commercials)
  {
    title: "Style on Screen",
    videos: [
      { url: "/videos/detection/Fake10.mp3", label: "fake" },
      { url: "/videos/detection/Fake11.mp3", label: "fake" }
    ]
  }
];

// Use same 10 groups for both phases
export const detectivePreSets = detectionSets;
export const detectivePostSets = detectionSets;
