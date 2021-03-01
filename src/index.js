const toyCollection = document.querySelector("div#toy-collection")
const toyForm = document.querySelector("form.add-toy-form")
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetch ("http://localhost:3000/toys", {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
  .then(resp => resp.json())
  .then(toyList => {
    toyList.forEach(toyObj => {
      renderOneToy(toyObj)
    })
  })

function renderOneToy(toyObj) {
  const div =  document.createElement('div')
  div.classList.add('card')
  div.dataset.id = toyObj.id

  div.innerHTML = `
  <h2>${toyObj.name}</h2>
  <img src=${toyObj.image} class="toy-avatar" />
  <p>${toyObj.likes} likes </p>
  <button class="like-btn">Like <3</button>
  `
  toyCollection.append(div)
}

toyForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const name = event.target.name.value
  const image = event.target.image.value

  const toyObj = {
    name: name,
    image: image,
    likes: 0
  }


  fetch("http://localhost:3000/toys", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyObj),
  })
    .then(resp => resp.json())
    .then(renderOneToy(toyObj))
  
  toyForm.reset()

})

toyCollection.addEventListener('click', function (event) {
  if (event.target.matches('button.like-btn')) {
    const currentLikes = event.target.parentNode.querySelector("p")
    const newLikes = parseInt(currentLikes.textContent) + 1
  fetch(`http://localhost:3000/toys/${event.target.parentNode.dataset.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
  .then(resp => resp.json())
  .then(data => {currentLikes.textContent = `${newLikes} likes`)}
})