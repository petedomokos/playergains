export const grey10 = (i) => ["#FFFFFF", "#E8E8E8","#D3D3D3", "#BEBEBE", "#A8A8A8", "#888888", "#696969", "#505050", "#303030", "#000000"][i-1];

//1 = summary, 2 = standard, 3 = detail
export const zoomLevel = k => k < 0.5 ? -1 : k < 1.3 ? 0 : 1;
export const OPEN_CHANNEL_EXT_WIDTH = 50;
export const DEFAULT_D3_TICK_SIZE = 6;
export const DEFAULT_PLANET_RX = 50;
export const DEFAULT_PLANET_RY = 50;
export const PLANET_RING_MULTIPLIER = 1.3;

export const DIMNS = {
    planet:{
        width:85,
        height:60
    },
    aim:{
        vertPlanetGap:3,
        margin:{ left: 5, right: 5, top: 15, bottom: 5 }
    },
    form:{
        single:{
            width:85,
            height:15
        }
    }
}
export const COLOURS = {
    canvas:"#FAEBD7",
    planet:grey10(5),
    link:grey10(5),
    potentialLinkPlanet:grey10(3),
    potentialLink:grey10(3),
    measure:"none",
    selectedMeasure:"aqua"
}

export const SMALL_FONT = 9;