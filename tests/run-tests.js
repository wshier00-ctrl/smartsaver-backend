const searchHandler = require("../dist/api/search.js").default;

async function run() {
  const req = {
    method: "POST",
    headers: {},
    body: {
      query: "ps5 controller",
      location: { lat: 40.7128, lng: -74.006 }
    }
  };

  const res = {
    statusCode: 200,
    _json: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this._json = payload;
      console.log("STATUS:", this.statusCode);
      console.log("BODY:", JSON.stringify(payload, null, 2));
      return this;
    }
  };

  await searchHandler(req, res);
}

run().catch((err) => {
  console.error("Test run failed:", err);
  process.exit(1);
});
