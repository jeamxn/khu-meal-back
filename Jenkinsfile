pipeline {
    agent any
    
    environment {
        DOCKER_BUILDKIT = "1"
        REGISTRY_URL = 'ghcr.io'
        IMAGE_NAME = sh(script: 'echo $GIT_URL | sed -E "s/.*[:\\/]([^\\/]+\\/[^\\/]+)\\.git$/\\1/"', returnStdout: true).trim()
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        IMAGE_URL = "${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"
        MOUNT_URL = "/mnt/data/services/${IMAGE_NAME}"

        CONTAINER_NAME = sh(script: 'echo $GIT_URL | sed -E "s/.*[:\\/]([^\\/]+\\/[^\\/]+)\\.git$/\\1/" | tr "/" "-"', returnStdout: true).trim()
    }

    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Debug Env') {
            steps {
                script {
                    echo "IMAGE_NAME => ${env.IMAGE_NAME}"
                    echo "IMAGE_TAG => ${env.IMAGE_TAG}"
                    echo "IMAGE_URL => ${env.IMAGE_URL}"
                    echo "MOUNT_URL => ${env.MOUNT_URL}"
                    echo "CONTAINER_NAME => ${env.CONTAINER_NAME}"
                    sh "cat ${env.MOUNT_URL}/.env"
                }
            }
        }

        stage('Remove Container') {
            steps {
                script {
                    sh "docker rm -f ${env.CONTAINER_NAME} || true"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh "docker create \
                        --name ${env.CONTAINER_NAME} \
                        --restart always \
                        --network proxy \
                        --volume ${env.MOUNT_URL}/.env:/app/.env \
                        ${env.IMAGE_URL}"
                    sh "docker start ${env.CONTAINER_NAME}"
                }
            }
        }
    }
}