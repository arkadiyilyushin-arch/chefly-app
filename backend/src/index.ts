type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

export interface Env {
  VAULT: KVNamespace;
}

type SyncPayload = {
  userId: string;
  followingIds: string[];
  savedPostIds: string[];
  updatedAt: number;
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/v1\/sync\/([^/]+)$/);
    if (!match) {
      return Response.json({ ok: true, service: 'chefly-sync' }, { headers: cors });
    }

    const userId = decodeURIComponent(match[1]);
    const key = `user:${userId}`;

    if (request.method === 'GET') {
      const raw = await env.VAULT.get(key);
      if (!raw) return new Response(null, { status: 404, headers: cors });
      return new Response(raw, {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'PUT') {
      const body = (await request.json()) as SyncPayload;
      const payload: SyncPayload = {
        userId,
        followingIds: body.followingIds ?? [],
        savedPostIds: body.savedPostIds ?? [],
        updatedAt: Date.now(),
      };
      await env.VAULT.put(key, JSON.stringify(payload));
      return Response.json(payload, { headers: cors });
    }

    return new Response('Method not allowed', { status: 405, headers: cors });
  },
};
