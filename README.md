# Brigade Project Index Statusboard and API

This repo contains two things:
1. A `statusboard` web app to display ongoing realtime information about Brigade projects
2. An `api` to download data from the [brigade-project-index](https://github.com/codeforamerica/brigade-project-index/tree/index/v1) and expose it via JSON API

The statusboard is running in production at https://projects.brigade.network and the API is accessible at https://statusboard.brigade.cloud.

## Running the statusboard locally

Once this is in place, you can install and run the app via yarn:

```
cd statusboard
yarn install
yarn start
```

This is a Create-React-App, so other commands come out of the box including `yarn test` and `yarn build`.

## Running the API locally

The frontend will by default look for a local copy of the backend API for the React app to load data from.

```
cd api
yarn install
yarn start
```

Currently, the server fetches a new copy of the project index from Github every time (very expensive). If memcached is running locally on port 11211, the API will use this to cache the results. We recommend installing it via Docker:

```
docker run --publish 11211:11211 --detach memcached:alpine
```

You don't have to run the API locally -- you can instead tell your local React app to use the production API using an environment variable like this:

```
REACT_APP_API_URL=https://statusboard.brigade.cloud yarn start
```

## Other commands

```
npm run update-cache
```

This builds both the projectIndex cache and tags cache (data.json and tags.json respectively), and in deployment is run on a scheduler every 10 min.

To run the test suite, run:

```
yarn test
```
