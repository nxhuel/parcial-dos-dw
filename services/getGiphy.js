async function searchGif(event) {
    if (event) event.preventDefault();

    const status = document.getElementById('status');
    const content = document.getElementById('result');
    const termino = document.getElementById('search').value.trim();

    if (!termino) {
        status.textContent = '';
        content.innerHTML = '';
        return;
    }

    status.textContent = 'Cargando...';
    content.innerHTML = '';

    const URL_API_SEARCH = `${ENV.BASE_URL}/search?api_key=${ENV.API_KEY}&q=${termino}`;

    try {
        const res = await fetch(URL_API_SEARCH);
        const data = await res.json();

        if (data.data.length === 0) {
            status.textContent = `No se encontraron resultados para "${termino}"`;
            return;
        }

        status.textContent = '';

        data.data.forEach(gif => {
            // Card structure
            const card = document.createElement("div");
            card.classList.add("card-container");

            const imgContainer = document.createElement("div");
            imgContainer.classList.add("img-container");

            const img = document.createElement("img");
            img.src = gif.images.fixed_height.url;
            img.alt = gif.title || "GIF";

            imgContainer.appendChild(img);
            card.appendChild(imgContainer);
            content.appendChild(card);
        });
    } catch (err) {
        console.error("Error al buscar GIFs:", err);
        status.textContent = "Ocurrió un error al buscar los GIFs.";
    }
}

async function getAllSuggestion() {
    const tags = ['funny', 'reaction', 'happy', 'wow'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];

    const URL_API_SUGGESTION = `${ENV.BASE_URL}/search?api_key=${ENV.API_KEY}&q=${randomTag}&limit=4`;

    const res = await fetch(URL_API_SUGGESTION);
    const data = await res.json();

    const content = document.getElementById('suggestion');
    content.innerHTML = '';

    data.data.forEach(gif => {
        // Card container
        const card = document.createElement("div");
        card.classList.add("card-container");

        // Header
        const header = document.createElement("div");
        header.classList.add("header");

        const tag = document.createElement("p");
        tag.textContent = `#${gif.title || "GIF"}`;

        const closeIcon = document.createElement("img");
        closeIcon.src = "/assets/button close.svg";
        closeIcon.alt = "button-close";
        closeIcon.style.cursor = "pointer";
        closeIcon.onclick = () => card.remove();

        header.appendChild(tag);
        header.appendChild(closeIcon);

        // Image container
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title || "GIF";

        // Button container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const moreButton = document.createElement("button");
        const buttonText = document.createElement("p");
        buttonText.textContent = "Ver más...";
        moreButton.appendChild(buttonText);

        moreButton.onclick = () => {
            window.open(gif.url, "_blank");
        };

        buttonContainer.appendChild(moreButton);
        imgContainer.appendChild(img);
        imgContainer.appendChild(buttonContainer);

        // Build the card
        card.appendChild(header);
        card.appendChild(imgContainer);

        content.appendChild(card);
    });
}


async function getAllTrending() {
    const URL_API_TRENDING = `${ENV.BASE_URL}/trending?api_key=${ENV.API_KEY}&limit=10`;

    const res = await fetch(URL_API_TRENDING);
    const data = await res.json();

    const content = document.getElementById('trending');
    content.innerHTML = '';

    data.data.forEach(gif => {
        // contenedor principal
        const card = document.createElement("div");
        card.classList.add("card-container");

        // contenedor de imagen
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        // imagen
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title || "Trending gif";

        // estructura
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        content.appendChild(card);
    });
}


window.onload = () => {
    const searchInput = document.getElementById('search');
    if (searchInput && searchInput.value.trim() !== '') {
        searchGif();
    }
    getAllSuggestion();
    getAllTrending();
};
