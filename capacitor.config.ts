import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kkrll.abc_society",
  appName: "ABC Society",
  webDir: "dist", // Vite uses 'dist' not 'build'
  server: {
    androidScheme: "https",
  },
};
