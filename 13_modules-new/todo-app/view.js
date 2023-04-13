// let owner = localStorage.getItem('owner');
// let path = './api.js';
// if (JSON.parse(localStorage.getItem(`storage-flag-${owner}`)) === false) {
//   path = './localStorage.js';
// };
// let { getToDoList, setItem, deleteItem, getItem, doneItem } = import (path);
// console.log(getToDoList);
import { switchStorage } from './api.js';
import { checkIfEmpty } from './helpers.js';

//Создает заголовок страницы (заголовок из appInit)
function createAppTitle (title) {
    let mainTitle = document.createElement('h2');
    mainTitle.innerHTML = title;
    return mainTitle;

};

//Создает форму создания дела. Внутри обработчики 
//input с проверкой на пустоту 
//и submit для отправки дела на сервер и его отрисовки
function createToDoItemForm (owner, {setItem, deleteItem, doneItem, getItem }) {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.id = 'set-task-button';
    button.name = 'button';
    button.textContent = 'Добавить дело';
    button.disabled = 'disabled';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    document.getElementById('todo-app').append(form);

    input.addEventListener('input', checkIfEmpty);
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const itemData = await setItem( owner, input.value.trim());
        setDOMItem(itemData.id, { deleteItem, doneItem, getItem });
        form.reset();
    });

    return {
        form,
        input,
        button,
    };
};

//Создает кнопку переключения хранилища (нужен пользователь)
function createStorageSwitcher(owner) {
    let switcher = document.createElement('button');
    let switcherWrapper = document.createElement('div');
    switcher.classList.add('btn', 'mb-4');
    switcher.id = `storage-switcher-${owner}`;
    let apiFlag = JSON.parse(localStorage.getItem(`storage-flag-${owner}`));
    if (!apiFlag) {
      switcher.textContent = 'перейти на api';
      switcher.classList.add('btn-success');
    } else {
      switcher.textContent = 'перейти на LocalStorage';
      switcher.classList.remove('btn-success');
    }

    switcherWrapper.append(switcher);
    document.getElementById('todo-app').prepend(switcherWrapper);

    switcher.addEventListener('click', e => {
        // e.preventDefault();
        
        switchStorage(owner);
        window.location.reload();
    })

}


//Создает существующий список дел (внутри вызывается функция подгрузки дел из стораджа)
async function setToDoList (owner, getToDoList, { deleteItem, doneItem, getItem }) {
    let presavedList;
    let list = document.querySelector('.list-group');
 
    presavedList = await getToDoList(owner);

    console.log(presavedList);

    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }

    if (presavedList.length > 0) {
        presavedList.forEach(task =>  {
            setDOMItem(task.id, { deleteItem, doneItem, getItem });
        });
    } else {
        let taskItem = document.createElement('li');
        taskItem.id = 'default-li';
        taskItem.textContent = 'Кажется, дел нет. Создайте новое!';

        list.append(taskItem);
    }

    document.getElementById('todo-app').append(list);

};  

//Отрисовывает дело в DOM (по ID)
async function setDOMItem (id, { deleteItem, doneItem, getItem }) {
  let container = document.querySelector('.list-group');
  let todoItem = await getItem(id);
  const doneClass = 'list-group-item-success';
  let item = document.createElement('li');
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

  if (todoItem.done) {
    item.classList.add(doneClass);
  };

  item.textContent = todoItem['name'];
  item.id = todoItem['id'];

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  doneButton.addEventListener('click', () => {
    doneItem(todoItem);
    item.classList.toggle(doneClass);
    
  });
  deleteButton.addEventListener('click', () => {
    deleteItem(todoItem);
    container.removeChild(item);
  });

  if (document.getElementById('default-li')) container.removeChild(document.getElementById('default-li'));

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);
  container.append(item);

  return item;
}

//Запускает первоначальную отрисовку страницы с существующими данными
async function appInit ({
  getToDoList,
  setItem,
  deleteItem,
  getItem,
  doneItem,
  switchStorage,
} ,owner = 'me', title = 'Мои дела') {

  localStorage.setItem(owner, []);
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('btn-success'));
  document.getElementById(`btn-${owner}`).classList.add('btn-success');
  createAppTitle(title);
  createToDoItemForm(owner, {setItem, deleteItem, doneItem, getItem });
  createStorageSwitcher(owner);
  let list = document.createElement('ul');
  list.classList.add('list-group');
  document.getElementById('todo-app').append(list);
  setToDoList(owner, getToDoList, { deleteItem, doneItem, getItem });
};



export { appInit, setToDoList};


