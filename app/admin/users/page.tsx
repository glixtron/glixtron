'use client'

import { useState, useEffect } from 'react'
import { Users, Mail, Calendar, Shield, Trash2, RefreshCw, Search, UserPlus, Download, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  id: string
  email: string
  name: string
  emailVerified: boolean
  createdAt: string
  hasPassword: boolean
  lastLogin?: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      } else {
        setError('Failed to fetch users')
      }
    } catch (error) {
      setError('Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Verified', 'Created At', 'Has Password'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.emailVerified ? 'Yes' : 'No',
        new Date(user.createdAt).toLocaleString(),
        user.hasPassword ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetDatabase = async () => {
    if (!confirm('Are you sure you want to reset all user data? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/reset-database', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        alert('Database reset successfully')
        fetchUsers()
      } else {
        alert('Failed to reset database')
      }
    } catch (error) {
      alert('Error resetting database')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-slate-400">
              Manage and monitor all registered users
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/register"
              className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Link>
            <button
              onClick={exportUsers}
              className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={resetDatabase}
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset All
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Verified</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter(u => u.emailVerified).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">With Password</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter(u => u.hasPassword).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-violet-400" />
            </div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">New Today</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter(u => {
                    const today = new Date().toDateString()
                    const userDate = new Date(u.createdAt).toDateString()
                    return today === userDate
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-medium transition-colors"
            >
              {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPasswords ? 'Hide' : 'Show'} Passwords
            </button>
            <button
              onClick={fetchUsers}
              className="flex items-center px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Joined
                  </th>
                  {showPasswords && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Password
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-slate-400 text-sm">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-slate-300">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {user.emailVerified ? (
                          <>
                            <Shield className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-sm">Verified</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-400 text-sm">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-slate-300 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    {showPasswords && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-400 text-sm font-mono">
                          {user.hasPassword ? '••••••••' : 'No Password'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">
                {searchTerm ? 'No users found matching your search' : 'No users registered yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
