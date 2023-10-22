function emptyCache() {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name)
    })
  })
}

export default emptyCache
