// write your code here

const BASE_URL = 'http://localhost:3000'

const getInitialImage = () => {
    fetch(BASE_URL + '/images/1')
    .then(res => res.json())
    .then(json => addOneDogToScreen(json))
}

const addOneDogToScreen = dog => {
    const title = document.getElementById('card-title')
    const image = document.getElementById('card-image')
    const likes = document.getElementById('like-count')
    const comments = document.getElementById('comments-list')

    title.textContent = dog.title
    image.src = dog.image
    image.alt = dog.title
    image.name = dog.id
    likes.textContent = `${dog.likes} likes`
    comments.textContent = ""
    dog.comments.forEach(comment => {
        const li = document.createElement('li')
        li.textContent = comment.content
        li.id = comment.id
        addListenerToComment(li)
        comments.append(li)
    })
}


const addListenerToLikeButton = () => {
    const btn = document.getElementById('like-button')
    btn.addEventListener('click', () => {
        const likes = document.getElementById('like-count')
        const likesCount = parseInt(likes.textContent.split(" ")[0])
        likes.textContent = `${likesCount + 1} likes`
    })
}

const addListenerToCommentForm = () => {
    const form = document.getElementById('comment-form')
    form.addEventListener('submit', e => {
        e.preventDefault()
        postCommentToServer(e.target.comment.value)
        document.getElementById('comment').value = ""
    })
}

const postCommentToServer = comment => {
    const body = JSON.stringify({
        imageId: parseInt(document.getElementById('card-image').name),
        content: comment
    })

    const config = {
        method: 'POST',
        headers: {
            "Content-Type": "Application/json"
        },
        body
    }

    const comments = document.getElementById('comments-list')

    fetch(BASE_URL + '/comments', config)
    .then(res => res.json())
    .then(json => {
        const li = document.createElement('li')
        li.textContent = json.content
        li.id = json.id
        comments.append(li)
    })
}

const addListenerToComment = comment => {

    comment.addEventListener('click', () => {
        const config = {
            method: "DELETE"
        }
        fetch(BASE_URL + `/comments/${comment.id}`, config)
        .then(res => res.json())
        .then(json => comment.remove())
    })
}

const addListenerToTitle = () => {
    const title = document.getElementById('card-title')
    const image = document.getElementById('card-image')
    title.addEventListener('click', () => {
        if (image.style.visibility === 'hidden')
            image.style.visibility = 'visible'
        else
            image.style.visibility = 'hidden'
    })
}

const fetchRandomDogImageAndAppend = () => {
    fetch('https://dog.ceo/api/breeds/image/random')
    .then(res => res.json())
    .then(json => {
        document.getElementById('card-image').src = json.message
        updateImageOnServer(json.message)
    })
}

const updateImageOnServer = image => {
    const config = {
        method: "PATCH",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({ image })
    }

    fetch(BASE_URL + `/images/1`, config)
}

const addListenerToImage = () => {
    const image = document.getElementById('card-image')
    image.addEventListener('click', () => {
        fetchRandomDogImageAndAppend()
    })
}

const init = () => {
    getInitialImage()
    addListenerToTitle()
    addListenerToImage()
    addListenerToLikeButton()
    addListenerToCommentForm()
}

init()
