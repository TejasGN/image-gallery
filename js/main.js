const flickrApi = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
const flickrApiKey = "653a0e19ade4364b08ac00b7c7250732";
const flickrPage = "&page=";
const apiParams = "&extras=url_l,description&format=json&nojsoncallback=%3F&safe_search=1&sort=relevance&text=";

//Use a global variable -> 2 marks
let _searchBox, _btn, _topbar, _srchWrap, _imgBox, pageNum = 1, imgArray = [], currQuery, loadMoreFlag = true, counter = 1, imageUrl, _recentWrap, recentSearchesAry = [], _resultWrap, currSurprise, _surprTxt, _spans, _clrTxt;

//Use an array -> 2 marks
const surpriseArry = ['mountains', 'sunset', 'flowers', 'skyline', 'beach', 'food', 'palace', 'scenery', 'nature', 'waterfall', 'under water', 'wallpapers', 'forest', 'moon', 'galaxy', 'sky', 'super cars', 'northern lights'];

//A custom function -> 2 marks
const adjustUi = () => {
    try{
        //Use an If statement -> 5 marks
        if(!_srchWrap.classList.contains("top-shift")){
            _topbar.style.top = "0";
            _srchWrap.classList.add("top-shift");
            document.querySelector('.srch-wrap.top-shift .logo-wrap').addEventListener('click', () => {
                location.reload();
            });
        }
    }catch(err){
        console.log("Error in adjustUi ", err);
    }
};

//A custom function using parameters -> 5 marks
const isInViewport = el => {
    try{
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            //Use a built‐in method for the document object (documentElement) -> 2 marks
            //Use a logical OR operator -> 5 marks
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }catch(err){
        console.log("Error in isInViewport ", err);
    }
};

const getFileName = (str) => {
    try{

        //Use a built‐in method for the string object -> 2 marks
        return str.substring(str.lastIndexOf('/') + 1);
    }catch(err){
        console.log("Error in getFileName ", err);
    }
};

const prntImages = () => {
    try{
        //Use a logical NOT operator -> 5 marks
        if(!document.querySelector('.loader-wrap')){
            imgArray.forEach(elem => {
                if(!!elem){

                    //Use the createElement() method -> 2 marks
                    let newImg = document.createElement('IMG');
                    newImg.src = elem;
                    newImg.addEventListener('click', (e) => {
                        let showCaseDiv = document.createElement('div');
                        showCaseDiv.classList.add('show-case-wrap');
                        let showCaseImg = document.createElement('IMG');

                        //Use the getAttribute() method -> 2 marks
                        //Use the event Target property -> 5 marks
                        showCaseImg.src = e.target.getAttribute('src');
                        let crossMark = document.createElement('span');
                        crossMark.classList.add('crs-btn');
                        let downTxt = document.createElement('p');

                        //Use the innerHTML property -> 2 marks
                        downTxt.innerHTML = "Click on the image to download";
                        crossMark.innerHTML = "&#10006;";
                        showCaseDiv.appendChild(showCaseImg);
                        showCaseDiv.appendChild(crossMark);
                        showCaseDiv.appendChild(downTxt);
                        document.querySelector('.afterwrap').appendChild(showCaseDiv);
                        showCaseImg.addEventListener('click', () => {
                            let imgPath = elem;
                            let fileName = getFileName(elem);
                            saveAs(imgPath, fileName);
                        });
                        crossMark.addEventListener('click', () => {
                            showCaseDiv.remove();
                        });
                    });
                    _imgBox.appendChild(newImg);
                }
            });
            ++pageNum
            imgArray.length = 0;
            let loaderDiv = document.createElement("div");
            loaderDiv.classList.add('loader-wrap');
            let imgWidth = document.querySelector('.img-box img').offsetWidth;

            //Use a built‐in method for the Math object -> 2 marks
            let numOfTiles = Math.floor(_imgBox.offsetWidth/imgWidth);
            let margVal = parseInt(window.getComputedStyle(document.querySelector('.img-box img')).getPropertyValue('margin-left').split('px')[0]);
            let tilesWidth = (imgWidth * numOfTiles) + (margVal * numOfTiles);
            let imgWrapPad = parseInt(window.getComputedStyle(_imgBox).getPropertyValue('padding-left').split('px')[0]) * 2;
            numOfTiles = tilesWidth > _imgBox.offsetWidth - imgWrapPad ? numOfTiles - 1 : numOfTiles;

            //Use a For loop -> 5 marks
            for(let i = 0; i < numOfTiles; i++){
                let imgLoader = document.createElement("div");
                imgLoader.classList.add('img-loader');
                imgLoader.style.width = imgWidth + "px";
                loaderDiv.appendChild(imgLoader);
            }
            document.querySelector('.afterwrap').appendChild(loaderDiv);
            document.addEventListener('scroll', () => {
                if(!!document.querySelector('.loader-wrap')){
                    let inViewFlag = isInViewport(document.querySelector('.loader-wrap')) ? true : false;
                    if(inViewFlag){
                        document.removeEventListener('scroll', () => {});
                        //Use a built‐in method for the window object (setTimeout) -> 2 marks
                        setTimeout(() => {
                            if(!!document.querySelector('.loader-wrap')) document.querySelector('.loader-wrap').remove();
                            fetchData('old');
                        }, 2000);
                    }
                }
            });
        }
    }catch(err){
        console.log("Error in prntImages ", err);
    }
};

