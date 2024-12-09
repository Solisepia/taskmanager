document.addEventListener('DOMContentLoaded', function () {
    const currentTime = document.getElementById('current-time');
    const currentDate = document.getElementById('current-date');
    const addTaskModal = document.getElementById('add-task-modal');
    const closeModal = document.querySelector('.close');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const taskList = document.getElementById('task-list');
    const noteList = document.getElementById('note-list');
    const addBtn = document.getElementById('add-btn');
    const todoBtn = document.getElementById('todo-btn');
    const notesBtn = document.getElementById('notes-btn');
    const filterBtn = document.getElementById('filter-btn');
    const calendarBtn = document.getElementById('calendar-btn');

    let tasks = [];
    let notes = [];
    let editingTaskIndex = -1;
    let editingNoteIndex = -1;
    let isViewingNotes = false;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function updateTime() {
        const now = new Date();
        currentTime.textContent = now.toLocaleTimeString();
        currentDate.textContent = now.toLocaleDateString();
    }
    setInterval(updateTime, 1000);
    updateTime();

    function loadTasksAndNotes() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        notes = JSON.parse(localStorage.getItem('notes')) || [];
        renderTasks(tasks);
        renderNotes(notes);
        renderCalendar(currentYear, currentMonth); // 渲染日历
    }

    function renderTasks(tasksToRender) {
        taskList.innerHTML = '';
        tasksToRender.forEach((task, index) => {
            addTaskToTable(task, index);
        });
    }

    function renderNotes(notesToRender) {
        noteList.innerHTML = '';
        notesToRender.forEach((note, index) => {
            addNoteToTable(note, index);
        });
    }

    function renderCalendar(year, month) {
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = '';
    
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
    
        const totalCells = startingDay + daysInMonth;
        const rows = Math.ceil(totalCells / 7);
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                const cellIndex = i * 7 + j;
    
                if (cellIndex >= startingDay && cellIndex < startingDay + daysInMonth) {
                    const day = cellIndex - startingDay + 1;
                    cell.textContent = day;
    
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const tasksForDate = tasks.filter(task => task.date === dateString);
    
                    tasksForDate.forEach(task => {
                        const taskDiv = document.createElement('div');
                        taskDiv.textContent = task.title;
                        taskDiv.className = `task ${task.priority.toLowerCase()}`;
                        cell.appendChild(taskDiv);
                    });
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    function changeMonth(offset) {
        currentMonth += offset;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    }

    function addTaskToTable(task, index) {
        const taskItem = document.createElement('tr');
        taskItem.dataset.index = index;

        let priorityClass = '';
        if (task.priority === 'High') {
            priorityClass = 'priority-high';
        } else if (task.priority === 'Medium') {
            priorityClass = 'priority-medium';
        } else {
            priorityClass = 'priority-low';
        }

        taskItem.className = priorityClass;
        taskItem.innerHTML = `
            <td>${task.title}</td>
            <td>${task.tag}</td>
            <td>${task.priority}</td>
            <td>${task.date}</td>
            <td class="description">${task.description}</td>
            <td class="delete-btn-container">
                <button class="delete-btn" onclick="deleteTask(event)">Delete</button>
            </td>
        `;

        taskItem.onclick = function () {
            openEditModal(index);
        };

        taskList.appendChild(taskItem);
    }

    function addNoteToTable(note, index) {
        const noteItem = document.createElement('tr');
        noteItem.dataset.index = index;

        noteItem.innerHTML = `
            <td>${note.title}</td>
            <td>${note.tag}</td>
            <td class="description">${note.content}</td>
            <td class="delete-btn-container">
                <button class="delete-btn" onclick="deleteNote(event)">Delete</button>
            </td>
        `;

        noteItem.onclick = function () {
            openEditNoteModal(index);
        };

        noteList.appendChild(noteItem);
    }

    function openEditModal(index) {
        const task = tasks[index];
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-tag').value = task.tag;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-date').value = task.date;
        document.getElementById('task-description').value = task.description;
        document.getElementById('modal-title').textContent = 'Add task';
        document.getElementById('priority-date-section').style.display = 'block';

        editingTaskIndex = index;
        addTaskModal.style.display = "block";
        autoResizeTextarea();
    }

    function openEditNoteModal(index) {
        const note = notes[index];
        document.getElementById('task-title').value = note.title;
        document.getElementById('task-tag').value = note.tag;
        document.getElementById('task-description').value = note.content;
        document.getElementById('modal-title').textContent = 'Add note';
        document.getElementById('priority-date-section').style.display = 'none';

        editingNoteIndex = index;
        addTaskModal.style.display = "block";
        autoResizeTextarea();
    }

    function autoResizeTextarea() {
        const textarea = document.getElementById('task-description');
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    saveTaskBtn.onclick = function () {
        const title = document.getElementById('task-title').value;
        const tag = document.getElementById('task-tag').value;
        const description = document.getElementById('task-description').value;

        if (isViewingNotes) {
            if (editingNoteIndex >= 0) {
                notes[editingNoteIndex] = { title, tag, content: description };
            } else {
                notes.push({ title, tag, content: description });
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes(notes);
        } else {
            const priority = document.getElementById('task-priority').value;
            const date = document.getElementById('task-date').value;

            if (editingTaskIndex >= 0) {
                tasks[editingTaskIndex] = { title, tag, priority, date, description };
            } else {
                tasks.push({ title, tag, priority, date, description });
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks(tasks);
        }

        clearInputFields();
        addTaskModal.style.display = "none";
        editingTaskIndex = -1;
        editingNoteIndex = -1;
        renderCalendar(currentYear, currentMonth);
    };

    function clearInputFields() {
        document.getElementById('task-title').value = '';
        document.getElementById('task-tag').value = '';
        document.getElementById('task-priority').value = '高';
        document.getElementById('task-date').value = '';
        document.getElementById('task-description').value = '';
    }

    window.deleteTask = function(event) {
        event.stopPropagation();
        const index = event.target.closest('tr').dataset.index;
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        renderCalendar(currentYear, currentMonth);
    };

    window.deleteNote = function(event) {
        event.stopPropagation();
        const index = event.target.closest('tr').dataset.index;
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes(notes);
    };

    addBtn.onclick = function () {
        clearInputFields();
        addTaskModal.style.display = "block";
        editingTaskIndex = -1;
        editingNoteIndex = -1;
    
        if (isViewingNotes) {
            document.getElementById('modal-title').textContent = 'Add note';
            document.getElementById('priority-date-section').style.display = 'none';
        } else {
            document.getElementById('modal-title').textContent = 'Add task';
            document.getElementById('priority-date-section').style.display = 'block';
        }
    };

    closeModal.onclick = function () {
        addTaskModal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == addTaskModal) {
            addTaskModal.style.display = "none";
        }
    };

    todoBtn.onclick = function () {
        isViewingNotes = false;
        document.getElementById('task-table').style.display = "table";
        document.getElementById('note-table').style.display = "none";
        renderTasks(tasks);
        filterBtn.style.display = "block";
        document.getElementById('calendar').style.display = "none";
    };

    notesBtn.onclick = function () {
        isViewingNotes = true;
        document.getElementById('task-table').style.display = "none";
        document.getElementById('note-table').style.display = "table";
        renderNotes(notes);
        filterBtn.style.display = "block";
        document.getElementById('calendar').style.display = "none";
    };

    calendarBtn.onclick = function () {
        isViewingNotes = false;
        document.getElementById('task-table').style.display = "none";
        document.getElementById('note-table').style.display = "none";
        document.getElementById('calendar').style.display = "block";
        renderCalendar(currentYear, currentMonth);
        filterBtn.style.display = "none";
    };

    const tableHeaders = document.querySelectorAll('#task-table th');
    tableHeaders.forEach((header, index) => {
        header.addEventListener('click', () => {
            sortTasks(index);
        });
    });

    function sortTasks(index) {
        const sortKey = ['title', 'tag', 'priority', 'date', 'description'][index];
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };

        tasks.sort((a, b) => {
            if (sortKey === 'priority') {
                return priorityOrder[a[sortKey]] - priorityOrder[b[sortKey]];
            } else if (typeof a[sortKey] === 'string') {
                return a[sortKey].localeCompare(b[sortKey]);
            }
            return a[sortKey] - b[sortKey];
        });

        renderTasks(tasks);
    }

    const filterModal = document.getElementById('filter-modal');
    const closeFilterModal = document.getElementById('close-filter-modal');
    const applyFilterBtn = document.getElementById('apply-filter-btn');
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    const filterTagTodo = document.getElementById('filter-tag-todo');
    const filterTagNotes = document.getElementById('filter-tag');

    filterBtn.onclick = function () {
        filterModal.style.display = "block";
        populateTags();

        if (isViewingNotes) {
            document.getElementById('filter-modal-title').textContent = 'Notes Filter';
            document.getElementById('filter-todo').style.display = 'none';
            document.getElementById('filter-notes').style.display = 'block';
        } else {
            document.getElementById('filter-modal-title').textContent = 'Tasks Filter';
            document.getElementById('filter-todo').style.display = 'block';
            document.getElementById('filter-notes').style.display = 'none';
        }
    };

    function populateTags() {
        const tagsNotes = new Set(notes.map(note => note.tag));
        const tagsTasks = new Set(tasks.map(task => task.tag));

        filterTagTodo.innerHTML = '<option value="">All</option>';
        tagsTasks.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            filterTagTodo.appendChild(option);
        });

        filterTagNotes.innerHTML = '<option value="">All</option>';
        tagsNotes.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            filterTagNotes.appendChild(option);
        });
    }

    applyFilterBtn.onclick = function () {
        if (isViewingNotes) {
            const tag = filterTagNotes.value;

            const filteredNotes = notes.filter(note => {
                return tag ? note.tag === tag : true;
            });

            renderNotes(filteredNotes);
        } else {
            const priority = document.getElementById('filter-priority').value;
            const startDate = document.getElementById('filter-date-start').value;
            const endDate = document.getElementById('filter-date-end').value;
            const tag = filterTagTodo.value;

            const filteredTasks = tasks.filter(task => {
                const matchesPriority = priority ? task.priority === priority : true;
                const matchesDate = (!startDate || task.date >= startDate) && (!endDate || task.date <= endDate);
                const matchesTag = tag ? task.tag === tag : true;
                return matchesPriority && matchesDate && matchesTag;
            });

            renderTasks(filteredTasks);
        }

        filterModal.style.display = "none";
    };

    resetFilterBtn.onclick = function () {
        if (isViewingNotes) {
            filterTagNotes.value = '';
            renderNotes(notes);
        } else {
            document.getElementById('filter-priority').value = '';
            document.getElementById('filter-date-start').value = '';
            document.getElementById('filter-date-end').value = '';
            filterTagTodo.value = '';
            renderTasks(tasks);
        }
    };

    closeFilterModal.onclick = function () {
        filterModal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == filterModal) {
            filterModal.style.display = "none";
        }
    };

    document.getElementById('prev-month-btn').onclick = function () {
        changeMonth(-1);
    };

    document.getElementById('next-month-btn').onclick = function () {
        changeMonth(1);
    };

    loadTasksAndNotes();
});

