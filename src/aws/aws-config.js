import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { useAuth } from "react-oidc-context";

const REGION = "us-east-1";
const IDENTITY_POOL_ID = "us-east-1:e6bc9cf-e0f5-4d5a-a530-1766da1767f9";
const USER_POOL_ID = "us-east-1_szDQpWkvh";

export function createDynamoDBClient(idToken) {
    const credentials = fromCognitoIdentityPool({
        identityPoolId: IDENTITY_POOL_ID,
        clientConfig: { region: REGION },
        logins: {
            [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
        },
    });

    return new DynamoDBClient({
        region: REGION,
        credentials,
    });
}
