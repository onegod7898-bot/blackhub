// Service worker for Web Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const data = event.data.json()
    const title = data.title || 'BlackHub'
    const body = data.body || ''
    const url = data.url || '/'
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        data: { url },
        tag: data.data?.type || 'blackhub',
      })
    )
  } catch {
    event.waitUntil(self.registration.showNotification('BlackHub', { body: 'New notification' }))
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    if (cs.length) cs[0].focus()
    if (clients.openWindow) clients.openWindow(url)
  }))
})
