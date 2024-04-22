/** @type {import('next').NextConfig} */
const cron = require('node-cron')
let got
import('got').then(module => {
  got = module.default
})

cron.schedule('* * * * *', function () {
  console.log('running a task every minute')
  got('http://localhost:4000/api/cron/order', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.CRON_SECRET
    }
  })
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