let messages = [];
document.getElementById('save-api-key-btn').addEventListener('click', function() {
    let apiKey = document.getElementById('api-key-input').value;
    if (apiKey.trim() !== "") {
        localStorage.setItem('chatgpt_api_key', apiKey);
        alert('API Key saved successfully!');
    } else {
        alert('Please enter a valid API Key.');
    }
});

function getApiKey() {
    return localStorage.getItem('chatgpt_api_key');
}

document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        let userInput = event.target.value;
        if (userInput.trim() !== "") {
            messages.push({role: "user", content: userInput});

            let chatBox = document.getElementById('chat-box');
            let userMessage = document.createElement('div');
            userMessage.textContent = "User: " + userInput;
            userMessage.classList.add('user-message');
            chatBox.appendChild(userMessage);

            let apiKey = getApiKey();
            if (!apiKey) {
                alert('Please enter and save your API Key first.');
                return;
            }

            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: messages
                })
            })
            .then(response => response.json())
            .then(data => {
                let botMessageContent = data.choices[0].message.content;
                messages.push({role: "assistant", content: botMessageContent});

                let botMessage = document.createElement('div');
                botMessage.textContent = "Bot: " + botMessageContent;
                botMessage.classList.add('bot-message');
                chatBox.appendChild(botMessage);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            event.target.value = '';
        }
    }
});

document.getElementById('clear-chat-btn').addEventListener('click', function() {
    messages = [];

    let chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
});