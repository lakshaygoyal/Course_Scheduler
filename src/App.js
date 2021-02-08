import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Recommender from'./Recommender';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      interests: [],
      completedCourses: [],
      ratedCourses: []
    };
  }



  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()
    let completedCourseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let compleletedCoursesData = await (await fetch(completedCourseURL)).json()


    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData), interests: this.getInterests(courseData), completedCourses: compleletedCoursesData.data});
    
  }

  getInterests(data){
    let interests = [];
    interests.push("All");

    for(let i=0; i < data.length; i++){
      data[i].keywords.forEach((keyword) => {
        if(interests.indexOf(keyword) === -1)
          interests.push(keyword);
        })
        if(interests.indexOf(data[i].subject) === -1)
          interests.push(data[i].subject);
      
    }
    
    return interests;

  }
  rateCourse(data){
    let ratedCoursesTemp = this.state.ratedCourses
    
      if(ratedCoursesTemp.indexOf(data)===-1){

        ratedCoursesTemp.push(data)
        this.setState({ratedCourses:ratedCoursesTemp})
        
      }
      return;

  }



  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];
    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  render() {

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="Search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="Search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interests={this.state.interests}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea id="Search"data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>

          <Tab eventKey="Cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea identifier="Cart" allCourses={this.state.allCourses} completedCourses={this.state.completedCourses} data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>

          <Tab eventKey="CompletedCourses" title="CompletedCourses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea id="Completed Course" completedCourses={this.state.completedCourses} courseData={this.state.allCourses} rateCourse={(data) => this.rateCourse(data)}/>
            </div>
          </Tab>
          <Tab eventKey="RecommendedCourses" title="RecommendedCourses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <Recommender allCourses={this.state.allCourses} completedCourses={this.state.completedCourses} ratedCourses={this.state.ratedCourses} />
            </div>
          </Tab>
          <Tab eventKey="Help" title="Help" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <div  class = "col-md-3">

              </div>
              <div class= "col-md-9">
              <Accordion >
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Search and filter
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      For Searcha and Filter you can use four features:
                      <ul>
                        <li>
                          Search : you can tyoe the keyword to search all the courses related to that keyword.
                        </li>
                        <li>
                          Subject: you can use a particular subject to list down all courses of that subject.
                        </li>
                        <li>
                          Interest Areas: you can use a particular interest to list down all courses realted to that particular interest.
                        </li>
                        <li>
                          Credits: you can search ocurse based of the number of credits.
                        </li>
                      </ul>


                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Cart
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>You can see all the courses or sections or subsections of the courses added in this.</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                      Completed Courses
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="3">
                    <Card.Body>All the courses previously taken can be seen here.</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                      Recommender
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="3">
                    <Card.Body>You can get recomendation based on your arting sof previously taken courses.</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              </div>
              <div  class = "col-md-3">

              </div>
              
             </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
