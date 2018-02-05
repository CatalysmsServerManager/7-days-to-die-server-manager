pipeline {
    agent { docker 'node:8.9' }
    environment {
        npm_config_cache= 'npm-cache'
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