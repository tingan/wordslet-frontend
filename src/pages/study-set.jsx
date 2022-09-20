import {useParams} from 'react-router-dom'

function StudySet(){
    let params = useParams();
  return <h1>Invoice {params.studyId}</h1>;
}

export default StudySet;