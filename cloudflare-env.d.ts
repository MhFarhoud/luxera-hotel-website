declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD_HASH?: string;
    ADMIN_SESSION_SECRET?: string;
    BUCKET?: R2Bucket;
  }
}
