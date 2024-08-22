// Define the API URL as a variable
const API_URL = 'https://9lzyamugrl.execute-api.ap-south-1.amazonaws.com/prod/tasks'; // Replace with your actual API Gateway URL

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const taskIdInput = document.getElementById('taskId');
    const taskNameInput = document.getElementById('taskName');
    const taskOwnerInput = document.getElementById('taskOwner');

    // Function to fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'X8TnD3EWqI8BskW1BuBxe2n1LeseuViOaE9a07VY'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tasks = await response.json();
            console.log('Fetched tasks:', tasks);

            // Clear the task list
            taskList.innerHTML = '';

            // Check if tasks is an object and iterate over its properties
            if (tasks && typeof tasks === 'object') {
                const taskItems = JSON.parse(tasks.body);
                console.log('Parsed tasks:', taskItems);

                Object.keys(taskItems).forEach(key => {
                    const task = taskItems[key];

                    // Create a container for the task details
                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';

                    // Add task ID
                    const taskIdElement = document.createElement('div');
                    taskIdElement.className = 'task-id';
                    taskIdElement.textContent = `ID: ${task.taskId}`;
                    taskItem.appendChild(taskIdElement);

                    // Add task name
                    const taskNameElement = document.createElement('div');
                    taskNameElement.className = 'task-name';
                    taskNameElement.textContent = `Name: ${task.taskName}`;
                    taskItem.appendChild(taskNameElement);

                    // Add task owner
                    const taskOwnerElement = document.createElement('div');
                    taskOwnerElement.className = 'task-owner';
                    taskOwnerElement.textContent = `Owner: ${task.Task_Owner}`;
                    taskItem.appendChild(taskOwnerElement);

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
        const taskOwner = taskOwnerInput.value;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'X8TnD3EWqI8BskW1BuBxe2n1LeseuViOaE9a07VY'
                },
                body: JSON.stringify({ taskId, taskName, taskOwner })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            taskIdInput.value = '';
            taskNameInput.value = '';
            taskOwnerInput.value = '';

            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // Initial fetch
    fetchTasks();
});
