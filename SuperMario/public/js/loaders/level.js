import Level from "../level.js";
import { Matrix } from "../math.js";
import { createBackgroundLayer, createSpriteLayer } from "../layer.js";
import { loadJSON, loadSpriteSheet} from "../loaders.js";

export function createLevelLoader(entityFactory) {
    return function loadLevel(name) {
        return loadJSON(`../src/levels/${name}.json`)
        .then(levelSpec => Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet),
        ]))
        .then(([ levelSpec, backgroundSprite ]) => {
            const level = new Level();
            setupCollision(levelSpec, level);
            setupBackgrounds(levelSpec, level, backgroundSprite);
            setupEntities(levelSpec, level, entityFactory);
            return level;
        });
    }
}

function setupCollision(levelSpec, level){
    // setup 方塊特性 to grid
    const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
    }, []);
    const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
    level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec, level, backgroundSprite) {
    // setup 方塊外觀 to grid
    levelSpec.layers.forEach(layer => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprite);
        level.comp.layers.push(backgroundLayer);
    });
}

function setupEntities(levelSpec, level, entityFactory) {
    // setup 角色生成
    levelSpec.entities.forEach(({name, pos:[x, y]}) => {
        const createEntity = entityFactory[name];
        const entity = createEntity();
        entity.pos.set(x * 16, y * 16);
        level.entities.add(entity);
    });
    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(spriteLayer);
}

function createCollisionGrid(tiles, patterns) {
    const grid = new Matrix();

    for ( const {tile, x, y} of expandTiles( tiles, patterns )) {
        grid.set(x, y, { type: tile.type });
    };

    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Matrix();

    for ( const {tile, x, y} of expandTiles( tiles, patterns )) {
        grid.set(x, y, { name: tile.name });
    };

    return grid;
}

function* expandSpanm(xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            yield {x, y};
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpanm(xStart, xLen, yStart, yLen);

    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpanm(xStart, xLen, yStart, 1);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpanm(xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) 
        yield* expandRange(range);
}

function* expandTiles(tiles, patterns) {
    function* walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {
                const derivedX = offsetX + x;
                const derivedY = offsetY + y;

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, derivedX, derivedY);
                } else {
                    yield {
                        tile,
                        x: derivedX,
                        y: derivedY,
                    };
                }
            }
        }
    }

    yield* walkTiles(tiles, 0, 0);
}