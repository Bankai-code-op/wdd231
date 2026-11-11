const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create elements to add to the div#cards element
    const card     = document.createElement('section');
    const fullName = document.createElement('h2');
    const dob      = document.createElement('p');
    const pob      = document.createElement('p');
    const portrait = document.createElement('img');

    // Build the h2 content to show the prophet's full name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Build date of birth and place of birth paragraphs
    dob.innerHTML = `<span class="label">Date of Birth:</span> ${prophet.birthdate}`;
    pob.innerHTML = `<span class="label">Place of Birth:</span> ${prophet.birthplace}`;

    // Build the image portrait by setting all the relevant attributes
    portrait.setAttribute('src',     prophet.imageurl);
    portrait.setAttribute('alt',     `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width',   '340');
    portrait.setAttribute('height',  '440');

    // Append elements to the card section
    card.appendChild(fullName);
    card.appendChild(dob);
    card.appendChild(pob);
    card.appendChild(portrait);

    // Append the card to the #cards div
    cards.appendChild(card);
  });
};

async function getProphetData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    // console.table(data.prophets);
    displayProphets(data.prophets); // data.prophets is the array inside the JSON object
  } catch (error) {
    console.error(error);
  }
}

getProphetData();
