export const config = { runtime: 'edge' };

export default async function handler() {
  return new Response(
    JSON.stringify({ ok: true, service: 'backend', ts: Date.now() }),
    { headers: { 'content-type': 'application/json' }, status: 200 }
  );
}
