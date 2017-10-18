
var Map = {
    map: []
};

Map.loadMapInScene = function(map, scene) {
    for (var x = 0; x < map.length; x++) {
        for (var z = 0; z < map[x].length; z++) {
            var entities = map[x][z].entities;

            for (var i = 0; i < entities.length; i++) {
                scene.add(entities[i]);
            }

            var lights = map[x][z].lights;

            for (var j = 0; j < lights.length; j++) {
                scene.add(lights[j]);
            }
        }
    }
};

Map.generateMapFromNumberMap = function(numMap, objectList) {
    var bufMap = [];

    for (var z = 0; z < numMap.length; z++) {
        bufMap.push([]);
        for (var x = 0; x < numMap[z].length; x++) {

            var blueprintOfObjectID = Utils.findObjectWithIDInList(numMap[z][x], objectList);
            var entities = [];
            var lights = [];

            if (blueprintOfObjectID !== undefined) {
                entities = Entity.generateEntities( blueprintOfObjectID, x, z);
                lights = Light.generateLights( blueprintOfObjectID, x, z);
            }

            bufMap[z].push({ id: numMap[z][x], entities: entities, lights: lights, objectBlueprint: blueprintOfObjectID });
        }
    }

    return bufMap;
};
