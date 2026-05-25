import { spawn } from 'child_process'

console.log('Starting migration generation with periodic enter heartbeat...')

const child = spawn('pnpm', ['payload', 'migrate:create', 'add_property_archive_block'], {
  stdio: ['pipe', 'pipe', 'inherit'],
})

const intervalId = setInterval(() => {
  console.log('[Script Heartbeat] Writing newline to stdin...')
  child.stdin.write('\n')
}, 4000)

child.stdout.on('data', (data) => {
  const text = data.toString()
  process.stdout.write(text)
})

child.on('close', (code) => {
  clearInterval(intervalId)
  console.log(`Migration script exited with code ${code}`)
})
