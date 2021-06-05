const UI = {}

UI.EnterPress = function () {
  document.querySelector('input')
    .addEventListener('keyup', function (keyPressed) {
      if (keyPressed.which === 13) {
        const searchResults = document.querySelector('.js-search-results')
        searchResults.innerHTML = ''
        const search = document.querySelector('input').value
        SoundCloudAPI.getTracks(search)
      }
    })
}

UI.Click = function () {
  document.querySelector('.search-button')
    .addEventListener('click', function () {
      const searchResults = document.querySelector('.js-search-results')
      searchResults.innerHTML = ''
      const search = document.querySelector('input').value
      SoundCloudAPI.getTracks(search)
    })
}

document.querySelector('.clear-playlist').addEventListener('click', function () {
  localStorage.removeItem('key')
  location.reload()
})

const SoundCloudAPI = {}

SoundCloudAPI.init = function () {
  SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
  })
}

SoundCloudAPI.getTracks = function (inputValue) {
  SC.get('/tracks', {
    q: inputValue
  }).then(function (tracks) {
    console.log(tracks)
    SoundCloudAPI.renderTracks(tracks)
  })
}

SoundCloudAPI.getEmbed = function (trackUrl) {
  SC.oEmbed(trackUrl, {
    auto_play: false
  }).then(function (embed) {
    const sideBar = document.querySelector('.js-playlist')

    const box = document.createElement('div')
    box.innerHTML = embed.html

    sideBar.appendChild(box)

    // LOCAL STORAGE
    localStorage.setItem('key', sideBar.innerHTML)
  })
}

SoundCloudAPI.renderTracks = function (tracks) {
  tracks.forEach((track) => {
    const searchResults = document.querySelector('.js-search-results')

    const card = document.createElement('div')
    card.classList.add('card', 'd-flex', 'justify-content-between', 'align-items-center', 'border-secondary', 'm-3')

    const imageDiv = document.createElement('div')
    imageDiv.classList.add('card-image', 'w-100')
    const image = document.createElement('img')
    image.src = track.artwork_url ? track.artwork_url : 'https://i1.sndcdn.com/avatars-000410178498-auqnbr-t500x500.jpg'
    imageDiv.appendChild(image)

    const title = document.createElement('div')
    title.classList.add('card-title', 'container', 'text-center')
    title.innerHTML = '<a class="link-secondary" href="' + track.permalink_url + '" target=_blank">' + track.title + '</a>'

    const playlistButtonDiv = document.createElement('div')
    playlistButtonDiv.classList.add('card-playlist-button', 'bg-dark', 'w-100')
    const addToPlaylistButton = document.createElement('button')
    addToPlaylistButton.classList.add('btn', 'btn-dark', 'w-100')
    addToPlaylistButton.textContent = 'Add to playlist'
    playlistButtonDiv.appendChild(addToPlaylistButton)

    addToPlaylistButton.addEventListener('click', function (e) {
      SoundCloudAPI.getEmbed(track.permalink_url)
    })

    searchResults.appendChild(card)
    card.append(imageDiv, title, playlistButtonDiv)
  })
}

SoundCloudAPI.init()
UI.EnterPress()
UI.Click()

// LOCAL STORAGE
const sideBar = document.querySelector('.js-playlist')
sideBar.innerHTML = localStorage.getItem('key')
