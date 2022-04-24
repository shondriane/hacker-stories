import * as React from "react";

function List(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <ul>
        {props.list.map(function (item) {
          return <Item item={item} />;
        })}
      </ul>
    </div>
  );
}
const Item = (props) => {
  return (
    <li key={props.item.objectID}>
      <span>
        <a href={props.item.url}>{props.item.title} </a>
      </span>
      <span> {props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  );
};
function Search(props) {
  const handleChange = (event) => {
    console.log(event.target.value);
    props.onSearch(event);
  };

  return (
    <React.Fragment>
      <label htmlFor="search"> Search: </label>
      <input id="search" type="text" onChange={handleChange} />
      <p>
        Searching for <strong>{props.searchTerm}</strong>
      </p>
    </React.Fragment>
  );
}
const useStorageState =(key,initialState) =>{
  const [value, setValue] = React.useState (
     localStorage.getItem(key) || initialState
   );
   React.useEffect(()=> {
     localStorage.setItem(key, value);
   }, [value,key]);
   return [value,setValue];
 };
function App() {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
 
  const [searchTerm,setSearchTerm] = useStorageState ('search', 'React');


  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    /*localStorage.setItem('search', event.target.value);*/
  };
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h1> My Hacker Stories</h1>

      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      <List list={searchedStories} title="React Ecosystem" />
    </div>
  );
}

export default App;
