const elconsole = require('./elconsole')
try {
  // things to checkout:
  /*
   * Events;
   * PLAYER_INI;
   * RESSOURCES
   * SETTING_DOMAIN_IMG
   * __DZR_APP_STATE__
   * __devtron
   */ 

  
  const DeezerStreaming = require('./Deezer/DeezerStreaming')
  /*eslint-disable */
  const deezerStreaming = new DeezerStreaming()
  /*eslint-enable */
} catch (ex) {
  elconsole.error('Error', ex)
}
