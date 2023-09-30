# Authorization using JSON Web Token

This project focuses on authorization using JWT and forgot/reset password via email tokens using nodemailer

## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environment.

## Install

#### Step 1: Clone the repository

```bash
git clone https://github.com/AkashP27/API.git
```

#### Step 2: Create Your MongoDB Account and Database/Cluster

- Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.

- Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change `<password>` with your own password

- add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your ip changes)

#### Step 3: Create mailtrap account

- Visit [mailtrap.io](https://mailtrap.io/) to get the credentials.

#### Step 4: Create the Environment File

- Create a file named .env in the /JWT directory.
- Copy all variables from tmp.env and paste inside .env
  This file will store environment variables for the project to run.

#### Step 5: Install the Dependencies

In your terminal, navigate to the /JWT directory of the project and run the following command to install the dependencies:

```bash
cd JWT
```

```bash
npm install
```

This command will install all the required packages specified in the package.json file.

#### Step 6: Run the Server

In the same terminal, run the following command to start the server:

```bash
npm run dev
```

### You can test the API in postman

[Set postman environment from here](https://www.postman.com/akash-api/workspace/akash-public/environment/16112169-8faac55e-e2dc-4fd2-9548-4c8c20624a87?action=share&creator=16112169&active-environment=16112169-8faac55e-e2dc-4fd2-9548-4c8c20624a87)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/16112169-6f4581ae-1fcd-476b-b789-1dece9db8c88?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D16112169-6f4581ae-1fcd-476b-b789-1dece9db8c88%26entityType%3Dcollection%26workspaceId%3D9fe04cc0-53c6-4f02-842b-8fe10274477e)
