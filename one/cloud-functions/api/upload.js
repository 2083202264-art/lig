import { createStorage } from 'edgeone-kv';
const storage = createStorage('photos');

export default async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('{"error":"只接受POST请求"}', { status: 405 });
  }
  try {
    const formData = await context.request.formData();
    const file = formData.get('photo');
    if (!file) return new Response('{"error":"没收到图片"}', { status: 400 });
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const data = new Uint8Array(await file.arrayBuffer());
    await storage.put(name, data);
    return new Response(JSON.stringify({ url: '/photos/' + name }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('{"error":"上传失败"}', { status: 500 });
  }
}