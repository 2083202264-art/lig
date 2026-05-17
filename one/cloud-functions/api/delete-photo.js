import { createStorage } from 'edgeone-kv';
const storage = createStorage('photos');

export default async function onRequest(context) {
  if (context.request.method !== 'DELETE') {
    return new Response('{"error":"只接受DELETE请求"}', { status: 405 });
  }
  try {
    const url = new URL(context.request.url);
    const filename = url.searchParams.get('filename');
    if (!filename) return new Response('{"error":"缺少文件名"}', { status: 400 });
    await storage.delete(filename);
    return new Response('{"success":true}', {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('{"error":"删除失败"}', { status: 500 });
  }
}