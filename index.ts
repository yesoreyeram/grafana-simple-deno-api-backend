import { parse } from "https://deno.land/std/flags/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const args = parse(Deno.args);
const port = args.port || 8080;
const BANNER = `Simple Grafana Deno REST API Server.\nRefer https://github.com/yesoreyeram/grafana-simple-deno-api-backend for more details.`;

const app = new Application();
const router = new Router();

router.all("/", async (ctx: any) => {
    ctx.response.body = BANNER;
})
router.post("/search", async (ctx: any) => {
    if (ctx.request.hasBody) {
        const body = await ctx.request.body({ type: 'json' }).value;
        switch (body.target) {
            case "Servers()":
                ctx.response.body = ["Server 1", "Server 2", "Server 3"];
                break;
            case "Teams()":
                ctx.response.body = ["Team A", "Team B"];
                break;
            default:
                ctx.response.body = ["cpu", "memory"];
                break;
        }
    } else {
        ctx.response.status = 404;
        ctx.response.body = `Requested route not found.\n\n${BANNER}`;
    }
})
router.post("/query", async (ctx: any) => {
    if (ctx.request.hasBody) {
        const body = await ctx.request.body({ type: 'json' }).value;
        const startTime = new Date(body.range.from).getTime();
        const endTime = new Date(body.range.to).getTime();
        var result: any[] = [];
        body.targets.forEach((target: any) => {
            if (target.type === 'timeserie') {
                let dataPointTime = startTime;
                const datapoints: any[] = [];
                let value = ([0, 20, 50, 70][Math.floor(Math.random() * 4)]);
                while (dataPointTime < endTime) {
                    value += ([-1, 0, 1][Math.floor(Math.random() * 3)])
                    datapoints.push([
                        value, startTime + (datapoints.length * 60 * 1000)
                    ]);
                    dataPointTime = dataPointTime + (60 * 1000)
                }
                result.push({
                    target: target.target,
                    datapoints
                });
            } else if (target.type === 'table') {
                result.push({
                    columns: [{ text: 'Server', type: 'string' }, { text: target.target, type: 'number' }],
                    rows: [
                        ['Server 1', Math.random() * 100],
                        ['Server 2', Math.random() * 100],
                        ['Server 3', Math.random() * 100],
                    ]
                })
            }
        })
        ctx.response.body = result;
    } else {
        ctx.response.status = 404;
        ctx.response.body = `Requested route not found.\n\n${BANNER}`;
    }
})
router.post("/annotations", async (ctx: any) => {
    if (ctx.request.hasBody) {
        const body = await ctx.request.body({ type: 'json' }).value;
        const startTime = new Date(body.range.from).getTime();
        const endTime = new Date(body.range.to).getTime();
        var annotations: any[] = [];
        let dataPointTime = startTime;
        while (dataPointTime < endTime) {
            annotations.push({
                title: `${body.annotation.query} ${annotations.length + 1}`,
                time: startTime + (annotations.length * ((endTime - startTime) / 3)) + (Math.random() * 5 * 60 * 10000),
                text: `Description of event ${body.annotation.query} ${annotations.length + 1}`,
                tags: ["Tag A", "Tag B", body.annotation.query]
            });
            dataPointTime = dataPointTime + ((endTime - startTime) / 3) + 20000;
        }
        ctx.response.body = annotations;
    } else {
        ctx.response.status = 404;
        ctx.response.body = `Requested route not found.\n\n${BANNER}`;
    }
})

app.use(async (ctx, next) => {
    await next();
    ctx.response.headers.set("Access-Control-Allow-Origin", `*`);
    ctx.response.headers.set("Access-Control-Allow-Methods", `POST`);
    ctx.response.headers.set("Access-Control-Allow-Headers", `accept, content-type`);
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx: any) => {
    ctx.response.status = 404;
    ctx.response.body = `Requested route not found.\n\n${BANNER}`;
})

console.log(`Grafana API Server running on port ${port}`);
await app.listen({ port });