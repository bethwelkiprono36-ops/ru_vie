# RuView — Wi-Fi Sensing Dashboard

A mobile-friendly dashboard prototype for exploring Wi-Fi Channel State Information (CSI) sensing workflows. It includes an interactive simulator with clear labels showing that demo readings are simulated.

## Deploy on Vercel

1. Import this repository into Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Install command: `npm install`.
6. Deploy.

## Run locally

```bash
npm install
npm run dev
```

## Included

- Responsive dark dashboard for mobile and desktop
- Demo mode toggle and animated simulated signal stream
- Presence and movement demo indicators
- Room-map visualization using simulated tracks
- Signal quality, device, and backend status panels
- Setup guide for connecting a real sensing backend

## Important technical limitation

This repository is a frontend dashboard and simulator, not a complete Wi-Fi sensing instrument. Browsers and Vercel static hosting cannot directly capture Wi-Fi CSI from a phone or ordinary router. Real sensing requires compatible CSI-capable hardware/firmware and a separate data collection and processing service. Do not treat simulated readings as real presence, medical, or security information.
