export const grey10 = (i) => ["#FFFFFF", "#E8E8E8","#D3D3D3", "#BEBEBE", "#A8A8A8", "#888888", "#696969", "#505050", "#303030", "#000000"][i-1];

//1 = summary, 2 = standard, 3 = detail
export const zoomLevel = k => k < 0.5 ? -1 : k < 1.3 ? 0 : 1;
export const OPEN_CHANNEL_EXT_WIDTH = 50;
export const DEFAULT_D3_TICK_SIZE = 6;
export const DEFAULT_PLANET_RX = 70;
export const DEFAULT_PLANET_RY = 50;
export const PLANET_RING_MULTIPLIER = 1.3;

export const FONTSIZES = {
    ctrls:{
        btn:10
    },
    mainAim:{
        name:12
    },
    aim:{
        name:10
    },
    planet:{
        name:{
            min:10,
            standard:12
        },

        target:8
    },
    measures:{
        title:12,
        subtitle:8
    },
    measure:{
        name:11,
        desc:8,
        targs:10
    }
}

export const DIMNS = {
    journey:{
        margin:{ left:10, right:10, top:10, bottom:10 }
    },
    ctrls:{
        btnWidth:130,
        btnHeight:20
    },
    xAxis:{
        height: 30
    },
    measures:{
        height:100,
        maxMargin:{ left: 10, right:10, top:10, bottom:10 },
        title:{
            width:50,
            height:20
        },
        btn:{
            width:30,
            height:10,
            gap:5
        }
    },
    measure:{
        width:100,
        margin:{ left: 5, right: 5, top: 0, bottom: 0 },
        maxMargin:{
            left:10, right:10, top:10, bottom:10
        },
        text:{
            margin:{ left: 2.5, right: 2.5, top: 0, bottom: 0 }
        },
        name:{
            height:20
        },
        targs:{
            minHeight:10
        }


    },
    planet:{
        width:110,
        height:70
    },
    mainAim:{
        name:{
            width:100,
            height:25,
            margin:{ left: 15, right: 0, top: 15, bottom: 0 }
        }
    },
    aim:{
        name:{
            width:100,
            height:25,
            margin: { left: 10, right: 0, top: 10, bottom: 0 }
        },
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
    milestone:grey10(2),
    link:grey10(5),
    potentialLinkPlanet:grey10(3),
    potentialLink:grey10(3),
    measure:"none",
    selectedMeasure:"aqua"
}

export const SMALL_FONT = 9;