const mongoose = require('mongoose')

const { Schema } = mongoose

const SiteSettingSchema = new Schema({
  name: { type: String, required: true, default: 'Site name' },
  description: { type: String, required: true, default: 'A cool website.' },
  twitterHandle: { type: String, required: false },
  youtubeChannel: { type: String, required: false },
  subreddit: { type: String, required: false },
  githubProfile: { type: String, required: false },
  headerBackgroundImage: { type: String, required: false },
  smtpHost: { type: String, required: true, default: 'localhost' },
  smtpPort: { type: Number, required: true, default: 25 },
  smtpUsername: { type: String, required: false },
  smtpPassword: { type: String, required: false },
  requireEmailVerification: { type: Boolean, required: true, default: false },
  copyrightText: { type: String, required: false },
  showDeveloperCredit: { type: Boolean, required: true, default: false },
  developerGitHubLinkInCredit: { type: Boolean, required: true, default: true },
  httpStatusCodeCats: { type: Boolean, required: true, default: false }
})

module.exports = mongoose.model('sitesetting', SiteSettingSchema)
