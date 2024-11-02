export default () => ({
    broker: process.env.BROKER ?? 'localhost:9092',
    services: {
      payment: {
        clientId: 'payment',
        groupId: 'payment',
        name: 'payment-kafka-client',
      },
    },
  });