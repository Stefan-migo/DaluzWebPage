
const { sanitizeProductPayload } = require('./src/lib/products/sanitize');

const testBody = {
  name: "Test",
  category_id: "",
  access_id: "",
  price: "100"
};

const payload = sanitizeProductPayload(testBody);
console.log("Payload:", JSON.stringify(payload, null, 2));

if (payload.category_id === null) {
  console.log("SUCCESS: category_id is null");
} else {
  console.log("FAILURE: category_id is", typeof payload.category_id, payload.category_id);
}
