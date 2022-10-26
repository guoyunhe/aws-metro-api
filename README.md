# The Back-end App

## System Requirements

- [Node.js 16+](https://nodejs.org/en/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Python 3](https://www.python.org/)
- awscli-local, run `pip install awscli-local` to install
- [Docker](https://docs.docker.com/get-docker/)

## Local Development

```
docker compose up
awslocal s3api create-bucket --bucket test
npm install
npm start
```
