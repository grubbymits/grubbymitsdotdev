import * as WT from "../lib/world-tree.js";

class Droid extends WT.Actor {
  static sheet = new WT.SpriteSheet("demos/graphics/png/levitate-droid");
  static directions = [ WT.Direction.West,
                        WT.Direction.South,
                        WT.Direction.East,
                        WT.Direction.North ];
  static sprites = new Array();
  static spriteWidth = 58;
  static spriteHeight = 107;
  static dims =
    WT.TwoByOneIsometric.getDimensions(this.spriteWidth, this.spriteHeight);
    
  static initGraphics() {
    this.staticGraphics = new Map();
    for (let x in this.directions) {
      let direction = this.directions[x];
      let sprite = new WT.Sprite(this.sheet, x * this.spriteWidth, 0,
                                 this.spriteWidth, this.spriteHeight);
      let graphic = new WT.StaticGraphicComponent(sprite.id);
      this.staticGraphics.set(direction, graphic);
    }
  }

  constructor(context, position) {
    super(context, position, Droid.dims);
    let graphics = new WT.DirectionalGraphicComponent(Droid.staticGraphics);
    this.addGraphic(graphics);
    
    this.addEventListener(WT.EntityEvent.FaceDirection, () =>
      graphics.direction = this.direction
    );

    let moveRandomDirection = () => {
      let dx = Math.round(Math.random() * 2) - 1;
      let dy = 0;
      let dz = 0;
      // Move along either the x or y axis.
      // Choose values between: -1, 0, 1
      if (dx == 0) {
        dy = Math.round(Math.random() * 2) - 1;
      }
      if (dx == 0 && dy == 0) {
        dy = 1;
      }
      let moveVector = new WT.Vector3D(dx, dy, dz);
      this.direction = WT.getDirectionFromVector(moveVector);
      this.action = new WT.MoveDirection(this, moveVector, context.bounds);
    };

    // Choose another direction when it can't move anymore.
    this.addEventListener(WT.EntityEvent.EndMove, moveRandomDirection);
    // Initialise movement.
    moveRandomDirection();
  }
}

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
  const shape = WT.TerrainShape.Flat;
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

const cellsX = 9;
const cellsY = 9;
const numTerraces = 1;
let heightMap = [ [ 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
                  [ 2, 2, 1, 1, 1, 2, 1, 1, 2 ],
                  [ 2, 1, 1, 1, 1, 2, 1, 1, 2 ],
                  [ 2, 1, 1, 1, 1, 1, 1, 1, 2 ],
                  [ 2, 1, 1, 2, 1, 1, 1, 2, 2 ],
                  [ 2, 1, 2, 1, 1, 1, 1, 1, 2 ],
                  [ 2, 1, 1, 1, 2, 1, 1, 1, 2 ],
                  [ 2, 2, 1, 1, 1, 1, 2, 1, 2 ],
                  [ 2, 2, 2, 2, 2, 2, 2, 2, 2] ];

window.onload = (event) => {
  const physicalDims =
    WT.TwoByOneIsometric.getDimensions(spriteWidth, spriteHeight);
  const worldDims = new WT.Dimensions(physicalDims.width * cellsX,
                                      physicalDims.depth * cellsY,
                                      physicalDims.height * (2 + numTerraces));
  const config = new WT.TerrainBuilderConfig(numTerraces,
                                             WT.TerrainType.DryGrass,
                                             WT.TerrainType.Rock);
  // Use the height map to construct a terrain.
  let builder = new WT.TerrainBuilder(cellsX, cellsY, heightMap,
                                      config, physicalDims);

  let canvas = document.getElementById("demoCanvas");
  let context = WT.createContext(canvas, worldDims, WT.Perspective.TwoByOneIsometric);
  builder.generateMap(context);

  // Place the droid in the middle of the map. 
  Droid.initGraphics();
  let droidPosition = new WT.Point3D(Math.floor(worldDims.width / 2),
                                     Math.floor(worldDims.depth / 2),
                                     Math.floor(physicalDims.height + 1));
  var droid = new Droid(context, droidPosition); 
  let camera = new WT.TrackerCamera(context.scene,
                                    canvas.width, canvas.height,
                                    droid);
  var update = function update() {
    if (document.hasFocus()) {
      context.update(camera);
    }
    window.requestAnimationFrame(update);
  }
  context.update(camera);
  window.requestAnimationFrame(update);
}
