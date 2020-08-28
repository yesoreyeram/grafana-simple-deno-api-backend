import { Context } from "./../deps.ts";
import { BANNER } from "./../config/config.ts";

export const defaultRoute = async (ctx: Context) => {
  ctx.response.body = BANNER;
};
