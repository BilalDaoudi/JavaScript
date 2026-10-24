var page_actual = 1;
var oldpersonnes;

var personnes = (oldpersonnes = [
  ["1", "user.jpeg", "Daoudi", "XXX", "Homme", "1990-01-01", "2024-05-01"],
  ["2", "user.jpeg", "Smith", "YYY", "Homme", "1991-02-02", "2024-06-02"],
  // ["3", "user.jpeg", "Johnson", "ZZZ", "Femme", "1992-03-03", "2024-07-03"],
  // ["4", "user.jpeg", "Brown", "ABC", "Homme", "1993-04-04", "2024-08-04"],
  // ["5", "user.jpeg", "Wilson", "DEF", "Femme", "1994-05-05", "2024-09-05"],
  // ["6", "user.jpeg", "Martinez", "GHI", "Homme", "1995-06-06", "2024-10-06"],
  // ["7", "user.jpeg", "Anderson", "JKL", "Femme", "1996-07-07", "2024-11-07"],
  // ["8", "user.jpeg", "Taylor", "MNO", "Homme", "1997-08-08", "2024-12-08"],
  // ["9", "user.jpeg", "Thomas", "PQR", "Femme", "1998-09-09", "2025-01-09"],
  // ["10", "user.jpeg", "Hernandez", "STU", "Homme", "1999-10-10", "2025-02-10"],
  // ["11", "user.jpeg", "Garcia", "VWX", "Femme", "2000-11-11", "2025-03-11"],
  // ["12", "user.jpeg", "Lopez", "YZA", "Homme", "2001-12-12", "2025-04-12"],
]);

var perPage = 5;
var tbody = document.querySelector("#tableau tbody");
var paginationUl = document.querySelector("#pagination ul");

function displaySearchInput() {
  var searchType = document.getElementById("searchType").value;
  var normaleInput = document.getElementById("normale");
  var dateInput = document.getElementById("date");
  var genreInput = document.getElementById("genre");
  normaleInput.style.display = "block";
  dateInput.style.display = "none";
  genreInput.style.display = "none";
  document.getElementById("searchInput").disabled = true;
  document.getElementById("searchInput").value = "";
  document.getElementById("date1").value = "";
  document.getElementById("date2").value = "";
  document.getElementById("homme").checked = false;
  document.getElementById("femme").checked = false;
  personnes = oldpersonnes;
  var numPages = Math.ceil(personnes.length / perPage);
  displayData(numPages < page_actual ? numPages : page_actual);
  displayPagination(numPages < page_actual ? numPages : page_actual);
  switch (searchType) {
    case "name":
    case "matricule":
      document.getElementById("searchInput").disabled = false;
      break;
    case "dob":
    case "creationDate":
      normaleInput.style.display = "none";
      dateInput.style.display = "block";
      break;
    case "genre":
      normaleInput.style.display = "none";
      genreInput.style.display = "block";
      break;
    default:
      break;
  }
}

document.getElementById("searchType").addEventListener("change", function () {
  displaySearchInput();
});

displaySearchInput();

function customIdSort(a, b) {
  return parseInt(a[0]) - parseInt(b[0]);
}

