import './App.css';

function App() {
  fetch('http://www.baidu.com/api/demo')
    .then(data => data.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

  return (
    <div className="App">
      <div>Hello World</div>
    </div>
  );
}

export default App;
