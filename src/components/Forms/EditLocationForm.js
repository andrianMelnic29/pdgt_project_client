import React, { Component } from 'react'
import { Button, Form, Message, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios'
import AuthContext from '../../context/authContext'
class EditLocationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lat: '',
      lng: '',
      isLoading: false,
      added: false,
      error: false
    }
  }

  static contextType = AuthContext
  handleChange = input => event => {
    this.setState({ [input]: event.target.value })
  }

  setCoordiantes (lat, lng) {
    this.setState({
      lat: lat,
      lng: lng
    })
  }

  editLocation = () => {
    this.setState({ isLoading: true, added: false })
    const reqBody = {
      latitude: this.state.lat,
      longitude: this.state.lng
    }
    const activeLocationID = this.props.activeLocation._id
    axios({
      url: `http://localhost:3000/drink_water/update/${activeLocationID}`,
      method: 'PUT',
      data: JSON.stringify(reqBody),
      headers: {
        Authorization: `Token ${this.context.token}`,
        'Content-Type': 'application/json'
      },
      crossDomain: true
    }).then(res => {
      console.log(res.data)
      this.setState({ isLoading: false, added: true })
      this.props.setLat(this.state.lat)
      this.props.setLng(this.state.lng)
      this.props.resetActiveLocation()
      this.props.refresh()
    }).catch(error => {
      this.setState({ isLoading: false, added: false, error: true })
      console.log(error)
    })
  }

  render () {
    return (
      <React.Fragment>
        {
          this.state.added &&
          <Message
            success
            header='Ok'
            content={
              <span>
                Modificato con successo
              </span>
            }
          />

        }
        {
          this.state.isLoading &&
          <Dimmer active>
            <Loader />
          </Dimmer>
        }
        <Form onSubmit={this.editLocation}>
          <Form.Field>
            <label>Latitudine</label>
            <input
              placeholder='Latitudine'
              value={this.state.lat}
              onChange={this.handleChange('lat')}
              name='lat'
            />
          </Form.Field>
          <Form.Field>
            <label>Longitudine</label>
            <input
              placeholder='Longitudine'
              value={this.state.lng}
              onChange={this.handleChange('lng')}
              name='lng'
            />
          </Form.Field>
          <Button
            icon='map marker alternate'
            type='button'
            content='Posizione attuale'
            onClick={() => this.setCoordiantes(this.props.lat, this.props.lng)} />
          <Button type='submit'>Conferma</Button>
        </Form>
      </React.Fragment>

    )
  }
}

export default EditLocationForm