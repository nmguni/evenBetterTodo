// // Form reference
// const form = {}
// form.noteText = document.querySelector('#formNoteText');
// form.addButton = document.querySelector('#formAddButton');
// form.color = document.querySelector('#formColor');

// const notes = document.querySelector('#notes');

// form.noteText.focus();

// // Functions
// function addNote() {
//     let text = form.noteText.value;
//     let note = document.createElement('div');
//     let deleteButton = document.createElement('span');

//     note.classList.add('note');

//     note.innerHTML = `<div class='note-text'>${text}</div>`;
//     deleteButton.classList.add('note-delete');
//     deleteButton.innerHTML = '&times;';

//     note.appendChild(deleteButton);
//     notes.appendChild(note);

//     form.noteText.value = '';
//     form.noteText.focus();

//     addListenerDeleteButton(deleteButton);
// }

// function addListenerDeleteButton(deleteButton) {
//     deleteButton.addEventListener('click', function (e) {
//         e.stopPropagation();
//         deleteNote(e);
//     });
// }

// function deleteNote(e) {
//     let eventNote = e.target.parentNode;
//     eventNote.parentNode.removeChild(eventNote);
// }



// // Event Listeners
// form.addButton.addEventListener('click', function (e) {
//     e.preventDefault();
//     if (form.noteText.value != '') {
//         addNote();
//     }
// })

//     // ------------------------------------------
//     (function () {
//         // 'use strict';
//         var tasker = {
//             init: function () {
//                 this.cacheDom();
//                 this.bindEvents();
//                 this.evalTasklist();
//             },
//             cacheDom: function () {
//                 this.taskInput = document.getElementById("input-task");
//                 this.addBtn = document.getElementById("add-task-btn");
//                 this.tasklist = document.getElementById("tasks");
//                 this.tasklistChildren = this.tasklist.children;
//                 this.errorMessage = document.getElementById("error");
//             },
//             bindEvents: function () {
//                 this.addBtn.onclick = this.addTask.bind(this);
//                 this.taskInput.onkeypress = this.enterKey.bind(this);
//             },
//             evalTasklist: function () {
//                 var i, chkBox, delBtn;
//                 //BIND CLICK EVENTS TO ELEMENTS
//                 for (i = 0; i < this.tasklistChildren.length; i += 1) {
//                     //ADD CLICK EVENT TO CHECKBOXES
//                     chkBox = this.tasklistChildren[i].getElementsByTagName("input")[0];
//                     chkBox.onclick = this.completeTask.bind(this, this.tasklistChildren[i], chkBox);
//                     //ADD CLICK EVENT TO DELETE BUTTON
//                     delBtn = this.tasklistChildren[i].getElementsByTagName("button")[0];
//                     delBtn.onclick = this.delTask.bind(this, i);
//                 }
//             },
//             render: function () {
//                 var taskLi, taskChkbx, taskVal, taskBtn, taskTrsh;
//                 //BUILD HTML
//                 taskLi = document.createElement("li");
//                 taskLi.setAttribute("class", "task");
//                 //CHECKBOX
//                 taskChkbx = document.createElement("input");
//                 taskChkbx.setAttribute("type", "checkbox");
//                 //USER TASK
//                 taskVal = document.createTextNode(this.taskInput.value);
//                 //DELETE BUTTON
//                 taskBtn = document.createElement("button");
//                 //TRASH ICON
//                 taskTrsh = document.createElement("i");
//                 taskTrsh.setAttribute("class", "fa fa-trash");
//                 //INSTERT TRASH CAN INTO BUTTON
//                 taskBtn.appendChild(taskTrsh);

//                 //APPEND ELEMENTS TO TASKLI
//                 taskLi.appendChild(taskChkbx);
//                 taskLi.appendChild(taskVal);
//                 taskLi.appendChild(taskBtn);

//                 //ADD TASK TO TASK LIST
//                 this.tasklist.appendChild(taskLi);

//             },
//             completeTask: function (i, chkBox) {
//                 if (chkBox.checked) {
//                     i.className = "task completed";
//                 } else {
//                     this.incompleteTask(i);
//                 }
//             },
//             incompleteTask: function (i) {
//                 i.className = "task";
//             },
//             enterKey: function (event) {
//                 if (event.keyCode === 13 || event.which === 13) {
//                     this.addTask();
//                 }
//             },
//             addTask: function () {
//                 var value = this.taskInput.value;


//                 if (value === "") {
//                     this.error();
//                 } else {
//                     this.render();
//                     this.taskInput.value = "";
//                     this.evalTasklist();
//                 }
//             },
//             delTask: function (i) {
//                 this.tasklist.children[i].remove();
//                 this.evalTasklist();
//             },
//             error: function () {
//                 this.errorMessage.style.display = "block";
//             }
//         };

//         tasker.init();
//     }());







const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
    clearElement(listsContainer)
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()