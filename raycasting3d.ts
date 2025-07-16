//% color="#AA278D" weight=100 icon="\uf121"
namespace raycasting3d {
    export interface MapTile {
        wallHeight: number;
        floorHeight: number;
        ceilingHeight: number;
        stairHeight?: number;
    }

    export let map: MapTile[][] = [];
    export let playerX = 1.5;
    export let playerY = 1.5;
    export let playerHeight = 0;
    export let playerAngle = 0;
    export let mapWidth = 0;
    export let mapHeight = 0;

    export function setMap(newMap: MapTile[][]) {
        map = newMap;
        mapWidth = map.length;
        mapHeight = map[0].length;
    }

    export function setPlayer(x: number, y: number, height: number, angle: number) {
        playerX = x;
        playerY = y;
        playerHeight = height;
        playerAngle = angle;
    }

    export function render(scene: Image) {
        const screenWidth = scene.width;
        const screenHeight = scene.height;
        scene.fill(0);
        const FOV = Math.PI / 3;
        const numRays = screenWidth;

        for (let i = 0; i < numRays; i++) {
            const rayAngle = playerAngle - FOV / 2 + (i / numRays) * FOV;
            let rayX = playerX;
            let rayY = playerY;
            let rayStep = 0.05;
            let distance = 0;
            let hit = false;
            let hitTile: MapTile | null = null;

            while (!hit && distance < 20) {
                rayX += rayStep * Math.cos(rayAngle);
                rayY += rayStep * Math.sin(rayAngle);
                distance += rayStep;

                const mapX = Math.floor(rayX);
                const mapY = Math.floor(rayY);

                if (mapX < 0 || mapX >= mapWidth || mapY < 0 || mapY >= mapHeight) {
                    break;
                }

                const tile = map[mapX][mapY];
                if (tile.wallHeight > 0) {
                    hit = true;
                    hitTile = tile;
                }
            }

            if (hit && hitTile) {
                const wallHeightPx = Math.min(screenHeight, (screenHeight / distance) * hitTile.wallHeight * 2);
                const floorHeightPx = (screenHeight / 2) + (playerHeight - hitTile.floorHeight) * 10;
                const ceilingHeightPx = (screenHeight / 2) - (hitTile.ceilingHeight - playerHeight) * 10;
                const wallTop = Math.max(0, ceilingHeightPx);
                const wallBottom = Math.min(screenHeight, floorHeightPx);

                for (let y = 0; y < screenHeight; y++) {
                    if (y >= wallTop && y <= wallBottom) {
                        scene.setPixel(i, y, 15);
                    } else if (y > wallBottom) {
                        scene.setPixel(i, y, 3);
                    } else {
                        scene.setPixel(i, y, 1);
                    }
                }
            } else {
                for (let y = 0; y < screenHeight; y++) {
                    scene.setPixel(i, y, y > screenHeight / 2 ? 3 : 1);
                }
            }
        }
    }
}
