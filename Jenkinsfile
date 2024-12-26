pipeline {
    agent any

    stages {
        // stage('Build') {
        //     agent {
        //         docker {
        //             image 'node:18-alpine'
        //             reuseNode true
        //         }
        //     }
        //     environment {
        //         NODE_OPTIONS = '--openssl-legacy-provider'
        //     }
        //     steps {
        //         sh '''
        //             ls -la
        //             node --version
        //             npm --version
        //             npm ci
        //             npm run build
        //             ls -la
        //         '''
        //     }
        // }
        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            environment {
                NODE_OPTIONS = '--openssl-legacy-provider'
            }
            steps {
                echo 'Test stage'
                sh '''
                    test -f build/index.html
                    npm test
                '''
            }
        }

        stage('E2E') {
            agent {
                docker {
                    image 'docker pull mcr.microsoft.com/playwright:v1.49.1-noble'
                    reuseNode true
                }
            }
            environment {
                NODE_OPTIONS = '--openssl-legacy-provider'
            }
            steps {
                echo 'Running E2E tests'
                sh '''
                    npm install -g serve
                    serve -s build
                    npx playwright test
                '''
            }
        }
    }

    post {
        always {
            junit 'test-results/junit.xml'
        }
    }
}
