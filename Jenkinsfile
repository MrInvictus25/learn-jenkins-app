pipeline {
    agent any

    stages {
        stage('Build') {
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
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        stage('Test') {
            steps {
                echo 'Test stage'
                // sh '''
                //     test -f build/$BUILD_FILE_NAME
                //     grep "Mainboard" build/$BUILD_FILE_NAME  # Grep command allows us to seek a specific string in the file
                //     grep "Display" build/$BUILD_FILE_NAME
                //     grep "Keyboard" build/$BUILD_FILE_NAME
                // '''
            }
        }
    }
}
