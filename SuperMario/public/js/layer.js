
function drawBackground(bgd, ctx, sprites) {
    bgd.ranges.forEach(([x1, x2, y1, y2]) => {
        for (let i = x1; i <= x2; i++){
            for (let j = y1; j <= y2; j++){
                sprites.drawTile(bgd.tile, ctx, i, j);
            }
        }
    });
}

export function createBackgroundLayer(backgrounds, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;

    //console.log('Level loaded', level);
    backgrounds.forEach(bgd => {
        drawBackground(bgd, buffer.getContext('2d'), sprites);
    });

    return function drawBackgroundLayer(ctx) {
        ctx.drawImage(buffer, 0, 0);
    }
}
