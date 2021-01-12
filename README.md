Express Microservice Template
==================================

This is an empty shell project for node js using the express framework.
If you have suggestions on how to improve it, please create an issue ticket.

- ES6 support via [babel](https://babeljs.io)
- Express [docs](https://expressjs.com/en/4x/api.html)
- Mocha [docs](https://mochajs.org/#getting-started)

Important
---------------

> Note 1: Please try to adhere to the external structure of the project. ie
everything outside of the src file dir. As for the structure inside the src dir,
feel free to change and use whichever framework you deem suitable.

> Note 2: Please try and use the existing env management solution implemented
here. This is because it makes it a lot easier to source for deployments and
docker files. If you really feel like there's another better option, please make
sure it utilizes some form of 'single source of truth' mentality. ie it has a
single configuration file for each state, that being dev, staging or prod.
Thank you.

Getting Started
---------------

```sh
# clone it
git clone git@github.com:mbrtargeting/express-nodejs-starter.git

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start production server:
npm start
```

In the `.env` file, you find all the configurational parameters for the project.
As stated above, please place all the services constants here for development.
Please don't put production secrets here for obvious reasons.

Code Style
------

Please refer to our style guide located in our Confluence [here](https://stroeerdigitalgroup.atlassian.net/wiki/spaces/MBR/pages/1478613/JavaScript+Style+Guide).

We extend on the google style guide. A link to installing the google linter;
follow this [link](https://github.com/google/eslint-config-google) 

Docker Support
------

Your service must be able to run as a stand-alone container. ie the service
should not contain a DB or other separate services inside the container. This
would be a violation of the microservice ethos.

```sh

# Build your image locally
docker build -t docker.m6r.eu/service-name .
#                          ^
#                   container tag

# run your image locally
docker run -p 8080:8080 docker.m6r.eu/service-name
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port

```

CI/CD
--------------

CI/CD is provided through Jenkins. The configuration for the pipeline is defined
in the `Jenkinsfile`. All pipeline definitions can be found there.

Deployment
--------------

This service is deployed to our k8 cluster via helm charts. You can find a
prototype for these charts in the charts directory in this repo. This is fairly
general and is quite open for manipulation. PLEASE rename `express-nodejs-template`
throughout the chart's YAML files to your service's name. This will be the name
that it will be reachable on. This name should be the name of repo/service.
Please be consistent.

This chart should then be placed within our flux [repository](https://github.com/mbrtargeting/flux-ams2)
within the charts folder. Once completed, a helm release should be created as
well.
