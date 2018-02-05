pipeline {
    agent { docker 'node:6.3' }
    environment {
        npm_config_cache= 'npm-cache'
    }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'npm install'
                sh 'npm start'
            }
        }
    }
}