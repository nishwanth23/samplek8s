pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        SONARQUBE = 'nodeapp' // Name of your SonarQube server configuration in Jenkins
        SONARQUBE_TOKEN = credentials('jenkins-sonar') // Use the ID of the SonarQube token credential
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
                    // Run SonarQube Scanner
                    withSonarQubeEnv(SONARQUBE) {
                        sh "sonar-scanner -Dsonar.projectKey=samplek8s -Dsonar.sources=."
                    }
                }
            }
        }
        stage('Build & Deploy to Kubernetes') {
            steps {
                script {
                    // Define version number using Jenkins BUILD_NUMBER
                    def IMAGE_TAG = "v1.0.${BUILD_NUMBER}"

                    // Authenticate with Docker Hub
                    sh "echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin"
                    
                    // Build and push Docker image with versioned tag
                    sh "cd node-app && docker build -t nishu23/node-app:${IMAGE_TAG} ."
                    sh "docker push nishu23/node-app:${IMAGE_TAG}"

                    // Apply the deployment (if not already applied)
                    sh 'cd node-app && kubectl apply -f deployment.yaml --validate=false'

                    // Update the deployment to use the new image version
                    sh "kubectl set image deployment/node-app node-app=nishu23/node-app:${IMAGE_TAG}"
                }
            }
        }
    }
    post {
        always {
            // Wait for SonarQube analysis to complete and check the quality gate status
            script {
                waitForQualityGate abortPipeline: true
            }
        }
    }
}
