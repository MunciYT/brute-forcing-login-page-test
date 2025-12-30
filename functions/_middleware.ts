export async function onRequest({ request, next }: any) {
  const cookie = request.headers.get("Cookie") || "";
  if (request.url.endsWith("/protected") && !cookie.includes("session=valid")) {
    return new Response("Unauthorized", { status: 401 });
  }
  return next();
}
