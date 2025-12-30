export async function onRequestPost({ request, env }: any) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );
  const hashHex = [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');

  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE username = ? AND password_hash = ?"
  ).bind(username, hashHex).first();

  if (!user) return new Response("Invalid login", { status: 401 });

  return new Response("Logged in", {
    headers: { "Set-Cookie": "session=valid; HttpOnly; Secure; Path=/" }
  });
}
