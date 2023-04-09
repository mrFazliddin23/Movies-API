// /// Higher order function
// function myOuterFun(num) { // Outer Fuction - tashqaridagi funksiya
//     return function myInnerFun(num2) { // Inner Function - ichkaridagi funksiya
//         return num * num2;
//     }
// }
// // console.log(myOuterFun(5)(2));

// const double = myOuterFun(2);
// console.log(double(10));

//// Callback function
// function myName(name, callback) {
//     const gretting = name + callback();
//     return gretting;
// }

// function sayGretting() {
//     return 'Happy birthday to you'
// }

// console.log(myName('Fazliddin ', sayGretting));




//////////////// async await

const loaderWrapper = document.querySelector(".loader-wrapper");
const loader = document.createElement("span");
loader.classList.add("loader");
loaderWrapper.appendChild(loader);

const moviesAll = document.querySelector("#movies");

const apiKey = "8b540f82dc731f0cd9f5cf69c2c389b3"; // my API key

const baseUrl = "https://api.themoviedb.org/3/";

const imgUrl = "https://image.tmdb.org/t/p/w500";

// const url = `${baseUrl}discover/movie?api_key=${apiKey}`; //hammasini olish
let currentPage = 1;


async function myAssyncFun() {
    const search = document.querySelector(".form-control").value;

    let url;

    if (search) {
        url = `${baseUrl}search/movie?api_key=${apiKey}&query=${search}`; //search qilib topish uchun
    } else {
        url = `${baseUrl}discover/movie?api_key=${apiKey}&page=${currentPage}`;
    }

    try {
        const responce = await fetch(url);
        const data = await responce.json();

        let totalPage = data.total_pages > 5 ? 5 : data.total_pages;

        moviesAll.innerHTML = "";

        if (data.results.length === 0) {
            const notFound = document.querySelector(".not-found");
            notFound.textContent = "The movie you were looking for was not found";
        } else {
            data.results.map((movie) => {
                const fragment = document.createDocumentFragment();
                const movieCard = document.createElement("div");
                movieCard.classList.add("movies__card");

                const movieImg = document.createElement("img");
                movieImg.src = `${imgUrl}${movie.backdrop_path}`;
                movieImg.alt = movie.title;
                movieImg.classList.add("movies__card--img");
                fragment.appendChild(movieImg);

                const moviTitle = document.createElement("h3");
                moviTitle.textContent = movie.title;
                moviTitle.style.color = "red";
                moviTitle.style.maxWidth = "400px";
                moviTitle.style.margin = "10px 0 10px 10px";
                fragment.appendChild(moviTitle);

                const movieRelease = document.createElement("p");
                movieRelease.textContent = `Released: ${movie.release_date}`;
                movieRelease.style.color = "white";
                movieRelease.style.margin = "10px 0 10px 10px";
                movieRelease.style.fontSize = "20px";
                fragment.append(movieRelease);

                moviesAll.appendChild(movieCard);
                movieCard.appendChild(fragment);
            });

            const pagination = document.querySelector(".pagination");
            pagination.innerHTML = "";
            if (totalPage > 1) {
                for (let i = 1; i < totalPage; i++) {
                    const btn = document.createElement('button');
                    btn.classList.add("pagination_btn");
                    btn.innerText = i;

                    if (currentPage === i) {
                        btn.classList.add('active');
                    }

                    btn.addEventListener('click', () => {
                        currentPage = i;
                        myAssyncFun();
                    })

                    pagination.appendChild(btn);
                }
            }

        }
    } catch (error) {
        console.error(error.message);
    } finally {
        const loader = document.querySelector(".loader");
        if (loader) {
            loaderWrapper.remove();
        }
    }

    const searchInput = document.querySelector(".form-control");
    const button = document.querySelector(".btn");
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            myAssyncFun();
        }
    });

    button.addEventListener("click", () => {
        currentPage = 1;
        myAssyncFun();
    });
}

myAssyncFun();