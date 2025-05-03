document.addEventListener('DOMContentLoaded', async () => {
    const sliderContainer = document.getElementById('slider');
    const breedContainer = document.getElementById('breedButtons');

    try {
        const imagesResponse = await fetch('https://dog.ceo/api/breeds/image/random/10');
        const imagesData = await imagesResponse.json();

        sliderContainer.innerHTML = imagesData.message.map(url => `
            <div class="slider-item">
                <img src="${url}" alt="Dog" 
                        style="height:300px; width:auto; max-width:100%; object-fit: cover;"
                        onerror="this.style.display='none'">
            </div>
        `).join('');

        new Glider(sliderContainer, {
            slidesToShow: 1,
            draggable: true,
        });

        const numberOfButtons = 10;
        const selectedBreeds = new Set();

        for (let i = 0; i < numberOfButtons; i++) {
            const randomPage = Math.floor(Math.random() * 29) + 1;
            const breedsResponse = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${randomPage}`);
            const breedsData = await breedsResponse.json();

            if (breedsData.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * breedsData.data.length);
                const breed = breedsData.data[randomIndex];

                if (!selectedBreeds.has(breed.id)) {
                    selectedBreeds.add(breed.id);
                    const button = document.createElement('button');
                    button.className = 'custom-btn breed-btn';
                    button.textContent = breed.attributes.name;

                    button.setAttribute('data-breed-id', breed.id);
                    button.setAttribute('data-breed-name', breed.attributes.name.toLowerCase());

                    button.addEventListener('click', () => showBreedInfo(breed.id));
                    breedContainer.appendChild(button);
                }
            }
        }

        if (annyang) {
            annyang.removeCommands();
            annyang.addCommands({
                'hello': () => alert('Hello!'),
                'change color to :color': (color) => {
                    document.body.style.backgroundColor = color;
                },
                'navigate to :page': (page) => {
                    window.location.href = `${page.toLowerCase()}.html`;
                },
                'load dog breed :breed': (breed) => {
                    const formattedBreed = breed.toLowerCase().trim();
                    const button = document.querySelector(
                        `[data-breed-name="${formattedBreed}"]`
                    );
                    if (button) button.click();
                }
            });

            annyang.start();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

async function showBreedInfo(breedId) {
    try {
        const response = await fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`);
        const data = await response.json();
        const details = data.data.attributes;

        const infoContainer = document.getElementById('breed-info');
        infoContainer.innerHTML = `
            <h2>${details.name}</h2>
            <p>${details.description}</p>
            <p><strong>Min Life:</strong> ${details.life.min} years</p>
            <p><strong>Max Life:</strong> ${details.life.max} years</p>
        `;

        infoContainer.style.display = 'block';
        infoContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching breed info:', error);
    }
}
