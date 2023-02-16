const {deterministicPartitionKey} = require('./dpk');
describe("deterministicPartitionKey", () => {

  const bigPartitionKey = {
    name: "John Doe",
    age: 32,
    email: "johndoe@example.com",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345"
    },
    phoneNumbers: [
      {
        type: "home",
        number: "555-555-5555"
      },
      {
        type: "work",
        number: "555-555-1234"
      }
    ],
    hobbies: [
      "reading",
      "hiking",
      "playing video games"
    ],
    education: {
      degree: "Bachelor's",
      major: "Computer Science",
      school: "University of Anytown"
    }
  };


  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it('should generate a deterministic partition key when event that has a string partition key', () => {
    const event = {partitionKey: "my-partition-key"};
    const result = deterministicPartitionKey(event);
    expect(result).toBe('my-partition-key');
  });

  it('should generate a deterministic partition key when event is a string', () => {

    const event = "test";
    const result = deterministicPartitionKey(event);

    expect(result).toBe('0fa3727b22cbb0a5271dddfcb7d414a1a512284913ccd690b198751de8100b1ea1935c1b63c35837696f8e73709431de092894581bec9bbfe6532106733af6d8');
  });

  it('should generate a deterministic partition key when event has a partitionKey but is an object', () => {

    const event = {partitionKey: {some: "object"}};
    const result = deterministicPartitionKey(event);
    expect(result).toBe(JSON.stringify(event.partitionKey));
  });

  it('should generate a deterministic partition key when event\'s partition key  is a string', () => {

    const event = {partitionKey: 'test'};
    const result = deterministicPartitionKey(event);

    expect(result).toBe('test');
  });

  it('should generate a partition key when partition key is a long string > MAX_PARTITION_KEY_LENGTH', () => {

    const event = {
      partitionKey: 'testsdjhgsdjhdsjgdjsdgjsdhgdsghhjgdsgjdhsgbjhdsbgdsjhbgsdjhbdsjhbdsjhdbsjdsbjhdsbjhsdbjdhsbdsjhbdsjhbdsjhbdsjhdsbjdsbjdsbjdshbdsjhb' +
        'testsdjhgsdjhdsjgdjsdgjsdhgdsghhjgdsgjdhsgbjhdsbgdsjhbgsdjhbdsjhbdsjhdbsjdsbjhdsbjhsdbjdhsbdsjhbdsjhbdsjhbdsjhdsbjdsbjdsbjdshbdsjhb'
    };
    const result = deterministicPartitionKey(event);

    expect(result).toBe('80c3e8b1435302839dd743f164817b094209584b8ccb722dd95a1ae1d15a88ed030be8a8e9adaf4cc18e9be667fc47b689a3df4e3f27d1b018777433caba5ae8');
  });

  it('should generate a partition key is a big JS object', () => {

    const event = {partitionKey: bigPartitionKey};
    const result = deterministicPartitionKey(event);

    expect(result).toBe('86eeb3d4e394dce4f50923c27e56be1230318c95135c6227f10d0e809ffa1242ecc3a5373d0735ff7bb82bf3189b6cc4f1270957ca92a31c5753b8bec3f83063');
  });

});
