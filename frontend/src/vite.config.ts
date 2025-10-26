export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  }
})
