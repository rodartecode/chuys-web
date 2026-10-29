// Stands in for `cloudflare:workers` under Vitest (aliased in vitest.config.ts).
// Tests set secrets by mutating this object; never reassign it.
export const env = {} as Cloudflare.Env;
