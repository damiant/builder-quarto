import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: { ignorePatterns: [".builder/skills/**"] },
  lint: {
    ignorePatterns: [".builder/skills/**"],
    options: { typeAware: true, typeCheck: true },
  },
});
