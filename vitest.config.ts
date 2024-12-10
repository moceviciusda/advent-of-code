import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./src/**/*.test.ts'], // Pattern for test files
    globals: true, // Enable global test functions
  },
});
