import React from 'react';
import './App.css';
import CompletedCourse from './CompletedCourses';
import Course from './Course';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];
    if(this.props.id === "Completed Course"){
      let completedcourses=this.props.completedCourses;
      let coursedata= this.props.courseData;

      for( let i =0; i < completedcourses.length; i++){
        for( let j=0; j<coursedata.length; j++){
          if(coursedata[j].number === completedcourses[i]){
            courses.push(
            <CompletedCourse key= {i} data={this.props.courseData[i]} rateCourse = {this.props.rateCourse}/>
            )
            break;
          }
        }
      }
      return courses;
    }

    if (Array.isArray(this.props.data)){
      for(let i =0; i < this.props.data.length; i++){
        courses.push (
          <Course identifier ={this.props.identifier} key={i} data={this.props.data[i]} courseKey={this.props.data[i].number} allCourses={this.props.allCourses} completedCourses={this.props.completedCourses} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
        )
      }
    }
    else{
      for(const course of Object.keys(this.props.data)){
        courses.push (
          <Course key={this.props.data[course].number} data={this.props.data[course]} courseKey={this.props.data[course].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
        )
      }
    }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  render() {
    return (
      <div style={{margin: 5, marginTop: -5}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CourseArea;
