import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const { auditAgentSpecs } = await server.ssrLoadModule("/src/enhance/sources.ts");
  const result = auditAgentSpecs();
  console.log(`Agent specs: ${result.checked} checked, ${result.errors.length} errors`);
  for (const error of result.errors) console.error(`- ${error}`);
  if (result.errors.length) process.exitCode = 1;
} finally {
  await server.close();
}
