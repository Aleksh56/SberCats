const homepage = document.getElementById('homepage');
const content = document.querySelector('.content');
const viewModal = document.querySelector('.cat-view-modal');
const popupAddOrEditFormContainer = document.querySelector('.create-edit-modal-form');
const addCatForm = document.querySelector('#addCatForm');
const showFormBtn = document.querySelector('.add-btn');
const closeFormButton = document.querySelector('.closeFormButton');
const closeViewModalButton = document.querySelector('.close-modal-button');
const updateAndFetchButton = document.querySelector('.update-btn');

const store = window.localStorage

let isUpdate = 0
let catChangeId = 0

const refreshCatsAndContent = () => {
	content.innerHTML = '';

	api.fetchCats().then((res) => {
		const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
		content.insertAdjacentHTML('afterbegin', cards); //загуглите insertAdjacentHTML afterbegin
	});
};

refreshCatsAndContent();

content.addEventListener('click', async (event) => {
	const target = event.target;
	if (target.tagName === 'BUTTON') {
	  const catCardBtns = target.closest('.cat-card-btns');
	  if (catCardBtns) {
		switch (target.className) {
		  case 'cat-card-view':
			await handleCatCardViewClick(target.value);
			break;
		  case 'cat-card-update':
			await handleCatCardUpdateClick(target.value);
			break;
		  case 'cat-card-delete':
			await handleCatCardDeleteClick(target.value);
			break;
		  default:
			console.log('Unknown button clicked');
		}
	  }
	}
  });
  
  async function handleCatCardViewClick(catId) {
	try {
	  const cat = await api.getCatById(catId);
	  const catNameParagraph = document.querySelector('#catName');
	  const catAgeParagraph = document.querySelector('#catAge');
	  const catDescParagraph = document.querySelector('#catDescription');
	  const catImageBlock = document.querySelector('#catImage');
	  catNameParagraph.innerHTML = `Имя котика - ${cat.name}`;
	  catAgeParagraph.innerHTML = `Возраст котика - ${cat.age}`;
	  catDescParagraph.innerHTML = `Описание котика - ${cat.description}`;
	  catImageBlock.src = cat.image;
	  viewModal.classList.add('show');
	} catch (error) {
	  console.error('Error getting cat:', error);
	}
  }
  
  async function handleCatCardUpdateClick(catId) {
	try {
	  isUpdate = true;
	  const cat = await api.getCatById(catId);
	  const idInput = document.querySelector('#id');
	  const nameInput = document.querySelector('#name');
	  const imageInput = document.querySelector('#image');
	  const ageInput = document.querySelector('#age');
	  const rateInput = document.querySelector('#rate');
	  const descriptionInput = document.querySelector('#description');
	  catChangeId = cat.id;
	  idInput.value = cat.id;
	  nameInput.value = cat.name;
	  imageInput.value = cat.image;
	  ageInput.value = cat.age;
	  rateInput.value = cat.rate;
	  descriptionInput.value = cat.description;
	  showForm();
	} catch (error) {
	  console.error('Error updating cat:', error);
	}
  }
  
  async function handleCatCardDeleteClick(catId) {
	try {
	  const res = await api.deleteCat(catId);
	  console.log(res);
	  refreshCatsAndContent();
	} catch (error) {
	  console.error('Error deleting cat:', error);
	}
  }
  
	
	const getNewIdOfCat = () => {
		return api.getIdsOfCat().then((res) => {
			return Math.max(...res) + 1;
		});
	};

	// Реализация через new FormData не работала, на сервер улетал только новый ID, остальное было пустым
	// При этом Postman вел себя отлично и все отправлялось как нужно.
	addCatForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const { name, image, age, rate, description } = addCatForm.elements;
		const apiMethod = isUpdate ? api.updateCat : api.addCat
		getNewIdOfCat().then((id) => {
			const newCatData = {
				id: isUpdate ? catChangeId : id,
				name: name.value,
				favourite: false,
				rate: rate.value,
				age: age.value,
				description: description.value,
				image: image.value
			}
			apiMethod(newCatData)
				.then(() => {
					isUpdate = 0
					hideForm()
					addCatForm.reset()
					refreshCatsAndContent();
				})
				.catch((err) => {
					console.error('Error adding cat:', err);
				});
		});
	});

updateAndFetchButton.addEventListener("click", () => refreshCatsAndContent)

closeViewModalButton.addEventListener("click", () => {
	viewModal.classList.remove("show")
})

closeFormButton.addEventListener("click", () => {
 isUpdate = 0
 hideForm()
 addCatForm.reset()
})

showFormBtn.addEventListener('click', () => {
	if (popupAddOrEditFormContainer.classList.contains('show')) {
		isUpdate = 0
		hideForm()
	  } else {
		showForm()
	  }
  });

  function showForm(){
	popupAddOrEditFormContainer.classList.add('show');
  }

  function hideForm() {
	popupAddOrEditFormContainer.classList.remove('show');
  }
