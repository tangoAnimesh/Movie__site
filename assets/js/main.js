// -- TMDB API 

const API_KEY = 'api_key=907ab422c27f9ea5787edc76397da938';

const BASE_URL = 'https://api.themoviedb.org/3';

const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' +
  API_KEY;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

// For Genres ------

const genres = [

  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }

]



const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEle = document.getElementById('tags');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = [];
setGenre();

function setGenre() {
  tagsEle.innerHTML = '';

  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          })
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
      highLightSelection();
    })
    tagsEle.append(t);
  })
}

function highLightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('highlight');
  })

  clearBtn();

  if (selectedGenre.length != 0) {

    selectedGenre.forEach(id => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add('highlight');
    })
  }

}

function clearBtn() {
  let clearBtn = document.getElementById('clear');
  if (clearBtn) {
    clearBtn.classList.add('highlight')
  } else {

    let clear = document.createElement('div');
    clear.classList.add('tag', 'highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear All';
    clear.addEventListener('click', () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    })
    tagsEle.append(clear);
  }

}


getMovies(API_URL);

function getMovies(url) {

  lastUrl = url;

  fetch(url).then(res => res.json()).then(data => {
    console.log(data.results);
    if (data.results.length !== 0) {
      showMovies(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;

      current.innerText = currentPage;

      if (currentPage <= 1) {
        prev.classList.add('disabled');
        next.classList.remove('disabled');
      } else if (currentPage >= totalPages) {
        prev.classList.remove('disabled');
        next.classList.add('disabled');
      } else {
        prev.classList.remove('disabled');
        next.classList.remove('disabled');
      }

      tagsEle.scrollIntoView({
        behavior: 'smooth'
      });

    } else {
      main.innerHTML = `<h1 class="no-results" >😓Sorry No Results Found😓</h1>`
    }

  })
}


function showMovies(data) {
  main.innerHTML = ' ';

  data.forEach(movie => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
      id
    } = movie;
    const movieElm = document.createElement('div');
    movieElm.classList.add('movie');
    movieElm.innerHTML = `
        <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580" }" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h3>overview</h3>
             ${overview}; 
             <br/>
             <button class="know-more"id="${id}">Explore</button>
        </div>

        `

    main.appendChild(movieElm);

    document.getElementById(id).addEventListener('click', () => {
      console.log(id);
      openNav(movie);
    })

  })
}

const overlayContent = document.getElementById('overlay-content');

/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json())
    .then(videoData => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          var embed = [];
          videoData.results.forEach((video, idx) => {
            let {name, key, site} = video

            if(site == 'YouTube'){

              embed.push(`
                <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${key}" 
                title="${name}" 
                frameborder="0" 
                class = "embed hide"
                allow="accelerometer;
                autoplay; clipboard-write; encrypted-media; gyroscope;
                picture-in-picture" allowfullscreen></iframe>
                
                `)

            }
          })

          var content = `

          <h1 class="no-results" >${movie.original_title}</h1>
          <br/>
          
          ${(embed.join(''))}
          <br/>
          `

          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results" >😓Sorry No Results Found😓</h1>`
        }
      }
    })

}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');
  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show');
      embedTag.classList.remove('hide');

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show');
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })
}


const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0 ){
    activeSlide--;
  }
  else{
    activeSlide = totalVideos -1;
  }

  showVideos();
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos - 1) ){
    activeSlide++;
  }
  else{
    activeSlide = 0;
  }

  showVideos();
})


function getColor(vote) {
  if (vote >= 8) {
    return 'green'
  } else if (vote >= 5) {
    return 'yellow'
  } else {
    return 'red'
  }
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchItem = search.value;
  selectedGenre = [];
  highLightSelection();

  if (searchItem) {
    getMovies(SEARCH_URL + '&query=' + searchItem);
  } else {
    getMovies(API_URL);
  }
});


prev.addEventListener('click', () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
})



next.addEventListener('click', () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
})




function pageCall(page) {
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length - 1].split('=');
  if (key[0] != 'page') {
    let url = lastUrl + '&page=' + page;
    getMovies(url);
  } else {

    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] + '?' + b;
    getMovies(url);

  }

}



// ==================== for creating BACK TO TOP button ========================
const toTop = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
})

//===================== Change color ==================

function changColor(id){

  document.body.style.background = document.getElementById(id).innerHTML;
  
}