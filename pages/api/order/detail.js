import fetch from "node-fetch";

export default (req, res) => {
  return new Promise(async (resolve) => {
    try {
      const { Order } = req.body;

      const order = await fetch(`https://jamesworldwide.myshopify.com/admin/api/2020-07/orders/${Order}.json`,{
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.APIKEY}:${process.env.APIPASS}`
            ).toString("base64"),
        },
      }).then(t=>t.json())
      
      res.status(200).end(JSON.stringify({
        ...order
      }))

      return resolve();
    } catch (err) {
      console.log(err)
      res.status(500).end()
      return resolve()
    }
  });
};
