import { createStorage } from 'edgeone-kv';
const storage = createStorage('photos');

export default async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const filename = url.pathname.split('/').pop();
    const photoData = await storage.get(filename);
    if (!photoData) return new Response('Not Found', { status: 404 });
    return new Response(photoData, {
      headers: { 'Content-Type': 'image/jpeg' }
    });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
}