const button = document.getElementById('fetchData');
const header = document.querySelector('header');
const image = document.querySelector('img');

button.addEventListener('click', async () => {
  setLoadingStatus();
  const poke = await fetchPokeData({
    pokeId: randomPokeNumber(),
  });
  showCharacterData(poke);
});

function setLoadingStatus() {
  header.textContent = 'loading...';
  button.ariaBusy = true;
}

function randomPokeNumber() {
  return Math.floor(Math.random() * 151 + 1);
}

async function showCharacterData(pokemon) {
  button.ariaBusy = false;
  header.textContent = pokemon.data.name;
  image.src = pokemon.image;
}

async function fetchPokeData({ pokeId }) {
  const endpoint = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;
  const endpointImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;

  let response = await fetchFromCache("MY_POKE_CACHE_ID", endpoint);
  let responseImage = await fetchFromCache("IMAGE_CACHE", endpointImage);

  if (response && responseImage) {
    console.log(`[fetchCharacterData] #${pokeId} was fetched from cache`);

    const responseDataClone = await response.clone();
    const blob = await responseImage.blob();
    const objectUrlOfImage = URL.createObjectURL(blob);

    return {
      data: responseDataClone.json(),
      image: objectUrlOfImage,
    };
  } else {
    console.log(`[fetchCharacterData] #${pokeId} was fetched from API`);
    const response = await fetch(endpoint);
    const responseClone = await response.clone();
    const responseJson = await responseClone.json();

    const responseImage = await fetch(endpointImage);
    const responseImageClone = await responseImage.clone();

    addToCache("MY_POKE_CACHE_ID", endpoint, response);
    addToCache("IMAGE_CACHE", endpointImage, responseImage);

    const blob = await responseImageClone.blob();
    const objectUrlOfImage = URL.createObjectURL(blob);

    return {
      data: responseJson,
      image: objectUrlOfImage,
    };
  }
}

async function addToCache(cacheName, key, response) {
  const cache = await caches.open(cacheName);
  cache.put(key, response);
}

async function fetchFromCache(cacheName, key) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(key);
  return response;
}