pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        SONARQUBE = 'nodeapp' // Name of the SonarQube configuration in Jenkins
        SONARQUBE_TOKEN = credentials('jenkins-sonar') // SonarQube authentication token
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/nishwanth23/samplek8s.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv(SONARQUBE) {
                        sh '''
                            export PATH=$PATH:/opt/sonar-scanner-5.0.1.3006-linux/bin
                            sonar-scanner \
                            -Dsonar.projectKey=samplek8s \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_AUTH_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Build & Deploy to Kubernetes') {
            steps {
                script {
                    def IMAGE_TAG = "v1.0.${BUILD_NUMBER}" // Versioning with BUILD_NUMBER

                    // Authenticate with Docker Hub
                    sh "echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin"
                    
                    // Build and push Docker image
                    sh "cd node-app && docker build -t nishu23/node-app:${IMAGE_TAG} ."
                    sh "docker push nishu23/node-app:${IMAGE_TAG}"

                    // Apply Kubernetes deployment (first-time setup)
                    sh 'cd node-app && kubectl apply -f deployment.yaml --validate=false'

                    // Update the deployment to use the new image version
                    sh "kubectl set image deployment/node-app node-app=nishu23/node-app:${IMAGE_TAG} --kubeconfig=${KUBECONFIG}"
                }
            }
        }
    }

    post {
        always {
            script {
                // Wait for SonarQube quality gate and fail pipeline if it does not pass
                waitForQualityGate abortPipeline: true
            }
        }
    }
}
