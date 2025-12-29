// ================= VARIABLES =================
const apiBase = 'http://localhost:8080/tp333/api/users';
const modal = new bootstrap.Modal(document.getElementById('studentModal'));
const cardsContainer = document.getElementById('cardsContainer');
const personForm = document.getElementById('personForm');
const personId = document.getElementById('personId');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');

// ================= FONCTIONS =================

// Charger tous les étudiants
function loadUsers(){
    fetch(`${apiBase}/affiche`)
        .then(res => res.json())
        .then(data => {
            cardsContainer.innerHTML = '';
            data.forEach(createCard);
        })
        .catch(() => alert("Erreur serveur lors du chargement des étudiants"));
}

// Créer une carte étudiant
function createCard(user){
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-4';
    div.innerHTML = `
    <div class="card h-100">
        <div class="card-body">
            <h5>${user.name}</h5>
            <p>ID : ${user.id}</p>
            <p>Âge : ${user.age}</p>
            <p>Email : ${user.mail || '-'}</p>
            <button class="btn btn-warning btn-sm" onclick="editUser(${user.id},'${user.name}',${user.age},'${user.mail || ''}')">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Supprimer</button>
        </div>
    </div>`;
    cardsContainer.appendChild(div);
}

// Soumettre formulaire (ajout / modification)
personForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(!this.checkValidity()){
        this.classList.add('was-validated');
        return;
    }

    const id = personId.value;
    const name = encodeURIComponent(nameInput.value);
    const age = ageInput.value;
    const email = encodeURIComponent(emailInput.value);
    const url = id ? `${apiBase}/update/${id}/${age}/${name}/${email}` 
                   : `${apiBase}/add/${age}/${name}/${email}`;

    fetch(url, { method: id ? 'PUT' : 'POST' })
        .then(res => res.json())
        .then(data => {
            if(data.state === "ok"){
                resetForm();
                modal.hide();
                loadUsers();
            } else alert(data.msg || "Erreur lors de l'enregistrement");
        })
        .catch(() => alert("Erreur serveur lors de l'enregistrement"));
});

// Ouvrir le formulaire pour modifier
function editUser(id,name,age,email){
    personId.value = id;
    nameInput.value = name;
    ageInput.value = age;
    emailInput.value = email; // correction : utilise mail
    submitBtn.textContent = "Modifier";
    modal.show();
}

// Supprimer un étudiant
function deleteUser(id){
    if(confirm("Supprimer cet étudiant ?")){
        fetch(`${apiBase}/remove/${id}`, {method:'DELETE'})
            .then(loadUsers)
            .catch(() => alert("Erreur serveur lors de la suppression"));
    }
}

// Rechercher un étudiant par ID ou nom
function searchUser(){
    const v = searchInput.value.trim();
    if(!v) return;
    const url = isNaN(v) ? `${apiBase}/getByName/${v}` : `${apiBase}/getById/${v}`;
    fetch(url)
        .then(r=>r.json())
        .then(u=>{
            cardsContainer.innerHTML='';
            if(u && u.id) createCard(u);
        })
        .catch(() => alert("Erreur serveur lors de la recherche"));
}

// Réinitialiser formulaire
function resetForm(){
    personForm.reset();
    personForm.classList.remove('was-validated');
    personId.value='';
    submitBtn.textContent='Enregistrer';
}

// ================= ÉVÉNEMENTS =================
searchBtn.addEventListener('click', searchUser);
showAllBtn.addEventListener('click', loadUsers);

// Charger les étudiants au démarrage
loadUsers();
