//Game Loader
//Define
export function loadImage(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load', () => { 
            resolve(img); 
        });
        img.src = url;
    });
}

export function loadLevel(name) {
    return fetch(`../src/levels/${name}.json`)
    .then( r => r.json() );
}