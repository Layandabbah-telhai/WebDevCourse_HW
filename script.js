const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const songIdInput = document.getElementById('songId');
const searchInput = document.getElementById('search');
const tableView = document.getElementById('tableView');
const cardsView = document.getElementById('cardsView');
const viewToggle = document.getElementById('viewToggle');
const viewIcon = document.getElementById('viewIcon');
const sortRadios = document.querySelectorAll('input[name="sortOption"]');

// if not exist in localStorage get empty array else
//get json text and convert it to object json
let songs = JSON.parse(localStorage.getItem('songs')) || [];

let isTableView = true;

function getYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') {
            return u.pathname.slice(1);
        }
        const v = u.searchParams.get('v');
        if (v) {
            return v;
        }
        return '';
    } catch (e) {
        return '';
    }
}

function playSong(videoId) {
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    window.open(url, '_blank', 'width=800,height=450');
}

sortRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        renderSongs();
    });
});

viewToggle.addEventListener('click', () => {
    isTableView = !isTableView;

    if (isTableView) {
        tableView.classList.remove('d-none');
        cardsView.classList.add('d-none');
        viewIcon.className = 'fas fa-th-large';
    } else {
        tableView.classList.add('d-none');
        cardsView.classList.remove('d-none');
        viewIcon.className = 'fas fa-table';
    }
});

//user click the Add button 
form.addEventListener('submit', (e) => {
    // dont submit the form to the server yet let me handle it here 
    e.preventDefault();

    // read forms data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = document.getElementById('rating').value;
    const videoId = getYouTubeId(url);
    const existingId = songIdInput.value;

    if (existingId) {
        const idNumber = Number(existingId);
        const index = songs.findIndex(song => song.id === idNumber);
        if (index !== -1) {
            songs[index].title = title;
            songs[index].url = url;
            songs[index].rating = rating;
            songs[index].videoId = videoId;
        }
    } else {
        //crate json based on json and url title
        const song = {
            id: Date.now(),  // Unique ID
            title: title,
            url: url,
            rating: rating,
            videoId: videoId,
            dateAdded: Date.now()
        };

        songs.push(song);
    }

    saveAndRender();
    form.reset();
    songIdInput.value = '';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
});

function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

function renderSongs() {
    list.innerHTML = '';
    cardsView.innerHTML = '';

    const selected = document.querySelector('input[name="sortOption"]:checked');
    const sortValue = selected ? selected.value : 'date';

    const sorted = [...songs];

    if (sortValue === 'name') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'rating') {
        sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else {
        sorted.sort((a, b) => b.dateAdded - a.dateAdded);
    }

    sorted.forEach(song => {
        const videoId = song.videoId || getYouTubeId(song.url);

        // ---- row in table view ----
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
                         alt="${song.title}"
                         style="width:80px;height:45px;object-fit:cover;margin-right:10px;">
                    <span>${song.title}</span>
                </div>
            </td>
            <td>${song.rating || '-'}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="playSong('${videoId}')">
                    <i class="fas fa-play"></i> Play
                </button>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);

        // ---- card in cards view ----
        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="card h-100 bg-dark">
                <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
                     class="card-img-top"
                     alt="${song.title}">
                    <div class="card-body d-flex flex-column text-white">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text mb-2">Rating: ${song.rating || '-'}</p>
                    <div class="mt-auto d-flex justify-content-between">
                        <button class="btn btn-sm btn-info" onclick="playSong('${videoId}')">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <div>
                            <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        cardsView.appendChild(col);
    });
}

function deleteSong(id) {
    if (!confirm('Are you sure?')) return;

    songs = songs.filter(song => song.id !== id);
    saveAndRender();
}

function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    document.getElementById('rating').value = song.rating || '';
    songIdInput.value = song.id;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
}

// בעליית הדף – הצגת רשימת הסרטונים מה localStorage
renderSongs();
