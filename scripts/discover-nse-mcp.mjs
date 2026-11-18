import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const environment = process.env;
const deployment = ["VERCEL", "VERCEL_ENV", "VERCEL_TARGET_ENV", "CI"].some(
  (key) => environment[key] !== undefined,
);
if (
  environment.MARKET_DATA_PROVIDER !== "nse-mcp" ||
  environment.NSE_MCP_LOCAL_RESEARCH_ENABLED !== "true" ||
  environment.NODE_ENV !== "development" ||
  deployment
) {
  console.error(
    "NSE tool discovery requires explicit local development research settings.",
  );
  process.exitCode = 1;
} else {
  const endpoint = new URL("https://mcp.nseindia.in/cmmkt/mcp");
  const signal = AbortSignal.timeout(10000);
  const transport = new StreamableHTTPClientTransport(endpoint, {
    requestInit: { redirect: "error", signal },
    reconnectionOptions: {
      maxReconnectionDelay: 1000,
      initialReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1,
      maxRetries: 0,
    },
  });
  const client = new Client({
    name: "marketpulse-local-discovery",
    version: "1.0.0",
  });
  try {
    await client.connect(transport, { timeout: 10000, signal });
    let cursor;
    const seen = new Set();
    for (let page = 0; page < 5; page++) {
      const result = await client.listTools(cursor ? { cursor } : undefined, {
        timeout: 10000,
        signal,
      });
      for (const {
        name,
        description,
        inputSchema,
        outputSchema,
      } of result.tools) {
        console.log(
          JSON.stringify({ name, description, inputSchema, outputSchema }),
        );
      }
      cursor = result.nextCursor;
      if (!cursor) break;
      if (seen.has(cursor) || page === 4)
        throw new Error("Tool discovery pagination limit reached.");
      seen.add(cursor);
    }
  } catch (error) {
    console.error(
      "NSE metadata discovery failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}
