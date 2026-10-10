/*
  Friday Startup website settings.
  Replace placeholder contact details and add only verified account URLs.
  launchAt must include an explicit timezone (ISO 8601).
*/
window.FRIDAY_STARTUP_CONFIG = {
  // Replace with the real company inbox before accepting live inquiries.
  contactEmail: "hello@fridaystartup.com",

  // Leave empty until each official Friday Startup profile is ready.
  // For gmail, enter an email address; for other platforms, enter the profile URL.
  socials: {
    facebook: "",
    instagram: "",
    gmail: "",
    x: "",
    linkedin: "",
    whatsapp: ""
  },

  // Optional channels; populated values are shown as working contact links.
  contactOptions: {
    phone: "",
    whatsapp: "",
    bookingUrl: ""
  },

  // Announcements appear automatically 48 hours before launchAt.
  // At launchAt, the product moves into the right-to-left logo lineup.
  launches: []
};
