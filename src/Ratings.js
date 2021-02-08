import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';


class Ratings extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          expanded: false,
        }
        this.rating = React.createRef();
    
      }


    setRating(){
        let courseTemp = this.props.data

        courseTemp.rating = this.rating.current.value
        this.props.rateCourse(courseTemp)

    }

    getRatings(){
        let ratings= []
        ratings.push(<option key={"No Rating"}>No Rating</option>)
        for(let i =1;i<6;i++){
            ratings.push(<option key={i}>{i}</option>)
          }
          return ratings
    }

    render(){
        return(
             <Form>
                <Form.Group style={{marginBottom:"0px"}}controlId="formRatings">
                    <Form.Control as="select" ref={this.rating} onChange={() => this.setRating()}>
                        {this.getRatings()}
                    </Form.Control>
                </Form.Group>
            </Form>

        )
    }
}
export default Ratings