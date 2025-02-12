pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')  // Securely fetch username & password
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
                    // Authenticate with Docker Hub using stored credentials
                    sh "echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin"
                    
                    // Build and push Docker image
                    sh 'cd node-app && docker build -t nishu23/node-app:latest .'
                    sh "docker push nishu23/node-app:latest"

                    // Deploy to Kubernetes
                    sh "kubectl apply -f deployment.yaml"
                }
            }
        }
    }
}

