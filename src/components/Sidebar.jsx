import React, { useContext } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from './context/AuthContext';
import Chats from './Chats';

export function Sidebar({ chats, onSelectChat, onSearch, searchTerm, setSearchTerm, handleKey, user, handleSelect }) {

  const {currentUser} = useContext(AuthContext);

  return (
    <div className="w-1/4 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm border-r border-gray-800">
      <div className="p-4 bg-black bg-opacity-80 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Chats</h1>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Plus size={20} className="text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <MoreVertical size={20} className="text-gray-300" />
          </button>
        </div>
      </div>
      <div className="p-4">

      <img src={currentUser.photoURL} alt='' />
      <span>{currentUser.displayName}</span>

      <button onClick={() => signOut(auth)}>
        Logout
      </button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by email"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKey}
          />
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" onClick={onSearch} />
        </div>
         {/* Display the fetched user details */}
      {user && (
        <button onClick={handleSelect}>
        <div className="mt-4 flex items-center space-x-4 bg-gray-900 bg-opacity-50 p-4 rounded-lg">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-16 h-16 rounded-full border-2 border-gray-500"
          />
          <div className="text-white">
            <p className="text-lg font-semibold">{user.displayName}</p>
            <p className="text-sm text-gray-400">{searchTerm}</p>
          </div>
        </div>
        </button>
      )}
      </div>
      <div className="overflow-y-auto h-[calc(100vh-140px)]">
        <Chats/>
      </div>
    </div>
  );
}