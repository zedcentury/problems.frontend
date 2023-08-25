module.exports = {
    apps: [
        {
            name: 'Problems',
            port: process.env.PORT || 3000,
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}