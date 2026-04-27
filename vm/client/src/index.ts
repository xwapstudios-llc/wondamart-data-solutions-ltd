import { home } from "./routes/home.js";
import { guest } from "./routes/guest.js";
import { user } from "./routes/user.js";
import { admin } from "./routes/admin.js";

export const api = {
  get: home.get,
  guest,
  user,
  admin,
}
