import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import serverless from "serverless-http";
import app from "./index";

const handler = serverless(app);

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Configurar timeout para Lambda
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.body && typeof event.body === "string") {
    try {
      event.body = JSON.parse(event.body);
    } catch (e) {}
  }

  try {
    const result = await handler(event, context);
    return result as APIGatewayProxyResult;
  } catch (error) {
    console.error("Lambda handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: "Something went wrong",
      }),
    };
  }
};
