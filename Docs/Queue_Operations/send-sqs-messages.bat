@echo off
setlocal enabledelayedexpansion

REM Define the SQS queue URL, region, and message group ID
set QueueUrl=https://sqs.ap-south-1.amazonaws.com/419526246250/task_ingester_queue.fifo
set Region=ap-south-1
set MessageGroupId=BATCH-A:TASKS

REM Loop to send messages with different task IDs
for /L %%i in (10,1,16) do (
    REM Generate a unique task ID and message body
    set TaskId=ITEM00%%i
    set "MessageBody={\"taskId\":\"!TaskId!\",\"taskName\":\"Sample Task %%i\",\"Task_Owner\":\"Kshitij Chauhan\"}"

    REM Send message to SQS
    aws sqs send-message ^
        --queue-url %QueueUrl% ^
        --message-body "!MessageBody!" ^
        --region %Region% ^
        --message-group-id %MessageGroupId%

    echo Message with taskId !TaskId! sent.
)

endlocal
