const db = firebase.firestore()
let currentUser = {}
let profile = false

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid
      getUserInfo(user.uid)
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

async function getUserInfo(uid) {
  const logUsers = await db.collection("profile").where("uid", "==", uid).get()
  let userInfo = document.getElementById("userInfo")
  if (logUsers.docs.length == 0) {
    userInfo.innerHTML = "Perfil não registrado"
  } else {
    userInfo.innerHTML = "Perfil registrado"
    profile = true
    const userData = logUsers.docs[0]
    currentUser.id = userData.id
    currentUser.firstName = userData.data().firstName
    currentUser.lastName = userData.data().lastName
    document.getElementById("inputFirstName").value = currentUser.firstName
    document.getElementById("inputLastName").value = currentUser.lastName
  }
}

async function saveProfile() {
  const firstName = document.getElementById("inputFirstName").value
  const lastName = document.getElementById("inputLastName").value
  if (!profile) {
    await db.collection("profile").add({
      uid: currentUser.uid,
      firstName: firstName,
      lastName: lastName,
    })
    getUserInfo(currentUser.uid)
  } else {
    await db.collection("profile").doc(currentUser.id).update({
      firstName: firstName,
      lastName: lastName,
    })
  }
}

window.onload = function () {
  getUser()
}
