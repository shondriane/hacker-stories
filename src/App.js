import * as React from "react";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);
  return [value, setValue];
};
//set stories takes in two arguments state and action
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "SET_STORIES":
      return action.payload;
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [url,setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
const handleFetchStories = React.useCallback(()=>{
  if (!searchTerm) return;
  dispatchStories({ type: "STORIES_FETCH_INIT" });

  fetch(url)
    .then(response=>response.json())
    .then(result => {
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.hits,
      });
    })
    .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
},[url])

  React.useEffect(() => {
   handleFetchStories()
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    const newStories = stories.data.filter(
      (story) => item.objectID !== story.objectID
    );
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = event=>{
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  

  return (
    <div>
      <h1> My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearchInput}
      >
        <strong> Search:</strong>
      </InputWithLabel>
      <button 
      type="button" 
      disable={!searchTerm} 
      onClick={handleSearchSubmit}
      >
        Submit
      </button>
      {stories.isError && <p> Something went wrong....</p>}
      {stories.isLoading ? (
        <p> Loading ....</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
      <hr />
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}> {children} </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);
export default App;
