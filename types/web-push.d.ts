declare module 'web-push' {
  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void

  export interface PushSubscription {
    endpoint: string
    keys?: { p256dh: string; auth: string }
  }

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer,
    options?: { TTL?: number }
  ): Promise<{ statusCode: number }>

  export function generateVAPIDKeys(): { publicKey: string; privateKey: string }
}
