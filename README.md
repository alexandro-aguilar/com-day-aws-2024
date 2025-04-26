# com-day-aws-2024

This application is the backend implementation of a Caylent quiz deployed at AWS Community Day 2024. 

## Setup

Make sure you have the following installed:
- `yarn`
- `aws-sam-cli` 
  - For macOS users, you can install via `brew install aws-sam-cli`
- Docker

To run the API, once Docker is running in the background, run the following command:

```bash
yarn dev
```

## Deployment
There is currently a pipeline in place listening to the `main` branch. Any changes to that branch will be deployed using CloudFormation alongside GitHub actions in the background.

> [!NOTE]  
> The `.env.example` file is only in place for manual deployments, so there is no need to configure those variables by hand.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `yarn build`   compile typescript to js
* `yarn watch`   watch for changes and compile
* `yarn test`    perform the jest unit tests
* `yarn cdk deploy`  deploy this stack to your default AWS account/region
* `yarn cdk diff`    compare deployed stack with current state
* `yarn cdk synth`   emits the synthesized CloudFormation template

# Conventional Commits Guide

## Commit Message Format
A commit message should follow this structure:

<type>[optional scope]: <description>

[optional body]

[optional footer]

### **Commit Types**
- **feat**: A new feature (triggers a **minor version bump** in Semantic Versioning).
- **fix**: A bug fix (triggers a **patch version bump**).
- **chore**: Routine tasks like updating dependencies or configurations (no code changes).
- **docs**: Documentation updates.
- **style**: Code style updates (whitespace, formatting, missing semicolons, etc.).
- **refactor**: Code restructuring **without changing functionality**.
- **perf**: Performance improvements.
- **test**: Adding or updating tests.
- **ci**: Continuous Integration (**CI**) related changes.
- **build**: Changes affecting build scripts, dependencies, or **CI/CD**.
- **revert**: Reverts a previous commit.

## Examples

### **Feature Addition**
```sh
git commit -m "feat(auth): add JWT token validation"