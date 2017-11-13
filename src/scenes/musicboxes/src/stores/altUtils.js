const alt = require('./alt')

module.exports = {
  createStore: (store, name = store.displayName) => {
    if (module.hot) {
      module.hot.accept(() => {
        console.log(alt.stores)
        // return alt.createStore(store, name)
        delete alt.stores[name]
      })
    }

    return alt.createStore(store, name)
  }
}