# Charlie's Custom Applications List

Hi, Charlie! I have created this README for you to easily run this project locally and deploy it to Vercel.

## Project setup

Clone this repository to your machine:

```bash
https://github.com/marybethhunter/nextjs-charlie-app.git
```

You could also fork the project to your github account and clone the fork.

Use `npm` to install the project dependencies:

```bash
npm install
```

## Tenant Setup

### API/Application Setup

1. First, you will need to create a new Application in the Auth0 Dashboard. Please name your application, select `Regular Web Applications` and, click `Create`. The dashboard will then ask you to pick which technology you are using for your project. Please select `Next.js`. [Here is the Quickstart guide I used for reference](https://auth0.com/docs/quickstart/webapp/nextjs/01-login), but you should only have to update the Allowed Callback URLs to `http://localhost:3000/api/auth/callback`, Allowed Logout URLs to `http://localhost:3000`, and ensure that the following Grants are checked under the `Advanced Settings => Grant Types` tabs at the bottom of your applications settings page: 'Implicit,' 'Authorization Code,' 'Refresh Token,' and 'Client Credentials'. The rest of the steps in the above Quickstart will be take care of for you. Be sure to Save All Changes.

2. For this project, you will need to create two APIs in the Auth0 tenant. You will need to first [create the first API](https://auth0.com/docs/authorization/apis) needed to access the Auth0 Management API using the [management dashboard](https://manage.auth0.com/#/apis). For example, I named this first one "Auth0 Management API" and entered in my tenant's identifier, which is just your Auth0 domain (ends in `.auth0.com`; you can find this in any application of yours under the Settings tab) + `/api/v2/` at the end.

In the Machine to Machine Applications tab of the Management API, you will need to make sure that your application is authorized and has all permissions. Once you have done the next step (#3), please return here and make sure that the Test API also has all permissions under the Machine to Machine Applications tab.

3. You will need to [create the second API](https://auth0.com/docs/authorization/apis) using the [management dashboard](https://manage.auth0.com/#/apis). You can name this API anything you wish. For example, mine is just named "Test API". This will give you an API Identifier that you can use in the `AUTH0_AUDIENCE` environment variable below. Then you will need to [add permissions](https://auth0.com/docs/get-started/dashboard/add-api-permissions) named `read:actions` and `read:clients` to your API. To get your app to ask for that permission, include it in the value of the `AUTH0_SCOPE` environment variable.

In the main `Settings` tab of this Test API you just made, you will need to be sure to enable both of the `RBAC Settings` near the bottom of the page. Save all changes.

In the Permissions tab of this Test API you just made you will need to add `read:actions`, `read:clients`, and `read:triggers` as scopes. In the Machine to Machine Applications tab, you will need to have both the Auth0 Management API and your Next.js application authorized with `read:actions` and `read:clients` as scopes. Make sure to Update the changes.

### Role/User Setup

In your tenant, you will need to create a Manager Role under the User Management sidebar. Click `Create Role` and follow the setup steps. Once created, click on the new Manager role. Under the `Permissions` tab, select `Add Permissions`. Select your Test API from the dropdown menu and add `read:actions`, `read:clients`, and `read:triggers`.

Then navigate to `Users` under the User Management sidebar and select the user(s) that you would like to give the Manager role to. Under the `Roles` tab, select `Assign Roles` and assign the Manager role to this user. Under the `Permissions` tab, be sure that `read:actions`, `read:clients`, and `read:triggers` are also assigned.

For any other non-Manager authenticated users that you want to be able to view the list (minus the triggers), go into those users and ensure that under the `Permissions` tab that those users have `read:actions` and `read:clients` assigned.

[Documentation: Configure Core Authorization Features for Role-Based Access Control](https://auth0.com/docs/manage-users/access-control/configure-core-rbac)

## Configuration

### Configure credentials

The project needs to be configured with your Auth0 Domain, Client ID and Client Secret, and several other variables listed below for the authentication flow to work.

To do this, first copy `.env.local.example` into a new file in the same folder called `.env.local`, and replace the values with your own Auth0 application credentials (see more info about [loading environmental variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)):

```sh
# random long string
AUTH0_SECRET=
# localhost:3000 if running locally
AUTH0_BASE_URL=
# your auth0 domain
AUTH0_ISSUER_BASE_URL=
# auth0 client id of your application
AUTH0_CLIENT_ID=
# auth0 client secret of your application
AUTH0_CLIENT_SECRET=
# your test api identifier
AUTH0_AUDIENCE=
# scopes (ex: "openid profile email read:actions read:clients")
AUTH0_SCOPE=
# auth0 management api identifier
AUTH0_MGMT_AUDIENCE=
# api port (ex: 3001, just don't use the same one as localhost)
API_PORT=
```

**Note**: Make sure you replace `AUTH0_SECRET` with your own secret (you can generate a suitable string using `openssl rand -hex 32` on the command line).

## Run the project locally

### Compile and hot-reload for development

This compiles and serves the Next.js app and starts the API server on port 3001.

```bash
npm run dev
```

## Generating the Applications Report

### Login

Once you have done all of the above in your Auth0 tenant and on your machine configuring this project, you are ready to use the app! Once you run `npm run dev` and visit `http://localhost:3000` you will see a standard Next.js homepage. Click the `Login` and sign in with your Auth0 account information. You should see your profile picture and there will be an option in the dropdown by your profile picture to visit your profile.

On the profile page, you will see your picture, name, and email address, as well as a section called `Applications List` with a `Generate List` button. Click the button and your requested dynamic list should populate the code block on the page.

## Deployment

I used Netlify to deploy this application. If you do not have a Netlify account, you can easily make one [here](https://www.netlify.com). Once you are logged in to your account, you can select `Add New Site` button and import your github repository for the project. You will need to update the Environment Variables in the Netlify Project Setup to how they are in your .env.local file. Click `Deploy`.

You will need to add your new Netlify domain to your .env.local file. You will need to update the Allowed Callback URLs to `${YOUR_VERCEL_DOMAIN}/api/auth/callback` and Allowed Logout URLs to `${YOUR_VERCEL_DOMAIN}` in your Auth0 tenant. Save all changes.
