pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'ea70ca22-620e-4d6f-b752-8395714c5708'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

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
                    echo "Smal change"
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        
        stage('Run Tests') {

            parallel {
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

                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }

                stage('E2E') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.39.0-noble'
                            reuseNode true
                        }
                    }
                    environment {
                        NODE_OPTIONS = '--openssl-legacy-provider'
                    }
                    steps {
                        echo 'Running E2E tests'
                        sh '''
                            npm install
                            npx playwright install
                            npm install serve
                            node_modules/.bin/serve -s build &
                            sleep 10
                            npx playwright test --reporter=line
                        '''
                    }

                    post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Local Report', reportTitles: '', useWrapperFileDirectly: true])
                        }
                    }
                }
            }
        }

        // stage('Deploy staging') {
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
        //             npm install netlify-cli node-jq      
        //             node_modules/.bin/netlify --version
        //             echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
        //             node_modules/.bin/netlify deploy --dir=build --json > deploy-output.json
        //             node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json
        //         '''
        //         script {
        //             env.STAGING_URL = sh(script: "node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json", returnStdout: true)
        //             }
        //     }
        // }

        stage('Deploy staging') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-noble'
                    reuseNode true
                }
            }
            environment {
                NODE_OPTIONS = '--openssl-legacy-provider'
                CI_ENVIRONMENT_URL = 'STAGING_URL_TO_BE_SET'
            }
            steps {
                echo 'Running combined stages Deployment and E2E tests'
                sh '''
                    node --version
                    npm install netlify-cli node-jq      
                    node_modules/.bin/netlify --version
                    echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify deploy --dir=build --json > deploy-output.json
                    CI_ENVIRONMENT_URL=$(node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json)
                    npm install
                    npx playwright install
                    npm install serve
                    node_modules/.bin/serve -s build &
                    sleep 10
                    npx playwright test --reporter=line
                '''
            } 
                    // node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json
                    // npm install
                    // npx playwright install
                    // npm install serve
                    // node_modules/.bin/serve -s build &
                    // sleep 10

            post {
                always {
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Staging E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }

        // stage('Approval') {
        //     steps {
        //         timeout(time: 1, unit:'MINUTES') {
        //              input message: 'Would you like to perform deploying to Production?', ok: 'Yes, I would like'
        //         }
        //     }
        // }

        stage('Deploy Prod') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-noble'
                    reuseNode true
                }
            }
            environment {
                NODE_OPTIONS = '--openssl-legacy-provider'
                CI_ENVIRONMENT_URL = 'https://vermillion-boba-a6cdb8.netlify.app/'
            }
            steps {
                sh '''
                    npm install netlify-cli       
                    node_modules/.bin/netlify --version
                    echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=build --prod
                    npx playwright test --reporter=line
                '''
            }
            post {
                always {
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }
    }
}