import { EntityEvent } from "./events.js";
import { CollisionDetector } from "./physics.js";
export class ActorDebug {
    constructor(actor, camera, debugCollision) {
        if (debugCollision) {
            this.debugCollision(actor, camera);
        }
    }
    debugCollision(actor, camera) {
        const context = actor.context;
        actor.addEventListener(EntityEvent.Moving, function () {
            if (!CollisionDetector.hasMissInfo(actor)) {
                return;
            }
            let missedEntities = CollisionDetector.getMissInfo(actor);
            let scene = context.scene;
            const start = Date.now();
            scene.addTimedEvent(function () {
                scene.ctx.strokeStyle = "Green";
                for (let entity of missedEntities) {
                    for (const segment of scene.getNode(entity.id).allSegments) {
                        scene.ctx.beginPath();
                        let drawP0 = camera.getDrawCoord(segment.p0);
                        let drawP1 = camera.getDrawCoord(segment.p1);
                        scene.ctx.moveTo(drawP0.x, drawP0.y);
                        scene.ctx.lineTo(drawP1.x, drawP1.y);
                        scene.ctx.stroke();
                    }
                }
                return Date.now() > start + 1000;
            });
        });
        actor.addEventListener(EntityEvent.Collision, function () {
            console.log("collision detected");
            if (!CollisionDetector.hasCollideInfo(actor)) {
                console.log("but no info available");
                return;
            }
            const collisionInfo = CollisionDetector.getCollideInfo(actor);
            const intersectInfo = collisionInfo.intersectInfo;
            const collidedEntity = collisionInfo.entity;
            const collidedFace = intersectInfo.face;
            let scene = context.scene;
            const start = Date.now();
            scene.addTimedEvent(function () {
                scene.ctx.strokeStyle = "Green";
                for (const segment of scene.getNode(actor.id).allSegments) {
                    scene.ctx.beginPath();
                    let drawP0 = camera.getDrawCoord(segment.p0);
                    let drawP1 = camera.getDrawCoord(segment.p1);
                    scene.ctx.moveTo(drawP0.x, drawP0.y);
                    scene.ctx.lineTo(drawP1.x, drawP1.y);
                    scene.ctx.stroke();
                }
                scene.ctx.strokeStyle = "Orange";
                for (const segment of scene.getNode(collidedEntity.id).allSegments) {
                    scene.ctx.beginPath();
                    let drawP0 = camera.getDrawCoord(segment.p0);
                    let drawP1 = camera.getDrawCoord(segment.p1);
                    scene.ctx.moveTo(drawP0.x, drawP0.y);
                    scene.ctx.lineTo(drawP1.x, drawP1.y);
                    scene.ctx.stroke();
                }
                scene.ctx.strokeStyle = "Red";
                scene.ctx.fillStyle = "Red";
                for (let vertex of collidedFace.vertices()) {
                    scene.ctx.beginPath();
                    let p0 = camera.getDrawCoord(scene.graph.getDrawCoord(vertex.point));
                    let p1 = camera.getDrawCoord(scene.graph.getDrawCoord(vertex.point.add(vertex.u)));
                    let p2 = camera.getDrawCoord(scene.graph.getDrawCoord(vertex.point.add(vertex.v)));
                    scene.ctx.beginPath();
                    scene.ctx.moveTo(p0.x, p0.y);
                    scene.ctx.lineTo(p1.x, p1.y);
                    scene.ctx.lineTo(p2.x, p2.y);
                    scene.ctx.closePath();
                    scene.ctx.stroke();
                    scene.ctx.fill();
                }
                return Date.now() > start + 1000;
            });
            CollisionDetector.removeInfo(actor);
        });
    }
}
