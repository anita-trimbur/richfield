import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next registers the jsx-a11y plugin but enables only a few
  // of its rules; turn on the full recommended set to help enforce WCAG AA.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // Must come last: disables stylistic rules that would conflict with Prettier.
  prettier,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
