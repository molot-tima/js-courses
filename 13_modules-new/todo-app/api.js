

export async function getToDoList (owner) {
    console.log(owner);
    const responce = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
    const data = await responce.json();
    console.log(data);
    return data;
    
}

export async function setItem (owner, name) {
    const responce = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
            name,
            owner,
        }),
        headers: {'Content-Type':'application/JSON'}
    });
    const data = await responce.json();
    console.log(data);
    return data;

}

export function switchStorage (owner) {
    let flag = JSON.parse(localStorage.getItem(`storage-flag-${owner}`));
    
    if (!flag) {
        console.log(flag);
        flag = !flag;
        localStorage.setItem(`storage-flag-${owner}`, flag);
        console.log('to api');
        alert('хранилище изменено на серверное');
    } else if (flag) {
        console.log(flag);
        flag = !flag;
        localStorage.setItem(`storage-flag-${owner}`, flag);
        console.log('to local');
        alert('хранилище изменено на локальное');
    } else localStorage.setItem(`storage-flag-${owner}`, true);
};

export async function deleteItem (todoItem) {
    const responce = await fetch (`http://localhost:3000/api/todos/${todoItem.id}`, {
        method: 'DELETE'
    });
    console.log(responce);
}

export async function getItem (id) {
    const responce = await fetch (`http://localhost:3000/api/todos/${id}`);
    const itemData = await responce.json();

    return itemData;
}

export async function doneItem (todoItem) {
    todoItem.done = !todoItem.done;
    const responce = await fetch (`http://localhost:3000/api/todos/${todoItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            done: todoItem.done,
        }),
        headers: {'Content-Type':'application/JSON'}

    });
    console.log(responce);
}