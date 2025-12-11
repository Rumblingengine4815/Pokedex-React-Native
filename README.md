# Pokedex (Expo + React Native)

Small Pokédex app (Expo + TypeScript) that lists Pokémon, shows details and evolution chains with artwork.

## Features
- List of Pokémon (first 70) with sprites and primary type color
- Details screen with height, weight, types and official artwork
- Evolution chain parsing and display with images
- File-based routing via `expo-router` (dynamic route `[name].tsx`)

## Repo layout
- app/
  - index.tsx       — Home list
  - [name].tsx      — Dynamic details (fetches evolutions & images)
  - _layout.tsx     — Stack layout & presentation
- package.json
- tsconfig.json
- babel.config.js (module-resolver for path aliases)

## Prerequisites
- Node.js (16+ recommended)
- npm
- Expo CLI: `npm install -g expo-cli` (or use `npx expo`)
- Android SDK (if you use emulator) and emulator/adb on PATH
- Expo Go on device / emulator (or use dev client)

## Quick start (development)

1. Install dependencies
```powershell
npm install
```

2. Start Metro / Expo
```powershell
npx expo start
# To force clear cache:
npx expo start -c
```

3. Open on Android emulator / device
- With emulator already running:
```powershell
# ensure adb reverse so device can reach the dev server
& "C:\Users\User\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081
& "C:\Users\User\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:19000 tcp:19000

# then from the expo terminal press "a" or:
npx expo start --android
```

- If using a physical device, open Expo Go and scan the QR code shown by `expo start` (use LAN or Tunnel connection depending on network).

## Create / launch Android emulator (example)
Replace AVD name with yours (`MyPixel`, `Medium_Phone_API_36.1`, etc.)

```powershell
$SDK = "C:\Users\User\AppData\Local\Android\Sdk"
# start emulator
& "$SDK\emulator\emulator.exe" -avd MyPixel

# check devices
& "$SDK\platform-tools\adb.exe" devices
```

If `adb` shows device as `offline`, restart adb:
```powershell
& "$SDK\platform-tools\adb.exe" kill-server
Start-Sleep -s 1
& "$SDK\platform-tools\adb.exe" start-server
& "$SDK\platform-tools\adb.exe" devices
```

## Common issues & fixes

- Expo Go not installed on emulator:
  - Install Expo Go from Play Store on the emulator, or use `npx expo start --tunnel` and open the QR code on a physical device.

- Device offline / ADB issues:
  - Kill and restart adb (see commands above).
  - Cold-boot emulator: `& "$SDK\emulator\emulator.exe" -avd MyPixel -wipe-data`

- Slow Expo Go loading:
  - Use `expo start -c`
  - Prefer LAN connection (if same network) instead of Tunnel
  - Use `adb reverse` for emulator/device to connect directly to Metro

- RN Web errors (style arrays / gap):
  - React Native Web does not accept style arrays or CSS `gap`. Merge style objects (spread) and use margins.

## Details about implementation
- Home (`app/index.tsx`):
  - Fetches `https://pokeapi.co/api/v2/pokemon/?limit=70`
  - Uses `Promise.all()` to fetch details for each Pokémon in parallel
  - Normalizes `types` from API to an array of `{ name, url }`

- Details (`app/[name].tsx`):
  - Fetches Pokémon by name, then species data to get `evolution_chain.url`
  - Parses the evolution chain tree recursively
  - Fetches each evolution's Pokémon data to obtain `sprites.other["official-artwork"].front_default`
  - Falls back to ID-based artwork URL when necessary

## Git / deploy
- Add remote and push:
```powershell
git remote add origin https://github.com/<your-repo>.git
git add .
git commit -m "Initial Pokedex"
git push -u origin main
```

## Extending / next steps
- Add search and filters
- Add favorites and local persistence
- Show abilities and stats
- Improve UI/UX and accessibility
- Create an EAS dev client to avoid Expo Go bundle download every run

## Troubleshooting help
If you hit a specific runtime error, copy the terminal/Metro log and the stack trace and reopen an issue or run:
```powershell
# restart dev server with verbose logs
npx expo start --tunnel
```

---

