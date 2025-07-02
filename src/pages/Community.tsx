
import React, { useState } from 'react';
import { Trophy, Users, Send, Crown, Medal, Award } from 'lucide-react';

const Community = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const leaderboard = [
    { rank: 1, name: 'Uncle Tan', hours: 8.5, isUser: false },
    { rank: 2, name: 'Mei Ling', hours: 7.2, isUser: false },
    { rank: 3, name: 'Ah Seng', hours: 6.8, isUser: true },
    { rank: 4, name: 'Auntie Wong', hours: 6.1, isUser: false },
    { rank: 5, name: 'Ah Beng', hours: 5.9, isUser: false },
    { rank: 6, name: 'Mrs Lim', hours: 5.3, isUser: false },
    { rank: 7, name: 'Uncle Lee', hours: 4.7, isUser: false },
    { rank: 8, name: 'Auntie Siti', hours: 4.2, isUser: false },
  ];

  const messageTemplates = [
    "Eh bro, come gym with me lah! 💪",
    "Auntie, let's go exercise together sia!",
    "Uncle, time to move your body leh!",
    "Come lah, don't lazy at home!",
    "Jio you go workout, can or not?",
    "Exercise time! Join me at the gym!"
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown size={20} className="text-yellow-500" />;
      case 2: return <Medal size={20} className="text-gray-400" />;
      case 3: return <Award size={20} className="text-orange-600" />;
      default: return null;
    }
  };

  const handleSendMessage = (message: string) => {
    setSelectedMessage(message);
    // Simulate sending message
    setTimeout(() => {
      setSelectedMessage(null);
      // Could show a toast notification here
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Community</h1>
        <p className="text-gray-600">Connect with your fitness buddies</p>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <Trophy size={24} className="text-yellow-500 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">This Week's Training Hours</h2>
            <p className="text-sm text-gray-600">You're #3 out of 8 friends!</p>
          </div>
        </div>

        {/* User's Position Highlight */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Award size={20} className="text-orange-600" />
                <span className="text-lg font-bold text-blue-600">#3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ah Seng (You)</p>
                <p className="text-sm text-gray-600">Great progress this week!</p>
              </div>
            </div>
            <span className="text-xl font-bold text-blue-600">6.8h</span>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-xl ${
                user.isUser 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 min-w-[40px]">
                  {getRankIcon(user.rank)}
                  <span className={`font-bold ${user.isUser ? 'text-blue-600' : 'text-gray-600'}`}>
                    #{user.rank}
                  </span>
                </div>
                <span className={`font-medium ${user.isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                  {user.name}
                  {user.isUser && ' (You)'}
                </span>
              </div>
              <span className={`font-bold ${user.isUser ? 'text-blue-600' : 'text-gray-600'}`}>
                {user.hours}h
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Jio Friends Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <Users size={24} className="text-green-500 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Jio Your Kakis!</h2>
            <p className="text-sm text-gray-600">Invite your friends to exercise</p>
          </div>
        </div>

        {/* Message Templates */}
        <div className="space-y-3">
          {messageTemplates.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedMessage === message
                  ? 'bg-green-100 border-green-300'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-800 flex-1 mr-4">{message}</p>
                <button
                  onClick={() => handleSendMessage(message)}
                  disabled={selectedMessage === message}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMessage === message
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {selectedMessage === message ? (
                    <div className="flex items-center space-x-2">
                      <span>Sent!</span>
                      <span>✓</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send size={16} />
                      <span>Send</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sync Contacts */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">Add Friends</h3>
            <p className="text-sm text-gray-600 mb-4">Sync Contacts</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              By Username
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
