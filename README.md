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

## AWS Deployment

```
git clone https://github.com/guoyunhe/aws-metro-api.git
cd aws-metro-api
npm install
cp .env.example .env
vi .env
```

Change the .env file as following

```ini
PORT=443
SSL_CERT=/etc/letsencrypt/live/aws-metro-api.guoyunhe.me/fullchain.pem
SSL_KEY=/etc/letsencrypt/live/aws-metro-api.guoyunhe.me/privkey.pem
```
