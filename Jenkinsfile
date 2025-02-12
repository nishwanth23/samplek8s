pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')  // Fetch DockerHub credentials
        KUBECONFIG = "/var/lib/jenkins/.kube/config"  // Set KUBECONFIG for Jenkins
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
                    sh 'set -e'  // Exit on error
                    
                    // Authenticate with Docker Hub
                    sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'
                    
                    // Build and push Docker image
                    sh '''
                        cd node-app
                        docker build -t nishu23/node-app:latest .
                        docker push nishu23/node-app:latest
                    '''

                    // Deploy to Kubernetes
                    sh '''
                        cd node-app
                        kubectl apply -f deployment.yaml --validate=false
                    '''
                }
            }
        }
    }
}
