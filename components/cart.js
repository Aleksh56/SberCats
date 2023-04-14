const generateCard = (cat) => {
	return `<div class="cat-card">
    <div class="cat-image"><img src=${cat.image} width="150px" height="150px"/></div> 
    ${cat.name}
    <div class="cat-card-btns">
    <button class="cat-card-view" value=${cat.id}>Посмотреть</button>
    <button class="cat-card-update" value=${cat.id}>Изменить</button>
    <button class="cat-card-delete" value=${cat.id}>Удалить</button>
    </div>
    </div>`;
};
