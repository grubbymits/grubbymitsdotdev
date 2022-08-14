import * as WT from "../lib/world-tree.js";
const spriteWidth = 322;
const spriteHeight = 270;
const sheet = new WT.SpriteSheet("demos/graphics/png/outside-terrain-tiles");
const tileRows = [
  WT.TerrainType.Rock,
  WT.TerrainType.DryGrass,
  WT.TerrainType.WetGrass,
  WT.TerrainType.Mud,
  WT.TerrainType.Sand,
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
  if (tileRows[row] == WT.TerrainType.Sand || tileRows[row] == WT.TerrainType.Water) {
    // Only supporting flat water and sand tiles.
    addGraphic(tileColumns[0], row);
    continue;
  }
  for (let column in tileColumns) {
    addGraphic(column, row);
  }
}

// Add graphical features: Waves.
const waveSheet = new WT.SpriteSheet("demos/graphics/png/waves");
const features = [ WT.TerrainFeature.ShorelineNorth,
                   WT.TerrainFeature.ShorelineWest,
                   WT.TerrainFeature.ShorelineEast,
                   WT.TerrainFeature.ShorelineSouth ];
for (let y in features) {
  let waveSprites = new Array();
  for (let x = 0; x < 3; x++) {
    waveSprites.push(new WT.Sprite(waveSheet,
                     x * spriteWidth,
                     y * spriteHeight,
                     spriteWidth, spriteHeight));
  }
  const waves = new WT.OssilateGraphicComponent(waveSprites, 500);
  const feature = features[y];
  WT.Terrain.addFeatureGraphics(feature, waves);
}

const cellsX = 11;
const cellsY = 11;
const numTerraces = 3;
const heightMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
                    [ 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0 ],
                    [ 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0 ],
                    [ 0, 1, 2, 3, 4, 6, 3, 2, 2, 1, 0 ],
                    [ 0, 1, 2, 3, 4, 4, 3, 2, 2, 1, 0 ],
                    [ 0, 1, 2, 3, 4, 6, 3, 2, 2, 1, 0 ],
                    [ 0, 1, 2, 3, 3, 2, 2, 2, 2, 1, 0 ],
                    [ 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0 ],
                    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];

function random_inrange(min, max) { 
  return Math.random() * (max - min) + min;
}

function addTrees(totalTrees, terrainDims, context, builder) {
  const treeSheet = new WT.SpriteSheet("demos/graphics/png/trees");
  const treeSpriteWidth = 114;
  const treeSpriteHeight = 171;

  // Ask WorldTree to chop the spritesheet into an array of
  // StaticGraphicComponent.
  const treeGraphics =
    WT.generateStaticGraphics(treeSheet, treeSpriteWidth, treeSpriteHeight,
                              /*xBegin*/0, /*yBegin*/0,
                              /*columns*/8, /*rows*/5);
  const treeDims =
    WT.TwoByOneIsometric.getDimensions(treeSpriteWidth,
                                       treeSpriteHeight);
  let inserted = 0;
  let insertedAt = new Map();
  let attempts = 0;
  const maxAttempts = 1000;
  while (inserted < totalTrees && attempts < maxAttempts) {
    // Choose a random spot on the map and check whether it seems wet
    // enough to support a tree.
    attempts++;
    const x = Math.floor(Math.random() * cellsX);
    const y = Math.floor(Math.random() * cellsY);
    const biome = builder.biomeAt(x, y);
    // Don't place a tree where it would be out of place.
    if (biome == WT.Biome.Beach || biome == WT.Biome.Water) {
      continue;
    }
    // Don't place on a ramp.
    if (!builder.isFlatAt(x, y)) {
      continue;
    }
    // Don't place two trees in the same place.
    if (insertedAt.has(y) && insertedAt.get(y).has(x)) {
      continue;
    } else if (insertedAt.has(y)) {
      insertedAt.get(y).add(x);
    } else {
      insertedAt.set(y, new Set());
      insertedAt.get(y).add(x);
    }

    // Try not the place the tree in the exact same relative spot within a tile.
    let offsetX = random_inrange(treeDims.width / -4, treeDims.width / 4);
    let offsetY = random_inrange(treeDims.depth / -4, treeDims.depth / 4);
    const centreX = Math.floor((x * terrainDims.width) +
                               (terrainDims.width / 2) + offsetX);
    const centreY = Math.floor((y * terrainDims.depth) +
                               (terrainDims.depth / 2) + offsetY);
    const z = terrainDims.height * (1 + builder.relativeHeightAt(x, y));
    const loc = new WT.Point3D(centreX, centreY, z);

    // Choose a random graphic.
    const idx = Math.floor(Math.random() * Math.floor(treeGraphics.length));
    const graphic = treeGraphics[idx];
    const tree = new WT.createGraphicalEntity(context, loc, treeDims, graphic);
    inserted++;
  }
}

window.onload = (event) => {
  const terrainDims =
    WT.TwoByOneIsometric.getDimensions(spriteWidth, spriteHeight);
  const worldDims = new WT.Dimensions(terrainDims.width * cellsX,
                                          terrainDims.depth * cellsY,
                                          terrainDims.height * 2 * numTerraces);
  let canvas = document.getElementById("demoCanvas");
  let context = new WT.createContext(canvas, worldDims,
                                     WT.Perspective.TwoByOneIsometric);
  const defaultFloor = WT.TerrainType.DryGrass;
  const defaultWall = WT.TerrainType.DryGrass;
  // Use the height map to construct a terrain.
  const config = new WT.TerrainBuilderConfig(numTerraces,
                                             defaultFloor,
                                             defaultWall);
  config.hasWater = true;
  config.hasBiomes = true;
  config.hasRamps = true;
  config.rainfall = 30;
  config.dryLimit = 0.2;
  config.treeLimit = 4;
  config.wetLimit = 1;
  config.waterLine = 0;
  config.rainDirection = WT.Direction.North;

  let builder = new WT.TerrainBuilder(cellsX, cellsY, heightMap,
                                      config, terrainDims);
  builder.generateMap(context);
  let camera = new WT.MouseCamera(context.scene, canvas,
                                  canvas.width, canvas.height);

  addTrees(20, terrainDims, context, builder);
  var update = function update() {
    if (document.hasFocus()) {
      context.update(camera);
    }
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
}