pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'ea70ca22-620e-4d6f-b752-8395714c5708'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION = "1.0.$BUILD_ID"
        AWS_DEFAULT_REGION = 'us-east-2'
        AWS_ECS_CLUSTER = 'JenkinsApp-Cluster-Prod-2025'
        AWS_ECS_SERVICE_PROD = 'LearnJenkinsApp-Service-Prod2'
        AWS_ECS_TD_PROD = 'JenkinsApp-TaskDefinition-Prod2'
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

        stage('Build Docker image') {
            agent {
                docker {
                    image 'amazonlinux'
                    reuseNode true
                    args "-u root --entrypoint=''"
                }
            }
            // -v /var/run/docker.sock:/var/run/docker.sock
            steps {
                sh '''
                    yum install -y amazon-linux-extras
                    amazon-linux-extras enable docker

                    # Install Docker
                    yum clean metadata
                    yum install docker
                    yum install -y docker
                    docker --version
                    docker build -t myjenkinsapp .
                '''
            }
        }   

        stage('Deploy on AWS') {
            agent {
                docker {
                    image 'my-aws-cli'
                    reuseNode true
                    args "-u root --entrypoint=''"
                }
            }
            
            steps {
                withCredentials([usernamePassword(credentialsId: 'myAWS', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                sh '''
                    aws --version
                    
              
                    LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition-prod.json)
                    echo $LATEST_TD_REVISION
                    aws ecs update-service --cluster $AWS_ECS_CLUSTER --service $AWS_ECS_SERVICE_PROD --task-definition $AWS_ECS_TD_PROD:7
                    aws ecs wait services-stable --cluster $AWS_ECS_CLUSTER --services $AWS_ECS_SERVICE_PROD
                '''
                }
            }       
        }
            // environment {
            //     AWS_S3_BUCKET = 'jenkins-files-01172025'
            // }

                    //                     yum install -y python3
                    // LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition-prod.json --output json | \
                    // python3 -c "import sys, json; print(json.load(sys.stdin)['taskDefinition']['revision'])")
                    //echo "Hello S3!" > index.html
                    //aws s3 cp index.html s3://$AWS_S3_BUCKET/index.html
                   // aws s3 sync build s3://$AWS_S3_BUCKET
    }         

}        
        // stage('Run Tests') {

        //     parallel {
        //         stage('Test') {
        //             agent {
        //                 docker {
        //                     image 'node:18-alpine'
        //                     reuseNode true
        //                 }
        //             }
        //             environment {
        //                 NODE_OPTIONS = '--openssl-legacy-provider'
        //             }

        //             steps {
        //                 echo 'Test stage'
        //                 sh '''
        //                     test -f build/index.html
        //                     npm test
        //                 '''
        //             }

        //             post {
        //                 always {
        //                     junit 'jest-results/junit.xml'
        //                 }
        //             }
        //         }

        //         stage('E2E') {
        //             agent {
        //                 docker {
        //                     image 'my-playwright'
        //                     reuseNode true
        //                 }
        //             }
        //             environment {
        //                 NODE_OPTIONS = '--openssl-legacy-provider'
        //             }
        //             steps {
        //                 echo 'Running E2E tests'
        //                 sh '''
        //                     serve -s build &
        //                     sleep 10
        //                     npx playwright test --reporter=html
        //                 '''
        //             }

        //             post {
        //                 always {
        //                     publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Local Report', reportTitles: '', useWrapperFileDirectly: true])
        //                 }
        //             }
        //         }
        //     }
        // }

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

        // stage('Deploy staging') {
        //     agent {
        //         docker {
        //             image 'my-playwright'
        //             reuseNode true
        //         }
        //     }
        //     environment {
        //         NODE_OPTIONS = '--openssl-legacy-provider'
        //         CI_ENVIRONMENT_URL = 'STAGING_URL_TO_BE_SET'
        //     }
        //     steps {
        //         echo 'Running combined stages Deployment and E2E tests'
        //         sh '''
        //             netlify --version
        //             echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
        //             netlify status
        //             netlify deploy --dir=build --json > deploy-output.json
        //             CI_ENVIRONMENT_URL=$(jq -r '.deploy_url' deploy-output.json)
        //             npx playwright test  --reporter=html
        //         '''
        //     } 
        //             // mcr.microsoft.com/playwright:v1.49.1-noble
        //             // mcr.microsoft.com/playwright:v1.39.0-noble
        //             // node --version
        //             // npm install netlify-cli node-jq      
        //             // node_modules/.bin/netlify --version

        //             // node_modules/.bin/node-jq -r '.deploy_url' deploy-output.json
        //             // npm install
        //             // npx playwright install
        //             // npm install serve
        //             // node_modules/.bin/serve -s build &
        //             // sleep 10

        //     post {
        //         always {
        //             publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Staging E2E', reportTitles: '', useWrapperFileDirectly: true])
        //         }
        //     }
        // }

        // stage('Approval') {
        //     steps {
        //         timeout(time: 1, unit:'MINUTES') {
        //              input message: 'Would you like to perform deploying to Production?', ok: 'Yes, I would like'
        //         }
        //     }
        // }

        // stage('Deploy Prod') {
        //     agent {
        //         docker {
        //             image 'my-playwright'
        //             reuseNode true
        //         }
        //     }
        //     environment {
        //         NODE_OPTIONS = '--openssl-legacy-provider'
        //         CI_ENVIRONMENT_URL = 'https://vermillion-boba-a6cdb8.netlify.app/'
        //     }
        //     steps {
        //         sh '''
        //             npm install netlify-cli       
        //             netlify --version
        //             echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
        //             netlify status
        //             netlify deploy --dir=build --prod
        //             npx playwright test  --reporter=html
        //         '''
        //     }
        //     post {
        //         always {
        //             publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Prod E2E', reportTitles: '', useWrapperFileDirectly: true])
        //         }
        //     }
        // }