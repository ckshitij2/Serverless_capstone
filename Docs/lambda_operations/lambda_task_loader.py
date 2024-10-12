import json
import boto3
import os
import re

# Initialize the DynamoDB resource and SQS client
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
sqs = boto3.client('sqs', region_name='ap-south-1')

# Define the table name and SQS queue URL from environment variables
TABLE_NAME = os.environ.get('TABLE_NAME', 'employee_tasks')
QUEUE_URL = os.environ.get('QUEUE_URL', 'https://sqs.ap-south-1.amazonaws.com/975050064793/task_ingester_queue')

def lambda_handler(event, context):
    # Convert the event to a JSON string
    event_json = json.dumps(event)
    print(f"Event JSON: {event_json}")
    
    # Convert the JSON string back to a dictionary
    try:
        event_dict = json.loads(event_json)
    except json.JSONDecodeError as e:
        print(f"Error parsing event JSON: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error processing event.')
        }

    # Initialize the DynamoDB table
    table = dynamodb.Table(TABLE_NAME)
    
    # Loop through each record in the SQS event
    for record in event_dict['Records']:
        # Parse the message body
        message_body = record['body']
        print("####################################################")
        print(f"Raw message body: {message_body}")
        print("####################################################")
        
        # Convert the message body into a valid JSON string using regex
        try:


            # Adding quotes around keys and replacing values with quotes as needed
            message_body = re.sub(r'([a-zA-Z0-9_]+):', r'"\1":', message_body)  # Add quotes around keys
            message_body = message_body.replace("'", "\"")  # Replace single quotes with double quotes
            
            # Fixing the value formatting to ensure they are quoted
            message_body = re.sub(r':\s*([^,}]+)', r': "\1"', message_body)  # Ensure all values are quoted
            message_body = re.sub(r':\s*("[^"]*")', r': \1', message_body)  # Don't double-quote already quoted values

            message = json.loads(message_body)
            print("******************************************")
            print(f"Parsed message: {message}")
            print("******************************************")
        except json.JSONDecodeError as e:
            print(f"Error parsing message: {e}")
            continue  # Skip this record if there's an error in parsing
        
        # Extract task details
        task_id = message['taskId']
        task_name = message['taskName']
        task_owner = message['taskOwner']
        
        task_item = {
            'taskId': task_id,
            'taskName': task_name,
            'taskOwner': task_owner
        }
        
        #Add task to DynamoDB (uncomment when ready)
        try:
            table.put_item(Item=task_item)
            print(f'Task added to DynamoDB table: {task_id}')
        except Exception as e:
            print(f'Error adding task {task_id} to DynamoDB table: {e}')
        
       
    
    return {
        'statusCode': 200,
        'body': json.dumps('Tasks processed successfully.')
    }
