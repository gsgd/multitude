const alt = require('./alt')

const altUtils = {
  createStore: (store, name = store.displayName) => {
    if (module.hot) {
      module.hot.accept(() => {
        delete alt.stores[name]
        return alt.createStore(store, name)
      })
    }

    return alt.createStore(store, name)
  }
}
module.exports = altUtils
