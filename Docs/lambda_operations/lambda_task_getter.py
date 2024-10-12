import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('employee_tasks')

def lambda_handler(event, context):
    # Scan the DynamoDB table to get all items
    response = table.scan()
    
    # Extract items from the response
    items = response.get('Items', [])
    
    # Return the items as a JSON response
    return {
        'statusCode': 200,
        'body': json.dumps(items),
        "headers": {
            "Access-Control-Allow-Origin": "*",  # Allow any origin
            "Access-Control-Allow-Headers": "Content-Type, x-api-key",  # Allow specific headers
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST"  # Allow specific methods
        }
    }
    
    
