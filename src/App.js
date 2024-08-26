import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup } from '@blueprintjs/core';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, website }),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          toast.success("User Added Successfully", {
            position: "top-right",
            autoClose: 5000,
          });
          setNewName('');
          setNewEmail('');
          setNewWebsite('');
        }) 
      }
    }

  function onChangeHandler(id,key,value){
    setUsers((users) => {
      return users.map((user) => {
        return user.id === id ? {...user, [key]: value } : user;
      })
    })
  }
  
  function updateUser(id){
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("User Updated Successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      }) 
  }

  function deleteUser(id){
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((users) => {
          return users.filter(user => user.id !== id)
        })
        toast.error("User Deleted Successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      }) 
  }

  return (
    <div className="App">
      <ToastContainer />
      <table className='bp4-html-table modifier'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText onChange={(value) => onChangeHandler(user.id, 'email', value) } value={user.email} /></td>
              <td><EditableText onChange={(value) => onChangeHandler(user.id, 'website', value) } value={user.website} /></td>
              <td>
                <Button onClick={() => updateUser(user.id)} style={{ backgroundColor: 'blue', color: 'white' }}>Update</Button>
                &nbsp;
                <Button onClick={() => deleteUser(user.id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Enter Name...'
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='Enter Email...'
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder='Enter Website...'
              />
            </td>
            <td>
              <Button onClick={addUser} style={{ backgroundColor: 'green', color: 'white' }}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
