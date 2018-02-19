pipeline {
    agent { docker 'node:8.9' }
    environment {
        npm_config_cache = 'npm-cache'
        CSMM_TEST_SERVERNAME = 'CSMM-test'
        CSMM_TEST_IP = '192.168.0.201'
        CSMM_TEST_WEBPORT ='8084'
        CSMM_TEST_TELNETPORT = '8081'
        CSMM_TEST_AUTHNAME = 'niek'
        CSMM_TEST_AUTHTOKEN = 'test'
        CSMM_TEST_TELNETPW = credentials('CSMM_TEST_TELNETPW')
        DISCORDCLIENTID = '324843053921861634'
        API_KEY_STEAM = credentials('API_KEY_STEAM')
        DISCORDBOTTOKEN = credentials('DISCORDBOTTOKEN')
        DISCORDCLIENTSECRET = credentials('DISCORDCLIENTSECRET')
        CSMM_TEST_STEAMID = '76561198028175941'
        CSMM_HOSTNAME='http://localhost:1337'
        SENTRY_DSN = credentials('SENTRY_DSN')
        CSMM_TEST_STEAM_USERNAME = credentials('CSMM_TEST_STEAM_USERNAME')
        CSMM_TEST_STEAM_PASSWORD = credentials('CSMM_TEST_STEAM_PASSWORD')
        JAVA_HOME = '/usr/bin/java'

    }
    stages {
        stage('Build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'java -version'
                sh 'npm install'
            }
        }
        stage('Mocha tests') {
            steps {
                sh 'npm run unit-service-tests'
            }
        }
        stage('Feature tests') {
            steps {
                sh 'npm run feature-tests'
            }
        }
    }
    post {
        always {
             publishHTML target: [
            allowMissing: true,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'test/output/coverage',
            reportFiles: 'index.html',
            reportName: 'Coverage report'
          ]
           publishHTML target: [
            allowMissing: true,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'test/output/mochawesome',
            reportFiles: 'mochawesome.html',
            reportName: 'Mocha report'
          ]
        }
    }
}