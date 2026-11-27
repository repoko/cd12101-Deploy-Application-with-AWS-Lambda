---

# Serverless TODO Application on AWS

## Project Overview

This project implements a serverless task management application using AWS Lambda, API Gateway, DynamoDB, Amazon S3, and the Serverless Framework.

The application allows authenticated users to create, retrieve, update, and delete TODO items, mark tasks as completed, and upload image attachments.

The backend follows a layered architecture to separate business logic, database operations, file storage, and Lambda request handling.

## Technologies Used

- **Backend:** Node.js 20, JavaScript, AWS Lambda
- **Frontend:** React
- **API:** Amazon API Gateway
- **Database:** Amazon DynamoDB
- **File Storage:** Amazon S3
- **Authentication:** Auth0 with JWT authorization
- **Infrastructure:** Serverless Framework v3, AWS CloudFormation
- **Monitoring:** AWS X-Ray, Amazon CloudWatch, Winston
- **Development Environment:** GitHub Codespaces
- **Version Control:** Git and GitHub

## Application Features

- User authentication through Auth0
- Create, retrieve, update, and delete TODO items
- Mark tasks as completed
- Upload and display image attachments
- User-specific TODO retrieval using authenticated user IDs
- Request validation through API Gateway
- Structured application logging and distributed tracing

## Application Architecture

The application uses the following architecture:

**React Frontend → API Gateway → AWS Lambda → DynamoDB**

Additional integrations:

- **Auth0:** Handles authentication and JWT authorization.
- **Amazon S3:** Stores uploaded attachments using presigned URLs.
- **AWS X-Ray:** Provides distributed tracing.
- **Amazon CloudWatch:** Captures Lambda logs and monitoring information.

## Backend Implementation

The backend implements six Lambda functions:

| Function | Purpose |
|---|---|
| Auth | Validates JWT authentication tokens |
| GetTodos | Retrieves TODO items belonging to the authenticated user |
| CreateTodo | Creates a new TODO item |
| UpdateTodo | Updates an existing TODO item |
| DeleteTodo | Deletes a TODO item |
| GenerateUploadUrl | Generates a presigned S3 upload URL |

### Separation of Concerns

The backend separates responsibilities into:

- `businessLogic/`: Application operations and business rules
- `dataLayer/`: DynamoDB database operations
- `fileStorage/`: S3 attachment handling
- `lambda/`: HTTP request handlers and authorization

Asynchronous operations use JavaScript `async/await`.

## Database Design

Amazon DynamoDB stores TODO items using a composite primary key:

- **Partition key:** `userId`
- **Sort key:** `todoId`

A local secondary index named `CreatedAtIndex` supports querying TODO items by creation date.

The application uses DynamoDB `Query` operations rather than table scans to retrieve user-specific records.

## Authentication and Security

Auth0 provides authentication through a Single Page Application configured with RS256 JWT tokens.

A custom API Gateway Lambda authorizer validates JWT signatures using Auth0's published JSON Web Key Set (JWKS).

A dedicated Auth0 API, `https://todo-api`, was configured to provide the appropriate token audience.

The frontend requests the following permissions:

- `read:todo`
- `write:todo`
- `delete:todo`

User-specific DynamoDB operations use the authenticated user's identifier.

AWS IAM permissions are configured individually for each Lambda function through the Serverless Framework.

## Monitoring and Best Practices

The application implements:

- **Request validation:** API Gateway request schemas
- **Distributed tracing:** AWS X-Ray integration
- **Structured logging:** Winston JSON logs
- **IAM permissions:** Per-function access permissions
- **Database efficiency:** DynamoDB queries with a composite key
- **Infrastructure as Code:** AWS resources defined in `serverless.yml`

## Development Environment and Alternatives

Several adjustments were made to accommodate the development environment and compatibility requirements.

### GitHub Codespaces

GitHub Codespaces was used instead of the Udacity workspace or local development.

The organization-managed laptop has restrictions on installing development software, including Docker Desktop.

Codespaces provided a cloud-based environment for development, dependency installation, testing, and AWS deployment.

### Node.js Compatibility

Node.js 20 was used instead of Node.js 14 because the older runtime is no longer supported for new AWS Lambda deployments.

The Lambda runtime was updated to `nodejs20.x` in `serverless.yml`.

### Serverless Framework v3

Serverless Framework v3 was used to deploy the backend directly to AWS.

**The Serverless Dashboard application setup was skipped because Serverless Framework v3 supports deployment using AWS credentials without requiring a Dashboard organization or application.**

AWS Cloud Lab credentials, including the temporary session token, were configured through the AWS CLI.

### Auth0 Integration Adjustments

A dedicated Auth0 API was created to replace the original Auth0 Management API audience.

User-delegated API access was configured with the appropriate permissions.

The frontend authentication configuration was adjusted to support refresh tokens and browser local storage.

Mismatched token scopes in frontend requests were corrected to ensure successful authentication and API access.

## Deployment

The backend was deployed using the Serverless Framework.

From the `starter/backend` directory:

1. Install dependencies using `npm install`.
2. Configure valid AWS credentials.
3. Deploy using `serverless deploy --verbose`.

The Serverless Framework provisions the necessary AWS infrastructure through CloudFormation.

The frontend is configured through `starter/client/.env` using:

- `REACT_APP_AUTH0_DOMAIN`
- `REACT_APP_AUTH0_CLIENT_ID`
- `REACT_APP_API_ENDPOINT`

The frontend can then be started using `npm install` and `npm start`.

**Note:** AWS credentials and authentication secrets must not be committed to the repository.

## Testing

The following functionality was successfully tested through the React application:

- Auth0 login
- Creating TODO items
- Retrieving TODO items
- Updating TODO items
- Marking TODO items as completed
- Deleting TODO items
- Uploading and displaying image attachments

AWS CloudWatch logs and X-Ray traces were also reviewed to verify application activity.

User-specific data isolation is implemented through the DynamoDB partition key and authenticated user ID. Testing with two separate user accounts has not yet been performed.

## Project Completion

The application was successfully deployed to AWS using the Serverless Framework.

Core CRUD operations, authentication, image attachments, structured logging, and distributed tracing were implemented and verified.

The project demonstrates practical experience with serverless application development, AWS services, authentication, cloud deployment, and backend architecture.