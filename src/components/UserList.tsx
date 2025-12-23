// src/components/UserList.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const UserList = () => {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data ?? [])
    }
  }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
