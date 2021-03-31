import React, { } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import UserProfile from './UserProfile'
import ArrowForward from '@material-ui/icons/ArrowForward'
import { withLoader } from '../util/HOCs';
import SimpleList from '../util/SimpleList'
//helper
import { userProfile } from '../util/ReduxHelpers'
import { filterUniqueById } from '../util/ArrayHelpers';

const useStyles = makeStyles(theme => ({
  root:{
    display:'flex',
    alignItems:'flex-start', //note - when removing this, it makes item stretch more
    flexDirection:'column'
  },
  dashboard:{
    margin:'50px'
  },
  lists:{
    marginTop:`${theme.spacing(4)}px`,
    alignSelf:'stretch',
    display:'flex',
    justifyContent:'space-around',
    flexWrap:'wrap'
  },
  list:{
    flex:'400px 0 0',
    maxWidth:'90vw', //keeps it on small mobile screens
    height:'100%',
  }
}))

function User(props) {
  console.log('User props', props)
  const { user } = props;
  const { groupsMemberOf, datasetsMemberOf } = user;
  const classes = useStyles()
  //note may need useEffect for window.scrollTo(0, 0)

  const groupItemActions = {
    main:{
      itemLinkPath:grp => '/group/'+grp._id,
      //onItemClick:(item, i) => { alert('item '+i)},
      ItemIcon:({}) => <ArrowForward/>
    },
    other:[]
  }

  const datasetItemActions = {
    main:{
      itemLinkPath:dset => '/dataset/'+dset._id,
      //onItemClick:(item, i) => { alert('item '+i)},
      ItemIcon:({}) => <ArrowForward/>
    },
    other:[]
  }

  //as this is a user profile, we dont show administered Groups and datasets,
  //only ones where user is a participant.
  const allDatasets = filterUniqueById([
    ...groupsMemberOf.map(g => g.datasets).reduce((a,b) => [...a, ...b], [] ),
    ...datasetsMemberOf
  ])

  return (
    <div className={classes.root} >
      <UserProfile profile={user} />
      <div className={classes.lists}>
          <div className={classes.list}>
            <SimpleList 
                    title='Groups' 
                    emptyMesg='Not a member of any groups.' 
                    items={groupsMemberOf}
                    itemActions={groupItemActions}
                    primaryText={grp => grp.name}
                    secondaryText={grp => grp.desc} />
          </div>

          <div className={classes.list} >
            <SimpleList 
                  title='Datasets' 
                  emptyMesg='No datasets yet' 
                  items={allDatasets}
                  itemActions={datasetItemActions}
                  primaryText={dset => dset.name}
                  secondaryText={dset => dset.desc} />
          </div>
      </div>
      <div className={classes.dashboard}>
        Data dashboard / summary 
      </div>
    </div>
  )
}
const Loading = <div>User is loading</div>
//must load user if we dont have the deep version eg has groupsMemberof property
export default withLoader(User, ['user.groupsMemberOf'], {alwaysRender:false, LoadingPlaceholder:Loading});
