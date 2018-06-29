const introText = [
  'Now Playing',
  'This is',
  'You\'re   listening to',
  'Up now',
  'Right now'
]

const voices = {
  // todo convert to promise based to return when loaded using window.speechSynthesis.onvoiceschanged
  getVoices: () => { return window.speechSynthesis.getVoices() },
  getIntro: () => { return introText[(Math.random() * introText.length) | 0] }
}
module.exports = voices
