/*
  Friday Startup website settings.
  Only the supplied official contact destinations are published.
  launchAt must include an explicit timezone (ISO 8601).
*/
window.FRIDAY_STARTUP_CONFIG = {
  contactEmail: "fridaystartup1@gmail.com",

  socials: {
    facebook: "https://www.facebook.com/share/1BN3iJyHXs/",
    instagram: "https://instagram.com/friday_startup?obrf=MWU1YmhocDRiYWo2aw%3D%3D",
    x: "https://x.com/Fridaystartup",
    gmail: "fridaystartup1@gmail.com"
  },

  // Approved newsroom stories appear at publishAt. Future-dated items show as upcoming.
  newsItems: [],

  // Product previews appear in News 48 hours before launchAt.
  // At launchAt, the product moves into the right-to-left logo lineup.
  launches: []
};
