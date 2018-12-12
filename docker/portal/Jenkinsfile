pipeline {
    agent any
    parameters {
            choice(choices: 'Build\nPackage Patch\nPackage Minor\nPackage Major', description: 'Choose action?', name: 'ACTION')
        }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install dependencies') {
            steps {
                sh '''
                    echo "registry=http://localhost:8081/repository/npm-registry/" > .npmrc
                    echo "_auth=YWRtaW46a2dkamZnOTgzNDR1MzI0Yjg5Nzk=" >> .npmrc
                    npm install --no-optional --loglevel verbose
                '''
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Clean Up') {
            steps {
                deleteDir()
            }
        }
    }
}
