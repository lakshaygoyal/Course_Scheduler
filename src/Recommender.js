import React from 'react';
import './App.css';
import Recommendation from './Recommendation'
class Recommender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedCourses:[],
    }
  }
  getInterests(data) {
    let interests = [];
      data.keywords.forEach((keyword) => {
        if(interests.indexOf(keyword) === -1){interests.push(keyword)}
      });
      if(interests.indexOf(data.subject) === -1){
        interests.push(data.subject);
      }
    return interests;
  }
courseInRecommended(course,recommended){
  for(let i =0;i<recommended.length;i++){
    if(recommended[i].name === course.name){
      return true
    }
  }
  return false
}
showRecommendedCourses(courses){
  let temp = []
  courses.forEach((course) => {
    temp.push(<Recommendation key={course.number}data={course} interest={course.interest}/>)
  });
  return temp
}
getRecommendedCourses(){
  let allCourses = this.props.allCourses;
  let ratedCourses = this.props.ratedCourses;
  let completedCourses = this.props.completedCourses;
  let recommendedCoursesTemp = [];

  ratedCourses = ratedCourses.filter((course) =>{
    if(course.rating !== "No Rating"&& course.rating>2){
      return true;
    }
    else {
      return false;
    }})
  ratedCourses = ratedCourses.sort((x,y)=> y.rating-x.rating)

  for(let i=0;i<ratedCourses.length;i++){
    let interestsAreas = []
    interestsAreas = this.getInterests(ratedCourses[i])

    interestsAreas.forEach((interest) => {
        allCourses.forEach((course) => {
            let courseInterestsAreas = []
            courseInterestsAreas = this.getInterests(course)
            if(courseInterestsAreas.indexOf(interest)!== -1){
                if(completedCourses.indexOf(course.number)=== -1&&!this.courseInRecommended(course,recommendedCoursesTemp)){
                    course.interest = interest
                    recommendedCoursesTemp.push(course)

                }
            }
        });

    });

}
let temp =   this.showRecommendedCourses(recommendedCoursesTemp)
return temp
}

  render() {
    return (
        <>
        {this.getRecommendedCourses()}
        </>
    )
  }
  }export default Recommender
