import { join } from "node:path";

// Tailwind first, then `.is-hover` added to every :hover selector (record-mode cursor, lib/postcss-record-hover.cjs).
// Absolute path, so the plugin resolves the same way from any working folder.
export default { plugins: { "@tailwindcss/postcss": {}, [join(process.cwd(), "lib/postcss-record-hover.cjs")]: {} } };
