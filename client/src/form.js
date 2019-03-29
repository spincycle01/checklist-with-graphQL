import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {

  state = {
    text: ''
  }
  
  handleChange = (event) => {
    const newText = event.target.value;
    console.log(newText);
    this.setState({
      text: newText
    });
  };

  handleKeyDown = (event) => {
    console.log(event);
    if(event.keyCode === 13) {
      this.props.submit(this.state.text)
    }
  }
  
  render() {
    const { text } = this.state;
    return (
      <TextField 
        onChange={this.handleChange} 
        onKeyDown={this.handleKeyDown}
        label="Add Item:" 
        margin="normal" 
        fullWidth 
        value={text} />
    )
  }
}
