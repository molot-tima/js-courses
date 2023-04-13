export function getToDoList (owner) {
    let tasksList = [];

    if (localStorage.getItem('tasks-list') != [] && localStorage.getItem('tasks-list') != null && localStorage.getItem('tasks-list').length > 0) {
        tasksList = JSON.parse(localStorage.getItem('tasks-list'));

        tasksList.forEach(task => {
            if (task['owner'] !== owner) {
                tasksList.splice(tasksList.indexOf(task), 1)
            }
        });
    }

    return tasksList;
}

export function switchStorage (owner) {
    let flag = JSON.parse(localStorage.getItem(`storage-flag-${owner}`));
    if (!flag) {
        flag = !flag;
        localStorage.setItem(`storage-flag-${owner}`, flag);
        console.log('to api');
        alert('хранилище изменено на серверное');
    } else if (flag) {
        flag = !flag;
        localStorage.setItem(`storage-flag-${owner}`, flag);
        console.log('to local');
        alert('хранилище изменено на локальное');
    } else localStorage.setItem(`storage-flag-${owner}`, true);
};

export function setItem (owner, name) {
    let taskList = JSON.parse(localStorage.getItem('tasks-list'));
    console.log(taskList);
    let prevID = 0;

    if (taskList === null) {
        taskList = [];
    }

    if (taskList.length > 0) {
        taskList.forEach(task => {
            prevID = Math.max(prevID, task['id']);
        });
    }

    const data = {
        'owner': owner,
        'name': name,
        'done': false,
        'id': prevID + 1,
    }

    taskList.push(data);
    localStorage.setItem('tasks-list', JSON.stringify(taskList));

    console.log(data);
    return data;

}

export function deleteItem (todoItem) {
    const taskList = JSON.parse(localStorage.getItem('tasks-list'));
    let taskIndex = taskList.indexOf((taskList.find(task => task['id'] === todoItem.id)));
    taskList.splice(taskIndex, 1);
    
    localStorage.setItem('tasks-list', JSON.stringify(taskList));
    console.log(taskList);
}

export function getItem (id) {
    const taskList = JSON.parse(localStorage.getItem('tasks-list'));
    const itemData = taskList.find(task => task['id'] ===  id);
    console.log(itemData);
    return itemData;
}

export function doneItem (todoItem) {
    const taskList = JSON.parse(localStorage.getItem('tasks-list'));
    taskList
        .map(task => task['id'] === todoItem.id ? task.done = !task.done : task)
    console.log(taskList);

    localStorage.setItem('tasks-list', JSON.stringify(taskList));
} 