const fetchData = (status) => {
    //Use a Try … Catch statement -> 5 marks
    try{
        const searchTerm = _searchBox.value;
        if(status == 'old') loadMoreFlag = parseInt(imageUrl.split('page=')[1].split('&')[0]) == pageNum ? false : true;
        else{
            loadMoreFlag = true;
            window.scrollTo(0, 0);
        }
        if(loadMoreFlag){
            imageUrl = `${flickrApi}${flickrApiKey}${flickrPage}${pageNum}${apiParams}${searchTerm}`;

            //Create an XMLHttpRequest object -> 15 marks
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    //Use the XMLHttpRequest object to get XML/JSON data -> 15 marks
                    let data = JSON.parse(this.responseText);
                    if(data.photos.photo.length == 0 && pageNum == 1){
                        let errorMsg = document.createElement('div');
                        errorMsg.classList.add('error-wrap');
                        errorMsg.innerHTML = `We couldn't find images for "${searchTerm}"`;
                        document.querySelector('.afterwrap').appendChild(errorMsg);
                        errorMsg.style.top = "0";
                        setTimeout(() => {
                            errorMsg.style.top = "-100%";
                            errorMsg.remove();
                        }, 2300);
                    }
                    if(pageNum > data.photos.pages) return;
                    if(status == "new"){
                        imgArray.length = 0;
                        _imgBox.innerHTML = "";
                        if(!!document.querySelector('.loader-wrap')) document.querySelector('.loader-wrap').remove();
                    }
                    adjustUi();
                    data.photos.photo.forEach(elem => {
                        if(!!elem.url_l) imgArray.push(elem.url_l);
                    });
                    prntImages(imgArray);
                }
            };
            xhttp.open("GET", imageUrl, true);
            xhttp.send();
        }
    }catch(err){
        console.log("Error in fetchData ", err);
    }
};

const takeCall = () => {
    try{
        if(!currQuery || currQuery != _searchBox.value){
            currQuery = _searchBox.value;
            pageNum = 1;
            loadMoreFlag = true;
            imageUrl = `${flickrApi}${flickrApiKey}${flickrPage}${pageNum}${apiParams}${currQuery}`;
            fetchData('new');
            _clrTxt.style.display = "inline";
            if(!recentSearchesAry.includes(currQuery)) recentSearchesAry.push(currQuery);
            if(recentSearchesAry.length > 5) recentSearchesAry = recentSearchesAry.slice(Math.max(recentSearchesAry.length - 5, 0));
            localStorage.setItem('recentSearches', JSON.stringify(recentSearchesAry));
        }
    }catch(err){
        console.log("Error in takeCall ", err);
    }
};

const getRandomSurp = arry => {
    try{
        return arry[Math.floor(Math.random() * arry.length)];
    }catch(err){
        console.log("Error in getRandomSurp ", err);
    }
};

const surpriseClicked = () => {
    try{

        //Use a locally scoped variable -> 2 marks
        let randomElement = getRandomSurp(surpriseArry);
        if(currSurprise == randomElement) surpriseClicked();
        _searchBox.value = randomElement;
        takeCall();

    }catch(err){
        console.log("Error in surpriseClicked ", err);
    }
};

//Use an Immediately Invoked Function Expression (IFFE) -> 10 marks
(() => {
    _searchBox = document.querySelector('#search-txt');
    _btn = document.querySelector('#btn');
    _topbar = document.querySelector('.topbar');
    _srchWrap = document.querySelector('.srch-wrap');
    _imgBox = document.querySelector('.img-box');
    _recentWrap = document.querySelector('.recent-wrap');
    _resultWrap = document.querySelector('.result-wrap');
    _surprTxt = document.querySelector('.surpr-txt');
    _clrTxt = document.querySelector('.clr-txt');

    //Use querySelectorAll -> 2 marks
    _spans = document.querySelectorAll('.lst-txt span');
    _resultWrap.innerHTML = "";

    //Use a Focus event -> 2 marks
    _searchBox.focus();

    //Use a keydown/keyup/keypress event -> 2 marks
    _searchBox.addEventListener('keyup', evt => {

        //Use a logical AND operator -> 5 marks
        if(evt.key == "Enter" && _searchBox.value.trim().length >= 1){
            takeCall();
        }
        if(_searchBox.value.trim().length >= 1) _clrTxt.style.display = "inline";
        else _clrTxt.style.display = "none";
    });
    _btn.addEventListener('click', () => {
        if(_searchBox.value.trim().length >= 1){
            takeCall();
        }
    });
    _surprTxt.addEventListener('click', () => {
        surpriseClicked();
    });
    //Use local/session storage -> 5 marks
    if(!!localStorage.getItem('recentSearches')){
        recentSearchesAry = JSON.parse(localStorage.getItem('recentSearches'));
        for(let i = recentSearchesAry.length-1; i >= 0; i--){
            let rcntSrchTxt = document.createElement('a');
            rcntSrchTxt.classList.add('rcnt-srch-txt');
            rcntSrchTxt.innerHTML = recentSearchesAry[i];
            rcntSrchTxt.addEventListener('click', () => {
                _searchBox.value = rcntSrchTxt.innerHTML;
                takeCall();
            });
            _resultWrap.appendChild(rcntSrchTxt);
        }
        _recentWrap.style.display = "flex";
        let localAryLen = recentSearchesAry.length;

        //Use an If … Else statement -> 5 marks
        if(localAryLen == 1){
            _spans.forEach(elem => {
                elem.style.display = "none";
            });
        }
        else{
            _spans.forEach(elem => {
                elem.style.display = "inline";
            });
            _spans[0].innerHTML = localAryLen;
        }
    }
    else{
        _recentWrap.style.display = "none";
    }
    document.body.addEventListener('keyup', evt => {
        if(evt.key == "Escape" && !!document.querySelector('.show-case-wrap')) document.querySelector('.show-case-wrap').remove();
    });
    _clrTxt.addEventListener('click', () => {
        _searchBox.value = "";
        _clrTxt.style.display = "none";
    });
})();