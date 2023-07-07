import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// Set up the AWS configuration
const region = "ap-southeast-2";
const client = new DynamoDBClient({ region });

export const getAll = async (tableName: string) => {
  const params = {
    TableName: tableName,
  };

  try {
    const command = new ScanCommand(params);

    return (await client.send(command)).Items?.map(item =>{
        return item
    });
  } catch (error) {
    console.log("error", error);
    return [];
  }
};
