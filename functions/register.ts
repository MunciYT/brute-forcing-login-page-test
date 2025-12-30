export async function onRequestPost({ request, env }: any) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );

  const hashHex = [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  try {
    await env.DB.prepare(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)"
    ).bind(username, hashHex).run();
  } catch {
    return new Response("User already exists", { status: 400 });
  }

  return new Response("Registered");
}
