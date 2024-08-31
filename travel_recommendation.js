// Get the search button element
const search = document.getElementById('search-key');
const searchForm = document.getElementById('search-form');
const searchContent = document.getElementById('search-content');

async function getRecommendations(e) {
	e.preventDefault();
	const places = [];
	const searchList = [];

	// todo: Get data from the JSON file
	let data;
	try {
		const response = await fetch('travel_recommendation_api.json');
		data = await response.json();
	} catch (error) {
		console.log(error);
	}

	const searchKey = search.value.toLowerCase();

	// Adding direct entries
	switch (searchKey) {
		case 'beach':
		case 'beaches':
			data.beaches.forEach((place) => searchList.push(place));
			break;
		case 'temple':
		case 'temples':
			data.temples.forEach((place) => searchList.push(place));
			break;
		case 'country':
		case 'countries':
			data.countries.forEach((country) => country.cities.forEach((place) => searchList.push(place)));
			break;
	}

	// Add all places to places array
	data.countries.forEach((country) => country.cities.forEach((place) => places.push(place)));
	data.beaches.forEach((place) => places.push(place));
	data.temples.forEach((place) => places.push(place));

	const searchPool = places.map((place) => {
		return `${place.name}, ${place.description}`.toLowerCase();
	});

	// Adding if the name/description contains the searchKey
	searchPool.forEach((searchString, idx) => {
		if (searchString.includes(searchKey)) {
			if (!searchList.some((item) => item.name === places[idx].name)) {
				searchList.push(places[idx]);
			}
		}
	});

	if (searchKey.trim() === '' || searchList.length === 0) {
		// Create error paragraph
		const para = document.createElement('p');
		para.textContent = 'Please enter a valid search query!';
		para.classList = 'no-result';
		searchContent.replaceChildren(para);
	} else {
		// Create Search List Element
		const searchListEl = document.createElement('ul');
		searchListEl.classList = 'search-list';

		// Add results to Search List Element
		searchList.forEach((item) => {
			const listItem = document.createElement('li');
			listItem.classList = 'search-item';

			const searchItemImgDiv = document.createElement('div');
			searchItemImgDiv.classList = 'search-item_img';
			const searchItemImgEl = document.createElement('img');
			searchItemImgEl.src = `images/${item.imageUrl}`;
			searchItemImgEl.alt = item.name;
			searchItemImgDiv.appendChild(searchItemImgEl);

			const searchItemDetailDiv = document.createElement('div');
			searchItemDetailDiv.classList = 'search-item_detail';
			const searchItemDetailName = document.createElement('h3');
			searchItemDetailName.textContent = item.name;
			const searchItemDetailDescription = document.createElement('p');
			searchItemDetailDescription.textContent = item.description;
			searchItemDetailDiv.appendChild(searchItemDetailName);
			searchItemDetailDiv.appendChild(searchItemDetailDescription);

			const searchBtn = document.createElement('button');
			searchBtn.classList = 'button visit-btn';
			searchBtn.textContent = 'Visit';

			listItem.appendChild(searchItemImgDiv);
			listItem.appendChild(searchItemDetailDiv);
			listItem.appendChild(searchBtn);

			searchListEl.appendChild(listItem);
		});

		searchContent.replaceChildren(searchListEl);
	}
}

// Add action listener to the search button
searchForm.addEventListener('submit', getRecommendations);
