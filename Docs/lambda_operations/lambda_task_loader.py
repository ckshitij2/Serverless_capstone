import json
import boto3
import os

# Initialize the DynamoDB resource and SQS client
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
sqs = boto3.client('sqs', region_name='ap-south-1')

# Define the table name and SQS queue URL from environment variables
TABLE_NAME = os.environ.get('TABLE_NAME', 'employee_tasks')
QUEUE_URL = os.environ.get('QUEUE_URL', 'https://sqs.ap-south-1.amazonaws.com/419526246250/task_ingester_queue.fifo')

def lambda_handler(event, context):
    # Initialize the DynamoDB table
    table = dynamodb.Table(TABLE_NAME)
    
    # Loop through each record in the SQS event
    for record in event['Records']:
        # Parse the message body
        message = json.loads(record['body'])
        
        # Extract task details
        task_id = message['taskId']
        task_name = message['taskName']
        task_owner = message['Task_Owner']
        
        # Write the task to the DynamoDB table
        try:
            table.put_item(
                Item={
                    'taskId': task_id,
                    'taskName': task_name,
                    'Task_Owner': task_owner
                }
            )
            print(f'Task added to DynamoDB table:{task_id}')
        except Exception as e:
            print(f'Error adding task {task_id} to DynamoDB table: {e}')
        
        # Delete the message from the SQS queue
        receipt_handle = record['receiptHandle']
        try:
            sqs.delete_message(
                QueueUrl=QUEUE_URL,
                ReceiptHandle=receipt_handle
            )
            print(f'Message {receipt_handle} deleted from SQS queue.')
        except Exception as e:
            print(f'Error deleting message {receipt_handle} from SQS queue: {e}')
    
    return {
        'statusCode': 200,
        'body': json.dumps('Tasks processed successfully.')
    }
