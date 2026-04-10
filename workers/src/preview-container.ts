import { Container } from "@cloudflare/containers";

export class PreviewContainer extends Container {
  defaultPort = 3100;
  sleepAfter = "30m";

  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "DELETE" && url.pathname === "/destroy") {
      await this.destroy();
      return new Response("ok");
    }
    return super.fetch(request);
  }
}
