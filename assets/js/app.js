let cl = console.log;




const todoForm = document.getElementById('todoForm')
const todoItem = document.getElementById('todoItem')
const todoList = document.getElementById('todoList')
const addBtn = document.getElementById('addBtn')
const updateBtn = document.getElementById('updateBtn')


let todoListArr = JSON.parse(localStorage.getItem('todoListArr')) || []; 

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const onItemEdit = (ele) => {
    // cl(ele, 'Edited')
    let editId = ele.getAttribute('data-id')
    cl(editId)


    let editObj = todoListArr.find(todo => {
        return todo.skillId === editId
    })

    localStorage.setItem('editObj', JSON.stringify(editObj))

    cl(editObj)

    updateBtn.classList.remove('d-none');
    addBtn.classList.add('d-none');
    todoItem.value = editObj.skillName;


}

const onItemDelete = (ele) => {
    cl(ele)

   
    cl(ele.dataset)

    let deleteId = ele.dataset.deleteid;
    cl(deleteId)
    let deletedValue = document.getElementById(deleteId).firstElementChild.innerHTML;
    let confirmDelete = confirm(`Are you sure to delete ${deletedValue} ?`) 

   if(confirmDelete){
    todoListArr = todoListArr.filter(item => {
        return item.skillId != deleteId;
    })

    
    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
    

    document.getElementById(deleteId).remove()

    Swal.fire({
        icon: 'success',
        text: `${deletedValue.toUpperCase()} is deleted successfully!!`,
        timer: 3000
    })
   }else{
    return false;
   }

}


const templating = (arr) => {
    let res = ''
    arr.forEach(obj => {
        res += `
        <li class="list-group-item font-weight-bold mb-2 d-flex justify-content-between" id='${obj.skillId}'>
        <span>${obj.skillName}</span>
        <span>
            <i class="fa-solid fa-pen-to-square mr-2 edit"
            onclick = "onItemEdit(this)"  
            data-id='${obj.skillId}'></i>
            <i class="fa-solid fa-trash-can delete"
            onclick = "onItemDelete(this)"
            data-deleteid='${obj.skillId}'></i>
        </span>
    </li>
               `
    })

    todoList.innerHTML = res;
}

templating(todoListArr)

const onFormSubmit = (eve) => {
    eve.preventDefault();
   

    let skill = todoItem.value;

    let toDoObj = {
        skillName: skill,
        skillId: create_UUID()  
    }
    todoListArr.unshift(toDoObj)
    localStorage.clear()
    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
    cl(todoListArr)
    eve.target.reset()

   

    let li = document.createElement('li')
    li.id = toDoObj.skillId;
    li.className = 'list-group-item font-weight-bold mb-2 d-flex justify-content-between'
    li.innerHTML = `
                    <span>${toDoObj.skillName}</span>
                    <span>
                        <i class="fa-solid fa-pen-to-square mr-2 edit"
                        onclick = "onItemEdit(this)"  
                        data-id='${toDoObj.skillId}'></i>
                        <i class="fa-solid fa-trash-can delete"
                        onclick = "onItemDelete(this)"
                        data-deleteid='${toDoObj.skillId}'></i>
                    </span>
    
                    `

    todoList.prepend(li)

    Swal.fire({
        icon: 'success',
        text: `${toDoObj.skillName.toUpperCase()} is added successfully!!`,
        timer: 3000
    })

}

const onUpdateBtn = () => {
    let updatedValue = todoItem.value;
    cl(updatedValue)

    let editedObj = JSON.parse(localStorage.getItem('editObj'))
    cl(editedObj)


    for (let i = 0; i < todoListArr.length; i++) {
        if (todoListArr[i].skillId === editedObj.skillId) {
            todoListArr[i].skillName = updatedValue
        }
        break;
    }
    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))

    let targetLi = document.getElementById(editedObj.skillId)
    targetLi.firstElementChild.innerHTML = updatedValue;
    todoForm.reset();
    updateBtn.classList.add('d-none')
    addBtn.classList.remove('d-none')

    Swal.fire({
        icon: 'success',
        title: `${updatedValue.toUpperCase()} is updated successfully!!`,
        timer: 3000
    })

}


todoForm.addEventListener('submit', onFormSubmit)
updateBtn.addEventListener('click', onUpdateBtn)


