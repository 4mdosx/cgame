/** @type {import('next').NextConfig} */
const cron = require('node-cron')
let got
import('got').then(module => {
  got = module.default
})

cron.schedule('* * * * *', function () {
  got(process.env.LOCAL_HOST + '/api/cron/order', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.CRON_SECRET
    }
  })
})

cron.schedule('0 * * * *', function () {
  got(process.env.LOCAL_HOST + '/api/cron/income', {
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
