import Fastify from "fastify";
import { request } from "undici";

const app = Fastify();
const PORT = process.env.PORT || 8080;

const GITHUB = "https://api.github.com";

app.get("/github/*", async (req, reply) => {
  const path = req.params["*"] ?? "";
  const url = `${GITHUB}/${path}`;

  try {
    const res = await request(url, {
      headers: { "User-Agent": "simple-github-proxy" }
    });

    const body = await res.body.text();
    reply.type("application/json").status(res.statusCode).send(body);

  } catch (err) {
    reply.status(500).send({ error: "Proxy error", details: err.message });
  }
});

app.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`🟢 Proxy running`);
});
