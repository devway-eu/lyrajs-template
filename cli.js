#!/usr/bin/env node

import { createApp } from './src/createApp.js'

(async () => {
  await createApp()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
