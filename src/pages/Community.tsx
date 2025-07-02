
import React, { useState } from 'react';
import { Trophy, Users, Send, Crown, Medal, Award, ArrowLeft, MessageSquare } from 'lucide-react';

const Community = () => {
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<{[key: string]: string}>({});
  
  const leaderboard = [
    { rank: 1, name: 'Uncle Tan', hours: 8.5, isUser: false, emoji: '🧓🏻', color: 'from-yellow-400 to-yellow-500' },
    { rank: 2, name: 'Mei Ling', hours: 7.2, isUser: false, emoji: '👵🏻', color: 'from-gray-300 to-gray-400' },
    { rank: 3, name: 'Ah Seng', hours: 6.8, isUser: true, emoji: '👨🏻', color: 'from-orange-400 to-orange-500' },
    { rank: 4, name: 'Auntie Wong', hours: 6.1, isUser: false, emoji: '👩🏻', color: 'from-blue-300 to-blue-400' },
    { rank: 5, name: 'Ah Beng', hours: 5.9, isUser: false, emoji: '👨🏻‍🦳', color: 'from-green-300 to-green-400' },
    { rank: 6, name: 'Mrs Lim', hours: 5.3, isUser: false, emoji: '👩🏻‍🦳', color: 'from-purple-300 to-purple-400' },
    { rank: 7, name: 'Uncle Lee', hours: 4.7, isUser: false, emoji: '🧓🏻', color: 'from-pink-300 to-pink-400' },
    { rank: 8, name: 'Auntie Siti', hours: 4.2, isUser: false, emoji: '👵🏽', color: 'from-indigo-300 to-indigo-400' },
  ];

  const friends = leaderboard.filter(person => !person.isUser);

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown size={20} className="text-yellow-500" />;
      case 2: return <Medal size={20} className="text-gray-400" />;
      case 3: return <Award size={20} className="text-orange-500" />;
      default: return null;
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedFriend) {
      setSentMessages(prev => ({
        ...prev,
        [selectedFriend.name]: message
      }));
      setMessage('');
      setTimeout(() => {
        setSentMessages(prev => ({
          ...prev,
          [selectedFriend.name]: ''
        }));
      }, 3000);
    }
  };

  if (selectedFriend) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
        {/* Header */}
        <div className="gradient-bg text-white px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setSelectedFriend(null)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">Message Friend</h1>
            <div className="w-12"></div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-2">{selectedFriend.emoji}</div>
            <h2 className="text-2xl font-bold">{selectedFriend.name}</h2>
            <p className="text-red-100">#{selectedFriend.rank} • {selectedFriend.hours}h this week</p>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Message Input */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={24} className="text-red-500" />
              <h3 className="text-lg font-bold text-gray-800">Send Encouragement</h3>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your encouraging message..."
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            
            {sentMessages[selectedFriend.name] && (
              <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center gap-2 text-green-600">
                  <span>✓</span>
                  <span className="font-medium">Message sent!</span>
                </div>
                <p className="text-green-700 mt-1">"{sentMessages[selectedFriend.name]}"</p>
              </div>
            )}
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`w-full mt-4 py-4 rounded-2xl font-bold transition-all ${
                message.trim()
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Send size={20} />
                <span>Send Message</span>
              </div>
            </button>
          </div>

          {/* Quick Templates */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100">
            <h4 className="font-bold text-gray-800 mb-4">Quick Templates</h4>
            <div className="space-y-3">
              {[
                "Keep up the great work! 💪",
                "Let's exercise together tomorrow!",
                "You're doing amazing this week! 🌟",
                "Time to beat your record! 🏆"
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(template)}
                  className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-gray-700"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showFriendsList) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
        {/* Header */}
        <div className="gradient-bg text-white px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setShowFriendsList(false)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">Choose Friend</h1>
            <div className="w-12"></div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-4">
            {friends.map((friend) => (
              <button
                key={friend.name}
                onClick={() => setSelectedFriend(friend)}
                className="w-full bg-white rounded-3xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${friend.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                      {friend.emoji}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800 text-lg">{friend.name}</p>
                      <p className="text-gray-500">#{friend.rank} • {friend.hours}h this week</p>
                    </div>
                  </div>
                  <Send size={20} className="text-red-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Users className="text-red-500" size={32} />
          Community
        </h1>
        <p className="text-gray-600 text-lg">Connect with your fitness buddies</p>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 card-hover">
        <div className="flex items-center mb-6">
          <div className="bg-yellow-100 rounded-xl p-3 mr-4">
            <Trophy size={28} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Weekly Leaderboard</h2>
            <p className="text-gray-600">You're #3 out of 8 friends! 🎉</p>
          </div>
        </div>

        {/* User's Position Highlight */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 mb-6 border-2 border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award size={24} className="text-orange-500" />
                <span className="text-xl font-bold text-red-600">#3</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👨🏻</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">Ah Seng (You)</p>
                  <p className="text-gray-600">Great progress this week!</p>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600">6.8h</span>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                user.isUser 
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 min-w-[60px]">
                  {getRankIcon(user.rank)}
                  <span className={`font-bold text-lg ${user.isUser ? 'text-red-600' : 'text-gray-600'}`}>
                    #{user.rank}
                  </span>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center text-xl shadow-sm`}>
                  {user.emoji}
                </div>
                <span className={`font-semibold text-lg ${user.isUser ? 'text-red-800' : 'text-gray-800'}`}>
                  {user.name}
                  {user.isUser && ' (You)'}
                </span>
              </div>
              <span className={`font-bold text-xl ${user.isUser ? 'text-red-600' : 'text-gray-600'}`}>
                {user.hours}h
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Jio Friends Section */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 card-hover">
        <div className="flex items-center mb-6">
          <div className="bg-green-100 rounded-xl p-3 mr-4">
            <MessageSquare size={28} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Jio Your Kakis!</h2>
            <p className="text-gray-600">Encourage your friends to exercise</p>
          </div>
        </div>

        <button
          onClick={() => setShowFriendsList(true)}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-6 rounded-2xl text-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-105"
        >
          <div className="flex items-center justify-center gap-3">
            <Send size={24} />
            <span>Send Message to Friends</span>
          </div>
        </button>

        <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-200">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">Add More Friends</h3>
            <p className="text-gray-600 text-sm mb-4">Expand your fitness community</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Find by Username
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
