pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG = "/home/jenkins/.kube/config"
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/nishwanth23/samplek8s.git'
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
}
