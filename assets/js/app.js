let cl = console.log;

const info = document.getElementById("info");
const title = document.getElementById("title");
const Information = document.getElementById("Information");
const studentForm = document.getElementById("studentForm");
const submit = document.getElementById("submit");
const update = document.getElementById("update");

let apiUrl = 'https://jsonplaceholder.typicode.com/posts';

//DELETE
//POST >> success
//PATCH >> Update data partialy 
//PUT >> update data complet
//GET >> Success
let postArray =[]
function fetchData(methodName, baseUrl, tempFun, data){

// 1 create a object by using XMLHTTPRequset

let xhr = new XMLHttpRequest();

// 2 call open method

// xhr.open("GET",apiUrl);
xhr.open(methodName,baseUrl);

// 3 onload method
xhr.onload = function(){
    cl(xhr.status);
    if((xhr.status === 200 || xhr.status === 201) && xhr.readyState === 4){
        
        // let data = JSON.parse(xhr.response);
        // cl(data);
        // templating(data)
        // tempFun(data);
       if(methodName === 'GET'){
       postArray = JSON.parse(xhr.response);
       tempFun(postArray);
       }
    }
    if(xhr.status === 404){
        alert('Page not found');
    }
    
};


// 4 send 
xhr.send(data)
}

const onEditHandler = (ele) => {
    cl(ele .closest('.card').dataset.id)
    let getId  = +(ele .closest('.card').dataset.id);
    localStorage.setItem('setId', getId);
    cl(typeof getId)
    let getObj = postArray.find(o => getId ===o.id)
    cl(getObj);
    title.value = getObj.title;
    Information.value = getObj.body;
    update.classList.remove('d-none')
    submit.classList.add('d-none')
}

const onDeleteHandler = (e) =>{
    // cl(e)
    let getId = +e.closest('.card').dataset.id;
    cl(getId)
    let deleteUrl = `${apiUrl}/${getId}`
    fetchData('DELETE',deleteUrl);
    postArray = postArray.filter(ele =>{
    return  ele.id !== getId;
    })
    templating(postArray)
}

fetchData('GET',apiUrl,templating);
function templating(arr){
    let result = "";
    arr.forEach((ele) => {
        result += `<div class="card mb-4" data-id="${ele.id}">
        <div class="card-body">
            <h3>
                ${ele.title}
            </h3>
            <p>
               ${ele.body}
            </p>
            <p class="text-right">
            <button class="class btn btn-success" onclick="onEditHandler(this)">Edit</button>
            <button class="class btn btn-danger" onclick="onDeleteHandler(this)">Delete</button>
            </p>
        </div>
    </div>
    `;
    });
    info.innerHTML = result;
}

const onStudentSubmit = (e) =>{
    e.preventDefault();
    let obj ={
        title: title.value,
        body: Information.value,
    };
    postArray.unshift(obj);
    studentForm.reset();
    templating(postArray);
    fetchData('POST', apiUrl, JSON.stringify(obj));
    // cl(obj)
}
const onStudentUpdate =(eve) =>{
    let getId = localStorage.getItem('setId');
    let updateUrl =`${apiUrl}/${getId}`;
    cl(updateUrl);
    // fetchData()

    let obj = {
        title: title.value,
        body : Information.value,
    }
    postArray.forEach(o =>{
        if(o.id == getId){
            o.title = title.value;
            o.body = Information.value;
        }
    })
    templating(postArray)
    studentForm.reset();
    update.classList.add('d-none');  
    submit.classList.remove('d-none');

    fetchData("PATCH", updateUrl, JSON.stringify(obj))

}
studentForm.addEventListener('submit',onStudentSubmit);
update.addEventListener('click',onStudentUpdate);


// xhr.satatus
// 200 || 201 >> success
//  4xx >> client side || 404 >> URL not found, 403 >> Forbidden
// 5xx >> Server Side Error

// xhr.readyState 
//   0 >> request is not initilize
// 1 >> servar connection established
// 2 >> requset recievd by server
// 3 >> proccessing requsest
// 4 >>  responce is ready