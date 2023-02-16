const crypto = require("crypto");


/*
 * Improvements
 * - I assigned TRIVIAL_PARTITION_KEY to candidate initially to avoid redundant if/else statement later on.
 * - I moved the check for the type of candidate inside the block as it can't be an object outside that block
 * - I moved the partition key generator in a loop to make sure that the key is always going to be <= MAX_PARTITION_KEY_LENGTH
 *    although it might be unnecessary as it would never generate a value bigger than MAX_PARTITION_KEY_LENGTH but
 *    since I am not sure of the functionality as to how it works, I will rather keep it.
 */

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate = TRIVIAL_PARTITION_KEY;

  // check of empty events or null or undefined
  if (!event) {
    return candidate;
  }

  if (event.partitionKey) {
    candidate = event.partitionKey;
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    const data = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  while (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};