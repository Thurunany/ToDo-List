const db = firebase.firestore()
let tasks = []
let currentUser = {}

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid
      readTasks()
      let userLabel = document.getElementById("navbarDropdown")
      userLabel.innerHTML = user.email
    } else {
      swal
        .fire({
          icon: "success",
          title: "Redirecionando para a tela de autenticação",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("login.html")
          }, 1000)
        })
    }
  })
}

function createDelButton(task) {
  const newButton = document.createElement("button")
  newButton.setAttribute("class", "btn btn-primary")
  newButton.appendChild(document.createTextNode("Excluir"))
  newButton.setAttribute("onclick", `deleteTask("${task.id}")`)
  return newButton
}

function renderTasks() {
  let itemList = document.getElementById("itemList")
  itemList.innerHTML = ""
  for (let task of tasks) {
    const newItem = document.createElement("li")
    newItem.setAttribute(
      "class",
      "list-group-item d-flex justify-content-between",
    )
    newItem.appendChild(document.createTextNode(task.title))
    newItem.appendChild(createDelButton(task))
    itemList.appendChild(newItem)
  }
}

async function readTasks() {
  tasks = []
  const logTasks = await db
    .collection("tasks")
    .where("owner", "==", currentUser.uid)
    .get()
  for (doc of logTasks.docs) {
    tasks.push({
      id: doc.id,
      title: doc.data().title,
    })
  }
  renderTasks()
}

async function addTask() {
  const itemList = document.getElementById("itemList")
  const newItem = document.createElement("li")
  newItem.setAttribute("class", "list-group-item")
  newItem.appendChild(document.createTextNode("Adicionando na nuvem..."))
  itemList.appendChild(newItem)

  const title = document.getElementById("newItem").value
  await db.collection("tasks").add({
    title: title,
    owner: currentUser.uid,
  })
  readTasks()
}

async function deleteTask(id) {
  await db.collection("tasks").doc(id).delete()
  readTasks()
}

window.onload = function () {
  getUser()
}
