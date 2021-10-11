export const INIT_CHAIN_STATE = [{op:{id:"home",name:"For Each" }}]

const defaultMargin = { left:10, right:10, top:10, bottom:10 };
const smallMargin = { left:5, right:5, top:5, bottom:5 };
const noMargin = { left:0, right:0, top:0, bottom:0 };
export const DIMNS = {
    margin:defaultMargin,
    smallMargin,
    noMargin,
    svg:{
        width:1000,
        minHeight:400
    },
    expBuilder:{
        margin:defaultMargin
    },
    planets:{
        width:100,
    },
    chainWrapper:{
        margin:defaultMargin
    },
    //calc
    calc:{
        width:400,
        height:100, //temp
        children:{
            margin:{ left:5 }
        },
        icons:{
            width:120,
            height:20
        },
        box:{
        },
    },
    //exp chain
    exp:{
        height:200, //temp
    },
    col:{
        width:160,
        margin:{ left:0.25, right:0.25, top:10, bottom:0 },
        children:{
            margin:{ left:0, right:0, top:0, bottom:0 }
        },
        vis:{
            margins:{
                op:5,
                val:30
            },
            home:{
                margins:{
                    val:50
                }
            },
            get:{
                margins:{

                }
            },
            agg:{
                margins:{

                }
            },
            empty:{
                margins:{

                }
            }
        }
    },
    //btns
    chainButtons:{
        height:30,
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
    chainWrapper:{
        btn:{
            bg:"transparent",
            col:grey10(6)
        }
    },
    exp:{
        bg:grey10(3),
        col:{
            bg:grey10(2)
        },
        box:{
            bg:{
                active: grey10(1),
                inactive: grey10(1)
            },
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

/*

if(selection.select("rect.test").empty()){
            selection.append("rect")
                .attr("class", "test")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "blue")
                .attr("opacity", 0.6)
        }

        */