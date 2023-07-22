let cl = console.log;


// let testConfirm = confirm('You want to delete?')
// cl(testConfirm)

const todoForm = document.getElementById('todoForm')
const todoItem = document.getElementById('todoItem')
const todoList = document.getElementById('todoList')
const addBtn = document.getElementById('addBtn')
const updateBtn = document.getElementById('updateBtn')


let todoListArr = JSON.parse(localStorage.getItem('todoListArr')) || []; // On page refresh local storage me jo data hai wo store rhena chahiye UI pe aur agar store nhi hai to empty rhena chahiye aur data backEnd se aayega isliye JSON.parse use kiye wo obj me convert kr dega
// OR
// const todoListArr = [];
// if(localStorage.getItem('todoListArr')){
//     todoListArr = JSON.parse(localStorage.getItem('todoListArr'))
// }

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

    // localStorage.setItem('editId', editId)

    let editObj = todoListArr.find(todo => {
        return todo.skillId === editId
    })

    localStorage.setItem('editObj', JSON.stringify(editObj))

    cl(editObj)

    updateBtn.classList.remove('d-none');
    addBtn.classList.add('d-none');
    // todoItem.value = 'Testing'
    todoItem.value = editObj.skillName;


}

const onItemDelete = (ele) => {
    cl(ele)

    // let deleteId = ele.getAttribute('data-deleteid') //   Advantage of data-id is that we get JS object and whatever is return after data- will be key of an object.
    cl(ele.dataset)
    // cl(ele.dataset.deleteid)

    let deleteId = ele.dataset.deleteid;
    cl(deleteId)
    let deletedValue = document.getElementById(deleteId).firstElementChild.innerHTML;
    let confirmDelete = confirm(`Are you sure to delete ${deletedValue} ?`) 

   if(confirmDelete){
    todoListArr = todoListArr.filter(item => {
        return item.skillId != deleteId;
    })

    
    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
    // templating(todoListArr)

    document.getElementById(deleteId).remove()

    Swal.fire({
        icon: 'success',
        text: `${deletedValue.toUpperCase()} is deleted successfully!!`,
        timer: 3000
    })
   }else{
    return false;
   }

    // todoListArr me whi data jayega jo delete id se equal nhi hoga
    // return item.skillId != ele.dataset.deleteid

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

// const editBtn = [...document.querySelectorAll('.edit')] 
// cl(editBtn) we can't use or get ON THE FLY ELEMENT(elements which are made by JS)  So we will bind always an inline element

templating(todoListArr)

const onFormSubmit = (eve) => {
    eve.preventDefault();
    // cl('hello')

    let skill = todoItem.value;

    let toDoObj = {
        skillName: skill,
        skillId: create_UUID()  // WE created obj here cause we have to get id, which help us to edit and update the items. coz data same rhe skta hai isliye object create krne pdega and jisme hume ID milega jo unique rhega.
    }
    todoListArr.unshift(toDoObj)
    localStorage.clear()
    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
    cl(todoListArr)
    eve.target.reset()

    // templating(todoListArr)   This is not right cpz it will slow the project, qki templating har baar start se pure li load krega aur templating sirf ek baar hono chahiye.

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

    // todoListArr.forEach(item => {
    //     if (item.skillId === updateId) {
    //         item.skillName = updatedValue
    //     }
    // })

    for (let i = 0; i < todoListArr.length; i++) {
        if (todoListArr[i].skillId === editedObj.skillId) {
            todoListArr[i].skillName = updatedValue
        }
        break;
    }
    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
    // templating(todoListArr)

    let targetLi = document.getElementById(editedObj.skillId)
    // targetLi.firstElementChild.innerHTML = updatedValue;
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