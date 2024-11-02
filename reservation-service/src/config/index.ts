export default () => ({
    broker: process.env.BROKER ?? 'localhost:9092',
    services: {
      reservation: {
        clientId: 'reservation',
        groupId: 'reservation',
        name: 'reservation-kafka-client',
      },
      payment: {
        clientId: 'payment',
        groupId: 'payment',
        name: 'payment-kafka-client',
      },
      availability: {
        clientId: 'availability',
        groupId: 'availability',
        name: 'availability-kafka-client',
      },
    },
  });