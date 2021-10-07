export const DIMNS = {
    margin:{ left:10, right:10, top:10, bottom:10 },
    svg:{
        width:800,
    },
    planets:{
        width:100,
    },
    expWrapper:{
        height:400,
    },
    exp:{
    },
    calc:{
        width:400,
        height:100,
        icons:{
            width:120,
            height:40
        },
        box:{
        }
    }
}



const grey10 = (i) => ["#FFFFFF", "#E8E8E8","#D3D3D3", "#BEBEBE", "#A8A8A8", "#888888", "#696969", "#505050", "#303030", "#000000"][i-1]

export const COLOURS = {
    svg:{
        bg:grey10(2)
    },
    planet:{
        bg:"aqua",
        name:grey10(8),
        property:grey10(5)
    },
    exp:{
        bg:grey10(3),
        col:{
            bg:grey10(2)
        },
        box:{
            bg:grey10(1),
            sel:grey10(8)
        },
        vis:{
            bg:grey10(1),
            val:grey10(7),
            op:grey10(1),
            count:grey10(5)
        }
    },
    calc:{
        bg:grey10(1),
        op:{
            selected:"blue",
            nonSelected:grey10(5)
        },
        btn:{
            selected:{
                bg:"blue",
                col:grey10(1)
            },
            nonSelected:{
                bg:grey10(2),
                col:grey10(6)
            }
        }
    },
    instruction:grey10(9),
}