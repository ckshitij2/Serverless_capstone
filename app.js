// Define the API URL as a variable
const API_URL = 'https://27ox4e757g.execute-api.us-east-1.amazonaws.com/prod/task'; // Replace with your actual API Gateway URL

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const taskIdInput = document.getElementById('taskId');
    const taskNameInput = document.getElementById('taskName');

    // Function to fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            
            // Debugging: log the tasks object
            console.log('Fetched tasks:', tasks);

            // Clear the task list
            taskList.innerHTML = '';

            // Check if tasks is an object and iterate over its properties
            if (tasks && typeof tasks === 'object') {
                const taskItems = JSON.parse(tasks.body);
                console.log('Parsed tasks:', taskItems);

                Object.keys(taskItems).forEach(key => {
                    const task = taskItems[key];
                    console.log('Task:', task);
                    console.log(`Task ID: ${task.taskId}, Task Name: ${task.taskName}`);

                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';
                    taskItem.textContent = `ID: ${task.taskId}, Name: ${task.taskName}`;
                    taskList.appendChild(taskItem);
                });
            } else {
                throw new Error('Unexpected response format: tasks is not an object.');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Function to add a new task
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const taskId = taskIdInput.value;
        const taskName = taskNameInput.value;

        // Debugging: log the task details before sending
        console.log('Adding task:', { taskId, taskName });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ taskId, taskName })
            });

            // Debugging: log the response status and headers
            console.log('POST response status:', response.status);
            console.log('POST response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            taskIdInput.value = '';
            taskNameInput.value = '';
            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // Initial fetch
    fetchTasks();
});
