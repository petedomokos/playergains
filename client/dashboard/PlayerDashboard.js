import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
//children
import { withLoader } from '../util/HOCs';
import PlayerDashboardSection from "./PlayerDashboardSection"
//helpers
import { addWeeks } from "../util/TimeHelpers";
import { createProjectedDatapoints } from './Projector';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2) +"px " +theme.spacing(2) +"px",
    border:'solid',
    borderColor:'green'
  },
}))

const PlayerDashboard = ({player, datasets}) => {
  const styleProps = { };
  const classes = useStyles() 
  //console.log("player---------------------", player)
  //console.log("datasets-------------------", datasets)
  //for now, just show a separate chart fro every measure and calculation in the dataset
  //calculate a calculation
  const calculate = (calc, values) =>{
    //todo
    //values has teh id refs whihc are used in the calc formula
    return 12;
  }

  //create data for a dashboard chart
  const createChartDataForMeasure = (measure, i, dset) =>{
      //console.log("measure", measure)
      //console.log("dset", dset)
      const ds = dset.datapoints.map(d => ({
          ...d,
          date:new Date(d.date),
          value:Number(d.values.find(v => v.measure === measure._id).value)
      }))

      const projectedDs = createProjectedDatapoints(ds.filter(d => !d.isTarget))
      //console.log("projected ds", projectedDs)
      //@TODO - dont return anything we dont need in chart
      return {
          key:"measure"+i,
          name:measure.name,
          dataset:dset,
          measure:measure,
          ds:[...ds, ...projectedDs]
      }
  }


  const createChartDataForCalculation = (calc, i, dset) =>{
    return {
      key:"calc"+i,
      name:calc.name,
      dataset:dset,
      calc:calc,
      ds:dset.datapoints.map(d => ({
        ...d,
        value:calculate(calc, d.values) //note values have id refs whihc are used in the formula
      }))
    }
  }

   //for now, its const time domain but will provide option to change as state
   const timeDomain = [addWeeks(-2, new Date()), addWeeks(9, new Date())]

   const settings = {
     timeDomain
   }


  //create data for a dashboard section - each measure and calc gets a chart
  const createDashboardSectionData = (dset, i) => ({
    key:"section"+i,
    name:dset.name,
    chartsData:[
        ...dset.measures.map((measure,i) => createChartDataForMeasure(measure, i, dset)),
        ...dset.calculations.map((calc,i) => createChartDataForCalculation(calc, i, dset))
    ]
  })

  //1 section per dashboard (later, we will group by goals)
  const sectionsData = datasets.map((dset,i) => createDashboardSectionData(dset,i))

  return (
    <div className={classes.root}>
      {sectionsData.map(sectionData=>
        <PlayerDashboardSection data={sectionData} key={sectionData.key} settings={settings} />
      )}
    </div>
  )
}

PlayerDashboard.defaultProps = {
}

export default withLoader(PlayerDashboard, ["allDatasetsFullyLoaded"] )


