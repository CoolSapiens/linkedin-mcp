import { readFile } from "node:fs/promises";

const server = JSON.parse(await readFile(new URL("../server.json", import.meta.url), "utf8"));

const required = ["$schema", "name", "title", "description", "version", "repository", "remotes"];
for (const key of required) {
  if (!server[key]) {
    throw new Error(`server.json is missing required field: ${key}`);
  }
}

if (server.name !== "io.github.CoolSapiens/linkedin-mcp") {
  throw new Error(`Unexpected registry name: ${server.name}`);
}

if (!Array.isArray(server.remotes) || server.remotes.length !== 1) {
  throw new Error("server.json must define exactly one remote endpoint");
}

const [remote] = server.remotes;
if (remote.type !== "streamable-http") {
  throw new Error(`Unexpected remote transport type: ${remote.type}`);
}

if (remote.url !== "https://api.talktohumans.app/mcp") {
  throw new Error(`Unexpected remote URL: ${remote.url}`);
}

console.log(`server.json OK: ${server.name}@${server.version}`);
