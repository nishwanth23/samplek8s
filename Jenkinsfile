pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        SONARQUBE = 'nodeapp' // Name of your SonarQube configuration in Jenkins
        SONARQUBE_TOKEN = credentials('jenkins-sonar') // SonarQube authentication token
        SONAR_HOST_URL = 'http://192.168.20.47:9000/' // Replace with your SonarQube server URL
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
                            -Dsonar.login=$SONARQUBE_TOKEN
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

