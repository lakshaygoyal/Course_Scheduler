import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
class Recommendation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
  }
  getExpansionButton() {
    let buttonText = '▼';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = '▲';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }
  setExpanded(value) {
    this.setState({expanded: value});
  }
  getDescription() {
    if(this.state.expanded) {
      return (
        <div style={{marginBottom: '5px'}}>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }

  render() {
    return (
      <Card style={{marginLeft:"14%",width: '42%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Title>
            <div style={{maxWidth: 250}}>
              {this.props.data.name}
            </div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
          {this.getDescription()}
            Recommended because you gave courses in the intrest area {this.props.interest} high ratings!
        </Card.Body>
      </Card>
    )
  }
  }export default Recommendation
