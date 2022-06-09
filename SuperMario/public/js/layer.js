
export function createBackgroundLayer(level, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 2048;
    buffer.height = 240;

    const ctx = buffer.getContext('2d');
    
    level.tiles.forEach((tile, x, y) => {
            sprites.drawTile(tile.name, ctx, x, y);
    })

    return function drawBackgroundLayer(ctx, camera) {
        ctx.drawImage(buffer, -camera.pos.x, -camera.pos.y);
    }
}

export function createSpriteLayer(entities, width = 64, height = 64) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');


    return function drawSpriteLayer(ctx, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);
            ctx.drawImage(
                spriteBuffer,
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y);
        });
    };
}

export function createCollisionLayer(level) {
    const resolvedTiles = [];
    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;
    const getByIndexOriginal = tileResolver.getByIndex;

    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedTiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y);
    };

    

    return function drawCollision(ctx, camera) {
        ctx.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            //console.log('Would draw', x, y);
            ctx.beginPath();
            ctx.rect(
                x * tileSize - camera.pos.x, 
                y * tileSize - camera.pos.y, 
                tileSize, 
                tileSize
                );
            ctx.stroke();
        });

        ctx.strokeStyle = 'red';
        level.entities.forEach(entity => {
            ctx.beginPath();
            ctx.rect(
                entity.pos.x - camera.pos.x, 
                entity.pos.y - camera.pos.y, 
                entity.size.x, 
                entity.size.y
                );
            ctx.stroke();
        });

        resolvedTiles.length = 0;
    }
}