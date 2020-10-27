module.exports = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: 'tiltify_bot',
        client_id: '***************************',
        password: 'oauth:***************************',
        client_secret: '***************************'
    },
    tiltify: {
        access_token: `*********************************************************************************`
    },
    mysql: {
        host: '127.0.0.1',
        user: 'DB_User',
        password: 'AwesomePassword122347',
        database: 'DB_Name'
    },
    default: {
        streamer: '******',
        channel_id: '*******'
    },
    channels: ['tiltify_bot'],
    default: {
        streamer: '******',
        channel_id: '*******',
        client_secret: '***************************',
        token: `***************************`,
        accessToken: `***************************`,
        clientID: `***************************`
    }
}