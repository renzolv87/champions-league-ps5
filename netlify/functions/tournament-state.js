const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'champions-ps5';
const KEY = 'shared-state';
const BLOBS_SITE_ID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.NETLIFY_BLOBS_SITE_ID;
const BLOBS_TOKEN = process.env.NETLIFY_TOKEN || process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    },
    body: JSON.stringify(body)
  };
}

function getConfiguredStore() {
  if (BLOBS_SITE_ID && BLOBS_TOKEN) {
    return getStore({
      name: STORE_NAME,
      siteID: BLOBS_SITE_ID,
      token: BLOBS_TOKEN
    });
  }
  return getStore(STORE_NAME);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });

  let store;
  try {
    store = getConfiguredStore();
  } catch (err) {
    return json(500, {
      error: 'Netlify Blobs no configurado.',
      detail: 'Define NETLIFY_SITE_ID y NETLIFY_TOKEN en el sitio de Netlify para habilitar estado compartido.',
      missing: {
        NETLIFY_SITE_ID: !BLOBS_SITE_ID,
        NETLIFY_TOKEN: !BLOBS_TOKEN
      }
    });
  }

  if (event.httpMethod === 'GET') {
    const entry = await store.getWithMetadata(KEY, { type: 'json', consistency: 'strong' });
    if (!entry) {
      return json(200, { state: null, etag: null, updatedAt: null });
    }
    return json(200, {
      state: entry.data,
      etag: entry.etag,
      updatedAt: entry.metadata?.updatedAt || null
    });
  }

  if (event.httpMethod === 'PUT') {
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (err) {
      return json(400, { error: 'JSON invalido.' });
    }

    if (!payload || typeof payload !== 'object' || !payload.state) {
      return json(400, { error: 'Falta state en el body.' });
    }

    const metadata = { updatedAt: new Date().toISOString() };

    if (payload.etag) {
      const update = await store.setJSON(KEY, payload.state, {
        onlyIfMatch: payload.etag,
        metadata
      });

      if (!update.modified) {
        const current = await store.getWithMetadata(KEY, { type: 'json', consistency: 'strong' });
        return json(409, {
          error: 'Conflicto de escritura. El estado remoto cambio antes de guardar.',
          state: current?.data || null,
          etag: current?.etag || null,
          updatedAt: current?.metadata?.updatedAt || null
        });
      }

      return json(200, { ok: true, etag: update.etag, updatedAt: metadata.updatedAt });
    }

    const create = await store.setJSON(KEY, payload.state, { onlyIfNew: true, metadata });

    if (!create.modified) {
      const current = await store.getWithMetadata(KEY, { type: 'json', consistency: 'strong' });
      return json(409, {
        error: 'El estado remoto ya existe. Recarga antes de guardar.',
        state: current?.data || null,
        etag: current?.etag || null,
        updatedAt: current?.metadata?.updatedAt || null
      });
    }

    return json(200, { ok: true, etag: create.etag, updatedAt: metadata.updatedAt });
  }

  return json(405, { error: 'Metodo no permitido.' });
};
