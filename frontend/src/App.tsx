import { gql, useQuery } from "@apollo/client";
import "./App.css";
const query = gql`
  query GetEvery {
    getTodos {
      title
      user {
        name
        email
      }
    }
  }
`;
function App() {
  const { data, loading, error } = useQuery(query);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>error...</div>;
  }
  console.log(data);
  return <div>{JSON.stringify(data)}</div>;
}

export default App;
