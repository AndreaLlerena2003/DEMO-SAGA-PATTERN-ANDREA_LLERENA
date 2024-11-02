export default () => ({
  broker: 'localhost:9092', 
  services: {
    availability: {
      clientId: 'availability',
      groupId: 'availability',
      name: 'availability-kafka-client',
    },
  },
});
