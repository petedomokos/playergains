import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import { withLoader } from '../util/HOCs';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))

export default withLoader(function EditUserProfile(props) {
  const classes = useStyles()
  const { user, onUpdate, updating, updatingError, history } = props;
  const [values, setValues] = useState({
    username: user.username || '',
    firstname:user.firstname || '',
    surname:user.surname || '',
    email: user.email || '',
    //photo: user.photo || '',
    password: ''
  })

  const clickSubmit = () => {
    let formData = new FormData();
    values.username && formData.append('username', values.username)
    values.firstname && formData.append('firstname', values.firstname)
    values.surname && formData.append('surname', values.surname)
    values.email && formData.append('email', values.email)
    values.password && formData.append('password', values.password)
    //values.photo && formData.append('photo', values.photo)
    onUpdate(user._id, formData, history)
  }

  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value})
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField id="username" label="Username" className={classes.textField} value={values.username} onChange={handleChange('username')} margin="normal"/><br/>
        <TextField id="firstname" label="First name" className={classes.textField} value={values.firstname} onChange={handleChange('firstname')} margin="normal"/><br/>
        <TextField id="surname" label="Surname" className={classes.textField} value={values.surname} onChange={handleChange('surname')} margin="normal"/><br/>
        <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
        <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
        <br/> {
          values.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {values.error}
          </Typography>)
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
      </CardActions>
    </Card>
  )
}, ['user'])


