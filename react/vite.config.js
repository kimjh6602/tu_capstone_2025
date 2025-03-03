import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // base: "/static/",  // ✅ Django의 STATIC_URL과 일치하게 설정 (삭제 후 정상 비로그인 커뮤니티 접속 시 뜨던 에러 해결)
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});