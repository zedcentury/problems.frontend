module.exports = {
    apps: [
        {
            name: 'problems.uz',
            port: process.env.PORT || 3004,
            // exec_mode: 'cluster',
            // instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}