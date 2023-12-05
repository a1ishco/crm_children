import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://crm-api.qmeter.net/api/',
    VITE_API_CHILDREN_BASE_URL: process.env.VITE_API_CHILDREN_BASE_URL || 'https://w4st1b2x-8754.euw.devtunnels.ms/api/customers/',
  },
});
