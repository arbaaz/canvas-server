#!groovy

pipeline {

    environment {
        /*
         * Fix for docker "Read timed out"
         * https://github.com/docker/compose/issues/3927
         */
        DOCKER_CLIENT_TIMEOUT=120
        COMPOSE_HTTP_TIMEOUT=120
        IMAGE_TAG = "docker.m6r.eu/express-nodejs-template:${GIT_COMMIT[0..7]}"
    }

    options {
        skipStagesAfterUnstable()
    }

    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([
                        $class           : 'GitSCM',
                        branches         : scm.branches,
                        extensions       : scm.extensions + [[$class: 'CleanCheckout']],
                        userRemoteConfigs: scm.userRemoteConfigs,
                ])
            }
        }

        stage('Deploy') {
            steps {
                echo "Building Image and pushing to the registry."
                sh "docker build -t ${IMAGE_TAG} ."
                sh "docker push ${IMAGE_TAG}"
            }
        }
    }
}
