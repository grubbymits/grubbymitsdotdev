import * as WT from "../lib/world-tree.js";
const spriteWidth = 322;
const spriteHeight = 270;
const sheet = new WT.SpriteSheet("../graphics/png/outside-terrain-tiles-muted-textured");
const tileRows = [
  WT.TerrainType.Lowland5,
  WT.TerrainType.Lowland4,
  WT.TerrainType.Lowland3,
  WT.TerrainType.Lowland2,
  WT.TerrainType.Lowland1,
  WT.TerrainType.Lowland0,
  WT.TerrainType.Upland5,
  WT.TerrainType.Upland4,
  WT.TerrainType.Upland3,
  WT.TerrainType.Upland2,
  WT.TerrainType.Upland1,
  WT.TerrainType.Upland0,
  WT.TerrainType.Water,
];
const tileColumns = [
  WT.TerrainShape.Flat,
  WT.TerrainShape.RampUpSouth,
  WT.TerrainShape.RampUpWest,
  WT.TerrainShape.RampUpEast,
  WT.TerrainShape.RampUpNorth,
  WT.TerrainShape.Wall,
  WT.TerrainShape.FlatAloneOut,
  WT.TerrainShape.FlatWestOut,
  WT.TerrainShape.FlatSouthOut,
  WT.TerrainShape.FlatSouthWest,
  WT.TerrainShape.FlatNorthEast,
  WT.TerrainShape.FlatNorth,
  WT.TerrainShape.FlatEastOut,
  WT.TerrainShape.FlatEast,
];

function addGraphic(column, row) {
  const shape = tileColumns[column];
  const type = tileRows[row];
  WT.Terrain.addGraphic(/*terrainType*/type,
                        /*terrainShape*/shape,
                        /*spriteSheet*/sheet,
                        /*coord.x*/spriteWidth * column,
                        /*coord.y*/spriteHeight * row,
                        /*width*/spriteWidth,
                        /*height*/spriteHeight);
}

for (let row in tileRows) {
  if (tileRows[row] == WT.TerrainType.Water) {
    // Only supporting flat water and sand tiles.
    addGraphic(tileColumns[0], row);
    continue;
  }
  for (let column in tileColumns) {
    addGraphic(column, row);
  }
}

const cellsX = 11;
const cellsY = 11;
const numTerraces = 3;
let heightMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                  [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
                  [ 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0 ],
                  [ 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0 ],
                  [ 0, 1, 2, 3, 3, 4, 3, 2, 2, 1, 0 ],
                  [ 0, 1, 2, 3, 4, 6, 4, 2, 2, 1, 0 ],
                  [ 0, 1, 2, 3, 4, 4, 3, 2, 2, 1, 0 ],
                  [ 0, 1, 2, 3, 3, 2, 2, 2, 2, 1, 0 ],
                  [ 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0 ],
                  [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
                  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];

window.onload = (event) => {
  const physicalDims =
    WT.TwoByOneIsometric.getDimensions(spriteWidth, spriteHeight);
  const worldDims = new WT.Dimensions(physicalDims.width * cellsX,
                                      physicalDims.depth * cellsY,
                                      physicalDims.height * (1 + numTerraces));
  let canvas = document.getElementById("demoCanvas");
  let context = WT.createContext(canvas, worldDims, WT.Perspective.TwoByOneIsometric);

  const config = new WT.TerrainBuilderConfig(numTerraces,
                                             WT.TerrainType.DryGrass,
                                             WT.TerrainType.DryGrass);
  config.hasWater = true;
  config.waterLine = 0;
  config.hasBiomes = true;
  config.hasRamps = true;
  config.rainfall = 30;
  config.rainDirection = WT.Direction.North;
  config.uplandThreshold = 4;

  // Use the height map to construct a terrain.
  let builder = new WT.TerrainBuilder(cellsX, cellsY, heightMap,
                                      config, physicalDims);
  builder.generateMap(context);
  let camera = new WT.MouseCamera(context.scene, canvas,
                                  canvas.width, canvas.height);
    
  var update = function update() {
    if (document.hasFocus()) {
      context.update(camera);
    }
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
}
