
import Header from '../Components/header';
import TaskList from '../Components/taskList';

 function Accueil()
{

    return(
    <>
        <Header/>
        <br/>
        <center><h1 ><u><mark>My Tasks </mark></u></h1> </center>
        <br/>
        <TaskList/>
    </>
        
    );
}

export default Accueil