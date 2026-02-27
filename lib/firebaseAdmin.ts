// Firebase Admin is disabled for demo purposes
// In production, configure proper Firebase Admin credentials

export const adminDb = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: () => Promise.resolve({ 
        data: () => null,
        exists: false,
        id: 'demo-order'
      }),
      set: (data: any) => Promise.resolve(),
      update: (data: any) => Promise.resolve(),
    }),
    where: (field: string, op: string, value: any) => ({
      limit: (count: number) => ({
        get: () => Promise.resolve({ empty: true, docs: [] }),
      }),
    }),
    orderBy: (field: string, direction: string) => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
    get: () => Promise.resolve({ 
      docs: [
        {
          id: 'demo-order-1',
          data: () => ({
            orderId: 'demo-order-1',
            createdAt: new Date(),
            status: 'new',
            customer: { name: 'Demo Customer', email: 'demo@demo.com' },
            config: { usageType: 'UAV', voltageClass: '24V' },
            choices: { bms: 'Standard 20–40A', connector: 'XT60' },
            pricing: { total: 1000 },
            payment: { stripeSessionId: 'demo-session' }
          })
        }
      ]
    }),
  }),
}

export const adminStorage = {
  bucket: () => ({
    name: 'demo-bucket',
    file: (name: string) => ({
      save: (buffer: Buffer, options?: any) => Promise.resolve([{ name: 'demo.pdf' }]),
      getSignedUrl: () => Promise.resolve(['https://demo.com/file.pdf']),
      makePublic: () => Promise.resolve(),
    }),
  }),
}

export const adminApp = null