function sortData(column, order) {
  if (column === 0) {
    // Si la colonne est l'ID
    personnes.sort(customIdSort);
    if (order === "desc") personnes.reverse();
  } else {
    personnes.sort((a, b) => {
      if (order === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
  }
}

function resetSortState() {
  var sortableHeaders = document.querySelectorAll(".sortable");
  sortableHeaders.forEach((header) => {
    header.dataset.order = "";
    toggleSortIcon(header, "");
  });
}

function toggleSortIcon(element, order) {
  var sortIcons = document.querySelectorAll(".sort-icon");
  sortIcons.forEach((icon) => {
    icon.textContent = "";
  });
  element.querySelector(".sort-icon").textContent = order === "asc" ? "↑" : "↓";
}

function handleColumnHeaderClick(event) {
  const column = parseInt(event.target.dataset.column);
  const order = event.target.dataset.order === "asc" ? "desc" : "asc";
  resetSortState();
  event.target.dataset.order = order;
  toggleSortIcon(event.target, order);
  sortData(column, order);
  displayData(1);
  displayPagination(1);
  updateSortInfo(column, order);
}

const sortableHeaders = document.querySelectorAll(".sortable");
sortableHeaders.forEach((header) => {
  header.addEventListener("click", handleColumnHeaderClick);
});

function displayData(page) {
  page_actual = page;
  tbody.innerHTML = "";
  var startIndex = (page - 1) * perPage;
  var endIndex = Math.min(startIndex + perPage, personnes.length);
  if (personnes.length != 0) {
    for (var i = startIndex; i < endIndex; i++) {
      var tr = document.createElement("tr");
      let per = personnes[i];
      personnes[i].forEach(function (info) {
        var td = document.createElement("td");
        if (info.endsWith(".jpeg")) {
          var img = document.createElement("img");
          img.setAttribute("width", "50px");
          img.src = info;
          img.alt = "Photo de profil";
          td.appendChild(img);
        } else {
          td.textContent = info;
        }
        tr.appendChild(td);
      });
      var actionTd = document.createElement("td");
      var editBtn = document.createElement("button");
      editBtn.setAttribute("class", "btn btn-warning");
      editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
      editBtn.addEventListener("click", function () {
        loadEditModal(per);
        $("#editModal").modal("show");
      });
      actionTd.appendChild(editBtn);
      var deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class", "btn btn-danger ml-1");
      deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
      deleteBtn.addEventListener("click", function () {
        loadDeleteModal(per[0]);
        $("#deleteModal").modal("show");
      });
      actionTd.appendChild(deleteBtn);
      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    }
  }
}

function displayPrevNextButtons(currentPage, numPages) {
  var prevLi = document.createElement("li");
  prevLi.className = "page-item";
  var prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "#";
  prevLink.textContent = "Précédent";
  prevLink.addEventListener("click", function () {
    if (currentPage > 1) {
      displayData(currentPage - 1);
      displayPagination(currentPage - 1);
    }
  });
  prevLi.appendChild(prevLink);
  var firstChild = paginationUl.firstChild;
  paginationUl.insertBefore(prevLi, firstChild);
  var nextLi = document.createElement("li");
  nextLi.className = "page-item";
  var nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "#";
  nextLink.textContent = "Suivant";
  nextLink.addEventListener("click", function () {
    if (currentPage < numPages) {
      displayData(currentPage + 1);
      displayPagination(currentPage + 1);
    }
  });
  nextLi.appendChild(nextLink);
  paginationUl.appendChild(nextLi);
}

function displayPagination(currentPage) {
  page_actual = currentPage;
  paginationUl.innerHTML = "";
  var numPages = Math.ceil(personnes.length / perPage);
  var totalPagesToShow = 3;
  var startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
  var endPage = Math.min(startPage + totalPagesToShow - 1, numPages);
  startPage = Math.max(1, endPage - totalPagesToShow + 1);
  if (personnes.length != 0) {
    for (var i = startPage; i <= endPage; i++) {
      var li = document.createElement("li");
      li.className = "page-item";
      var a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.textContent = i;
      if (i === currentPage) li.classList.add("active");
      a.addEventListener("click", function () {
        displayData(parseInt(this.textContent));
        displayPagination(parseInt(this.textContent));
      });
      li.appendChild(a);
      paginationUl.appendChild(li);
    }
  }

  displayPrevNextButtons(currentPage, numPages);
}

displayData(1);
displayPagination(1);

document
  .getElementById("perPageSelect")
  .addEventListener("change", function () {
    perPage = parseInt(this.value);
    displayData(1);
    displayPagination(1);
  });

document.addEventListener("DOMContentLoaded", function () {
  var nomHeader = document.querySelector('.sortable[data-column="0"]');
  nomHeader.click();
});
function updateSortInfo(column, order) {
  var columnName;
  switch (column) {
    case 0:
      columnName = "ID";
      break;
    case 1:
      columnName = "Photo";
      break;
    case 2:
      columnName = "Nom";
      break;
    case 3:
      columnName = "Matricule";
      break;
    case 4:
      columnName = "Genre";
      break;
    case 5:
      columnName = "Date de naissance";
      break;
    case 6:
      columnName = "Date de création";
      break;
    default:
      columnName = "";
  }
  var sortOrder = order === "asc" ? "croissant" : "décroissant";
  document.getElementById("triInfo").textContent =
    columnName + " (" + sortOrder + ")";
}

function loadEditModal(personne) {
  document.getElementById("editId").value = personne[0];
  document.getElementById("editName").value = personne[2];
  document.getElementById("editMatricule").value = personne[3];
  document.getElementById("editDob").value = personne[5];
  document.getElementById("img_edit").src = personne[1];
  var hommeRadio = document.getElementById("editHomme");
  var femmeRadio = document.getElementById("editFemme");
  if (personne[4] === "Homme") {
    hommeRadio.checked = true;
  } else if (personne[4] === "Femme") {
    femmeRadio.checked = true;
  }
}
function loadDeleteModal(id) {
  document.getElementById("deleteId").value = id;
}

function previewImage(inp, id) {
  var preview = document.getElementById(id);
  var file = inp.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    preview.src = reader.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

function removePersonById() {
  personnes = oldpersonnes = oldpersonnes.filter(function (person) {
    return person[0] !== document.getElementById("deleteId").value;
  });
  $("#deleteModal").modal("hide");
  var numPages =
    personnes.length != 0 ? Math.ceil(personnes.length / perPage) : 1;
  displayData(numPages < page_actual ? numPages : page_actual);
  displayPagination(numPages < page_actual ? numPages : page_actual);
}

function rechercherPersonnes(colonne, valeur) {
  const colonnes = {
    id: 0,
    image: 1,
    name: 2,
    matricule: 3,
    genre: 4,
  };
  if (!colonnes.hasOwnProperty(colonne)) return oldpersonnes;
  if (valeur == "") return oldpersonnes;
  const colonneIndex = colonnes[colonne];
  return oldpersonnes.filter((personne) =>
    personne[colonneIndex].toLowerCase().includes(valeur.toLowerCase())
  );
}

function rechercherPersonnesParDate(colonne, dateDebut, dateFin) {
  // alert(dateDebut)
  if (colonne !== "dob" && colonne !== "creationDate") return oldpersonnes;
  if (dateDebut == "" || dateFin == "") return oldpersonnes;

  const colonnes = {
    dob: 5,
    creationDate: 6,
  };
  const colonneIndex = colonnes[colonne];

  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);

  return oldpersonnes.filter((personne) => {
    const personDate = new Date(personne[colonneIndex]);
    return personDate >= startDate && personDate <= endDate;
  });
}

function Find() {
  var col = document.getElementById("searchType").value;
  if (col != "choisir") {
    if (col === "creationDate" || col === "dob") {
      var date1 = document.getElementById("date1").value;
      var date2 = document.getElementById("date2").value;
      personnes = rechercherPersonnesParDate(col, date1, date2);
    } else if (col == "genre") {
      var genre =
        document.getElementById("homme").checked == true ? "homme" : "femme";
      // alert(col)
      personnes = rechercherPersonnes(col, genre);
    } else {
      var text = document.getElementById("searchInput").value;
      personnes = rechercherPersonnes(col, text);
    }
    var numPages =
      personnes.length != 0 ? Math.ceil(personnes.length / perPage) : 1;
    displayData(numPages < page_actual ? numPages : page_actual);
    displayPagination(numPages < page_actual ? numPages : page_actual);
  }
}

function updatePerson() {
  const id = document.getElementById("editId").value;
  const nom = document.getElementById("editName").value;
  const matricule = document.getElementById("editMatricule").value;
  const datenaissance = document.getElementById("editDob").value;
  const index = oldpersonnes.findIndex((personne) => personne[0] == id);

  alert(id)
  if (index !== -1) {
    // oldpersonnes[index][1] = image;
    oldpersonnes[index][2] = nom;
    oldpersonnes[index][3] = matricule;
    oldpersonnes[index][5] = datenaissance;
    $("#editModal").modal("hide");
    personnes = oldpersonnes;
    var numPages =
      personnes.length != 0 ? Math.ceil(personnes.length / perPage) : 1;
    displayData(numPages < page_actual ? numPages : page_actual);
    displayPagination(numPages < page_actual ? numPages : page_actual);
    return true;
  } else {
    return false;
  }
}


function previewImage(input, imgElementId) {
  var reader = new FileReader();
  reader.onload = function (e) {
      document.getElementById(imgElementId).src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

// function addPerson() {
//   var id = (oldpersonnes.length + 1).toString();
//   var photo = document.getElementById('photo').files[0];
//   var name = document.getElementById('name').value;
//   var matricule = document.getElementById('matricule').value;
//   var genre = document.getElementById('genre').value;
//   var dob = document.getElementById('dob').value;

  // Save the image to /img folder
//   var reader = new FileReader();
//   reader.onload = function(event) {
//       var imgData = event.target.result;
//       var imgName = id + '.jpeg'; // Use the person's ID as the image name
//       var imgPath = '/img/' + imgName; // Path to save in the array
//       // Save the image data to /img folder
//       var img = new Image();
//       img.src = imgData;
//       img.onload = function() {
//           var canvas = document.createElement('canvas');
//           canvas.width = img.width;
//           canvas.height = img.height;
//           var ctx = canvas.getContext('2d');
//           ctx.drawImage(img, 0, 0);
//           canvas.toBlob(function(blob) {
//               var formData = new FormData();
//               formData.append('file', blob, imgName);
//               // Here you can use Ajax to send the formData to the server for saving
//               // For demonstration purposes, I'll just log the image path
//               console.log('Image saved to: ' + imgPath);
//           }, 'image/jpeg');
//       };
//   };
//   reader.readAsDataURL(photo);

//   // Add the person to the array
//   oldpersonnes.push([id, photo.name, name, matricule, genre, dob]);
//   console.log(oldpersonnes);
// }


// function addPerson(event) {
//   event.preventDefault();

//   var name = document.getElementById('name').value;
//   var matricule = document.getElementById('matricule').value;
//   var genre = document.getElementById('genre').value;
//   var dob = document.getElementById('dob').value;
//   var photoInput = document.getElementById('photo');
//   var id = oldpersonnes.length + 1; // Incremental ID

//   if (photoInput.files && photoInput.files[0]) {
//       var reader = new FileReader();
//       reader.onload = function (e) {
//           var photoUrl = e.target.result; // Base64 string of the image
//           var newPerson = [id.toString(), photoUrl, name, matricule, genre, dob, new Date().toISOString().split('T')[0]];
//           oldpersonnes.push(newPerson);
//           console.log(oldpersonnes);
//           // Optionally, you can update the UI to reflect the new person added
//       };
//       reader.readAsDataURL(photoInput.files[0]);
//   }
// }