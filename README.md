# snippets app live demo

This is a live demo for https://github.com/bao00022/nextjs_tutorial

## demo data auto reset

To keep live demo data clean, the app now auto-resets snippet records every 5 minutes by default.

Environment variables:

- `DEMO_AUTO_RESET_ENABLED`: set to `false` to disable auto reset (default: enabled).
- `DEMO_RESET_INTERVAL_MS`: reset interval in milliseconds (default: `300000`, i.e. 5 minutes).

Examples:

```bash
# keep default behavior (auto reset every 5 minutes)
npm run dev

# custom: reset every 2 minutes
DEMO_RESET_INTERVAL_MS=120000 npm run dev

# disable auto reset
DEMO_AUTO_RESET_ENABLED=false npm run dev
```
