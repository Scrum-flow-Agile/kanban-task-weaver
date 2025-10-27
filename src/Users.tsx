import React, { useEffect, useState } from "react";
import api from "./api"; // 👈 import the api file
import { get } from "http";

function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
  const getUsers = async()=>{
    try{
      const response = await api.get("/users");
      console.log(response);
      setUsers(response.data)
      
    }catch(error){
      console.error("Error fetching users:", error);
    }
  }
  getUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
