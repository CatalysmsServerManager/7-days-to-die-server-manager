pipeline {
    agent { docker 'node:8.9' }
    environment {
        npm_config_cache= 'npm-cache'
        CSMM_TEST_IP = '192.168.0.201'
        CSMM_TEST_WEBPORT ='8084'
        CSMM_TEST_TELNETPORT = '8081'
        CSMM_TEST_AUTHNAME = 'niek'
        CSMM_TEST_AUTHTOKEN = 'test'
        CSMM_TEST_TELNETPW = credentials('CSMM_TEST_TELNETPW')
        API_KEY_STEAM = credentials('API_KEY_STEAM')
        DISCORDBOTTOKEN = credentials('DISCORDBOTTOKEN')
        CSMM_HOSTNAME='http://localhost:2000'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        post {
            always {
                archiveArtifacts actifacts: './test/output/**/*', fingerprint: true
            }
        }
    }
}